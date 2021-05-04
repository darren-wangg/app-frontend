import { createSelector } from 'reselect'

export const authInfoSelector = () =>
  createSelector(
    state => state.authInfo
  )
