import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';

class CustomFormControl extends Component {
  focus(){
    ReactDOM.findDOMNode(this._element).focus();
  }
  
  render(){
    return(
      <FormControl {...this.props} ref={(element)=>this._element=element} />
    )
  }
};
  
export default CustomFormControl;