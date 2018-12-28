const express = require("express");
const http = require('http');
const messageDb = require('../database/messageDb.js');
const app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// app.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();
//   let flightId = req.body.Body;
//   let options = {
//     url: 'https://aviation-edge.com/v2/public/flights',
//     qs: {
//       key: 'c27849-c7cc8c',
//       flightIata: flightId
//     }
//   }
//   request(options, (err, response, body) => {
//     if (err) {
//       twiml.message('Sorry! Flight not found.')
//     } else {
//       if(response.body && response.body.error) {
//       twiml.message('Sorry! Flight not found.')
//     } else {
//       console.log('responseeeee', body[0])
//       let departure = response.body[0].departure.iataCode
//       let arrival = response.body[0].arrival.iataCode
//       let flight = response.body[0].flight.iataNumber
//       let status = response.body[0].status
//       twiml.message(`${flight} from ${departure} to ${arrival}: ${status}`)
//       }
//     }
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.end(twiml.toString());
//   });
// });

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let flightId = req.body.Body;
  let options = {
    url: 'https://aviation-edge.com/v2/public/flights',
    qs: {
      key: 'c27849-c7cc8c',
      flightIata: flightId,
      json: true
    }
  }
  request(options, (err, response, body) => {
    if (response.body && response.body.error) {
      twiml.message('Sorry! Flight not found.');
    } else {
  //     console.log('RESPONSE', response.body)
  //     let departure = response.body[0].departure.iataCode
  //     let arrival = response.body[0].arrival.iataCode
  //     let flight = response.body[0].flight.iataNumber
  //     let status = response.body[0].status
  //     twiml.message(`${flight} from ${departure} to ${arrival}: ${status}`)
  twiml.message(response.body)
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
});


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

//get with cache
app.get

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