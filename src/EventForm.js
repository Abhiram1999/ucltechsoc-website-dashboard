import "./EventForm.css";
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


var currentDate = new Date();
var date = currentDate.getDate().toString();
if(date.length == 1){
    date = '0' + date;
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
var finalDate = year+'-'+month+'-'+date;
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
    if (authtext.length === 0) {
        errors.push("authtext can't be empty");
      }
      if (title.length === 0) {
        errors.push("title can't be empty");
      }
    
      if (date.length === 0) {
        errors.push("date can't be empty");
      }
      if (time.length === 0) {
        errors.push("time can't be empty");
      }
      if (location.length === 0) {
        errors.push("location can't be empty");
      }
      if (link.length === 0) {
        errors.push("link can't be empty");
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

class TextFields extends React.Component {
  state = {
    authtext:'',
    name: '',
    type:'',
    title:'',
    date:{finalDate},
    time:{finalTime},
    location:'',
    link:'',
    errors:[],

  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,title,type,date,time,location,link} = this.state;
    const errors = validate(authtext,title,date,time,location,link);
    if (errors.length > 0) {
        this.setState({ errors });
        return;
      }
    const data = {
      title : title,
      type : type,
      date : formatDate(finalDate),
      time : formatTime(finalTime),
      location: location,
      link: link
    }
    const output = JSON.stringify(data);
    
    var url = 'https://exesto.serveo.net/addevent';
    
    
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

  render() {
    const { classes } = this.props;
    const {errors} = this.state;
    
    
    
    return (
    <div>
        <div className = "error">
        {errors.map(error => (
          <p key={error}>Error: {error}</p>
        ))}
        </div>
      <form noValidate className={classes.container}  onSubmit = {this.handleSubmit} >
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
          className={classes.textField}
          margin="normal"
          onChange = {this.handleChange('link')}
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

