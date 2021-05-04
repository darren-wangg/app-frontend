import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField, Typography, CircularProgress, Stepper, Step, StepLabel, StepContent, InputAdornment, OutlinedInput, FormControl, Icon, Grid } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import { keccak256 } from 'web3-utils'
import Portal from '@material-ui/core/Portal'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { updateEthAuthInfo } from '../../redux/actions'

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i

const { BACKEND_API } = process.env
const ERROR_MSG = `Unable to link your account. Please try again.`
const INVALID_EMAIL_ERROR_MSG = `Please enter a valid email address.`
const WHITELIST_MSG = 'Your Ethereum address is not whitelisted.'
const VALIDATE_MSG = 'Username is invalid. Please try again.'
const NOTMAINNET_MSG = 'Please connect with a mainnet Ethereum address.'
const EMAIL_MSG = 'Success. We will get back to you soon.'
const MIRROR_MSG = 'Please wait while we create your YUP account...'
const REDIRECT_MSG = 'Success! Redirecting to your Yup account profile.'

const styles = theme => ({
  dialog: {
    width: '100%',
    marginLeft: 190,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 190,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    }
  },
  dialogTitleText: {
    fontWeight: '500',
    color: '#fff'
  },
  dialogContentText: {
    fontFamily: 'Gilroy',
    fontWeight: '200',
    color: '#fff'
  },
  buttons: {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: '14px'
  },
  platforms: {
    width: '100%',
    fontSize: '16px',
    textTransform: 'none'
  },
  walletConnectIcon: {
    maxWidth: '4vw',
    width: '24px',
    height: 'auto',
    float: 'right'
  },
  twitterIcon: {
    maxWidth: '4vw',
    width: '18px',
    height: 'auto',
    float: 'right'
  },
  loader: {
    float: 'right',
    paddingTop: '1px'
  },
  outline: {
    borderColor: '#AAAAAA'
  },
  input: {
    padding: '5px',
    color: '#aaa'
  },
  arrowIcon: {
    width: '16px',
    height: 'auto',
    filter: 'brightness(0) invert(1)'
  },
  desktop: {
    display: 'inline',
    [theme.breakpoints.down('600')]: {
      display: 'none'
    }
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  snack: {
    color: '#fff8f3',
    justifyContent: 'center'
  },
  emailButton: {
    minWidth: '20px',
    width: '20px',
    height: '20px',
    position: 'absolute',
    zIndex: '99999',
    [theme.breakpoints.down('sm')]: {
      right: '60px',
      marginTop: '20px'
    }
  },
  usernameButton: {
    minWidth: '20px',
    width: '20px',
    height: '20px',
    position: 'absolute',
    zIndex: '99999',
    right: '85px',
    bottom: '18%',
    [theme.breakpoints.down('sm')]: {
      bottom: '17%'
    }
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  stepperInput: {
    width: '250px',
    padding: '5px',
    color: '#fff',
    margin: 'auto',
    right: '24px',
    [theme.breakpoints.down('sm')]: {
      width: '160px'
    }
  }
})

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fafafa',
      main: '#aaaaaa',
      dark: '#cacaca'
    },
    type: 'dark'
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        color: '#fff',
        borderColor: '#fff !important',
        lineHeight: '1.75'
      },
      input: {
        paddingLeft: '21px'
      },
      adornedEnd: {
        paddingRight: '21px'
      }
    },
    MuiStepIcon: {
      root: {
        color: '#00EAB7 !important'
      },
      text: {
        fill: '#000 !important'
      }
    },
    MuiStepLabel: {
      label: {
        color: '#fff !important'
      }
    }
  }
})

