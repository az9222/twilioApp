import React from 'react';
const axios = require('axios');
const config = require('../../../config.js');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightNumber: '',
      phoneNumber: ''
    }
    this.onFlightChange = this.onFlightChange.bind(this);
    this.onPhoneChange  = this.onPhoneChange.bind(this);
    this.onSubmitFlightData = this.onSubmitFlightData.bind(this);
  };

  onFlightChange(e) {
    e.preventDefault();
    let newStateFlight = Object.assign({}, this.state.flightNumber);
    newStateFlight[e.target.name] = e.target.value;
    this.setState({
      flightNumber: newStateFlight
    });
  };

  onPhoneChange(e) {
    e.preventDefault();
    let newStatePhone = Object.assign({}, this.state.phoneNumber);
    newStatePhone[e.target.name] = e.target.value;
    this.setState({
      phoneNumber: newStatePhone
    });
  };

  //when user inputs flight #, it makes an API call to get the data and post into mongoDB
  onSubmitFlightData(e) {
    e.preventDefault();
    let options = {
      url: 'https://aviation-edge.com/v2/public/flights',
      qs: {
        key: config.flightApiKey,
        flightIata: this.state.flightNumber
      },
      phoneNumber: this.state.phoneNumber
    }
    axios.get(options.url, {
      'params': options.qs
    });
    axios.post('/flightInfo', options)
    .catch((error) => {console.log(error)});
    this.setState({
      flightNumber: '',
      phoneNumber: ''
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmitFlightData}>
        <label className="flightNumberField"> Flight Number:
          <input type='text' name="flightNumber" className="formText" onChange = {(e) => this.onFlightChange(e)} /> 
        </label>
        <label className="phoneNumberField"> Phone Number:
          <input type='text' name="phoneNumber" className="formText" onChange = {(e) => this.onPhoneChange(e)}/>
        </label>
        <input type="submit" className="submit"/>
      </form>
    )
  };
};

export default Form;