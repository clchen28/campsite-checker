import React, { Component }  from 'react';

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
          <em>Radius (miles)</em>
          <br />
          <input type="text" name="radius" value={this.props.radius} onChange={this.props.onChange}></input>
          <p>{this.curError()}</p>
      </div>
      );
  }
}

export default Radius;