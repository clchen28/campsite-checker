import React, { Component }  from 'react';
import DatePicker from 'react-datepicker';
import { ControlLabel } from 'react-bootstrap';
import CustomFormControl from './CustomFormControl';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class DateBox extends Component {
  render() {
    return (
      <div>
        <ControlLabel>{this.props.startOrEnd} Date</ControlLabel>
        <DatePicker
          dateFormat="MM/DD/YYYY"
          todayButton={"Today"}
          selected={this.props.date}
          onChange={this.props.onChange}
          customInput={<CustomFormControl type="text" />}
        />
      </div>
    );
  }
}

export default DateBox