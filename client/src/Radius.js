import React, { Component }  from 'react';
import { FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';

class Radius extends Component {
  curError() {
    if (this.props.radiusError === "invalid_radius") {
      return "Must be a valid number";
    }
    else if (this.props.radiusError === "null_radius") {
      return "Radius input required";
    }
    else {
      return "";
    }
  }

  render() {
      return (
      <div>
        <FormGroup validationState={this.props.validateRadius()} ref="radiusFormGroup">
          <ControlLabel>Radius (miles)</ControlLabel>
          <FormControl className="input75" type="text" value={this.props.radius} onChange={this.props.onChange} />
          <FormControl.Feedback />
          {this.props.validateRadius() === "error" ? <HelpBlock>Must be a valid number</HelpBlock> : ""}
        </FormGroup>
      </div>
      );
  }
}

export default Radius;
