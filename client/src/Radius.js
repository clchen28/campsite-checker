import React, { Component }  from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';

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
        <ControlLabel>Radius (miles)</ControlLabel>
        <FormControl type="text" value={this.props.radius} onChange={this.props.onChange} />
        <p>{this.curError()}</p>
      </div>
      );
  }
}

export default Radius;