import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Input from '@material-ui/core/Input'
import { withStyles } from '@material-ui/core/styles'
import { addPostComment } from '../../redux/actions'
import { parseError } from '../../eos/error'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import SubscribeDialog from '../SubscribeDialog/SubscribeDialog'
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { createcomv2 } from '../../eos/actions/comment'

const styles = theme => ({
  addComment: {
    padding: '12px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '16px',
    color: '#ffffff'
  },
  panelText1: {
    fontSize: '16px',
    padding: '0px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    color: '#ffffff',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  }
})

class AddComment extends PureComponent {
  state = {
    comment: '',
    isLoading: false,
    dialogOpen: false
  }

  handleCommentChange = (event) => {
    this.setState({
      comment: event.target.value
    })
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleInputSelect = () => {
    const { account } = this.props
    if (account == null) {
        this.handleDialogOpen()
    }
  }

  onEnter = async (e) => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault()
      try {
        const { scatter, account, postid, addComment, commentsCount, handleExpansionPanelOpen, ethAuth } = this.props
        if (account == null) {
            this.handleDialogOpen()
            return
        }

        let com = this.state.comment
        if (com.trim() === '') {
          return
        }

        this.setState({ isLoading: true })

        const txData = { postid, comment: com }

        const signedInWithEth = (!scatter || !scatter.connected) && !!ethAuth
        if (signedInWithEth) {
          await createcomv2(account, txData, ethAuth)
        } else {
          await scatter.createcomv2({ data: txData })
        }

        addComment(account.name, postid, com)
        this.setState({ comment: '' })
        if (commentsCount > 1) { handleExpansionPanelOpen() }
      } catch (err) {
        console.error(err)
        this.props.handleSnackbarOpen(parseError(err, 'createcomment'))
      }
      this.setState({ isLoading: false })
    }
  }

  render () {
    const { classes } = this.props
    const { isLoading } = this.state

    const CommentLoader = (props) => isLoading
    ? <CircularProgress size={16}
      style={{ color: 'white', marginRight: '-8px' }}
      />
    : null

    const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
    const twitterInfo = cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)

    return (
      <ErrorBoundary>
        <Grid container
          className={classes.addComment}
        >
          <Grid container
            justify='flex-start'
          >
            <Input
              id='demo'
              width='500px'
              placeholder='Add a comment…'
              value={this.state.comment}
              onChange={this.handleCommentChange}
              onKeyDown={this.onEnter}
              onClick={this.handleInputSelect}
              disableUnderline
              className={classes.panelText1}
              fullWidth
              inputProps={{ maxLength: 140 }}
              multiline
              rowsMax={5}
              style={{ fontFamily: 'Gilroy', color: '#ffffff' }}
            />
          </Grid>
          <Grid container
            justify='flex-end'
          >
            <CommentLoader />
          </Grid >
          {
            twitterInfo
              ? <WelcomeDialog dialogOpen={this.state.dialogOpen}
                handleDialogClose={this.handleDialogClose}
                /> : <SubscribeDialog
                  account={this.props.account}
                  dialogOpen={this.state.dialogOpen}
                  handleDialogClose={this.handleDialogClose}
                     />
          }

        </Grid>
      </ErrorBoundary>
    )
  }
}

const mapDispatchToProps = {
    addComment: addPostComment
}

const mapStateToProps = (state, ownProps) => {
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

AddComment.propTypes = {
  scatter: PropTypes.object,
  account: PropTypes.object,
  handleSnackbarOpen: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  commentsCount: PropTypes.number.isRequired,
  handleExpansionPanelOpen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  ethAuth: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddComment))
