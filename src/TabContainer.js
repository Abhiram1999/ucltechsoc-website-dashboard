import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import EventForm from './EventForm';
import DeleteEvent from './DeleteEvent'
import SponsorForm from './SponsorForm';
import DeleteSponsor from './DeleteSponsor';
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: "#eeeeee",
  },
  typography: {
    padding: theme.spacing.unit * 4,
  },
});

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            scrollable
            scrollButtons="auto"
          >
            <Tab label= "Add Event" />
            <Tab label = "Delete Event" />
            <Tab label="Add Sponsor"/>
            <Tab label="Delete Sponsor"/>
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><EventForm/></TabContainer>}
        {value === 1 && <TabContainer><DeleteEvent/></TabContainer>}
        {value === 2 && <TabContainer><SponsorForm/></TabContainer>}
        {value === 3 && <TabContainer><DeleteSponsor/></TabContainer>}
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
