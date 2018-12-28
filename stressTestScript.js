const faker = require('faker');

const generateRandomHour = (min, max) => {
  return Math.floor(Math.random() * (max- min) + min);
};

const generateRandomMinute = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateFlightNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

function generateFlightData(userContext, events, done) {
  const flightNumber = `${faker.address.countryCode()}${generateFlightNumber(100, 300)}`;
  const destination = faker.address.country();
  const date =  `${faker.fake('{{date.month}}, {{date.weekday}}')}`;
  const time = `${generateRandomHour(1, 24)} : ${generateRandomMinute(1, 59)}`
  const flightInfo = `${flightNumber}\t${destination}\t${date}\t${time}\n`;
  userContext.vars.flightNumber = flightNumber;
  userContext.vars.destination = destination;
  userContext.vars.date = date;
  userContext.vars.time = time;
  userContext.vars.flightInfo = flightInfo;
  return done();
};

module.exports = {
  generateFlightData,
};
