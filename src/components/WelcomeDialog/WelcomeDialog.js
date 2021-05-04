import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

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
    fontFamily: 'Bungee',
    fontWeight: '300',
    color: '#ffffff',
    fontSize: '20'
  },
  dialogContentText: {
    fontFamily: 'Gilroy',
    fontWeight: '200',
    color: '#ffffff'
  },
  primaryBtn: {
    color: '#0a0a0a',
    fontWeight: '500',
    backgroundColor: '#00eab7',
    '&:hover': {
      backgroundColor: '#00bb92'
    }
  },
  linkBtn: {
    color: '#FFFFFF',
    fontWeight: '100',
    textTransform: 'capitalize',
    textDecoration: 'underline'
  },
  desktopDialogContentText: {
    display: 'inline',
    [theme.breakpoints.down('600')]: {
      display: 'none'
    }
  },
  mobileDialogContentText: {
    display: 'inline',
    [theme.breakpoints.up('600')]: {
      display: 'none'
    }
  }
})

class WelcomeDialog extends Component {
  openTour = () => {
    const { handleDialogClose, startProductTour } = this.props
    handleDialogClose()
    startProductTour()
  }

  render () {
    const { handleDialogClose, dialogOpen, classes, showProductTour } = this.props
    return (
      <ErrorBoundary>
        <Dialog open={dialogOpen}
          onClose={handleDialogClose}
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
          <DialogTitle className={classes.dialogTitle}
            id='form-dialog-title'
          >
            <Typography
              align='left'
              className={classes.dialogTitleText}
              color='#ffffff'
              variant='title'
            >
              Welcome to Yup 🎉
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography
                align='left'
                className={classes.dialogContentText}
                color='#ffffff'
                variant='title'
              >
                <span className={classes.desktopDialogContentText}>
                  <div style={{ opacity: 0.6, marginBottom: '10px' }}>
                    Your Yup account has been created! Your Twitter likes and tweets will now earn you influence and rewards on Yup.
                  </div>
                  To rate directly from your computer, download the Yup extension.
                  You must use the Yup extension to redeem rewards of all kinds.
                </span>
                <span className={classes.mobileDialogContentText}>
                  <div style={{ opacity: 0.6, marginBottom: '10px' }}>
                    Your Yup account has been created! Your Twitter likes and tweets will now earn you influence and rewards on Yup.
                  </div>
                  To rate directly from your computer, download the Yup extension.
                  You must use the Yup extension to redeem rewards of all kinds.
                </span>
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container
              direction='column'
              justify='space-between'
              alignItems='center'
            >
              <Grid item
                className={classes.desktopDialogContentText}
              >
                <Button wide
                  className={classes.primaryBtn}
                  href='https://chrome.google.com/webstore/detail/yup-the-opinion-layer-of/nhmeoaahigiljjdkoagafdccikgojjoi?hl=en'
                > Download Yup Extension </Button>
              </Grid>
              { showProductTour && <>
                <Grid item
                  className={classes.desktopDialogContentText}
                >
                  <Button className={classes.linkBtn}
                    onClick={this.openTour}
                  > 10 second tutorial </Button>
                </Grid>
                <Grid item
                  className={classes.mobileDialogContentText}
                >
                  <Button fullWidth
                    className={classes.primaryBtn}
                    onClick={this.openTour}
                  > 10 Second Tutorial </Button>
                </Grid>
                </>}
            </Grid>
          </DialogActions>
        </Dialog>
      </ErrorBoundary>
    )
  }
}

WelcomeDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  showProductTour: PropTypes.bool,
  startProductTour: PropTypes.func.isRequired,
  handleDialogClose: PropTypes.func.isRequired
}
export default withStyles(styles)(WelcomeDialog)