class SubscribeDialog extends Component {
  state = {
    email: '',
    EthIsLoading: false,
    OAuthIsLoading: false,
    connector: null,
    connected: false,
    account: null,
    signature: '',
    address: '',
    showWhitelist: false,
    showUsername: false,
    username: '',
    steps: ['Connect Ethereum Account', 'Verify Ownership'],
    activeStep: 0,
    snackbar: {
      open: false,
      error: true,
      content: ''
    }
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value })
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return 'Connect your account from your mobile device.'
      case 1:
        return 'Sign the message on your mobile device to confirm your account ownership.'
      case 2:
        return this.state.showWhitelist ? 'Your address needs to be whitelisted. Please add your email so we can notify you.' : 'Please enter a Yup username to create your account.'
    }
  }

  initWalletConnect = async () => {
    this.onDisconnect()

    const bridge = 'https://bridge.walletconnect.org'
    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal })
    this.setState({ connector })

    // already logged in
    if (connector.connected && !localStorage.getItem('YUP_ETH_AUTH')) {
      localStorage.removeItem('walletconnect')
      this.initWalletConnect()
    }

    if (!connector.connected) {
     await connector.createSession()
    }

    await this.subscribeToEvents()
  }

   subscribeToEvents = async () => {
    const { connector } = this.state

    if (!connector) {
      return
    }

    connector.on('connect', (error, payload) => {
      if (error) {
        this.handleSnackbarOpen(ERROR_MSG, true)
        throw error
      }

      this.onConnect(payload, false)
    })

    connector.on('disconnect', (error, payload) => {
      if (error) {
        this.handleSnackbarOpen(ERROR_MSG, true)
        throw error
      }

      this.onDisconnect()
      this.handleSnackbarOpen('Wallet disconnected.', true)
    })

    // already connected
    if (connector.connected) {
      this.setState({ connector })
      this.onConnect(connector, true)
    }
  };

   onConnect = async (payload, connected) => {
     if (!this.state.connector || !payload) { return }

     try {
      const chainId = connected ? payload._chainId : payload.params[0].chainId
      const accounts = connected ? payload._accounts : payload.params[0].accounts

      if (chainId !== 1) {
        this.handleSnackbarOpen(NOTMAINNET_MSG, true)
        this.onDisconnect()
        return
      }

      this.handleSnackbarOpen('Successfully connected.', false)
      this.setState({
        connected: true,
        activeStep: 1
      })

      const address = accounts[0]
      const challenge = (await axios.get(`${BACKEND_API}/v1/eth/challenge`, { params: { address } })).data.data
      const msgParams = [
        address,
        keccak256('\x19Ethereum Signed Message:\n' + challenge.length + challenge)
      ]
      const signature = await this.state.connector.signMessage(msgParams)

      this.setState({
        address,
        signature
      })

      try {
        await axios.post(`${BACKEND_API}/v1/eth/challenge/verify`, { address, signature })
      } catch (err) {
        // fetch new challenge and signature
        this.handleSnackbarOpen(ERROR_MSG, true)
        this.onConnect(payload)
        return
      }

      const ethAuth = {
        challenge,
        signature,
        address
      }
      localStorage.setItem('YUP_ETH_AUTH', JSON.stringify(ethAuth))

      const whitelist = (await axios.get(`${BACKEND_API}/v1/eth/whitelist/${address}`)).data.whitelisted
      if (!whitelist) {
        this.handleSnackbarOpen(WHITELIST_MSG, true)
        this.setState({
          steps: [...this.state.steps, 'Ethereum Whitelist Application'],
          activeStep: 2,
          showWhitelist: true
        })
        return
      }

      // check if account already claimed
      let account
      try {
        account = (await axios.get(`${BACKEND_API}/accounts/eth?address=${address}`)).data
      } catch (err) {
        // not claimed -> signUp()
        this.setState({
          steps: [...this.state.steps, 'Create Account'],
          activeStep: 2,
          showUsername: true
        })
        this.handleUsername()
        return
      }

      // claimed -> signIn()
      this.setState({
        account,
        activeStep: 2,
        username: account.username
      },
      this.signIn()
      )
      } catch (err) {
        console.error(err)
        this.handleSnackbarOpen(ERROR_MSG, true)
        this.onDisconnect()
      }
  }

  handleWhitelist = async () => {
    if (!this.state.address || !this.state.email) {
      this.handleSnackbarOpen(ERROR_MSG, true)
      return
    }

    try {
      this.setState({ EthIsLoading: true })
      await axios.post(`${BACKEND_API}/accounts/application/eth`, {
        email: this.state.email,
        address: this.state.address,
        signature: this.state.signature
      })
      this.setState({
        EthIsLoading: false,
        showWhitelist: false,
        snackbar: {
          error: false
        }
      })
      this.logEthWhitelist()

      this.handleSnackbarOpen(EMAIL_MSG, false)
      this.onDisconnect()
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(ERROR_MSG, true)
    }
  }

  handleUsername = async () => {
    if (this.state.username) {
      this.signUp()
    }
  }

  signUp = async () => {
    const { history, dispatch } = this.props
    let validate
    try {
      // check if username valid
      validate = await axios.post(`${BACKEND_API}/accounts/validate/${this.state.username}`)
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(VALIDATE_MSG, true)
    }

    if (validate.status === 200) {
      this.handleSnackbarOpen(MIRROR_MSG, false)
      this.setState({ EthIsLoading: true })
      const mirrorStatus = await axios.post(`${BACKEND_API}/accounts/eth/mirror`, { signature: this.state.signature, address: this.state.address, username: this.state.username })
      this.setState({ EthIsLoading: false })

      if (mirrorStatus.status === 200) {
        this.handleSnackbarOpen(REDIRECT_MSG, false)
        localStorage.setItem('YUP_ETH_AUTH', JSON.stringify({
          address: this.state.address,
          signature: this.state.signature,
          ...mirrorStatus.data
        }))

        const ethAuthInfo = { address: this.state.address,
          signature: this.state.signature,
          account: mirrorStatus.data.account
        }
        dispatch(updateEthAuthInfo(ethAuthInfo))

        this.logEthSignup(mirrorStatus.data.account)

        const profileUrl = `/${this.state.username}`
        history.push(profileUrl)
        this.props.handleDialogClose()
      } else {
        this.handleSnackbarOpen(ERROR_MSG, true)
      }
    } else {
      this.handleSnackbarOpen(VALIDATE_MSG, true)
    }
  }

  signIn = async (payload) => {
    const { history, dispatch } = this.props
    let txStatus
    try {
      txStatus = await axios.post(`${BACKEND_API}/v1/eth/challenge/verify`, { address: this.state.address, signature: this.state.signature })
    } catch (err) {
      // TODO: error handling
      this.handleSnackbarOpen(ERROR_MSG, true)

      // fetch new challenge and signature
      this.onConnect(payload)
      return
    }
    if (!txStatus) {
      return
    }
    this.handleSnackbarOpen(REDIRECT_MSG, false)

    const { address, account, signature } = this.state
    const ethAuthUpdate = { address, account, signature }
    dispatch(updateEthAuthInfo(ethAuthUpdate))

    this.logEthLogin(account)

    const profileUrl = `/${account.username}`
    // already on user page
    if (window.location.href.split('/').pop() === account.username) {
      window.location.reload()
    } else {
      history.push(profileUrl)
    }
    this.props.handleDialogClose()
  }

  onDisconnect = () => {
    this.setState({
      connected: false,
      address: '',
      connector: null,
      steps: ['Connect Ethereum Account', 'Verify Ownership'],
      activeStep: 0,
      showWhitelist: false,
      showUsername: false,
      EthIsLoading: false
    },
    localStorage.removeItem('YUP_ETH_AUTH')
    )
  }

  handleMobileSignup = async () => {
    try {
      if (!EMAIL_RE.test(this.state.email)) {
        this.handleSnackbarOpen(INVALID_EMAIL_ERROR_MSG, true)
        return
      }
      await axios.post(`${BACKEND_API}/auth/invite_mobile`, { email: this.state.email })
    } catch (err) {
      this.handleSnackbarOpen(ERROR_MSG, true)
    }
    this.handleSnackbarOpen(EMAIL_MSG, false)
    this.props.handleDialogClose()
  }

  startTwitterOAuth = async () => {
    try {
      this.setState({ OAuthIsLoading: true })
      const oauthRes = (await axios.post(`${BACKEND_API}/v1/auth/oauth-challenge`, { domain: 'yup.io' }))
      const { token, _id: id } = oauthRes.data
      const twitterRes = (await axios.post(`${BACKEND_API}/v1/auth/twitter`,
        { verificationToken: token, verificationId: id, oauthReferrer: 'website' }))
      window.location.href = twitterRes.data.redirectPath
      this.setState({ OAuthIsLoading: false })
    } catch (err) {
      this.handleSnackbarOpen('Error occured during Twitter OAuth', true)
      console.error('Error occured during Twitter OAuth: ', err)
    }
  }

  logEthLogin (account) {
    window.analytics.track('ETH Login', {
      userId: this.state.address,
      username: account.username,
      application: 'Web App'
    })
  }

  logEthWhitelist () {
    window.analytics.track('ETH Application Submission', {
      userId: this.state.address,
      email: this.state.email,
      application: 'Web App'
    })
  }

  logEthSignup (account) {
    window.analytics.track('ETH Signup', {
      userId: this.state.address,
      username: this.state.username,
      application: 'Web App'
    })
  }

  handleSnackbarOpen = (msg, error) => {
    this.setState({
      snackbar: {
        open: true,
        content: msg,
        error: error
      }
    })
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbar: {
        open: false,
        content: '',
        error: this.state.snackbar.error
      }
    })
  }

  render () {
    const { handleDialogClose, dialogOpen, classes } = this.props

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={theme}>
          <Portal>
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={4000}
              className={classes.snackUpper}
              onClose={this.handleSnackbarClose}
              open={this.state.snackbar.open}
            >
              <SnackbarContent
                className={classes.snack}
                message={this.state.snackbar.content}
                style={{ backgroundColor: this.state.snackbar.error ? '#ff5252' : '#48B04C' }}
              />
            </Snackbar>
          </Portal>

          <Dialog open={dialogOpen}
            onClose={() => {
            handleDialogClose()
          }}
            aria-labelledby='form-dialog-title'
            className={classes.dialog}
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
            {!this.state.connected && (!this.state.showWhitelist && !this.state.showUsername) &&
            <>
              <DialogTitle style={{ paddingBottom: '10px' }}>
                <Typography
                  align='left'
                  className={classes.dialogTitleText}
                  variant='h5'
                >
                  Sign Up / Login
                </Typography>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Typography
                    align='left'
                    className={classes.dialogContentText}
                    variant='subtitle1'
                  >
                    <span className={classes.desktop}>
                      Earn money & clout for rating content anywhere on the internet.<br />
                      Get extra rewards for joining today.
                    </span>
                  </Typography>
                </DialogContentText>
                <Grid container
                  direction='column'
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      className={classes.buttons}
                      variant='outlined'
                      size='large'
                      onClick={this.initWalletConnect}
                      fullWidth
                    >
                      <Typography
                        align='left'
                        className={classes.platforms}
                      >
                        WalletConnect
                      </Typography>
                      {this.state.EthIsLoading
                    ? <CircularProgress size={20}
                      className={classes.loader}
                      />
                    : <img alt='wallet connect'
                      src='/images/icons/wallet_connect.png'
                      className={classes.walletConnectIcon}
                      />
                  }
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={classes.buttons}
                      variant='outlined'
                      size='large'
                      onClick={this.startTwitterOAuth}
                      fullWidth
                    >
                      <Typography
                        align='left'
                        className={classes.platforms}
                      >
                        Twitter
                      </Typography>
                      {this.state.OAuthIsLoading
                    ? <CircularProgress size={20}
                      className={classes.loader}
                      />
                    : <img alt='twitter'
                      src='/images/icons/twitter.svg'
                      className={classes.twitterIcon}
                      />
                  }
                    </Button>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <OutlinedInput
                        onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        this.handleMobileSignup()
                        ev.preventDefault()
                      }
                      }}
                        helperText={EMAIL_RE.test(this.state.email) || !this.state.email.length ? '' : 'Please enter a valid email'}
                        id='outlined-basic'
                        fullWidth
                        color='primary'
                        endAdornment={<InputAdornment position='end'
                          onClick={this.handleMobileSignup}
                                      >
                          <Icon fontSize='small'
                            className='fal fa-arrow-right'
                            style={{ color: '#c0c0c0' }}
                          /></InputAdornment>}
                        aria-describedby='filled-weight-helper-text'
                        variant='outlined'
                        placeholder='Email'
                        type='email'
                        required
                        margin='dense'
                        error={!EMAIL_RE.test(this.state.email) && this.state.email.length}
                        onChange={this.handleEmailChange}
                        InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        input: classes.inputInput,
                        notchedOutline: classes.outline
                    },
                    className: classes.input }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          }

            {this.state.connected &&
            <>
              <DialogTitle style={{ paddingBottom: '10px' }}>
                <Typography
                  align='left'
                  className={classes.dialogTitleText}
                  variant='h5'
                >
                  Sign Up / Login
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Stepper activeStep={this.state.activeStep}
                  orientation='vertical'
                  className={classes.stepper}
                >
                  {this.state.steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                      <StepContent>
                        <Typography
                          align='left'
                          variant='body1'
                          style={{ color: '#fff', fontWeight: '300' }}
                        >
                          {this.getStepContent(this.state.activeStep)}
                        </Typography>
                        {this.state.showWhitelist && !this.state.showUsername &&
                          <DialogContent>
                            <TextField
                              onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                this.handleWhitelist()
                                ev.preventDefault()
                              }
                              }}
                              margin='dense'
                              id='outlined-basic'
                              variant='outlined'
                              placeholder='Email address'
                              required
                              type='text'
                              fullWidth
                              onChange={this.handleEmailChange}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                  input: classes.inputInput,
                                  notchedOutline: classes.outline
                              },
                              className: classes.stepperInput }}
                            />
                            <Button className={classes.emailButton}
                              onClick={this.handleWhitelist}
                              style={{ width: 'auto' }}
                            >
                              {this.state.EthIsLoading
                              ? <CircularProgress size={20}
                                className={classes.loader}
                                />
                              : <img alt='submit'
                                src='/images/icons/arrow.svg'
                                className={classes.arrowIcon}
                                />
                              }
                            </Button>
                          </DialogContent>
                      }

                        {this.state.showUsername && !this.state.showWhitelist &&
                          <DialogContent>
                            <TextField
                              onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                this.handleUsername()
                                ev.preventDefault()
                              }
                              }}
                              margin='dense'
                              id='outlined-basic'
                              variant='outlined'
                              placeholder='Username'
                              required
                              type='text'
                              fullWidth
                              onChange={this.handleUsernameChange}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                  input: classes.inputInput,
                                  notchedOutline: classes.outline
                              },
                              className: classes.stepperInput }}
                            />
                            <Button className={classes.usernameButton}
                              onClick={this.handleUsername}
                              style={{ width: 'auto' }}
                            >
                              {this.state.EthIsLoading
                              ? <CircularProgress size={20}
                                className={classes.loader}
                                />
                              : <img alt='submit'
                                src='/images/icons/arrow.svg'
                                className={classes.arrowIcon}
                                />
                            }
                            </Button>
                          </DialogContent>
                      }
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </DialogContent>
            </>
          }

          </Dialog>
        </MuiThemeProvider>
      </ErrorBoundary>
    )
  }
}

SubscribeDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}
export default withRouter(connect(null)(withStyles(styles)(SubscribeDialog)))
