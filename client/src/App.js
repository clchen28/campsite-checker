import React, { Component } from 'react';
import LocationForm from './LocationForm';
import Campgrounds from './Campgrounds';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campgrounds: false
    }
    this.onChangeCampgrounds = this.onChangeCampgrounds.bind(this);
  }

  currentView() {
    if (!this.state.campgrounds) {
      return <LocationForm onResponse={this.onChangeCampgrounds} />;
    }
    else {
      return <Campgrounds campgrounds={this.state.campgrounds} />;
    }
  }

  onChangeCampgrounds(newCampgrounds) {
    this.setState({
      campgrounds: newCampgrounds
    });
    console.log(this.state.campgrounds);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Campsite Checker</h2>
        </div>
        {this.currentView()}
      </div>
    );
  }
}

export default App;
