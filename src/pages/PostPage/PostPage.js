import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import PostDisplay from '../../components/Post/PostDisplay'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Footer from '../../components/Footer/Footer'
import Grid from '@material-ui/core/Grid'
import '../../components/Twitter/twitter.css'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'

import path from 'path'
import axios from 'axios'

const { BACKEND_API } = process.env

const styles = theme => ({
  container: {
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0px',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: '#1b1b1ba1'
    },
    paddingBottom: '20px'
  },
  mainFeed: {
    paddingLeft: '0vw',
    paddingRight: '0',
    [theme.breakpoints.down('md')]: {
      paddingRight: '0vw'
    }
  },
  page: {
    background: 'transparent',
    width: '100%',
    objectFit: 'cover',
    margin: '0px 0px 0px 0px ',
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1'
    },
    flex: 1
  },
  gridContainer: {
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(10)
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(10)
    }
  }
})

class PostPage extends Component {
  state = {
    post: null,
    isLoading: true
  }

  componentDidMount () {
    this.loadPostData()
    window.Intercom('update')
    window.analytics.page('Post Page')
  }

  loadPostData = () => {
    (async () => {
      try {
        const { location } = this.props
        const postId = path.basename(location.pathname)
        const post = (await axios.get(`${BACKEND_API}/posts/post/${postId}`)).data
        this.setState({ post, isLoading: false })
      } catch (err) {
        this.setState({ isLoading: false })
      }
    })()
  }

  render () {
    const { classes } = this.props
    const { post, isLoading } = this.state

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.page}>
            <Header />
            <Grid alignItems='flex-start'
              className={classes.gridContainer}
              container
              justify='center'
            >
              <PostDisplay isLoading={isLoading}
                post={post}
              />
            </Grid>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    )
  }
}

PostPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(PostPage)
