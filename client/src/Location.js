import React, { Component }  from 'react';
import { FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';

class Location extends Component {
  curError() {
    if (this.props.locationError === "null_location") {
      return "Location required";
    }
  }

  render() {
    return (
      <div>
        <FormGroup validationState={this.props.validateLocation()}>
          <ControlLabel>Location</ControlLabel>
          <FormControl type="text" value={this.props.location} onChange={this.props.onChange} />
          <FormControl.Feedback />
          {this.props.validateLocation() === "error" ? <HelpBlock>Location required</HelpBlock> : ""}
        </FormGroup>
      </div>
    );
  }
}

export default Location;