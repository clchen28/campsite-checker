import React, { Component }  from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class DateBox extends Component {
  render() {
    return (
      <div>
        <em>{this.props.startOrEnd} Date</em>
        <DatePicker
          dateFormat="MM/DD/YYYY"
          todayButton={"Today"}
          selected={this.props.date}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default DateBox