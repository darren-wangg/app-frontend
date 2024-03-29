import { authInviteConstants as constants } from '../constants'
import axios from 'axios'

const BACKEND_API = process.env.BACKEND_API

export function authInvite (code) {
  return async dispatch => {
    try {
      dispatch(request(code))
      if (code == null) {
        throw Error('No invite code is set')
      }
      const data = (await axios.post(`${BACKEND_API}/auth/invite/${code}`)).data
      localStorage.setItem('inviteCode', data)
      dispatch(success(data))
    } catch (err) {
      dispatch(failure(code, JSON.stringify(err)))
    }
  }

  function request (code) {
    return { type: constants.AUTH_INVITE_CODE, code }
  }

  function success (code) {
    return { type: constants.AUTH_INVITE_CODE_SUCCESS, code }
  }

  function failure (code, error) {
    return { type: constants.AUTH_INVITE_CODE_FAILURE, code, error }
  }
}
