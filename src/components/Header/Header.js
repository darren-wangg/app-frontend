import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import PropTypes from 'prop-types'
import TopBar from '../TopBar/TopBar'
import { connect } from 'react-redux'
import scatterWallet from '../../eos/scatter/scatter.wallet'
import { loginScatter, signalConnection } from '../../redux/actions/scatter.actions'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import axios from 'axios'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  root: {
    width: '100%'
  }
})

class Header extends Component {
  state = {
    alertDialogOpen: false,
    notifications: []
  }

  handleAlertDialogOpen = (msg) => {
    this.setState({ alertDialogOpen: true, alertDialogContent: msg })
  }

  handleAlertDialogClose = () => {
    this.setState({ alertDialogOpen: false, alertDialogContent: '' })
  }

  checkScatter = () => {
    (async () => {
      const { scatter, account, updateScatter, scatterInstall } = this.props
      if (scatter == null || account == null) {
        try {
          await scatterWallet.detect(updateScatter, scatterInstall)
        } catch (err) {
          if (err.message === 'TWO_SCATTERS_INSTALLED') {
            this.setState({
              alertDialogOpen: true,
              alertDialogContent: `Both Scatter Desktop and Extension are installed. Close or
              uninstall one to continue`
            })
          }
        }
      }
    })()
  }

  checkNotifications () {
    const { account } = this.props
    if (account) {
      const req = `${BACKEND_API}/notifications/${account.name}`
      axios.get(req)
        .then(({ data }) => {
          data.map((notif) => {
            notif.votes = [...new Map(notif.votes.map(item => [item.voteid, item])).values()]
          }) // get non duplicate voting notifs
          this.setState({ notifications: data.reverse() })
        })
        .catch(err => {
          console.error(err, 'ERROR FETCHING NOTIFICATIONS')
        })
    }
  }

  async checkBrave () {
    if (localStorage.getItem('CHECK_BRAVE')) return
    if (navigator.brave && await navigator.brave.isBrave()) {
      this.setState({
        alertDialogOpen: true,
        alertDialogContent: `You may experience some performance issues on Brave, please turn shields off for the best experience.`
      })
      localStorage.setItem('CHECK_BRAVE', true)
    }
  }

  componentDidMount () {
    this.checkScatter()
    this.checkNotifications()
    this.checkBrave()
  }

  componentDidUpdate (prevProps) {
    if (this.props.account && (prevProps.account == null || this.props.account.name !== prevProps.account.name)) {
      this.checkNotifications()
    }
  }

  render () {
    this.checkScatter()
    const { notifications } = this.state
    const { classes, isTourOpen } = this.props
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <TopBar
            notifications={notifications}
            isTourOpen={isTourOpen}
          />
          <Dialog
            aria-describedby='alert-dialog-description'
            aria-labelledby='alert-dialog-title'
            onClose={this.handleAlertDialogClose}
            open={this.state.alertDialogOpen}
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                { this.state.alertDialogContent }
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  scatter: PropTypes.object,
  scatterInstall: PropTypes.func.isRequired,
  updateScatter: PropTypes.func.isRequired,
  account: PropTypes.object,
  isTourOpen: PropTypes.bool
}

const mapStateToProps = (state) => {
  const { account: ethAccount } = state.ethAuth

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }
  const ethAuth = !scatterIdentity && state.ethAuth.account ? state.ethAuth : null

  return {
    account,
    ethAuth,
    scatter: state.scatterRequest.scatter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    scatterInstall: (bool) => dispatch(signalConnection(bool)),
    updateScatter: (scatter, account) => dispatch(loginScatter(scatter, account))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header))
