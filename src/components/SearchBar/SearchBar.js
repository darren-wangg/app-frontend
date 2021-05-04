import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PropTypes from 'prop-types'
// import { debounce } from 'lodash'
import CloseIcon from '@material-ui/icons/Close'
import { fetchUserSearchResults, fetchPostSearchResults } from '../../redux/actions'

const styles = theme => ({
  Fragment: {
    paddingRight: '200vw'
  },
  root: {
    position: 'relative',
    borderRadius: '20px',
    border: '0px solid #fff',
    '&:hover': {
      backgroundColor: '#101010'
    },
    '&:active': {
      backgroundColor: '#101010'
    },
    marginLeft: '1rem',
    justify: 'center',
    width: '',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    boxShadow: '20px 20px 20px 0px rgb(255 255 255 / 1%), -2px -2px 20px rgb(0 0 0 / 3%), inset 12px 3px 20px 0px rgb(255 255 255 / 3%), inset -3px -7px 17px 0px #0404044a, 5px 5px 9px 0px rgb(255 255 255 / 2%), -20px -20px 12px rgb(0 0 0 / 1%), inset 1px 1px 6px 0px rgb(255 255 255 / 1%), inset -1px -1px 2px 0px #0404040d',
    color: '#fff',
    maxWidth: '',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0px'
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '-5vw'
    }
  },
  searchIcon: {
    color: '#f2f2f2',
    maxWidth: '5vw',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '1px 0px 0px 3%',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '5%'
    }
  },
  menuItem: {
    fontWeight: 400,
    color: 'inherit',
    margin: '0%',
    backgroundColor: '#2a2a2a',
    width: 'flex',
    '&:hover': {
      background: '#C0C0C0'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '5px 10px'
    }
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(),
    left: 0,
    right: 0
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    marginLeft: '0px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    flexWrap: 'wrap'
  },
  inputInput: {
    color: 'inherit',
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    width: '15vw',
    paddingLeft: '45px',
    transition: theme.transitions.create('width'),
    maxWidth: '1000vw',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      width: '25vw',
      paddingLeft: '35px'
    }
  },
  closeIcon: {
    float: 'right',
    opacity: '0.7',
    width: '25px',
    height: 'auto',
    margin: '5px 10px 0px 0px',
    zIndex: '99999',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      width: '20px'
    }
  }
})

class SearchBar extends Component {
  state = {
    searchText: ''
  }

  componentDidMount () {
    const { postSearchResults, userSearchResults } = this.props

    this.setState({
      searchText: userSearchResults.searchText || postSearchResults.searchText
    })
  }

  handleTextFieldChange = (e) => this.setState({ searchText: e.target.value })

  handleReturnKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch()
    }
  }

  handleSearchClose = (e) => {
    const { searchPosts, searchUsers, history } = this.props
    e.preventDefault()

    searchPosts('', 0)
    searchUsers('', 0)
    history.goBack()
  }

  handleSearch = async () => {
    const { searchText } = this.state
    if (searchText == null || searchText === '') return // TODO: Remove this?
    const { searchPosts, searchUsers, history } = this.props
    searchPosts(searchText, 5)
    searchUsers(searchText, 5)

    history.push('/search')
  }

  render () {
    const { classes } = this.props
    const { searchText } = this.state
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <div className={classes.container}>
            <SearchIcon className={classes.searchIcon} />
            {searchText && searchText.length > 0 &&
              <CloseIcon onClick={this.handleSearchClose}
                className={classes.closeIcon}
              />
            }
            <TextField
              onChange={this.handleTextFieldChange}
              onKeyPress={this.handleReturnKeyPress}
              InputProps={{
                classes: {
                  root: classes.inputRoot,
                  input: classes.inputInput
                },
                disableUnderline: true
              }}
              value={searchText}
            />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { account } = state.scatterRequest
  return {
    account,
    userSearchResults: state.searchResults.userSearchResults, // userSearchResultsSelector(state),
    postSearchResults: state.searchResults.postSearchResults // postSearchResultsSelector(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchPosts: (searchText, limit) => dispatch(fetchPostSearchResults(searchText, limit)),
    searchUsers: (searchText, limit) => dispatch(fetchUserSearchResults(searchText, limit))
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  searchPosts: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  userSearchResults: PropTypes.object.isRequired,
  postSearchResults: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchBar)))
