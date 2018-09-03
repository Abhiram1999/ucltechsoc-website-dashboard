import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {rootDomain, getEventsLink,deleteEventsLink} from './ConnectionConstants';
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

var events = [];

function renderResponse(jsonResponse){
  let R_events = [];
  if(!jsonResponse){
    console.log(jsonResponse.state);
  }
  for(let i = 0;i<jsonResponse.length;i++){
    R_events.push(jsonResponse[i]['data']['title']);
  }
  console.log(R_events);
  return R_events;
}

function getEvents(url){
  fetch(url).then(response => {
    if(response.ok){
      return response.json();
    }
    throw new Error('Request failed!');
  },networkError => {
    //alert("Site not working");
    console.log(networkError.message)}
).then(jsonResponse => {
  console.log(jsonResponse);
  events = renderResponse(jsonResponse);

})
}

function validate(authtext,event){
  let errors = [];
  if(authtext.length === 0){
    errors.push("Auth Text can't be empty");
  }

  if(event.length === 0){
    errors.push("Event can't be empty");
  }
  return errors;
}

const delurl = rootDomain + deleteEventsLink;
const geturl = rootDomain + getEventsLink;
//Uncomment the below line when the server is running
getEvents(geturl);

class TextFields extends React.Component {
  state = {
    authtext:'',
    event:'',
    
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,event} = this.state;
    const errors = validate(authtext,event);
    const data = {
      authtext:authtext,
      event:event
    }

    const output = JSON.stringify(data);

    if(errors.length > 0){
      document.getElementById("errortext").innerHTML = "<p>" + errors.join("</p><p>") + "</p>";
        return;
    }
    else{
      document.getElementById("errortext").innerHTML = "Respond to Prompt";
      /*
      fetch(url,{
        method : 'POST',
        headers : {
          'key' : authtext,
          'event':output
        }
      }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
      */
    }
       
  }
  render() {
    const { classes } = this.props;
    console.log(events);
    return (
      <div>
         <div className = "error">
            <p id = "errortext" style = {{color:"red"}}></p>       
        </div>
      <form className={classes.container} noValidate>
        <TextField
          id="authtext"
          label="Auth Text"
          className={classes.textField}
          onChange={this.handleChange('authtext')}
          margin="normal"
          required

        />
       
        <TextField
          id="select-event"
          select
          label="Select Event"
          className={classes.textField}
          onChange={this.handleChange('event')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
          required
        >

          {events.map(option => (
            <MenuItem key={events[0]} value={events[0]}>
              {events[0]}
            </MenuItem>
          ))}
        </TextField>
        
      </form>


      <button onClick = {this.handleSubmit} type="submit">Submit</button>
      </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);