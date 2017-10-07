import React, { Component } from 'react';
import LocationForm from './LocationForm';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Campgrounds from './Campgrounds';
import About from './About';
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
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <h1 id="site-title">Campsite Checker</h1>
            <Navbar>
              <Nav>
                <NavItem eventKey={1}><Link to="/about">About</Link></NavItem>
                <NavItem eventKey={2}><Link to="/">Search</Link></NavItem>
                <NavItem eventKey={3}><Link to="/results">Results</Link></NavItem>
              </Nav>
            </Navbar>
          </div>
          <Route exact path="/" render={() => <LocationForm onResponse={this.onChangeCampgrounds} />} />
          <Route path="/about" component={About} />
          <div className="App-footer">
          <i className ="fa fa-code" aria-hidden="true"></i> with <i className="fa fa-heart" aria-hidden="true"></i>, <i className="fa fa-coffee" aria-hidden="true"></i>, and <i className="fa fa-beer" aria-hidden="true"></i><br />
          Hosted on <a href="https://github.com/CCInCharge/campsite-checker"><i className="fa fa-github" aria-hidden="false"></i></a>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
