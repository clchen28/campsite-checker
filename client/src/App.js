import React, { Component } from 'react';
import LocationForm from './LocationForm';
import Campgrounds from './Campgrounds';
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
          <h1 id="site-title">Campsite Checker</h1>
        </div>
        {this.currentView()}
      </div>
    );
  }
}

export default App;
