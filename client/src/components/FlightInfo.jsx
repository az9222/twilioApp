import React from 'react';

const FlightInfo = (props) => {
  return (
    <div className="resultsList">
      {props.flightInfo.map((result) => {
        return (
          <div className="single-result">
            {result._id}
          </div>
        )
      })}
    </div>
  );
};

export default FlightInfo;