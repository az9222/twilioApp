import React from 'react';
import { Query } from 'mongoose';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: '',
        body: ''
      },
      submission: false,
    }
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }
  
  onNumberChange(e) {
    e.preventDefault();
    let newState = Object.assign({}, this.state.message.to);
    newState[e.target.name] = e.target.value;
    this.setState({
      message: {
        to: newState.to,
        body: this.state.message.body
      }
    });
  };

  onBodyChange(e) {
    e.preventDefault();
    let newState = Object.assign({}, this.state.message.body);
    newState[e.target.name] = e.target.value;
    this.setState({
      message: {
        to: this.state.message.to,
        body: newState.body
      }
    });
  };

  onMessageSubmit(e) {
    e.preventDefault();
    this.setState({
      submission: true
    });
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.message)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        this.setState({
          submission: false, 
        })
      } else {
        this.setState({
          submission: false
        });
      };
    });
  };

  render() {
    console.log(this.state.message);
    console.log(this.state.message.to);
    console.log(this.state.message.body);
    return (
      <form onSubmit={this.onMessageSubmit} >
        <label><span className="messageText"> To: </span>
          <input name="to" onChange={(e) => this.onNumberChange(e)} 
          className="toTextField" />
        </label>
        <br />
        <br />
        <label><span className="messageText"> Message: </span>
          <input name="body" onChange={(e) => this.onBodyChange(e)} 
            className="bodyTextField" />
        </label>
        <br />
        <br />
        <input type="submit" className="submitButton" /> 
      </form>
    )
  };
};

export default Form;