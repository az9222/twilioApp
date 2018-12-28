const fs = require('fs');
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

const generateFlightData = (i) => {
  const flightNumber = `${faker.address.countryCode()}${generateFlightNumber(100, 300)}`;
  const destination = faker.address.country();
  const date =  `${faker.fake('{{date.month}}, {{date.weekday}}')}`;
  const time = `${generateRandomHour(1, 24)} : ${generateRandomMinute(1, 59)}`
  const flightInfo = `${flightNumber}\t${destination}\t${date}\t${time}\n`;
  return flightInfo;
};

function writeOneHundredTimes(writer, numEntries) {
  let i = numEntries;
  function write() {
    let ok = true;
    let data;
    do {
      i -= 1;
      if (i === 0) {
        data = generateFlightData(i + 1);
        writer.write(data); 
      } else {
        data = generateFlightData(i + 1);
        ok = writer.write(data);
        console.log('loading', i);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write); 
    }
  }
  write();
};

const stream = fs.createWriteStream('sampleData.tsv');
writeOneHundredTimes(stream, 100);
