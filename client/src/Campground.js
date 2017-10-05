import React, { Component } from 'react';

class Campground extends Component {
  render() {
    console.log(this.props.campsiteDates);
    return (<tr>
      <td><a href={this.props.url}>{this.props.name} {this.props.campsiteNumber}</a></td>
      <td>{this.props.campsiteDates.join(", ")}</td>
      </tr>
    )
  }
}

export default Campground;