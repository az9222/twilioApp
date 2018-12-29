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
        resolve(resultObj);
        return;
      }
      resultObj = {statusCode: 201}
      resolve(resultObj);
    });
  });
};

//front end. When someone chooses to post their flight #, it goes into the mongoDB.
app.post('/flightInfo', (req, res) => {
  saveIntoDatabase(req.body);
});

//When someone texts their flight # to the Twilio phone #, it responds with status while simultaneously putting the flight info into mongoDB.
app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let flightId = req.body.Body; //This is real data
  // let flightId = "AC12";
  let options = {
    url: 'https://aviation-edge.com/v2/public/flights',
    qs: {
      key: config.flightApiKey,
      flightIata: flightId
    }
  }
  request(options, (err, response, body) => {
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
    saveIntoDatabase({ departure, arrival, flight, status, phoneNumber }).then((statusObj) => {
    if(statusObj.err) {
      res.status(statusObj.statusCode).send(statusObj.err);
      return;
    } else {
      res.send(statusObj.statusCode);
    }
  });
}); //REVISIT.
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
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

const getFlightInfo = (flightsId) => {
  let options = {
    url: 'https://aviation-edge.com/v2/public/flights',
    qs: {
      key: config.flightApiKey,
      flightIata: flightsId
    }
  }
  return axios.get(options.url, {
    'params': options.qs
  })
};

// compare the flight status from the live data in API and the flight status that's in mongoDB. If they're not equal (meaning that something is delayed), send a text. Make a call to the API every 5 min to check.
const intervalFn = () => {
  const twiml = new MessagingResponse();
  //Get data from database of flights that have not yet
  messageDb.getFlightsInProgressStatus((err, results) => {
    results.forEach((flight) => {
      let flightsDoc = flight._doc;
      let flightId = flightsDoc.flight;
      let mongoFlightData = flightsDoc.status;
      getFlightInfo(flightId)
        .then((axiosData) => {
          console.log('axiosABCD', axiosData);
          axiosData = {
            data: [
              {
                status: "barfoo"
              }
            ]
          }
          if(axiosData.data.error){
            //Maybe delete the entry from mongodb.
            messageDb.deleteFlightInfo(flightId)
              .then((data) => {
                console.log(data);
            });
            return;
          }
          //Need to extract flight status from data
          if (axiosData.data[0].status !== mongoFlightData && flightsDoc.phoneNumber) {
            //Need customer's phone number
            //And to send new message/flight status to customer at that phone number.
            client.messages.create({
              to: flightsDoc.phoneNumber,
              from: "+19843648645", //twilio phone number
              body: `Your flight status has changed! It is now ${axiosData.data[0].status}`
            })
          }
          //And Update data in mongodb...REVISIT.
          messageDb.updateFlightInfo(axiosData.data[0].flightIata, axios.data[0].status)
          .then((data) => {
            console.log(data);
          });
          setTimeout(intervalFn, 10000) //Calls itself after interval - this service perpetutates
          //delete if its invalid or landed....REVISIT.
          if (axios.data[0].status === 'landed') {
            messageDb.deleteFlightInfo(flightId)
              .then((data) => {
                console.log(data);
            });
            return;
          }
        })
        .catch((error) => {console.log(error)});
      })
    });
  // setTimeout(intervalFn, 1000); //Commented out for now
}

// setTimeout(intervalFn, 10000)

app.get('/testDebug', (req, res) => {
  intervalFn();
})

http.createServer(app).listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
