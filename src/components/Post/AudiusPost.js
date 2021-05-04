import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
const { AUDIUS_EMBED } = process.env

const styles = theme => ({
  postContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      borderRadius: '0px'
    }
  }
})

 function AudiusPost (props) {
    const { previewData: { trackId, ownerId }, classes, postHOC: PostHOC } = props
    if (!trackId || !ownerId) return null

    const AudiusComp = (_props) => (
      <div className={classes.postContainer}
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <iframe src={`${AUDIUS_EMBED}?id=${trackId}&ownerId=${ownerId}&flavor=compact`}
          allow='encrypted-media'
          width='100%'
          height='120'
          style={{ border: 'none', padding: '10px' }}
        />
      </div>
    )
    return (
      <ErrorBoundary>
        <PostHOC
          component={AudiusComp}
          {...props}
        />
      </ErrorBoundary>
    )
}

AudiusPost.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired,
  previewData: PropTypes.object.isRequired
}

export default memo(withStyles(styles)(AudiusPost))
