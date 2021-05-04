import PropTypes from 'prop-types'
import React, { Component, memo } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { levelColors } from '../../utils/colors'
import { withStyles } from '@material-ui/core/styles'
import { parseError } from '../../eos/error'
import scatter from '../../eos/scatter/scatter.wallet'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  panelText: {
    fontSize: '18px',
    fontFamily: '"Gilroy", sans-serif',
    color: '#ffffff',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  menuItem: {
    fontSize: '20px',
    fontFamily: '"Gilroy", sans-serif',
    color: 'black'
  },
  comment: {
    fontWeight: '400',
    textDecoration: 'none',
    color: '#ffffff',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  }
})

class Comment extends Component {
  state = {
    // anchorEl: false,
    status: null
  }

  /*
  handleCommentMenuClick = event => {
   this.setState({ anchorEl: event.currentTarget })
 }

  handleCommentMenuClose = () => {
    this.setState({ anchorEl: null })
  }
  */

  handleDeleteComment = async () => {
    const { comment, account } = this.props
    try {
      if (account == null) {
        this.props.handleSnackbarOpen('Log in to modify comments!')
        return
      } else {
        const { commentid } = comment._id
        await scatter.scatter.deletecomment({ data: { commentid } })
        this.setState({ status: 'deleted' })
      }
    } catch (err) {
      this.props.handleSnackbarOpen(parseError(err))
    }
    this.handleCommentMenuClose()
  }

  render () {
    const { classes, levels, comment } = this.props
    const { status } = this.state

    let authorLevelColor

    const level = levels.levels[comment.author]
    if (level) {
      const { quantile } = level.levelInfo
      authorLevelColor = levelColors[quantile]
    }

    const username = level && level.levelInfo.username
    const eosname = comment.author

    if (username == null || status === 'deleted') { return null }

    /*
    const MenuController = (props) => (

      account && account.name === comment.author && comment._id != null
      ? <Fragment>
        <MoreVertIcon
          onClick={this.handleCommentMenuClick}
          style={{ color: 'white', height: '16px', marginTop: '0px' }}
        />
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleCommentMenuClose}
        >
          <MenuItem
            onClick={this.handleDeleteComment}
            className={classes.menuItem}
          >
          Delete!
          </MenuItem>
        </Menu>
      </Fragment>
      : null
    ) */

    const MenuController = (props) => null

    return (
      <ErrorBoundary>
        <Grid
          container
          direction='row'
          alignItems='flex-start'
        >
          <Grid item>
            <Typography align='left'
              className={classes.panelText}
            >
              <a
                className={classes.comment}
                href={`/${username || eosname}`}
                style={{
                textDecoration: 'underline',
                marginRight: '4px',
                textDecorationColor: authorLevelColor,
                textDecorationStyle: 'solid'
              }}
              >
                {username || eosname}
              </a>
              {comment.comment}
            </Typography>
          </Grid>
          <Grid item
            container
            justify='flex-end'
          >
            <MenuController />
          </Grid >
        </Grid>
      </ErrorBoundary>
    )
  }
}

Comment.propTypes = {
  account: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  levels: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  handleSnackbarOpen: PropTypes.func.isRequired
}

export default withStyles(styles)(memo(Comment))
