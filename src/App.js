import React, { Component } from 'react';
import techsoc from './techsoc.jpg';
import './App.css';
import EventForm from './EventForm'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        
         <a href = "ucltechsoc.com" ><img src={techsoc} className="App-logo" alt="logo"/> </a>
          <h1 className="App-title">Events Form</h1>
        </header>
        <p className="App-intro">
          
        </p>
        <div className = "form">
        <EventForm/>
        </div>
      </div>
    );
  }
}

export default App;
