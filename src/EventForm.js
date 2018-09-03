import "./EventForm.css";
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import EventCard from './EventCard.js';
import {rootDomain,addEventLink} from "./ConnectionConstants.js";
import InputAdornment from '@material-ui/core/InputAdornment';
//7334D4CA5D474
var currentDate = new Date();
var fdate = currentDate.getDate().toString();
if(fdate.length == 1){
    fdate = '0' + fdate;
}

var month = currentDate.getMonth();
month++;
month = month.toString();

if(month.length == 1){
    month = '0' + month;
}

var year = currentDate.getFullYear().toString();
var hours = currentDate.getHours().toString();
if(hours.length == 1){
    hours = '0' + hours;
}
var minutes = currentDate.getMinutes().toString();
if(minutes.length == 1){
    minutes = '0' + minutes;
}
var finalDate = year+'-'+month+'-'+fdate;
var finalTime = hours+':'+minutes;

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

function submitForm(url,authtext,output){
    fetch(url, {
        method: 'POST', 
        headers:{
          'key': authtext,
          'event': output
        }
      }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
}
const types = [
  {
    value: 'Talks',
    label: 'Talks',
  },
  {
    value: 'Hackathons',
    label: 'Hackathons',
  },
  {
    value: 'Projects',
    label: 'Projects',
  },
  {
    value: 'Socials',
    label: 'Socials',
  },
  {
      value:'Other',
      label:'Other',
  }
];

function validate(authtext,title,date,time,location,link) {

    const errors = [];
    //console.log(date + "T" + time);
    if (authtext.length === 0) {
        errors.push("Auth Text can't be empty");
      }
      if (title.length === 0) {
        errors.push("Title can't be empty");
      }
    
      if (date.length === 0) {
        errors.push("Date can't be empty");
      }
      if (time.length === 0) {
        errors.push("Time can't be empty");
      }
      if (location.length === 0) {
        errors.push("Location can't be empty");
      }
      if (link.length === 0) {
        errors.push("Link can't be empty");
      }

      var datetime = new Date(date + "T" + time)
      if(currentDate > datetime){
          errors.push("Date and Time cannot be before today's");
      }

    
    return errors;
  }

  function formatDate(dateString){
    var splitDate = dateString.split("-");
    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var currentMonth = months[parseInt(splitDate[1]) - 1];
    return splitDate[2] + " " + currentMonth + " " + splitDate[0];
  }
  
  function formatTime(timeString){
    // Check correct time format and split into components
    timeString = timeString.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [timeString];

  if (timeString.length > 1) { // If time format correct
    timeString = timeString.slice (1);  // Remove full string match value
    timeString[5] = +timeString[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    timeString[0] = +timeString[0] % 12 || 12; // Adjust hours
  }
  return (timeString.join ('')); // return adjusted time or original string
  }

  function formatLinks(linkString){
    if (!/^https?:\/\//i.test(linkString)) {
    linkString = 'http://' + linkString;
    }
    return linkString;
  }

class TextFields extends React.Component {
  state = {
    authtext:'',
    type:'',
    title:'',
    date:finalDate,
    time:finalTime,
    location:'',
    link:'',
    img_url:'',
    errors:[],

  };

  initialState = {
    authtext:'',
    type:'',
    title:'',
    date:finalDate,
    time:finalTime,
    location:'',
    link:'',
    img_url:'',
    errors:[],

  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,title,type,date,time,location,link,img_url} = this.state;
    console.log(img_url);
    const errors = validate(authtext,title,date,time,location,link);

    const data = {
        title : title,
        type : type,
        date : formatDate(finalDate),
        time : formatTime(finalTime),
        location: location,
        link: formatLinks(link),
        img_url : formatLinks(img_url)
      }
       const output = JSON.stringify(data);
      
      var url = rootDomain + addEventLink;
      console.log(url,authtext,output);
    if (errors.length > 0) {
        
        this.setState({ errors });
        this.setState({errorText:errors[0]});
        document.getElementById("errortext").innerHTML = "<p>" + errors.join("</p><p>") + "</p>";
        return;
      }
    
    else{
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    submitForm(url,authtext,output);
                    this.setState(this.initialState);
                    document.getElementById("errortext").innerHTML = "";
                    document.getElementById("successtext").innerHTML = "Event Published Successfully!";
                }
              },
              {
                label: 'No',
                onClick: () => {
                  return;
                }
              }
            ],
            childrenElement: () => <EventCard title={title} date={formatDate(date)} time={formatTime(time)} location={location} url={link} tag={type} imageUrl={img_url}/>
          })
        
        //window.location.reload();
    }
   
    
  }

  render() {
    const { classes } = this.props;
    const {errors} = this.state;
    
    
    
    return (
    <div>
        <div className = "error">
            <p id = "errortext" style = {{color:"red"}}></p> {/*Don't worry bro, the code on line 152 puts the errors here dynamically if there are any*/}      
        </div>
        <div className = "success">
            <p id = "successtext" style = {{color:"green"}}></p> {/*Don't worry bro, the code on line 152 puts the errors here dynamically if there are any*/}      
        </div>
        
      <form noValidate className={classes.container} >
        <TextField
          required
          id="authtext"
          label="Auth Text"
          value={this.state.authtext}
          //defaultValue="Default Value"
          className={classes.textField}
          onChange = {this.handleChange('authtext')}
          margin="normal"
          
        />    
        <TextField
          required
          id="selecttype"
          select
          label="Type"
          className={classes.textField}
          value = {this.state.type}
          onChange={this.handleChange('type')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select the type"
          margin="normal"
        >
          {types.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          id="title"
          label="Title"
          className={classes.textField}
          value={this.state.title}
          onChange={this.handleChange('title')}
          margin="normal"
        />
        <TextField
        required
        id="date"
        label="Select Date"
        type="date"
        value = {this.state.date}
        defaultValue={finalDate}
        className={classes.textField}
        onChange={this.handleChange('date')}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
        
        <TextField
        required
        id="time"
        label="Select Time"
        type="time"
        value = {this.state.time}
        defaultValue={finalTime}
        className={classes.textField}
        margin="normal"
        onChange = {this.handleChange('time')}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 60,
        }}
      />
        <TextField
          required
          id="multiline-static"
          label="Location"
          multiline
          rows="1"
          value = {this.state.location}
          className={classes.textField}
          margin="normal"
          onChange = {this.handleChange('location')}
        />
        <TextField
          required
          id="multiline-static"
          label="Link"
          multiline
          rows="1"
          //defaultValue="Default Value"
          value = {this.state.link}
          className={classes.textField}
          margin="normal"
          onChange = {this.handleChange('link')}
          InputProps={{
            startAdornment: <InputAdornment position="start">https://</InputAdornment>,
          }}
        />
        <TextField
          id="multiline-static"
          label="Image Url"
          multiline
          rows="1"
          //defaultValue="Default Value"
          value = {this.state.img_url}
          className={classes.textField}
          margin="normal"
          onChange = {this.handleChange('img_url')}
          InputProps={{
            startAdornment: <InputAdornment position="start">https://</InputAdornment>,
          }}
        />

      </form>
      
      <button onClick = {this.handleSubmit} type="submit" >Submit</button>
      
    </div>
    );

    
  } 
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);

