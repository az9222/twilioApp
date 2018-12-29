const mongoose = require('mongoose');
const db = require('./index.js');

const flightSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  flight: String,
  status: String,
  phoneNumber: String
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

const getFlightsInProgressStatus = (callback) => {
  FlightModel.find({status: { $in: ['started', 'en-route', 'unknown'] }},  (err, results) => {
    if (err) {
      callback (err, null);
    } else {
      callback(null, results);
    }
  });
};

// const getFlightInfoForOne = (id, callback) => {
//   FlightModel.find({_id: id}, (err, results) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, results);
//     }
//   });
// };

const deleteFlightInfo = (id, callback) => {
  FlightModel.remove({_id: id}, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const updateFlightInfo = (flightId, status, callback) => {
  FlightModel.update({flight: flightId}, {status: status}, (err, results) => {
    if (err) {
      callback (err, null);
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
  getFlightsInProgressStatus,
  updateFlightInfo
};