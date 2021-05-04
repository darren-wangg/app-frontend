import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import AddComment from './AddComment'
import Portal from '@material-ui/core/Portal'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Comment from './Comment'
import BottomCommentPanel from './BottomCommentPanel'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import isEqual from 'lodash/isEqual'

const styles = theme => ({
  addComment: {
    padding: '12px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '16px',
    color: '#ffffff'
  },
  firstComment: {
    margin: '0px 0px 0px -15px'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  panel: {
    color: '#fedeee'
  }
})

class Comments extends Component {
  state = {
    snackbarOpen: false,
    snackbarContent: '',
    expanded: false
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  handleSnackbarOpen = (msg) => {
    this.setState({ snackbarOpen: true, snackbarContent: msg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarContent: '' })
  }

  handleExpansionPanelOpen = () => {
    this.setState({ expanded: true })
  }

  handleExpansionPanelClick = (event) => {
    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    const { classes, comments, levels, postid, account } = this.props

    const Snack = (props) => (
      <Portal>
        <Snackbar
          className={classes.snackUpper}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.snackbarOpen}
          onClose={this.handleSnackbarClose}
          autoHideDuration={4000}
        >
          <SnackbarContent
            className={classes.snack}
            message={this.state.snackbarContent}
          />
        </Snackbar>
      </Portal>
    )

    if (comments == null || comments.length === 0) {
      return (
        <Fragment>
          <AddComment postid={postid}
            handleSnackbarOpen={this.handleSnackbarOpen}
            handleExpansionPanelOpen={this.handleExpansionPanelOpen}
            commentsCount={0}
          />
          <Snack />
        </Fragment>
      )
    }

    const firstComment = comments[0]
    const restOfComments = comments.slice(1)
    return (
      <ErrorBoundary>
        <Fragment>
          <div style={{ marginLeft: '0px' }}>
            <ExpansionPanel
              expanded={this.state.expanded}
              onChange={this.state.onChange}
              onClick={restOfComments.length > 0 ? this.handleExpansionPanelClick : () => {}}
              style={{
                boxShadow: 'none',
                paddingLeft: '0px',
                paddingBottom: '0px',
                marginBottom: '0px',
                backgroundColor: 'transparent',
                fill: 'white'
              }}
            >
              <ExpansionPanelSummary
                style={{ margin: '0px 0px -20px -12px' }}
                expandIcon={restOfComments.length > 0 ? <ExpandMoreIcon style={{ fill: 'white' }} /> : <div />}
                className={classes.panel}
              >
                <Comment
                  style={{ margin: '-20px 0px 0px -12px' }}
                  comment={firstComment}
                  levels={levels}
                  account={account}
                  handleSnackbarOpen={this.handleSnackbarOpen}
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{ padding: '0px 12px 12px' }}
              >
                <BottomCommentPanel
                  comments={restOfComments}
                  levels={levels}
                  account={account}
                  handleSnackbarOpen={this.handleSnackbarOpen}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <AddComment postid={postid}
            handleSnackbarOpen={this.handleSnackbarOpen}
            handleExpansionPanelOpen={this.handleExpansionPanelOpen}
            commentsCount={this.props.comments.length}
          />
          <Snack />
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const getCommentsInfo = (state, postid) => {
  return state.postComments && state.postComments[postid]
}

const getComments = (commentsInfo) => {
  return commentsInfo && commentsInfo.comments
}

const commentsSelector = createSelector(getCommentsInfo, getComments)

const mapStateToProps = (state, ownProps) => {
  const { account: ethAccount } = state.ethAuth

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }
  return {
    account,
    comments: commentsSelector(state, ownProps.postid),
    levels: state.socialLevels
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  comments: PropTypes.array,
  account: PropTypes.object.isRequired,
  levels: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Comments))
