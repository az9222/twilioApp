const express = require("express");
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('../config.js');
const client = require('twilio')(config.accountSid, config.authToken);
const messageDb = require('../database/messageDb.js');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const saveIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        messageDb.save(data, (err, results) => {
            let resultObj = {};
            if (err) {
                resultObj = {
                    err,
                    statusCode: 500
                }
            } else {
                resultObj = { statusCode: 201 }
            }
            resolve(resultObj);
        });
    });
};

//front end. When someone chooses to post their flight #, it goes into the mongoDB. But don't I already have this on my client side...? Check with neil.
app.post('/flightInfo', (req, res) => {
    saveIntoDatabase(req.body);
});

//When someone texts their flight # to the Twilio phone #, it responds with status while simultaneously putting the flight info into mongoDB.
app.post('/sms', (req, response) => {
  console.log(req.body);
    const twiml = new MessagingResponse();
    let flightId = req.body.Body; //req.body.flight? Body? flightInfo
    // let flightId = "AC12";
    let options = {
        url: 'https://aviation-edge.com/v2/public/flights',
        qs: {
            key: config.flightApiKey,
            flightIata: flightId
        }
    }
    request(options, (err, res, body) => {
        let bodyJSON = JSON.parse(body);
        // const mockData = `[{"geography":{"latitude":60.5667,"longitude":-155.15,"altitude":11887.2,"direction":75},"speed":{"horizontal":963.04,"isGround":0,"vertical":0},"departure":{"iataCode":"PVG","icaoCode":"ZSPD"},"arrival":{"iataCode":"YUL","icaoCode":"CYUL"},"aircraft":{"regNumber":"CGHQQ","icaoCode":"B788","icao24":"C058D5","iataCode":"B788"},"airline":{"iataCode":"AC","icaoCode":"ACA"},"flight":{"iataNumber":"AC12","icaoNumber":"ACA12","number":"12"},"system":{"updated":"1546019023","squawk":"0"},"status":"en-route"}]`
        // const bodyJSON = JSON.parse(mockData);
        if (err) {
            twiml.message('Sorry! Flight not found.');
            return;
        }
        if (bodyJSON.error) {
            twiml.message(bodyJSON.error)
            return;
        }
        let flightData = bodyJSON[0];
        let departure = flightData.departure.iataCode;
        let arrival = flightData.arrival.iataCode;
        let flight = flightData.flight.iataNumber;
        let status = flightData.status;
        let phoneNumber = req.body.From;
        twiml.message(`Flight ${flight} from ${departure} to ${arrival}: ${status}`)
        //XXX: Before saving into database, maybe you should check if there's already an entry for that flightId
        //And then decide what to do
        //1. Make an api call anyways and update the existing data
        //2. Just return the data saved in the database to the user (Assuming you know your data is not stale)
        //   If you know your data is not stale, this reduces the number of API calls you make, saving you money and resources.
        saveIntoDatabase({ departure, arrival, flight, status, phoneNumber }).then((statusObj) => {
            if (statusObj.err) {
              console.log('Error saving into Database');
            } else {
              console.log('Success saving into database');
            }
        });
        response.writeHead(200, { 'Content-Type': 'text/xml' });
        response.end(twiml.toString());
    });
});

app.get('/flightInfo', (req, res) => {
    messageDb.getFlightInfo((err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.delete('/flightInfo/:id', (req, res) => {
    messageDb.deleteFlightInfo(req.params.id, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            messageDb.getFlightInfo((err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            });
        }
    });
});

const getFlightInfoFromApi = (flightsId) => {
    let options = {
        url: 'https://aviation-edge.com/v2/public/flights',
        qs: {
            key: config.flightApiKey,
            flightIata: flightsId
        }
    };
    return axios.get(options.url, {
        'params': options.qs
    })
};

// compare the flight status from the live data in API and the flight status that's in mongoDB. If they're not equal (meaning that something is delayed), send a text. Make a call to the API every 5 min to check.
const intervalFn = () => {
    const twiml = new MessagingResponse();
    //Get data from database of flights that have not yet landed
    messageDb.getFlightsInProgressStatus((err, results) => {
        results.forEach((flight) => {
            let flightsDoc = flight._doc;
            let flightId = flightsDoc.flight;
            let mongoFlightData = flightsDoc.status;
            getFlightInfoFromApi(flightId)
                .then((axiosData) => {
                    //Just mock data in case axiosData. This is for me to test when the status is different. 
                    // axiosData = {
                    //   data: [
                    //     {
                    //       status: "barfoo"
                    //     }
                    //   ]
                    // }
                    if (axiosData.data.error) {
                        //correct? delete from mongodb.
                        messageDb.deleteFlightInfo(flightId)
                            .then((data) => {
                                if (data.error) {//TOOD: See if .error is the error property, change if it isn't
                                    //TODO: Handle Error scenario.
                                    //Maybe you want to log a more specific error message, maybe you want to try to delete again etc.
                                    console.log("There was an error deleting the data");
                                    return;
                                }
                                console.log("Delete successful"); //Maybe you want to say the id of item deleted too
                            });
                        return;
                    }

                    //Need to extract flight status from data
                    if (axiosData.data[0].status !== mongoFlightData && flightsDoc.phoneNumber) {
                        client.messages.create({
                            to: flightsDoc.phoneNumber,
                            from: "+19843648645", //twilio phone number
                            body: `Your flight status has changed! It is now ${axiosData.data[0].status}`
                        })
                    }
                    //And Update data in mongodb...REVISIT.
                    //Check to see if data exists before updating
                    if (axiosData &&
                        axiosData.data &&
                        axiosData.data[0] &&
                        axiosData.data[0].status) {
                        messageDb.updateFlightInfo(flightId, axiosData.data[0].status, (err, results) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Successfully updated");
                                console.log(results);
                            }
                        });
                    }
                    //delete if its invalid or landed....????
                    if (axiosData.data[0].status === 'landed') {
                        messageDb.deleteFlightInfo(flightId, (err, results) => {
                            if (err) {
                                console.log("Had an error deleting");
                            } else {
                                console.log("Deleted successfully");
                            }
                        })
                    }
                })
                .catch((error) => { console.log(error) });
        })
    });
    setTimeout(intervalFn, 1000);
}

//Leave this inactive for now.
//TODO: At some point, test that this works. With a more reasonable time.
//setTimeout(intervalFn, 10000)

http.createServer(app).listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
