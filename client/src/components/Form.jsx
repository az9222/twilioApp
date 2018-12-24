import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      body: '',
      submission: false,
      error: false
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
      }, //comment out later to test
      body: JSON.stringify(this.state.body) //comment to test
    })
    .then(res => res.json())
    .then((data) => {
      if(data.success) {
        this.setState({
          error: false,
          submission: false,
          to: '',
          body: ''
        });
      } else {
        this.setState({
          error: true,
          submission: false
        });
      }
    });
  };

  render() {
    return (
      <form onSubmit={this.onMessageSubmit}>
        <label>To: 
          <input type="text" name="to" onChange={(e) => this.onNumberChange(e)} />
        </label>
        <label>Body: 
          <input type="text" name="body" onChange={(e) => this.onBodyChange(e)} />
        </label>
        <input type="submit" value="Submit Message" />
      </form>
    )
  }
};

export default Form;