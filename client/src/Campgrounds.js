import React, { Component } from 'react';
import Campground from './Campground';
import { Table } from 'react-bootstrap';

class Campgrounds extends Component {
  processCampgrounds(campgrounds) {
    var results = [];
    var counter = 0;
    for (var i = 0, len = campgrounds.length; i < len; i++) {
      let name = campgrounds[i].name;
      let url = campgrounds[i].url;
      for (var j = 0, leng = campgrounds[i].campsites.length; j < leng; j++) {
        counter++;
        let campsiteNumber = Object.keys(campgrounds[i].campsites[j])[0];
        let campsiteDates = campgrounds[i].campsites[j][campsiteNumber];
        // API returns an empty list if a campsite is found but does not have availability
        if (campsiteDates.length === 0) {
          break;
        }
        let component = (<Campground key={counter} name={name} url={url}
          campsiteNumber={campsiteNumber} campsiteDates={campsiteDates} />);
        results.push(component);
      }
    }
    return results;
  }

  render() {
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th className="text-center">Campsite</th>
              <th className="text-center">Dates Available</th>
            </tr>
          </thead>
          <tbody>
            {this.processCampgrounds(this.props.campgrounds)}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default Campgrounds;