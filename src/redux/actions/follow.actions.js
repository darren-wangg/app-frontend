import { followConstants as constants } from '../constants'
import axios from 'axios'
const BACKEND_API = process.env.BACKEND_API

export function fetchFollowers (username) {
  return async dispatch => {
    dispatch(request(username))
    try {
      let followers = []
      const followerInfo = (await axios.get(`${BACKEND_API}/followers/${username}`)).data

      await Promise.all(followerInfo.map(async (follower) => {
        const data = (await axios.get(`${BACKEND_API}/accounts/${follower._id.account}`)).data
        followers.push({ ...data, following: follower.following })
      }))
      dispatch(success(username, followers))
    } catch (err) {
      dispatch(failure(username, err))
    }
  }

  function request (username) {
    return { type: constants.FETCH_FOLLOWERS, username }
  }

  function success (username, followers) {
    return { type: constants.FETCH_FOLLOWERS_SUCCESS, username, followers }
  }

  function failure (username, error) {
    return { type: constants.FETCH_FOLLOWERS_FAILURE, username, error }
  }
}

export function fetchFollowing (username) {
  return async dispatch => {
    dispatch(request(username))
    try {
      const following = []
      const accountsFollowed = (await axios.get(`${BACKEND_API}/following/${username}`)).data

      await Promise.all(accountsFollowed.map(async (account) => {
        const data = (await axios.get(`${BACKEND_API}/accounts/${account}`)).data
        following.push(data)
      }))
      dispatch(success(username, following))
    } catch (err) {
      dispatch(failure(username, err))
    }
  }

  function request (username) {
    return { type: constants.FETCH_FOLLOWING, username }
  }

  function success (username, following) {
    return { type: constants.FETCH_FOLLOWING_SUCCESS, username, following }
  }

  function failure (username, error) {
    return { type: constants.FETCH_FOLLOWING_FAILURE, username, error }
  }
}

export function followUser (username, userToFollow) {
  return async dispatch => {
    try {
      const accountInfo = (await axios.get(`${BACKEND_API}/accounts/${userToFollow}`)).data
      const followerInfo = (await axios.get(`${BACKEND_API}/accounts/${username}`)).data
      dispatch({
        type: constants.FOLLOW_USER,
        followerInfo,
        username: username,
        accountToFollow: accountInfo
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export function unfollowUser (username, accountToUnfollow) {
  return {
    type: constants.UNFOLLOW_USER,
    username: username,
    accountToUnfollow: accountToUnfollow
  }
}
