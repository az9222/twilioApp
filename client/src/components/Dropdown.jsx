import React from 'react';
import Form from './Form.jsx';
import ThanksForm from './ThanksForm.jsx';
import HomePage from './HomePage.jsx';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '',
    }
    this.handleSelectOption = this.handleSelectOption.bind(this);
    this.renderForm = this.renderForm.bind(this);
  };

  handleSelectOption(e) {
    e.preventDefault();
    this.setState({
      selectedValue: e.target.value
    });
  };

  renderForm() {
    if (this.state.selectValue === "Select") {
      return (
        <HomePage />
      )
    };
    if (this.state.selectedValue === "Yes") {
      return (
        <Form />
      )
    };
    if (this.state.selectedValue === "No") {
      return (
        <ThanksForm />
      )
    };
    return <HomePage />
  };

  render() {
    return (
      <div>
        <select onChange={this.handleSelectOption}>
          <option>Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        {this.renderForm()}
      </div>
    )
  };
};

export default Dropdown;