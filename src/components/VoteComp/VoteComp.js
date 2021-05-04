import React, { Component } from 'react'
import VoteButton from '../VoteButton/VoteButton'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchInitialVotes } from '../../redux/actions'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const VOTE_CATEGORIES = process.env.VOTE_CATEGORIES.split(',')
const PROF_CATEGORIES = process.env.PROF_CATEGORIES.split(',')
const MAPS_CATEGORIES = process.env.MAPS_CATEGORIES.split(',')
const COURSE_CATEGORIES = process.env.COURSE_CATEGORIES.split(',')
const ELECTION_CATEGORIES = process.env.ELECTION_CATEGORIES.split(',')
const NFT_ART_CATEGORIES = process.env.NFT_ART_CATEGORIES.split(',')
const NFT_MUSIC_CATEGORIES = process.env.NFT_MUSIC_CATEGORIES.split(',')

const artPattern = new RegExp('^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com/token/|www.rarible.com/token/|http://rarible.com/token/|https://rarible.com/*/|opensea.io/assets/|www.opensea.io/assets/|http://opensea.io/assets/|https://opensea.io/assets/|superrare.co/|www.superrare.co/|http://superrare.co/|https://superrare.co/|foundation.app/*/|www.foundation.app/*/|http://foundation.app/*/|https://foundation.app/*/|zora.co/|www.zora.co/|http://zora.co/|https://zora.co/)')
const musicPattern = new RegExp('^(audius.co/|www.audius.co/|http://audius.co/|https://audius.co/|http://www.audius.co/|https://www.audius.co/*/)')

class VoteComp extends Component {
  state = {
    isShown: false
  }

  componentDidMount () {
    this.fetchInitialVotes()
  }

  async fetchInitialVotes () {
    const { postid, account, dispatch } = this.props
    if (account == null) { return }
    await dispatch(fetchInitialVotes(account.name, postid))
  }

  render () {
    const { postid, caption, quantiles, voterWeight, weights, postType, rating, categories: _categories, listType } = this.props
    const isMobile = window.innerWidth <= 600

    let categories

    if (_categories == null) {
      // TODO: Make this configurable
      if (postType === 'columbia-course-registration:courses') {
        categories = COURSE_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'columbia-course-registration:professors') {
        categories = PROF_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'maps.google.com') {
        categories = MAPS_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'politics:candidates' && listType === 'politics:candidates') {
        categories = ELECTION_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(artPattern)) {
        categories = NFT_ART_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(musicPattern)) {
        categories = NFT_MUSIC_CATEGORIES.filter((cat) => cat !== 'overall')
      } else {
        categories = VOTE_CATEGORIES.filter((cat) => cat !== 'overall')
      }
    } else {
      categories = _categories
    }

    return (
      <ErrorBoundary>
        <div style={{
            display: 'flex',
            marginLeft: '8px'
          }}
          onMouseEnter={() => this.setState({ isShown: true })}
          onMouseLeave={() => this.setState({ isShown: false })}
        >
          { categories.map((cat) => {
          return (
            <VoteButton
              category={cat}
              catWeight={weights[cat]}
              key={cat}
              rating={rating}
              postid={postid}
              listType={listType}
              quantile={quantiles[cat]}
              voterWeight={voterWeight}
              isShown={isMobile ? true : this.state.isShown}
            />
          )
        })
      }
        </div>
      </ErrorBoundary>
    )
  }
}

VoteComp.propTypes = {
  account: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  quantiles: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
  voterWeight: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  postType: PropTypes.string,
  listType: PropTypes.string,
  categories: PropTypes.array,
  dispatch: PropTypes.func.isRequired
}

VoteComp.defaultProps = {
  weights: {
    intelligence: null,
    popularity: null,
    overall: null,
    funny: null
  },
  voterWeight: 0
}

const mapStateToProps = (state, ownProps) => {
  const { account: ethAccount } = state.ethAuth

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || state.ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  let voterWeight = 0
  let initialVotes = { votes: {}, isLoading: false, error: null }
  if (account && account.name) {
    const level = state.socialLevels.levels[account.name]
    if (level && level.levelInfo.weight) {
      voterWeight = level.levelInfo.weight
    }

    const userVotes = state.initialVotes[account.name]
    const userVotesForPost = userVotes && userVotes[ownProps.postid]
    if (userVotesForPost) {
      initialVotes = userVotesForPost
    }
  }

  // const ethAuth = state.ethAuth.account ? state.ethAuth : null

  return {
    voterWeight,
    initialVotes,
    account
  }
}

export default connect(mapStateToProps)(VoteComp)
