/* eslint-disable */
import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'

//child componenents
import Reply from './Reply'
import Retweet from './Retweet'
import Quoted from './Quoted'
import Original from './Original'

const styles = theme => ({
  container: {
    padding: '15px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left',
    position: 'relative',
    width: '100%'
  },
  twitterTag: {
    color: 'white !important',
    textDecoration: 'none !important',
    fontWeight: 500
  },
  videoTweet: {
    width: 'auto !important',
    borderRadius: '0px 0px 20px 20px',
    textAlign: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '200px'
    },
    '&::focus': {
      outline: 'none !important',
      border: 'none !important',
      textDecoration: 'none !important'
    },
    '&::active': {
      outline: 'none !important',
      border: 'none !important',
      textDecoration: 'none !important'
    }
  },
  header: {

    display: 'flex'
  },
  replyTextWithBar: {
    color: 'white !important',
    padding: '10px 0px',
    fontSize: '0.9em',
    textAlign: 'left',
    '&::before': {
      border: '1.2px solid #AAAAAA',
      content: " '' ",
      top: 0,
      left: -35,
      fontSize: 0,
      bottom: 2,
      position: 'absolute !important',
      width: 0,
      zIndex: 1,
      height: '92%'
    },
    position: 'relative'
  },
  tweetText: {
    color: 'white !important',
    whiteSpace: 'pre-wrap',
    padding: '10px 4px',
    textAlign: 'left',
    position: 'relative'
  },
  twitterName: {
    color: 'white !important',
    padding: 0,
    margin: 0
  },
  twitterHandle: {
    color: 'grey',
    fontSize: '18px'
  },
  twitterBirdIcon: {
    position: 'absolute',
    left: '550px',
    '&:hover': {
      filter: 'brightness(1) invert(1)'
    }
  },
  userAvatarContainer: {

    paddingRight: '10px'
  },
  userAvatar: {
      width: '50px',
      borderRadius: '50%'
  },
  tweetImg: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '20px',
    boxShadow: '0px 0px 5px #AAAAAAA0'
  },
  retweetContainer: {
    boxShadow: '0px 0px 5px #AAAAAAA0',
    padding: '12px',
    borderRadius: '20px',
    fontSize: '0.9em',
    marginTop: '10px'
  },
  videoTweetContainer: {
    boxShadow: '0px 0px 5px #AAAAA0',
    paddingTop: 10
  },
  retweetUserAvatar: {
    width: '30px',
    borderRadius: '50%'
  },
  retweetTwitterName: {
    display: 'inline',
    marginRight: '10px',
    color: 'white !important'
  },
  retweetTwitterBirdIcon: {
    display: 'none'
  },
  replyTwitterName: {
    display: 'inline',
    marginRight: '10px',
    color: 'white !important'
  },
  barDiv: {
    border: '1.2px solid #AAAAAA',
    content: " '' ",
    top: 0,
    left: -35,
    fontSize: 0,
    bottom: 2,
    width: 0,
    zIndex: 1,
    height: '92%',
    margin: 'auto',
    background: '#AAAAAA'
  },
  replyLine: {
    backgroundColor: 'gray',
    width: 2,
    marginRight: 'auto',
    marginLeft: 22,
    padding: 0,
    height: 100,
    position: 'absolute'
  },
  mainReplyContainer: {

    padding: '15px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left',
    position: 'relative',
    width: '100%'
  },
  replyContainer: {

    padding: '15px',
    paddingTop: '0px',
    paddingLeft: '0px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyOriginalContainer: {

    padding: '12px',
    paddingTop: '0px',
    paddingLeft: '0px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyContainer: {
    display: 'flex'
  },
  replyHeaderAndContent: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '9px'
  },
  replyAvatarAndBar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: '5px'
  },
  replyImageContainer: {

    color: 'white !important',
    padding: '10px 0px',
    textAlign: 'left',
    position: 'relative'
  },
  LinkPreviewImageSmall: {
    width: 150,
    height: '100%',
    borderRadius: '20px 0px 0px 20px'
  },
  LinkPreviewContentSmall: {
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: '0.85em'
  },
  LinkPreviewMain: {
    display: 'flex',
    maxHeight: 150,
    minHeight: 150,
    overflow: 'hidden',
    marginBottom: 25,
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 20
  },
  LinkPreviewURL: {
    color: 'gray'
  },
  LinkPreviewTitle: {
    fontWeight: 400,
    color: 'white !important'
  },
  LinkPreviewText: {
    padding: '10px 0px',
    color: 'white !important'
  },
  LinkPreviewImageLarge: {
    width: '100%',
    borderRadius: '20px 20px 0px 0px'
  },
  LinkPreviewImageSmallContainer: {
    height: '100%'
  },
  LinkPreviewContentLarge: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 20,
    fontSize: '0.85em'
  },
  LinkPreviewMainLarge: {
    display: 'flex',
    overflow: 'hidden',
    marginBottom: 25,
    flexDirection: 'column',
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 20
  },
  LinkPreviewAnchor: {
    color: 'inherit',
    textDecoration: 'none'
  },
  letterAvatar: {
    fontSize: '25px',
    border: '2px solid rgb(218, 218, 218)',
    borderRadius: '100%',
    backgroundColor: 'rgba(9, 9, 9, 0.44)',
    fontFamily: 'Gilroy',
    fontWeight: '600',
    color: 'rgb(218, 218, 218)',
    padding: '0 5px 0 5px'
  }
})

class CustomTweetEmbed extends Component {
  render () {
    const { tweetData, classes } = this.props
    if (!tweetData || !tweetData.tweetInfo) {
      return <div/>
    }
    const retweet = tweetData.tweetInfo.retweeted_status ? !(_.isEmpty(tweetData.tweetInfo.retweeted_status)) : false
    const quoted = tweetData.tweetInfo.quoted_status ? !(_.isEmpty(tweetData.tweetInfo.quoted_status)) : false
    const reply = tweetData.tweetInfo.in_reply_to_status_id  ? !(_.isEmpty(tweetData.tweetInfo.reply_status)) : false

    return (
      <Fade in
        timeout={1000}
      >
        {
          retweet
          ? <Retweet tweetData={tweetData}
            classes={classes}
            />
          : quoted
          ? <Quoted tweetData={tweetData}
            classes={classes}
            />
          : reply
          ? <Reply tweetData={tweetData}
            classes={classes}
            />
          : <Original tweetData={tweetData}
            classes={classes}
            />
        }
      </Fade>
    )
  }
}

export default withStyles(styles)(CustomTweetEmbed)
