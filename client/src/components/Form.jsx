import React from 'react';
import FlightInfo from './FlightInfo.jsx';
import Dropdown from './Dropdown.jsx';
import SearchBar from './SearchBar.jsx';
const axios = require('axios');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightNumber: '',
      time: '',
      destination: '',
      date: '',
      flightInfo: [],
      query: ''
    }
    this.onFlightChange = this.onFlightChange.bind(this);
    this.onFlightInfoSubmit = this.onFlightInfoSubmit.bind(this);
    this.getFlightInfo = this.getFlightInfo.bind(this);
    this.deleteFlightInfo = this.deleteFlightInfo.bind(this);
    this.sortEarliestFirst = this.sortEarliestFirst.bind(this);
    this.onInputSearch = this.onInputSearch.bind(this);
    this.filterForSearchedResults = this.filterForSearchedResults.bind(this);
    this.renderFlightInfo = this.renderFlightInfo.bind(this);
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
    axios.post('/flightInfo', this.state)
    this.getFlightInfo();
  };

  getFlightInfo() {
    fetch('/flightInfo')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.setState({
        flightInfo: data
      })
    })
    .catch((error) => {console.log(error)});
  };

  deleteFlightInfo(e, item) { 
    e.preventDefault();
    alert(`Flight number ${item.flightNumber} deleted`);
    axios.delete(`/flightInfo/${item._id}`)
    .then((results) => {
      this.setState({
        flightInfo: results.data
      })
    })
    .catch((error) => {console.log(error)});
  };

  sortEarliestFirst(list) {
    return list.sort((a, b) => {
      return a.date - b.date;
    });
  };

  onInputSearch(e) {
    e.preventDefault();
    let query = e.target.value;
    this.setState({
      query: query
    });
  };

  filterForSearchedResults(list, word) {
    let lowerCaseQuery = word.toLowerCase();
    return list.filter((searchedWord) => {
      let lowerCaseSearchedWord = searchedWord.flightNumber.toLowerCase();
      if (lowerCaseSearchedWord.includes(lowerCaseQuery)) {
        return true;
      } else {
        return false;
      };
    });
  };

  renderFlightInfo() {
    let flightInfo = this.state.flightInfo;
    if (this.state.query) {
      flightInfo = this.filterForSearchedResults(flightInfo, this.state.query);
    }
  };

  render() {
    return (
      <div>
        <Dropdown />
        <SearchBar onSearch={this.onInputSearch} />
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
            <FlightInfo flightInfo={this.state.flightInfo} deleteFlightInfo={this.deleteFlightInfo} renderFlightInfo={this.renderFlightInfo}/>
          </div>
        </form>
      </div>
    )
  };
};

export default Form;