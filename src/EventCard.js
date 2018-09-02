import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardActions: {
    float: 'right',
  },
  button: {
      color: "#330F53",
  },
  button2: {
    color: "#ffffff",
    backgroundColor: "#330F53",
    '&:hover': {
        color: '#330F53',
        backgroundColor: "ffffff",
        opacity: 1,
      },
  },
  lightTooltip: {
    background: "#ffffff",
    color: "#330F53",
    boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
    fontSize: 11,
  },
};

function EventCard(props) {
  const { classes } = props;
/*
  function getImage(i){
      if(i == "picnic01"){
        return require('./static/events/picnic01.png');
      } else if(i == "default-talks"){
        return require('./static/events/default-talks.png');
      } else if(i == "default-hackathons"){
        return require('./static/events/default-hackathons.png');
      } else if(i == "default-projects"){
        return require('./static/events/default-projects.png');
      } else if(i == "default-socials"){
        return require('./static/events/default-socials.png');
      } else {
          return require('./static/events/default-others.png');
      }
  }
*/
  function getTagInfo(tag){
    if(tag === "Talks"){
      return "Find out about the latest tech trends from speakers throughout the industry.";
    } else if(tag === "Hackathons"){
      return "Competitive 24-hour events where you work with a team to create something awesome.";
    } else if(tag === "Projects"){
      return "Learn the trendiest concepts and how to apply them in real life through our beginner friendly sessions."
    } else if(tag === "Socials"){
      return "Hang out and meet members from the society as well as the committee and make awesome new friends!";
    } else {
      return "Something that can't be simply categorized."
    }
  }

  EventCard.defaultProps = {
    title: "Default Title",
    date: "1 January 1970",
    time: "00:00",
    location: "UCL Main Quad",
    tag: "Others",
    image: 'meh',
    url:"ucltechsoc",
};

  const title = props.title;
  const date = props.date;
  const time = props.time;
  const location = props.location;
  const imageUrl = props.image;
  const tags = props.tag;
  const url = props.url;
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          //image={getImage(imageUrl)}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {title}
          </Typography>
          <Typography component="p">
            Date: {date} <br/>
            Time: {time} <br/>
            Location: <a target="_new" href={"https://maps.google.com/?q="+location}>{location}</a>
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Tooltip title={getTagInfo(tags)} classes={classes.lightTooltip}>
          <Button size="small" className={classes.button}>
            {tags}
          </Button>
          </Tooltip>
          <a target= "_new" href={"https://www.facebook.com/"+url}>
          <Button size="small" className={classes.button2}>
            Event Info
          </Button>
          </a>
        </CardActions>
      </Card>
    </div>
  );
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventCard);
