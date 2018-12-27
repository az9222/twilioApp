import React from 'react';
import FlightInfo from './FlightInfo.jsx';
const axios = require('axios');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightNumber: '',
      time: '',
      destination: '',
      date: '',
      flightInfo: []
    }
    this.onFlightChange = this.onFlightChange.bind(this);
    this.onFlightInfoSubmit = this.onFlightInfoSubmit.bind(this);
    this.getFlightInfo = this.getFlightInfo.bind(this);
  }

  componentDidMount(){
    this.getFlightInfo();
  }

  onFlightChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name] : e.target.value
    });
  }
  
  onFlightInfoSubmit(e) {
    e.preventDefault();
    axios.post('/flightInfo', this.state);
    this.getFlightInfo();
  };

  getFlightInfo() {
    axios.get('/flightInfo')
    .then((results) => {
      let joined = this.state.flightInfo.concat(results.data);
      this.setState({
        flightInfo: joined
      })
    })
    .catch((error) => {console.log(error)});
  };

  render() {
    return (
      <form onSubmit={this.onFlightInfoSubmit}>
        <label><span className="messageText"> Flight Number: </span>
          <input name="flightNumber" onChange={(e) => this.onFlightChange(e)} 
          className="toTextField" />
        </label>
        <br />
        <br />
        <label><span className="messageText"> Destination: </span>
          <input name="destination" onChange={(e) => this.onFlightChange(e)} 
          className="toTextField" />
        </label>
        <br />
        <br />
        <label><span className="messageText"> Date: </span>
          <input name="date" onChange={(e) => this.onFlightChange(e)} 
          className="toTextField" />
        </label>
        <br />
        <br />
        <label><span className="messageText"> Time: </span>
          <input name="time" onChange={(e) => this.onFlightChange(e)} 
          className="toTextField" />
        </label>
        <br />
        <br />
        <input type="submit" className="submitButton" /> 
        <div>
          <h2 className="toTextField">Flight Info: </h2>
          <FlightInfo flightInfo={this.state.flightInfo} />
        </div>
      </form>
    )
  };
};

export default Form;