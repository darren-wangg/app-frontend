import { feedConstants as constants } from '../constants'
import produce from 'immer'

const initialState = {
  homeFeed: 'dailyhits',
  feeds: {
    'nfts': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'crypto': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'dailyhits': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'new': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'politics': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'non-corona': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'latenightcool': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'lol': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    },
    'brainfood': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10
    }
  }
}

export function homeFeed (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case constants.SET_HOME_FEED:
        draft.homeFeed = action.homeFeed
        break
      default:
        return state
    }
  })
}

export function feedInfo (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case constants.FETCH_FEED:
        let feedInfo = draft.feeds[action.feedType]
        feedInfo.isLoading = true
        feedInfo.error = null
        break
      case constants.FETCH_FEED_SUCCESS:
        draft.feeds[action.feedType] = {
          isLoading: false,
          posts: state.feeds[action.feedType].posts.concat(action.posts),
          error: null
        }
        break
      case constants.FETCH_FEED_FAILURE:
        feedInfo = draft.feeds[action.feedType]
        feedInfo.isLoading = false
        feedInfo.error = action.error
        break
      default:
        return state
    }
  })
}
