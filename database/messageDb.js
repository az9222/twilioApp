const mongoose = require('mongoose');
const db = require('./index.js');

const messageSchema = mongoose.Schema({
  to: String,
  body: String
});

const MessageModel = mongoose.model('MessageModel', messageSchema);

const save = (message, callback) => {
  const newMessage = new MessageModel(message);
  newMessage.save((err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports ={
  MessageModel, 
  save
};