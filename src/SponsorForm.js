import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {rootDomain,sponsorLink} from './ConnectionConstants'
import { confirmAlert } from 'react-confirm-alert'; 
import { relative } from 'path';
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

const tiers = [
    "Partners",
    "Gold",
    "Silver",
    "Bronze"    
];

function submitForm(url,authtext,output){
  console.log(output);
  fetch(url, {
    method: 'POST', 
    headers:{
      'Content-Type': 'application/json',
      'key': authtext
    },
      body: output
      }).then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
}

function formatLinks(linkString){
    if (!/^https?:\/\//i.test(linkString)) {
    linkString = 'http://' + linkString;
    }
    return linkString;
  }

  function validate(authtext,name,tier,img_url, home_url) {

    const errors = [];
    //console.log(date + "T" + time);

    if (authtext.length === 0) {
        errors.push("Auth Text can't be empty");
      }
      
      if (name.length === 0) {
        errors.push("Name can't be empty");
      }
    
      if (tier.length === 0) {
        errors.push("Tier can't be empty");
      }
      
      if (img_url.length === 0) {
        errors.push("Image Url can't be empty");
      }

      if (home_url.length === 0) {
        errors.push("Image Url can't be empty");
      }
 
    return errors;
  }


class TextFields extends React.Component {
  state = {
    authtext:'',
    name: '',
    tier:'',
    img_url:'',
    home_url:''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {authtext,name,tier,img_url, home_url} = this.state;
    const errors = validate(authtext,name,tier,img_url, home_url);
    const dataToSend = {
      id: 0,
      sponsor:{
        name:name,
        tier:tier,
        img_url:img_url,
        home_url:home_url
      }
    }

    const output = JSON.stringify(dataToSend);
    var sponsorurl = rootDomain + sponsorLink;
    if(errors.length > 0){
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
                    submitForm(sponsorurl,authtext,output);
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
            childrenElement: () => <div style = {{position:relative, overflow:"auto",wordWrap:"break-word"}}>
                                        <p>Company: {name}</p>
                                        <p>Image URL: {img_url}</p>
                                        <img src = {img_url} width = "100px" height = "100px" />
                                    </div>
          })
    }
  }

  render() {
    const { classes } = this.props;

    return (
    <div>
        <div className = "error" style = {{width:"100%"}}>
            <p id = "errortext" style = {{color:"red"}}></p> {/*Don't worry bro, the code on line 152 puts the errors here dynamically if there are any*/}      
        </div>
        <div className = "success">
            <p id = "successtext" style = {{color:"green"}}></p> {/*Don't worry bro, the code on line 152 puts the errors here dynamically if there are any*/}      
        </div>

      <form className={classes.container} noValidate autoComplete="off">
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
          id="name"
          label="Name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        
        <TextField
          id="select-tier"
          select
          label="Tier"
          className={classes.textField}
          value={this.state.tier}
          onChange={this.handleChange('tier')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select tier"
          margin="normal"
          
        >
          {tiers.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

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

        <TextField
          id="multiline-static"
          label="Company Homepage Url"
          multiline
          rows="1"
          //defaultValue="Default Value"
          value = {this.state.home_url}
          className={classes.textField}
          margin="normal"
          onChange = {this.handleChange('home_url')}
          InputProps={{
            startAdornment: <InputAdornment position="start">https://</InputAdornment>,
          }}
        />
        
        
      </form>

      <button type = "submit" onClick = {this.handleSubmit}>Submit</button>
    </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);
