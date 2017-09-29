import React, { Component } from 'react';

class Campground extends Component {
  render() {
    return (
      <div>
        Campground: {this.props.name}
        <br />
        Url: {this.props.url}
        <br />
        Campsite Number: {this.props.campsiteNumber}
        <br />
        Campsite Dates; {this.props.campsiteDates}
        <br />
      </div>
    );
  }
}

export default Campground;