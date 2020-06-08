import React from "react";

import { Form } from "react-bootstrap";

class ChartOptionSelector extends React.Component {

  handleSelectChange = event => {
    const { options, updateSelectedOption } = this.props;
    const target = event.target;
    const value = target.value;
    const selectedObject = options[value];

    updateSelectedOption(selectedObject);
  };


  render() {
    const { options, disabled } = this.props;
    return (
      <Form>
        <Form.Control as="select" onChange={this.handleSelectChange} disabled={ disabled } >
          {options.map((option, index) => (
            <option key={option.key} value={index}>{ option.name }</option>
          ))}
        </Form.Control>
      </Form>
    );
  }
}

export default ChartOptionSelector;