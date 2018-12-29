import React from 'react';
const axios = require('axios');
const config = require('../../../config.js');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightNumber: ''
    }
    this.onInfoChange = this.onInfoChange.bind(this);
    this.onSubmitFlightData = this.onSubmitFlightData.bind(this);
  };

  onInfoChange(e){
    e.preventDefault();
    this.setState({
      [e.target.name] : e.target.value
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
      }
    }
    axios.get(options.url, {
      'params': options.qs
    });
    axios.post('/flightInfo', options)
    .catch((error) => {console.log(error)});
    this.setState({
      flightNumber: ''
    });
  };

  render() {
  console.log('flightNumber', this.state.flightNumber)
    return (
      <form onSubmit={this.onSubmitFlightData}>
        <label> Flight Number:
          <input type='text' name="flightNumber" onChange = {(e) => this.onInfoChange(e)} /> 
        </label>
        <label> Phone Number:
          <input type='text' name="phoneNumber" onChange = {(e) => this.onInfoChange(e)}/>
        </label>
        <input type="submit" />
      </form>
    )
  }
};

export default Form;