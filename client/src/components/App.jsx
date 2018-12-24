import React from 'react';
import Form from './Form.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   list: []
    // }
  };

  render() {
    return (
    <div>
      <Form />
    </div>
    )
  }
};

export default App;