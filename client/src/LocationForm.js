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
      locationValidationState: null,
      radiusValidationState: null,
      startDateError: null,
      endDateError: null,
      submitting: false,
    };
    this.validateLocation = this.validateLocation.bind(this);
    this.validateRadius = this.validateRadius.bind(this);
    this.validateDates = this.validateDates.bind(this);
    this.noErrorInForm = this.noErrorInForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateLocation() {
    if (this.props.locationFirstRender) {
      return null;
    }
    else if (this.props.location === "") {
      return "error";
    }
    else {
      return "success";
    }
  }

  validateRadius() {
    if (this.props.radiusFirstRender) {
      return null;
    }
    else if (this.props.radius === "") {
      return "error";
    }
    else if (isNaN(this.props.radius)) {
      return "error";
    }
    else if (isNaN(parseInt(this.props.radius, 10))) {
      return "error";
    }
    else {
      return "success";
    }
  }

  validateDates() {
    if (this.props.start_date.date() < moment().date()) {
      return "Start date must be today or later";
    }
    else if (this.props.start_date >= this.props.end_date) {
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
        location: this.props.location,
        radius: this.props.radius,
        start_date: this.props.start_date.format("MM/DD/YYYY"),
        end_date: this.props.end_date.format("MM/DD/YYYY")
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
          this.setState({
            submitting: false
          });
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
            location={this.props.location}
            validateLocation={this.validateLocation}
            onChange={this.props.onChangeLocation}
            locationError={this.state.locationError} />
          <Radius
            radius={this.props.radius}
            validateRadius={this.validateRadius}
            onChange={this.props.onChangeRadius}
            radiusError={this.state.radiusError} />
          <Dates
            startDate={this.props.start_date}
            endDate={this.props.end_date}
            validateDates={this.validateDates}
            onChangeStartDate={this.props.onChangeStartDate}
            onChangeEndDate={this.props.onChangeEndDate} />
          {this.currentButton()}
          <Button bsStyle="default" onClick={this.props.onClearSearch}>Clear</Button>
        </form>
      </div>
    );
  }
}

export default LocationForm;