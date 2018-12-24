const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const twilio = require('twilio');
const config = require('../client/config.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  twilio.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({success: true}));
    })
    .catch((err) => {
      console.log("error:", err);
      res.send(JSON.stringify({success: false}));
    });
});

app.listen(port, () => {console.log(`Listening on port ${port}...`)});