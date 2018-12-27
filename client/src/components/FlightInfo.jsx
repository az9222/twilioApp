import React from 'react';

const FlightInfo = (props) => {
  return (
    <div className="resultsList">
      {props.flightInfo.map((result, index) => {
        return (
          <div className="single-result" key={index}>
            <span>&nbsp;Flight Number: {result.flightNumber}</span> 
            <span>&nbsp;Destination: {result.destination}</span> 
            <span>&nbsp;Date: {result.date}</span> 
            <span>&nbsp;Time: {result.time}</span> 
          </div>
        )
      })}
    </div>
  );
};

export default FlightInfo;