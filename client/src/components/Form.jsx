import React from 'react';
const axios = require('axios');

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        <label> Flight Number:
          <input type='text'/> 
        </label>
        <label> Phone Number:
          <input type='text'/>
        </label>
      </form>
    )
  }
};

export default Form;