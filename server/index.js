const express = require("express");
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const messageDb = require('../database/messageDb.js');
const config = require('../config.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

//api call with Twilio services
app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let flightId = req.body.Body;
  let options = {
    url: 'https://aviation-edge.com/v2/public/flights',
    qs: {
      key: config.flightApiKey,
      flightIata: flightId
      }
    }
    request(options, (err, response, body) => {
    let bodyJSON = JSON.parse(body);
    if (err) {
      twiml.message('Sorry! Flight not found.');
    } else {
      if(bodyJSON.error) {
        twiml.message(bodyJSON.error)
      } else {
        let flightData = bodyJSON[0];
        let departure = flightData.departure.iataCode;
        let arrival = flightData.arrival.iataCode;
        let flight = flightData.flight.iataNumber;
        let status = flightData.status;
        twiml.message(`${flight} from ${departure} to ${arrival}: ${status}`);
        }
      }
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      });
  });

//RESTful API for web services
app.post('/flightInfo', (req, res) => {
  messageDb.save(req.body, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send();
    }
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

app.get('/flightInfo/:id', (req, res) => {
  messageDb.getFlightInfoForOne(req.params.id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
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

http.createServer(app).listen(port, () => {
  console.log(`Listening on port ${port}...`);
});