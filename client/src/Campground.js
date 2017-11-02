import React, { Component } from 'react';

class Campground extends Component {
  processDate() {
    var results = [];
    for (var i = 0, len=this.props.campsiteDates.length; i < len; i++) {
      let date = this.props.campsiteDates[i].date;
      let reservationUrl = this.props.campsiteDates[i].reservationUrl;
      let link = (<span><a href={reservationUrl}>{date}</a>{" "}</span>);
      results.push(link);
    }
    return results;
  }
  render() {
    return (<tr>
      <td><a href={this.props.url}>{this.props.name} {this.props.campsiteNumber}</a></td>
      <td>{this.processDate()}</td>
      </tr>
    )
  }
}

export default Campground;