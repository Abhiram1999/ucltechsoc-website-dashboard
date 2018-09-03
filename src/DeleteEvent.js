import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { confirmAlert } from 'react-confirm-alert'; 
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
  textFieldOptions: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500,
  },
  menu: {
    width: 500,
  },
});

var events = [];
var eventIDs = [];

function renderResponse(jsonResponse){
  let R_events = [];
  let R_eventIDs = [];
  if(!jsonResponse){
    console.log(jsonResponse.state);
  }
  for(let i = 0;i<jsonResponse.length;i++){
    R_events.push(jsonResponse[i]['data']['title']);
    R_eventIDs.push(jsonResponse[i]['id']);
  }
  events = R_events;
  eventIDs = R_eventIDs;
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
  renderResponse(jsonResponse);
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

  getEventID = (eventName) => {
    var index = -1;
    for(var i = 0; i < events.length; i++){
      if(events[i] === eventName){
        index = i;
      }
    }
    if(index != -1){
      return eventIDs[index];
    } else {
      return index;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,event, id} = this.state;
    const errors = validate(authtext,event);
    const data = {
      authtext:authtext,
      event:event
    }

    if(errors.length > 0){
      document.getElementById("errortext").innerHTML = "<p>" + errors.join("</p><p>") + "</p>";
        return;
    }
    else{
      document.getElementById("errortext").innerHTML = "Respond to Prompt";
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
               fetch(delurl,{
                method : 'POST',
                headers : {
                  'key' : authtext,
                  'event_id': this.getEventID(event),
                }
              }).then(res => res.json())
              .then(response => console.log('Success:', JSON.stringify(response)))
              .catch(error => console.error('Error:', error)); 
              getEvents(geturl);
              this.setState({authtext:"", event: ""});
              document.getElementById("errortext").innerHTML = "";
              document.getElementById("successtext").innerHTML = "Event Successfully Deleted!";
            }
          },
          {
            label: 'No',
            onClick: () => {
              return;
            }
          }
        ],
      })
    }
       
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
         <div className = "error">
            <p id = "errortext" style = {{color:"red"}}></p>       
        </div>
        <div className = "success">
            <p id = "successtext" style = {{color:"green"}}></p>
        </div>
      <form className={classes.container} noValidate>
        <TextField
          id="authtext"
          label="Auth Text"
          className={classes.textField}
          value={this.state.authtext}
          onChange={this.handleChange('authtext')}
          margin="normal"
          required

        />
       
        <TextField
          id="select-event"
          select
          label="Select Event"
          className={classes.textFieldOptions}
          value = {this.state.event}
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
            <MenuItem key={option} value={option}>
              {option}
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