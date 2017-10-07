import React, { Component } from 'react';
import Dates from './Dates';
import Location from './Location';
import Radius from './Radius';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationFirstRender: true,
      radiusFirstRender: true,
      location: "",
      radius: "",
      locationValidationState: null,
      radiusValidationState: null,
      startDateError: null,
      endDateError: null,
      submitting: false,
      start_date: moment(),
      end_date: moment().add(1, 'days'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeRadius = this.onChangeRadius.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.validateRadius = this.validateRadius.bind(this);
    this.validateDates = this.validateDates.bind(this);
  }

  onChangeLocation(newLocation) {
    this.setState({
      location: newLocation.target.value,
      locationFirstRender: false
    });
  }

  onChangeRadius(newRadius) {
    this.setState({
      radius: newRadius.target.value,
      radiusFirstRender: false
    });
  }

  onChangeStartDate(newStartDate) {
    this.setState({
      start_date: newStartDate,
      dateFirstRender: false
    });
  }

  onChangeEndDate(newEndDate) {
    this.setState({
      end_date: newEndDate,
      dateFirstRender: false
    });
  }

  validateLocation() {
    if (this.state.locationFirstRender) {
      return null;
    }
    else if (this.state.location === "") {
      return "error";
    }
    else {
      return "success";
    }
  }

  validateRadius() {
    if (this.state.radiusFirstRender) {
      return null;
    }
    else if (this.state.radius === "") {
      return "error";
    }
    else if (isNaN(this.state.radius)) {
      return "error";
    }
    else if (isNaN(parseInt(this.state.radius, 10))) {
      return "error";
    }
    else {
      return "success";
    }
  }

  validateDates() {
    if (this.state.start_date.date() < moment().date()) {
      return "Start date must be today or later";
    }
    else if (this.state.start_date >= this.state.end_date) {
      return "Start date must be before the end date";
    }
    return "success";
  }

  noErrorInForm() {
    if (this.validateLocation() !== "success") {
      return false;
    }
    else if (this.validateRadius() !== "success") {
      return false;
    }
    else if (this.validateDates() !== "success") {
      return false;
    }
    else {
      return true;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
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
      };
      this.setState({
        submitting: true
      });
      axios.post(apiUrl, data, headers).then(
        response => {
          this.props.onResponse(response.data.campgrounds);
        }
      );
    }
  }

  currentButton() {
    const loadingButton = <Button type="submit" bsStyle="warning" disabled>Searching...</Button>;
    const activeButton = <Button type="submit" bsStyle="success">Submit</Button>;
    const disabledButton = <Button type="submit" bsStyle="danger" disabled>Submit</Button>;
    if (this.state.submitting) {
      return loadingButton;
    }
    else if (this.noErrorInForm()) {
      return activeButton;
    }
    else if (!this.noErrorInForm()) {
      return disabledButton;
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Location 
            location={this.state.location}
            validateLocation={this.validateLocation}
            onChange={this.onChangeLocation}
            locationError={this.state.locationError} />
          <Radius
            radius={this.state.radius}
            validateRadius={this.validateRadius}
            onChange={this.onChangeRadius}
            radiusError={this.state.radiusError} />
          <Dates
            startDate={this.state.start_date}
            endDate={this.state.end_date}
            validateDates={this.validateDates}
            onChangeStartDate={this.onChangeStartDate}
            onChangeEndDate={this.onChangeEndDate} />
          {this.currentButton()}
        </form>
      </div>
    );
  }
}

export default LocationForm;