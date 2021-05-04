import { commentsConstants as constants } from '../constants'
import axios from 'axios'
const BACKEND_API = process.env.BACKEND_API

export function fetchPostComments (postid) {
  return async dispatch => {
    dispatch(request(postid))
    try {
      const comments = (await axios.get(`${BACKEND_API}/comments/post/${postid}`)).data
      comments.reverse() // Reverse to get comments in ascending order based on timestamp
      dispatch(success(postid, comments))
    } catch (err) {
      dispatch(failure(postid, err))
    }
  }

  function request (postid) {
    return { type: constants.FETCH_COMMENTS, postid }
  }

  function success (postid, comments) {
    return { type: constants.FETCH_COMMENTS_SUCCESS, postid, comments }
  }

  function failure (postid, error) {
    return { type: constants.FETCH_COMMENTS_FAILURE, postid, error }
  }
}

export function addPostComment (author, postid, comment) {
  return { type: constants.ADD_COMMENT, author, postid, comment }
}
