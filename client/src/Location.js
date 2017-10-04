import React, { Component }  from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';

class Location extends Component {
  curError() {
    if (this.props.locationError === "null_location") {
      return "Location required";
    }
  }

  render() {
    return (
      <div>
        <ControlLabel>Location</ControlLabel>
        <FormControl type="text" value={this.props.location} onChange={this.props.onChange} />
        <p>{this.curError()}</p>
      </div>
    );
  }
}

export default Location;