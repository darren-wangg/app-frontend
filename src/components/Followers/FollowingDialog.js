import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import FollowButton from './FollowButton'
import { levelColors } from '../../utils/colors'
import UserAvatar from '../UserAvatar/UserAvatar'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { connect } from 'react-redux'
import numeral from 'numeral'

const styles = theme => ({
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: 'black',
    paddingTop: '0%',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  followButton: {
    margin: theme.spacing()
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2)
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: '30px',
    paddingRight: '5%'
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  progress: {
    margin: theme.spacing(2),
    color: '#ffffff'
  },
  text: {
    fontSize: '13px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      display: 'flex'
    }
  }
})

class FollowingDialog extends Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { classes, account, followingInfo, levels } = this.props
    const { following } = followingInfo
    const formattedFollowing = numeral(following.length).format('0a').toUpperCase()

    const isLoading = false // TODO: fetch this from Redux
    return (
      <ErrorBoundary>
        <Fragment>
          <Button
            color='white'
            disableRipple
            onClick={this.handleClickOpen}
            style={{ backgroundColor: 'transparent', textTransform: 'capitalize' }}
          >
            <Typography
              align='left'
              className={classes.text}
              color='#ffffff'
              style={{ color: '#ffffff', fontFamily: 'Gilroy' }}
            >
              <a style={{ fontWeight: 500 }}>{formattedFollowing} </a> following
            </Typography>
          </Button>
          <Dialog
            aria-labelledby='customized-dialog-title'
            fullWidth
            maxWidth='xs'
            onClose={this.handleClose}
            open={this.state.open}
            PaperProps={{
              style: {
                backgroundColor: '#0A0A0A',
                borderRadius: '25px',
                boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
                width: '80%',
                padding: '1rem 0.5rem',
                maxWidth: '500px',
                color: '#fafafa'
              }
            }}
            BackdropProps={{
              style: {
                backdropFilter: 'blur(3px)'
              }
            }}
          >
            <DialogTitle
              className={classes.dialogTitle}
              disableTypography
              id='customized-dialog-title'
              onClose={this.handleClose}
            >
              <Typography
                align='center'
                color='inherit'
                style={{ fontFamily: 'Gilroy', fontWeight: '500', color: '#ffffff' }}
                variant='title'
              >
                Following
              </Typography>
              <IconButton
                aria-label='Close'
                className={classes.closeButton}
                disableRipple
                onClick={this.handleClose}
              >
                <CloseIcon style={{ marginTop: '4px', color: '#a0a0a0' }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {
              isLoading
                ? <div align='center'>
                  <CircularProgress className={classes.progress} />
                </div>
                : <Grid container
                  direction='column'
                  > {
                    following.length === 0
                      ? <Typography
                        color='white'
                        style={{ textAlign: 'center' }}
                        >
                        No users are being followed
                      </Typography>
                      : following.map((user) => {
                        const eosname = user._id
                        const level = levels.levels[eosname]
                        const username = level && level.levelInfo.username
                        const quantile = level && level.levelInfo.quantile
                        let socialLevelColor = levelColors[quantile]

                        return (
                          <Grid item
                            key={user}
                          >
                            <div className={classes.user}>
                              <Grid alignItems='center'
                                container
                                direction='row'
                                justify='space-between'
                              >
                                <Grid item>
                                  <Grid alignItems='center'
                                    container
                                    direction='row'
                                    spacing='16'
                                  >
                                    <Grid item>
                                      <UserAvatar
                                        username={username || eosname}
                                        className={classes.avatarImage}
                                        src={user.avatar}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Link
                                        onClick={this.handleClose}
                                        style={{ textDecoration: 'none', color: '#ffffff' }}
                                        to={`/${eosname}`}
                                      >
                                        <Typography
                                          color='white'
                                          style={{
                                            textDecoration: socialLevelColor ? 'underline' : 'none',
                                            textDecorationColor: socialLevelColor,
                                            textDecorationStyle: socialLevelColor ? 'solid' : 'none',
                                            marginLeft: '1rem',
                                            color: '#ffffff',
                                            fontFamily: 'Gilroy'
                                          }}
                                          variant='caption'
                                        >
                                          {username || eosname}
                                        </Typography>
                                      </Link>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <FollowButton
                                    account={account}
                                    className={classes.followButton}
                                    eosname={eosname}
                                    isLoggedIn={account && account.name === eosname}
                                  />
                                </Grid>
                              </Grid>
                            </div>
                          </Grid>
                        )
                      })
                  }
                </Grid>
            }
            </DialogContent>
          </Dialog>
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  const { account: ethAccount } = state.ethAuth
  let account = scatterIdentity || state.ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  return {
    account,
    levels: state.socialLevels,
    followingInfo: state.followingByUser[username] || {
      isLoading: true,
      following: [],
      error: false
    }
  }
}

FollowingDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  levels: PropTypes.object,
  followingInfo: PropTypes.object.isRequired,
  account: PropTypes.object
}

export default connect(mapStateToProps)(withStyles(styles)(FollowingDialog))
