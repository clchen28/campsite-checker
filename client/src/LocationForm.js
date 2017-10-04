import React, { Component } from 'react';
import DateBox from './DateBox';
import Location from './Location';
import Radius from './Radius';
import { FormGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

// TODO: Use a more elegant technique to handle form error validation

class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      radius: "",
      radiusError: "",
      locationError: "",
      startDateError: "",
      endDateError: "",
      start_date: moment(),
      end_date: moment().add(1, 'days'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeRadius = this.onChangeRadius.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
  }

  onChangeLocation(newLocation) {
    this.setState({
      location: newLocation.target.value
    });
  }

  onChangeRadius(newRadius) {
    this.setState({
      radius: newRadius.target.value
    });
  }

  onChangeStartDate(newStartDate) {
    this.setState({
      start_date: newStartDate
    });
  }

  onChangeEndDate(newEndDate) {
    this.setState({
      end_date: newEndDate
    });
  }

  noErrorInForm() {
    if (this.state.radiusError === "" && this.state.locationError === "" &&
      this.state.startDateError === "" && this.state.endDateError === "") {
      return true
    }
    else {
      return false
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.radius === "") {
      this.setState({
        radiusError: "null_radius"
      });
    }
    else if (isNaN(this.state.radius)) {
      this.setState({
        radiusError: "invalid_radius"
      });
    }
    if (this.state.location === "") {
      this.setState({
        locationError: "null_location"
      });
    }

    if (this.state.start_date.date() < moment().date()) {
      this.setState({
        startDateError: "past_date"
      });
    }

    if (this.state.start_date >= this.state.end_date) {
      this.setState({
        endDateError: "invalid_date"
      });
    }

    if (this.noErrorInForm()) {
      var apiUrl = "/api";
      var data = {
        location: this.state.location,
        radius: this.state.radius,
        start_date: this.state.start_date.format("MM/DD/YYYY"),
        end_date: this.state.end_date.format("MM/DD/YYYY")
      };
      var headers = {
        'Content-Type': 'application/json'
      }
      axios.post(apiUrl, data, headers).then(
        response => {
          this.props.onResponse(response.data.campgrounds);
        }
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Location location={this.state.location} onChange={this.onChangeLocation} locationError={this.state.locationError} />
        </FormGroup>
        <FormGroup>
          <Radius radius={this.state.radius} onChange={this.onChangeRadius} radiusError={this.state.radiusError} />
        </FormGroup>
        <FormGroup>
          <DateBox startOrEnd="Check-in" date={this.state.start_date} onChange={this.onChangeStartDate}
            dateError={this.state.startDateError} />
          <DateBox startOrEnd="Check-out" date={this.state.end_date} onChange={this.onChangeEndDate} 
            dateError={this.state.endDateError} />
        </FormGroup>
          <Button type="submit" bsStyle="primary">Submit</Button>
      </form>
    );
  }
}

export default LocationForm;