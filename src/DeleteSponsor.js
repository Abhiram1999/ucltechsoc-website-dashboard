import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { confirmAlert } from 'react-confirm-alert'; 
import {rootDomain, sponsorLink} from './ConnectionConstants';
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

var sponsors = [];
var sponsorIDs = [];

function renderResponse(jsonResponse){
  let R_sponsors = [];
  let R_sponsorIDs = [];

  if(!jsonResponse){
    console.log(jsonResponse.state);
  }
  for(let i = 0;i<jsonResponse.length;i++){
    R_sponsors.push(jsonResponse[i]['sponsor']['name']);
    R_sponsorIDs.push(jsonResponse[i]['id']);
  }
  sponsors = R_sponsors;
  sponsorIDs = R_sponsorIDs;
}

function getSponsors(url){
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

function validate(authtext,sponsor){
  let errors = [];
  if(authtext.length === 0){
    errors.push("Auth Text can't be empty");
  }

  if(sponsor.length === 0){
    errors.push("Sponsor can't be empty");
  }
  return errors;
}

const url = rootDomain + sponsorLink;
//Uncomment the below line when the server is running
getSponsors(url);

class TextFields extends React.Component {
  state = {
    authtext:'',
    sponsor:'',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  getSponsorID = (sponsorName) => {
    var index = -1;
    for(var i = 0; i < sponsors.length; i++){
      if(sponsors[i] === sponsorName){
        index = i;
      }
    }
    console.log(index);
    if(index !== -1){
      return sponsorIDs[index];
    } else {
      return index;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,sponsor, id} = this.state;
    const errors = validate(authtext,sponsor);
    
    const data = {
      authtext:authtext,
      sponsor:sponsor
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
               fetch(url + "/" + this.getSponsorID(sponsor),
               {
                method : 'DELETE',
                headers : {
                  'Content-Type': 'application/json',
                  'key' : authtext,
                }
              }).then(res => res.json())
              .then(response => console.log('Success:', JSON.stringify(response)))
              .catch(error => console.error('Error:', error)); 
              getSponsors(url);
              this.setState({authtext:"", sponsor: ""});
              document.getElementById("errortext").innerHTML = "";
              document.getElementById("successtext").innerHTML = "Sponsor Successfully Deleted!";
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
          label="Select Sponsor"
          className={classes.textFieldOptions}
          value = {this.state.sponsor}
          onChange={this.handleChange('sponsor')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
          required
        >

          {sponsors.map(option => (
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