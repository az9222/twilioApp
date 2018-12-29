import React from 'react';
import Form from './Form.jsx';
import Dropdown from './Dropdown.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
    <div>
      <h1 className="title">Welcome</h1>
      <br />
      <br />
      <img src="http://images.clipartpanda.com/airline-clipart-airline-clipart-airplane-clipart.jpg" className="airplanePic" />
      <br />
      <br />
      <h2 className="heading">Do you want to get texts about your flight status</h2>
      <Dropdown />
      <h3 className="heading">Keep track of flights that you have here: </h3>
      <Form />
    </div>
    )
  }
};

export default App;