import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import Footer from '../../components/Footer/Footer'
import { withStyles } from '@material-ui/core/styles'
import { Fab, Typography, Grid, Button } from '@material-ui/core'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { Link } from 'react-router-dom'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import Fade from '@material-ui/core/Fade'
// import { createSelector } from 'reselect'
import UserAvatar from '../../components/UserAvatar/UserAvatar'

const MIN_SEARCH_LEN = 1
const DISPLAYED_USERS = 2

const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      display: 'none'
    }
  },
  container: {
    margin: '75px 0px 0px 20px',
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    minHeight: 'calc(100vh - 75px)',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    color: '#fff',
    [theme.breakpoints.down('xs')]: {
      background: '#2a2a2a'
    }
  },
  feedContainer: {
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('1700')]: {
      width: '100%'
    }
  },
  feedPage: {
    height: '800px',
    minHeight: '800px',
    overflowY: 'auto',
    marginLeft: '-5px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '-15px',
      width: '98%'
    }
  },
  feedLoader: {
    margin: '0px',
    maxWidth: '590px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '420px'
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '-15px'
    }
  },
  resultsContainer: {
    [theme.breakpoints.down('md')]: {
      marginLeft: '0px'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '65px 0px 0px 5px'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    width: '100%',
    marginLeft: 0,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '200px',
      width: `calc(100% - 200px)`
    },
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      backgroundSize: 'contain',
      overflowX: 'hidden'
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
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  headerText: {
    fontWeight: 300,
    marginBottom: '15px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0px'
    }
  },
  peopleContainer: {
    width: '80%',
    display: 'inline-block',
    padding: '10px 0px',
    [theme.breakpoints.down('md')]: {
      width: '85%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  },
  people: {
    display: 'inline-block',
    padding: '10px 0px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '100%',
    [theme.breakpoints.down('md')]: {
      width: '50px',
      height: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '40px',
      height: '40px'
    }
  },
  user: {
    width: '300px',
    padding: '0px 10px',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: '275px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '250px'
    }
  },
  article: {
    maxWidth: '590px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '420px'
    }
  }
})

const User = (props) => {
  const { classes, user } = props

  return (
    <Link className={classes.people}
      key={user._id}
      to={`/${user.username || user._id}`}
      style={{ textDecoration: 'none' }}
    >
      <Grid container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.user}
      >
        <Grid item
          xs={3}
        >
          <UserAvatar className={classes.avatar}
            src={user.avatar}
            username={user.username}
            alt='avatar'
          />
        </Grid>
        <Grid item
          xs={9}
        >
          <Typography variant='body1'>
            <strong>{user.fullname || user._id || user.username}</strong>
          </Typography>
          <Typography variant='body1'>
            @{user.username || user.eosname}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  )
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const People = (props) => {
  const { classes, people } = props

  return (
    <Grid container
      direction='row'
      justify='center'
      alignItems='center'
      spacing={2}
      className={classes.peopleContainer}
    >
      {/* TODO: need better way to display users in three rows */}
      <Grid item>
        {
          people.slice(0, DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
      <Grid item>
        {
          people.slice(DISPLAYED_USERS, DISPLAYED_USERS + DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
      <Grid item>
        {
          people.slice(DISPLAYED_USERS + DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
    </Grid>
  )
}

People.propTypes = {
  classes: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired
}

class Search extends Component {
  state = {
    showTour: true,
    isTourOpen: false
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  render () {
    const { classes, postSearchResults, userSearchResults } = this.props
    const { posts, searchText, isLoading } = postSearchResults
    const { users } = userSearchResults

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.page}>
            <Header />
            <SideDrawer />
            <Fade in
              timeout={1000}
            >
              <Grid container
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
                spacing={4}
                className={classes.resultsContainer}
              >
                <Grid item
                  xs={12}
                >
                  <Typography variant='body1'>
                    Results for "{searchText}"
                  </Typography>
                </Grid>

                {searchText.length > MIN_SEARCH_LEN && (posts.length > 0 || users.length > 0) &&
                  <>
                    <Grid item
                      lg={!isLoading && posts.length === 0 ? 12 : 5}
                      md={!isLoading && posts.length === 0 ? 12 : 7}
                      xs={12}
                      tourname='SearchPosts'
                      style={{ overflow: 'hidden' }}
                    >
                      <Typography
                        variant='h6'
                        className={classes.headerText}
                      >
                        Posts
                      </Typography>
                      <Feed isLoading={isLoading}
                        hasMore
                        classes={classes}
                        posts={posts}
                        hideInteractions
                      />
                    </Grid>
                    <Grid item
                      lg={!isLoading && posts.length === 0 ? 12 : 7}
                      md={!isLoading && users.length === 0 ? 12 : 5}
                      xs={12}
                      tourname='SearchUsers'
                    >
                      <Typography
                        variant='h6'
                        className={classes.headerText}
                      >
                        People
                      </Typography>
                      <People classes={classes}
                        people={users}
                      />
                    </Grid>
                  </>
                }

                {!isLoading && posts.length === 0 && users.length === 0 &&
                  <Grid item
                    xs={12}
                    style={{ height: '100%' }}
                  >
                    <Typography
                      variant='h6'
                      className={classes.headerText}
                      style={{ textAlign: 'center' }}
                    >
                      Try searching for posts, users, or keywords
                    </Typography>
                  </Grid>
                }
              </Grid>
            </Fade>

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

const steps = [
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          🔍  Search
        </h4>
        <p>
          Search for users and elevant posts across the web.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="SearchPosts"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📰  Posts
        </h4>
        <p>
          These are your search results for posts.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="SearchUsers"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          👥  Users
        </h4>
        <p>
          These are the search results for users.
        </p>
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
      </div>
    )
  }
]

// const getUserSearchInfo = state => {
//   return state && state.searchResults.userSearchResults
// }

// const userSearchResultsSelector = createSelector(getUserSearchInfo)

// const getPostSearchInfo = state => {
//   return state && state.searchResults.postSearchResults
// }

// const postSearchResultsSelector = createSelector(getPostSearchInfo)

const mapStateToProps = (state) => {
  return {
    userSearchResults: state.searchResults.userSearchResults, // userSearchResultsSelector(state),
    postSearchResults: state.searchResults.postSearchResults // postSearchResultsSelector(state)
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  userSearchResults: PropTypes.object.isRequired,
  postSearchResults: PropTypes.object.isRequired
}

Search.defaultProps = {
  userSearchResults: {
    isLoading: false,
    error: null,
    searchText: '',
    users: []
  },
  postSearchResults: {
    isLoading: false,
    searchText: '',
    error: null,
    posts: []
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Search))
