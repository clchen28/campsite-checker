import React, { Component } from 'react';
import LocationForm from './LocationForm';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Campgrounds from './Campgrounds';
import About from './About';
import moment from 'moment';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campgrounds: false,
      locationFirstRender: true,
      radiusFirstRender: true,
      location: "",
      radius: "",
      start_date: moment(),
      end_date: moment().add(1, 'days'),
      redirectToResults: false
    };
    this.onChangeCampgrounds = this.onChangeCampgrounds.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeRadius = this.onChangeRadius.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
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
      campgrounds: newCampgrounds,
      redirectToResults: true
    });
  }

  onChangeLocation(newLocation) {
    this.setState({
      location: newLocation.target.value,
      locationFirstRender: false,
      redirectToResults: false
    });
  }

  onChangeRadius(newRadius) {
    this.setState({
      radius: newRadius.target.value,
      radiusFirstRender: false,
      redirectToResults: false
    });
  }

  onChangeStartDate(newStartDate) {
    this.setState({
      start_date: newStartDate,
      dateFirstRender: false,
      redirectToResults: false
    });
  }

  onChangeEndDate(newEndDate) {
    this.setState({
      end_date: newEndDate,
      dateFirstRender: false,
      redirectToResults: false
    });
  }

  onClearSearch() {
    this.setState({
      location: '',
      locationFirstRender: true,
      radius: '',
      radiusFirstRender: true,
      start_date: moment(),
      end_date: moment().add(1, 'days')
    });
  }

  render() {
  const redirectToResults = this.state.redirectToResults ? (<Redirect to="/results"/>) : '';
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <h1 id="site-title">Campsite Checker</h1>
            <Navbar id="navbar">
              <Nav>
                <LinkContainer to="/" activeClassName="selected-nav" exact={true}>
                  <NavItem eventKey={1}>Search</NavItem>
                </LinkContainer>
                <LinkContainer to="/results" activeClassName="selected-nav">
                  <NavItem eventKey={2}>Results</NavItem>
                </LinkContainer>
                <LinkContainer to="/about" activeClassName="selected-nav">
                  <NavItem eventKey={3}>About</NavItem>
                </LinkContainer>
              </Nav>
            </Navbar>
          </div>
          <Route exact path="/"
            render={() => <LocationForm onResponse={this.onChangeCampgrounds}
                                        onChangeLocation={this.onChangeLocation}
                                        onChangeRadius={this.onChangeRadius}
                                        onChangeStartDate={this.onChangeStartDate}
                                        onChangeEndDate={this.onChangeEndDate}
                                        onClearSearch={this.onClearSearch}
                                        locationFirstRender={this.state.locationFirstRender}
                                        radiusFirstRender={this.state.radiusFirstRender}
                                        location={this.state.location}
                                        radius={this.state.radius}
                                        start_date={this.state.start_date}
                                        end_date={this.state.end_date} />} />
          <Route path="/about" component={About} />
          <Route path="/results" render={() => <Campgrounds campgrounds={this.state.campgrounds} />} />
          {redirectToResults}
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
