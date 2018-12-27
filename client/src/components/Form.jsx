import React from 'react';
import FlightInfo from './FlightInfo.jsx';
const axios = require('axios');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightNumber: '',
      timeDate: '',
      destination: '',
      flightInfo: []
    }
    this.onFlightNumberChange = this.onFlightNumberChange.bind(this);
    // this.onFlightInfoSubmit = this.onFlightInfoSubmit.bind(this);
    this.getFlightInfo = this.getFlightInfo.bind(this);
  }

  componentDidMount(){
    this.getFlightInfo();
  }

  onFlightNumberChange(e) {
    e.preventDefault();
    let newState = Object.assign({}, this.state.flightNumber);
    newState[e.target.name] = e.target.value;
    this.setState({
      flightNumber: newState
    });
  };
  
//   onFlightInfoSubmit(e) {
//     e.preventDefault();
//     axios.post('/flightInfo', this.state.flightNumber);
//   };

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
    console.log('flightinfo', this.state.flightInfo)
    return (
//       <form onSubmit={this.onFlightInfoSubmit}>
        <form>
        <label><span className="messageText"> Flight Number: </span>
          <input name="flightNumber" onChange={(e) => this.onFlightNumberChange(e)} 
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