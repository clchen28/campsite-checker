import React, { Component }  from 'react';
import DatePicker from 'react-datepicker';
import { ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import CustomFormControl from './CustomFormControl';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class Dates extends Component {
  render() {
    const errMsg = this.props.validateDates();
    return (
      <div>
        <FormGroup validationState={errMsg === "success" || errMsg === null ? errMsg : "error"}>
          <ControlLabel>Check-In Date</ControlLabel>
          <DatePicker
            dateFormat="MM/DD/YYYY"
            todayButton={"Today"}
            selected={this.props.startDate}
            onChange={this.props.onChangeStartDate}
            customInput={<CustomFormControl type="text" />}
          />
        </FormGroup>
        <FormGroup validationState={errMsg === "success" || errMsg === null ? errMsg : "error"}>
          <ControlLabel>Check-Out Date</ControlLabel>
          <DatePicker
            dateFormat="MM/DD/YYYY"
            todayButton={"Today"}
            selected={this.props.endDate}
            onChange={this.props.onChangeEndDate}
            customInput={<CustomFormControl type="text" />}
          />
          {errMsg === "success" || errMsg === null ? null : <HelpBlock>{errMsg}</HelpBlock>}
        </FormGroup>
      </div>
    );
  }
}

export default Dates