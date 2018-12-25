const express = require("express");
const twilio = require("twilio");
const config = require('../config.js')
const client = new twilio(config.config.twilioConfig.accountSid, config.config.twilioConfig.authToken)
const messageDb = require('../database/messageDb.js');

console.log('this is config', config.config)

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body);
  client.messages
    .create({
      from: config.config.twilioConfig.number,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.listen(port, () => {console.log(`Listening on port ${port}...`)});