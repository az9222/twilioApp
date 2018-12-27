const express = require("express");
const http = require('http');
const messageDb = require('../database/messageDb.js');
const app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let flightId = req.body.Body;
  let url = `https://aviation-edge.com/v2/public/flights?key=c27849-c7cc8c&flightIata=${flightId}`;
  fetch(url)
    .then(response => response.json())
    .then(response => twiml.message(JSON.stringify(response)))
    .catch(error => twiml.message('Sorry! Flight not found.'));
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

// app.post('/sms', (req, res) => {
//     const twiml = new MessagingResponse();
//     let flightId = req.body.Body;
//     let url = `https://aviation-edge.com/v2/public/flights?key=c27849-c7cc8c&flightIata=${flightId}`;
//     fetch(url)
//       .then(response => response.json())
//       .then(if (response == {error: "No Record Found or Flight not currently detected by receivers. "}))
//       .then(twiml.message('Sorry! Flight not found.'))
//       // .catch(error => twiml.message('Sorry! Flight not found.'));
//       res.writeHead(200, {'Content-Type': 'text/xml'});
//       res.end(twiml.toString());
//   });

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