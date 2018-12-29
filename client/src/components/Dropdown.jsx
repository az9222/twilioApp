import React from 'react';
import Form from './Form.jsx';
import ThanksForm from './ThanksForm.jsx';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '',
      form: ''
    }
    this.handleSelectOption = this.handleSelectOption.bind(this);
    this.renderForm = this.renderForm.bind(this);
  };

  handleSelectOption(e) {
    e.preventDefault();
    this.setState({
      selectedValue: e.target.value
    })
  };

  renderForm() {
    let form = this.state.form;
    if (this.state.selectedValue === "Yes") {
      return (
        <Form />
      )
    }
    if (this.state.selectedValue === "No") {
      return (
        <ThanksForm />
      )
    }
  };

  render() {
    console.log(this.state.selectedValue)
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
  }
};

export default Dropdown;