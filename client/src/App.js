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
        <div className="App-footer">
        <i className ="fa fa-code" aria-hidden="true"></i> with <i className="fa fa-heart" aria-hidden="true"></i>, <i className="fa fa-coffee" aria-hidden="true"></i>, and <i className="fa fa-beer" aria-hidden="true"></i><br />
        Hosted on <a href="https://github.com/CCInCharge/campsite-checker"><i className="fa fa-github" aria-hidden="false"></i></a>
        </div>
      </div>
    );
  }
}

export default App;
