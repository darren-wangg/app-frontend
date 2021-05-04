import React, { Component, memo } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PropTypes from 'prop-types'
import YupLeaderboard from '../../components/YupLeaderboard/YupList'
import { connect } from 'react-redux'
import { Grid, Fab, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { setListOptions } from '../../redux/actions'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import axios from 'axios'
import ReactPlayer from 'react-player'
import Fade from '@material-ui/core/Fade'
import isEqual from 'lodash/isEqual'

const { BACKEND_API } = process.env
const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'

const styles = theme => ({
  container: {
    background: '#060606',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: '#0f0f0f'
    },
    minHeight: '100vh',
    maxWidth: '100vw',
    paddingBottom: '0px',
    margin: '-20',
    display: 'flex',
    overflowY: 'hidden',
    flexDirection: 'column'
  },
  gridContainer: {
    paddingTop: '30px'
  },
  page: {
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    marginBottom: '0px',
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1'
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 190,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    },
    flex: 1
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
    zIndex: 1000,
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

class YupLists extends Component {
  state = {
    isLoading: true
  }
  async fetchListOptions () {
    const { setListOpts } = this.props
    const updatedListOpts = (await axios.get(`${BACKEND_API}/v1/lists/listInfo`)).data
    setListOpts(updatedListOpts)
    this.setState({ isLoading: false })
  }
  state = {
    isTourOpen: false,
    showTour: true
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  };

  openTour = () => {
    this.setState({ isTourOpen: true })
  };

  componentDidMount () {
    window.Intercom('update')
    window.analytics.page('Yup Lists')
    // this.fetchListOptions()
    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  render () {
    const { classes } = this.props
    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.page}>
            <Header isTourOpen={this.state.isTourOpen} />
            { !this.state.isLoading &&
            <Grid className={classes.gridContainer}
              container
              justify='center'
            >
              <YupLeaderboard />
            </Grid>
            }
            <Tour
              steps={steps}
              isOpen={this.state.isTourOpen}
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
              lastStepNextButton={
                <div
                  style={{ display: 'none' }}
                />
              }
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
      </ErrorBoundary>
      )
  }
}

YupLists.propTypes = {
  classes: PropTypes.object.isRequired,
  setListOpts: PropTypes.func.isRequired
}

const steps = [
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
    selector: '[tourName="LeaderboardMenu"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          ‍📊  Leaderboard Menu
        </h4>
        <p>
          Here you can edit and filter leaderboards.
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

const mapStateToProps = null
const mapDispatchToProps = (dispatch) => {
  return {
    setListOpts: (listOpts) => dispatch(setListOptions(listOpts))
  }
}

export default memo(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YupLists)))
