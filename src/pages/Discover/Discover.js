import React, { Component, memo } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import HomeMenu from '../../components/Landing/HomeMenu'
import PropTypes from 'prop-types'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Fab, Button, Typography } from '@material-ui/core'
import FeedHOC from '../../components/Feed/FeedHOC'
import { Helmet } from 'react-helmet'
import Tooltip from '@material-ui/core/Tooltip'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import './discover.scss'
import isEqual from 'lodash/isEqual'
import ReactPlayer from 'react-player'
import Fade from '@material-ui/core/Fade'

const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'

const styles = theme => ({
  container: {
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    minHeight: '100vh',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1'
    }
  },
  page: {
    width: '100%',
    marginLeft: 0,
    overflowX: 'hidden',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 200,
      width: `calc(100vw - 201px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    },
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      backgroundSize: 'contain'
    },
    flex: 1
  },
  sideFeed: {
    position: 'fixed',
    marginLeft: '38vw',
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  feedWrapper: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      marginLeft: '0%',
      padding: '0%'
    }
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourFab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    background: '#A0A0A0AA',
    color: '#FAFAFA',
    zIndex: '1000',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  }
})

function feedMetaTitle (feed) {
  switch (feed) {
    case 'dailyhits':
      return 'Yup • Daily Hits'
    case 'lol':
      return 'Yup • LOL'
    case 'brainfood':
      return 'Yup • Smart'
    case 'latenightcool':
      return 'Yup • Popular'
    case 'politics':
      return 'Yup • The Race'
    case 'non-corona':
      return 'Safe Space - A corona-free news feed'
    case 'crypto':
      return 'Yup • Crypto'
    case 'nfts':
      return 'Yup • NFTs'
    default:
      return 'Yup • Social Layer for the Internet'
  }
}

function feedDescription (feed) {
  switch (feed) {
    case 'dailyhits':
      return 'Top content of the day based on general influence'
    case 'lol':
      return 'Top content based on the funny category '
    case 'brainfood':
      return 'Top content based on the smart category'
    case 'latenightcool':
      return 'Top content based on the like category'
    case 'politics':
      return 'Top content related to the US presidential election'
    case 'non-corona':
      return 'A feed free from virus-related content. Its purpose is to provide a place for clarity and well-being in these hard and confusing times.'
    case 'crypto':
      return 'The top crypto content out there'
    case 'nfts':
      return 'Non-fungibility for days'
    default:
      return 'Yup • Social Layer for the Internet'
  }
}

function FeedContainer ({ classes, feed, headerWidth, query, isMinimize }) {
  const metaTitle = feedMetaTitle(query.feed)
  const feedDesc = feedDescription(query.feed)

  return (
    <ErrorBoundary>
      <div id='feedTitleContainer'
        className={classes.feed}
      >
        <Helmet>
          <meta charSet='utf-8' />
          <title> {metaTitle} </title>
          <meta name='description'
            content={metaTitle}
          />
        </Helmet>
        <Grid container
          direction='column'
          justify='center'
        >
          <Grid container>
            <StyledFeedHeader
              description={feedDesc}
              headerWidth={headerWidth}
              image={`images/feeds/${FEED_HEADERS[feed]}`}
              name={`${FEED_NAMES[feed]}`}
              isMinimize={isMinimize}
            />
          </Grid>
          <Grid justify='center'
            container
          >
            <FeedHOC feed={feed} />
          </Grid>
        </Grid>
      </div>
    </ErrorBoundary>
  )
}

FeedContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  headerWidth: PropTypes.string,
  feed: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

const StyledFeedContainer = withStyles(theme => ({
  feed: {
    height: '100vh',
    overflowY: 'hidden',
    fontFamily: 'Gilroy',
    fontWeight: 100,
    margin: '0 auto',
    width: '100%',
    fontSize: '20px',
    color: '#ffffff',
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      width: '100%'
    }
  }
}))(FeedContainer)

const FEED_HEADERS = {
  dailyhits: 'dailyhitscover.png',
  brainfood: 'smartcover.png',
  lol: 'lolcover.png',
  latenightcool: 'popularcover.png',
  politics: 'politicscover.png',
  'non-corona': 'safecover.png',
  crypto: 'cryptocover.png',
  nfts: 'nftcover.png',
  new: 'dailyhitscover.png'
}

const FEED_NAMES = {
  dailyhits: 'Your Daily Hits',
  brainfood: 'Smart',
  lol: 'Funny',
  latenightcool: 'Popular',
  politics: 'Politics',
  'non-corona': 'Safe Space',
  crypto: 'Crypto',
  nfts: 'NFT Gallery',
  new: 'New'
}

function FeedHeader ({
  classes,
  headerWidth,
  image,
  name,
  description,
  isMinimize
}) {
  return (
    <div
      className={classes.topicDiv}
      style={
        isMinimize
          ? {
              padding: '78px 0 15px 0'
            }
          : {}
      }
    >
      <Tooltip
        placement='bottom'
        disableTouchListener
        title={
          <p color='#fff'
            style={{ fontSize: '12px' }}
          >
            {' '}
            {description}{' '}
          </p>
        }
      >
        <Grid
          container
          direction='row'
          spacing={2}
          justify='flex-start'
          alignItems='center'
        >
          <Grid
            item
            style={isMinimize ? { height: '2.5rem' } : { height: '3.5rem' }}
          >
            <img
              className={classes.topicImg}
              src={image}
              style={isMinimize ? { width: '2rem' } : {}}
            />
          </Grid>
          <Grid item>
            <Typography
              variant='h4'
              style={isMinimize ? { fontSize: '1.375rem' } : {}}
            >
              {name}
            </Typography>
          </Grid>
        </Grid>
      </Tooltip>
    </div>
  )
}

FeedHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  headerWidth: PropTypes.string,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

const StyledFeedHeader = withStyles(theme => ({
  topicDiv: {
    background: 'transparent',
    zIndex: 100,
    width: '600px',
    margin: '0 auto',
    position: 'relative',
    padding: '78px 0px 32px 0px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
      padding: '55px 0px 0px 15px',
      width: '100vw'
    }
  },
  topicImg: {
    zIndex: 100,
    width: '2.5rem',
    borderRadius: '0.25rem'
  }
}))(FeedHeader)

class Discover extends Component {
  state = {
    isTourOpen: false,
    isMinimize: false,
    showTour: true
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  handleScroll = e => {
    const { isMinimize } = this.state
    let element = e.target
    if (element.scrollTop > this.prev && !isMinimize) {
      this.setState({ isMinimize: true })
    }
    if (element.scrollTop === 0 && isMinimize) {
      this.setState({ isMinimize: false })
    }

    this.prev = element.scrollTop
  }

  closeTour = () => {
    if (window.location.search.includes('tutorial=true')) {
      window.location.search = window.location.search.replace(
        '&?tutorial=true',
        ''
      )
    }
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  componentDidMount () {
    window.Intercom('update')
    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  render () {
    const { classes, feed, query } = this.props

    return document.location.search === '' ? (
      <HomeMenu />
    ) : (
      <div className={classes.container}>
        <div className={classes.page}>
          <Header isTourOpen={this.state.isTourOpen} />
          <SideDrawer />
          <Grid container
            justify='center'
          >
            <Grid
              className={classes.feedWrapper}
              item
              width='100%'
              onScroll={this.handleScroll}
            >
              <StyledFeedContainer
                query={query}
                headerWidth={classes.page.width}
                feed={feed}
                // account={account}
                isMinimize={this.state.isMinimize}
              />
            </Grid>
          </Grid>
          <Tour
            steps={steps}
            isOpen={
              this.state.isTourOpen ||
              window.location.search.includes('tutorial=true')
            }
            onRequestClose={this.closeTour}
            className={classes.Tour}
            accentColor='#00eab7'
            rounded={10}
            disableInteraction
            highlightedMaskClassName={classes.Mask}
            nextButton={
              <Button
                size='small'
                variant='outlined'
                style={{ fontWeight: 400 }}
                small
              >
                Next
              </Button>
            }
            prevButton={
              <Button
                size='small'
                variant='outlined'
                style={{ fontWeight: 400 }}
              >
                Back
              </Button>
            }
            lastStepNextButton={<div style={{ display: 'none' }} />}
          />
          <Fade in={this.state.showTour}
            timeout={1000}
          >
            <Fab
              className={classes.tourFab}
              variant='extended'
              onClick={this.openTour}
            >
              10-Second Tutorial
            </Fab>
          </Fade>
        </div>

        <Footer />
      </div>
    )
  }
}

const steps = [
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <h4 className='tourHeader'>📰 User Feed</h4>
        <p>
          This is the content across the web, aggregated into a feed just for
          you.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="Rating"]',
    content: (
      <div>
        <h4 className='tourHeader'>🤔 Rating</h4>
        <p>
          You can rate content out of 5 in different categories, such as like
          ♥️, smart 🧠, funny 😂, etc.
        </p>
        <a
          href='https://docs.yup.io/basic/rating'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <h4 className='tourHeader'>🔍 Search</h4>
        <p>Search for friends and influencers across the web.</p>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <h4 className='tourHeader'>📈 Leaderboard</h4>
        <p>Find content and users ranked by category and platform.</p>
        <a
          href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <h4 className='tourHeader'>📡 Feeds</h4>
        <p>These are your feeds.</p>
        <a
          href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    content: (
      <div>
        <h3 className='tourHeader'>👏 That's it !</h3>
        <p>That's all for now. Learn more with some of these resources:</p>
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

const mapStateToProps = state => {
  const { router } = state
  return {
    // account: state.scatterRequest.account,
    feed: router.location.query.feed || state.homeFeed.feed,
    query: router.location.query
  }
}

Discover.propTypes = {
  classes: PropTypes.object.isRequired,
  // account: PropTypes.object.isRequired,
  feed: PropTypes.string,
  query: PropTypes.object.isRequired
}

export default memo(connect(mapStateToProps)(withStyles(styles)(Discover)))
