import React, { Component }  from 'react';

class Location extends Component {
  curError() {
    if (this.props.locationError === "null_location") {
      return "Location required";
    }
  }

  render() {
    return (
      <div>
        <em>Location</em> <i className="fa fa-map-marker" aria-hidden="true"></i>
        <br />
        <i className="fa fa-crosshairs" aria-hidden="true"></i>
        <input type="text" name="location" value={this.props.location} onChange={this.props.onChange}></input>
        <p>{this.curError()}</p>
      </div>
    );
  }
}

export default Location;