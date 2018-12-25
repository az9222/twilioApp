import React from 'react';
import Form from './Form.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
    <div>
      <h1 className="title">Welcome</h1>
      <h2 className="heading">Send a text to instantly receive flight details!</h2>
      <br />
      <br />
      <img src="http://images.clipartpanda.com/airline-clipart-airline-clipart-airplane-clipart.jpg" className="airplanePic" />
      <br />
      <br />
      <Form />
    </div>
    )
  }
};

export default App;