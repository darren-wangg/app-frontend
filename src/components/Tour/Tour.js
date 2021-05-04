import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import { Fab, Button } from '@material-ui/core'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import ReactPlayer from 'react-player'

const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'

const styles = theme => ({
    Tour: {
      fontFamily: '"Gilroy", sans-serif',
      borderRadius: '5px !important',
      padding: '34px 60px 34px 30px !important'
    },
    tourFab: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(12),
      background: '#A0A0A0AA',
      color: '#FAFAFA',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },
    hideOnMobile: {
      display: 'inherit',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    }
})

class Tour extends Component {
  constructor () {
    super()
    this.state = {
      isTourOpen: true
    }
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  render () {
    const { classes } = this.props
    return (
      <ErrorBoundary>
        <div>
          <MuiThemeProvider>
            <Tour
              steps={steps}
              isOpen={this.state.isTourOpen}
              onRequestClose={this.closeTour}
              className={classes.Tour}
              accentColor='#00eab7'
            />
            <Fab
              className={classes.tourFab}
              variant='extended'
              onClick={this.openTour}
            >
              10-Second Tutorial
            </Fab>
          </MuiThemeProvider>
        </div>
      </ErrorBoundary>
  )
}
}

const steps = [
  {
    selector: '[tourName="ProfileUsername"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          👩‍🚀 User Profile
        </h4>
        <p>
          Where you'll find important information on each user as well as yourself!
        </p>
        <a href='https://docs.yup.io'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Influence"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          💯  Influence Score
        </h4>
        <p>
          A score out of 100 showing how influential a user is. The higher the number, the more powerful your opinions!
        </p>
        <a href='https://docs.yup.io/basic/colors'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="YUPBalance"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          💰  YUP Balance
        </h4>
        <p>
          The number of tokens you've earned. Rate any piece of content to earn more!
        </p>
        <a href='https://docs.yup.io/protocol/yup-protocol#yup-token'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📰  User Feed
        </h4>
        <p>
          This is the content you're rating, aggregated into a feed.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="Rating"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          🤔  Rating
        </h4>
        <p>
          You can rate content out of 5 in different categories, such as like ♥️, smart 🧠, funny 😂, etc.
        </p>
        <a href='https://docs.yup.io/basic/rating'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          🔍  Search
        </h4>
        <p>
          Search for friends and influencers across the web.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📈  Leaderboard
        </h4>
        <p>
          Find content and users ranked by category and platform.
        </p>
        <a href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📡  Feeds
        </h4>
        <p>
          These are your feeds.
        </p>
        <a href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    content: (
      <div>
        <h3 className='tourHeader'>
          👏 That's it !
        </h3>
        <p>
          That's all for now. Learn more with some of these resources:
        </p>
        <div className='tourResources'>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://docs.yup.io'
            target='_blank'
          >
            Docs
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://yup.io'
            target='_blank'
          >
            Website
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://blog.yup.io'
            target='_blank'
          >
            Blog
          </Button>
        </div>
        <ReactPlayer
          controls
          style={{ overFlow: 'hidden', maxHeight: '200px' }}
          url={EXPLAINER_VIDEO}
          width='100%'
        />
      </div>
    )
  }
]

Tour.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Tour)
