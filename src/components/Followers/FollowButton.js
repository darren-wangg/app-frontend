import React, { Component, Fragment } from 'react'
import { unfollowUser, followUser } from '../../redux/actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { parseError } from '../../eos/error'
import scatter from '../../eos/scatter/scatter.wallet'
import { follow, unfollow } from '../../eos/actions/follow'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  button: {
    width: 14,
    height: 14,
    padding: 5,
    color: 'white'
  },
  followButton: {
    color: '#ffffff',
    backgroundColor: '#2a2a2a90'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  }
})

class FollowButton extends Component {
  state = {
    snackbarOpen: false,
    snackbarContent: '',
    isLoading: false
  }

  handleSnackbarOpen = (msg) => {
    this.setState({ snackbarOpen: true, snackbarContent: msg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarContent: '' })
  }

  handleFollow = async (accountToFollow) => {
    try {
      const { account, ethAuth, dispatch } = this.props
      if (account == null) {
        this.handleSnackbarOpen('Login to follow user!')
        return
      }

      this.setState({ isLoading: true })
      const signedInWithEth = (!scatter || !scatter.connected) && !!ethAuth
      if (signedInWithEth) {
        await follow(account, { accountToFollow }, ethAuth)
      } else {
        await scatter.scatter.follow({ data: { accountToFollow } })
      }
      await dispatch(followUser(account.name, accountToFollow))
    } catch (err) {
      console.log(parseError(err))
      this.handleSnackbarOpen(parseError(err, 'follow'))
    }
    this.setState({ isLoading: false })
  }

  handleUnfollow = async (accountToUnfollow) => {
    try {
      const { account, ethAuth, dispatch } = this.props
      if (account == null) {
        this.handleSnackbarOpen('Login to unfollow user!')
        return
      }
      this.setState({ isLoading: true })
      const signedInWithEth = (!scatter || !scatter.connected) && !!ethAuth
      if (signedInWithEth) {
        await unfollow(account, { accountToUnfollow }, ethAuth)
      } else {
      await scatter.scatter.unfollow({ data: { accountToUnfollow } })
      }
      await dispatch(unfollowUser(account.name, accountToUnfollow))
    } catch (err) {
      console.log(parseError(err))
      this.handleSnackbarOpen(parseError(err))
    }
    this.setState({ isLoading: false })
  }

  render () {
    const { isLoading } = this.state
    const { classes, eosname, isLoggedIn, account, followingInfo } = this.props
    if (isLoggedIn || account == null || followingInfo == null) {
      return null
    }

    const isFollowing = followingInfo[eosname] ? followingInfo[eosname].followers.some(
      user => {
        return user._id === account.name
      }
    ) : []

    if (isFollowing) {
      return (
        <ErrorBoundary>
          <Fragment>
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={4000}
              className={classes.snackUpper}
              onClose={this.handleSnackbarClose}
              open={this.state.snackbarOpen}
            >
              <SnackbarContent
                className={classes.snack}
                message={this.state.snackbarContent}
              />
            </Snackbar>
            {
            isLoading
            ? <CircularProgress size={16}
              style={{ color: 'white', marginTop: '3px', marginRight: '20px' }}
              />
            : <Button
              className={classes.followButton}
              onClick={() => { this.handleUnfollow(eosname) }}
              >
              Following
            </Button>
          }
          </Fragment>
        </ErrorBoundary>
      )
    } else {
      return (
        <ErrorBoundary>
          <Fragment>
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={4000}
              className={classes.snackUpper}
              onClose={this.handleSnackbarClose}
              open={this.state.snackbarOpen}
            >
              <SnackbarContent
                className={classes.snack}
                message={this.state.snackbarContent}
              />
            </Snackbar>
            {
            isLoading
            ? <CircularProgress size={16}
              style={{ color: 'white', marginTop: '3px', marginRight: '20px' }}
              />
            : <Button
              className={classes.followButton}
              onClick={() => { this.handleFollow(eosname) }}
              >
              Follow
            </Button>
          }
          </Fragment>
        </ErrorBoundary>

      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { account: ethAccount } = state.ethAuth

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }
  const ethAuth = state.ethAuth.account ? state.ethAuth : null

  return {
    account,
    ethAuth,
    followingInfo: state.followersByUser
  }
}

FollowButton.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  eosname: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  followingInfo: PropTypes.object,
  ethAuth: PropTypes.object,
  account: PropTypes.object
}

export default connect(mapStateToProps)((withStyles(styles)(FollowButton)))
