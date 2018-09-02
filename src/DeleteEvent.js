import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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

const currencies = [
 
];

class TextFields extends React.Component {
  state = {
    authtext:'',
    events:''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="on">
        <TextField
          id="authtext"
          label="Auth Text"
          className={classes.textField}
          onChange={this.handleChange('authtext')}
          margin="normal"
          required

        />
       
        <TextField
          id="select-currency"
          select
          label="Select"
          className={classes.textField}
          onChange={this.handleChange('events')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select your event"
          margin="normal"
          required
        >
          {currencies.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
      </form>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);