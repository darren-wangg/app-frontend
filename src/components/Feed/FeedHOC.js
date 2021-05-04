import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll'
import FeedLoader from '../FeedLoader/FeedLoader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { fetchFeed } from '../../redux/actions'
import { createSelector } from 'reselect'

import PostController from '../Post/PostController'
import { Typography } from '@material-ui/core'

const styles = theme => ({
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '85vw',
      marginleft: '0'
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '98vw',
      margin: '0 0'
    }
  },
  scrollDiv: {
     overflowY: 'hidden',
     overflowX: 'hidden'
  },
  infiniteScroll: {
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block'
    }
  },
  container: {
    width: 'calc(100vw - 190px)',
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('1700')]: {
      width: '100vw'
    }
  },
  page: {
    overflowY: 'none',
    marginBottom: '0%',
    maxWidth: '625px',
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0%'
    }
  },
  resetScroll: {
    fontFamily: 'Gilroy',
    color: '#FAFAFA',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: '300'
  }
})

const Feed = (props) => {
  const { posts, classes, isLoading, hasMore } = props

  if (isLoading) {
    return (
      <div className={classes.feedLoader}>
        <FeedLoader />
      </div>
    )
  }

  if (!isLoading && !hasMore && posts.length === 0) {
    return (
      <div align='center' >
        <Typography
          style={{ color: '#ffffff' }}
          variant='caption'
        >
          No posts found
        </Typography>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={classes.container}
        style={{ marginBottom: !hasMore ? '10%' : '' }}
      >
        <div id='profilefeed'
          align='center'
          className={classes.page}
          tourname='ProfileFeed'
        >
          {
            posts.map((post) => (
              <PostController key={post._id}
                post={post}
              />
            ))
          }
        </div>
        {!isLoading && !hasMore &&
          <p className={classes.resetScroll}>end of feed</p>
        }
      </div>
    </ErrorBoundary>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired
}

class FeedHOC extends PureComponent {
  state = {
    initialLoad: true,
    hasMore: true,
    start: 0,
    limit: 15
  }

  componentDidMount () {
    this.fetchPosts()
    switch (this.props.feed) {
      case 'dailyhits':
        window.analytics.page('Daily Hits')
        break
      case 'lol':
        window.analytics.page('Funny')
        break
      case 'brainfood':
        window.analytics.page('Smart')
        break
      case 'latenightcool':
        window.analytics.page('Late Night Cool')
        break
      case 'politics':
        window.analytics.page('The Race')
        break
      case 'non-corona':
        window.analytics.page('Safe Space')
        break
      case 'crypto':
        window.analytics.page('Crypto')
        break
      case 'nfts':
        window.analytics.page('NFTs')
        break
      case 'new':
        window.analytics.page('New')
        break
    }
  }

  fetchPosts = () => {
    const { dispatch, feed } = this.props
    try {
      dispatch(fetchFeed(feed, this.state.start, this.state.limit))
      this.setState({
        hasMore: true,
        initialLoad: false,
        start: this.state.start + this.state.limit + 1
      })
    } catch (err) {
      this.setState({
        hasMore: false,
        initialLoad: false
      })
      console.error('Error fetching feed: ', err)
    }
  }

  render () {
    const { posts, classes } = this.props
    const { initialLoad, hasMore } = this.state

    return (
      <ErrorBoundary>
        <div className={classes.scrollDiv}>
          <InfiniteScroll
            dataLength={posts.posts.length}
            hasMore={hasMore}
            height='100vh'
            className={classes.infiniteScroll}
            loader={
           !initialLoad
             ? <div className={classes.feedLoader}>
               <FeedLoader />
             </div>
             : ''
          }
            next={this.fetchPosts}
            onScroll={this.onScroll}
          >
            {posts && posts.posts &&
              <Feed classes={classes}
                isLoading={initialLoad}
                posts={posts.posts}
                hasMore={hasMore}
                hideInteractions={false}
              />
            }
          </InfiniteScroll>
        </div>
      </ErrorBoundary>
    )
  }
}

const getActiveFeedType = (state) => {
  return state.router.location.query.feed || state.homeFeed.homeFeed
}

const getAllFeeds = (state) => {
  return state.feedInfo && state.feedInfo.feeds
}

export const getFeedPosts = createSelector(
  [getActiveFeedType, getAllFeeds],
  (activeFeedType, allFeeds) => allFeeds[activeFeedType]
)

const mapStateToProps = (state) => {
  return {
    posts: getFeedPosts(state),
    account: state.scatterRequest.account,
    push: state.scatterInstallation.push
  }
}

FeedHOC.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  feed: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(FeedHOC))
