import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      body: '',
      submission: false,
    }
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }
  
  onNumberChange(e) {
    e.preventDefault();
    let newState = Object.assign({}, this.state.to);
    newState[e.target.name] = e.target.value;
    this.setState({
      to: newState
    });
  };

  onBodyChange(e) {
    e.preventDefault();
    let newState = Object.assign({}, this.state.body);
    newState[e.target.name] = e.target.value;
    this.setState({
      body: newState
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
      body: JSON.stringify(this.state.body)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        this.setState({
          submission: false, 
          to: '',
          body: ''
        })
      } else {
        this.setState({
          submission: false
        });
      };
    });
  };

  render() {
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