const mongoose = require('mongoose');
const db = require('./index.js');

const flightSchema = mongoose.Schema({
  flightNumber: String,
  destination: String,
  date: String,
  time: String,
});

const FlightModel = new mongoose.model('FlightModel', flightSchema);

const save = (flight, callback) => {
  const newFlight = new FlightModel(flight);
  newFlight.save((err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getFlightInfo = (callback) => {
  FlightModel.find({}, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getFlightInfoForOne = (id, callback) => {
  FlightModel.find({_id: id}, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const deleteFlightInfo = (id, callback) => {
  FlightModel.remove({_id: id}, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports ={
  FlightModel, 
  save,
  getFlightInfo,
  deleteFlightInfo,
  getFlightInfoForOne
};