import React, { Component } from 'react';
import Campground from './Campground';

class Campgrounds extends Component {
  processCampgrounds(campgrounds) {
    var results = [];
    var counter = 0;
    for (var i = 0, len = campgrounds.length; i < len; i++) {
      let name = campgrounds[i].name;
      let url = campgrounds[i].url;
      for (var j = 0, leng = campgrounds[i].campsites.length; j < leng; j++) {
        // TODO: Change API to return an object for each campsite, with name and dates keys
        counter++;
        let campsiteNumber = Object.keys(campgrounds[i].campsites[j])[0];
        let campsiteDates = campgrounds[i].campsites[j][campsiteNumber];
        // API returns an empty list if a campsite is found but does not have availability
        if (campsiteDates.length === 0) {
          break;
        }
        let component = (<div key={counter}><Campground name={name} url={url}
          campsiteNumber={campsiteNumber} campsiteDates={campsiteDates} /><br /></div>);
        results.push(component);
      }
    }
    return results;
  }

  render() {
    return (
      <div>
        {this.processCampgrounds(this.props.campgrounds)};
      </div>
    )
  }
}

export default Campgrounds;