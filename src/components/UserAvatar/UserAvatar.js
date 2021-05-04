import React from 'react'
import PropTypes from 'prop-types'
import ImageLoader from 'react-load-image'
import { parseIpfsRef, hashToUrl } from '../../utils/ipfs.js'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Avatar from '@material-ui/core/Avatar'
import Fade from '@material-ui/core/Fade'

const ANONYMOUS_DEFAULT_AVATAR = 'images/icons/user.svg'

function UserAvatar (props) {
  const { className, src: _src, alt, style, username } = props
  const userLetter = username && username[0].toUpperCase()

  const src = _src === ANONYMOUS_DEFAULT_AVATAR ? '' : _src

  const setDefaultSrc = (e) => {
    e.target.onerror = null
    e.target.src = ANONYMOUS_DEFAULT_AVATAR
    e.target.style.visibility = 'hidden'
  }

  return (
    <Fade in
      timeout={1000}
    >
      <ErrorBoundary>
        <ImageLoader src={parseIpfsRef(src) || ANONYMOUS_DEFAULT_AVATAR}>
          <img alt={alt}
            className={className}
            src={hashToUrl(src)}
            style={{
          ...style, objectFit: 'cover' }}
            onError={setDefaultSrc}
          />
          <Avatar alt={alt}
            className={className}
            style={{ ...style, backgroundColor: '#09090970', fontFamily: 'Gilroy', fontWeight: '600', color: '#DADADA', boxShadow: 'inset 2px 2px 0px 10px #AAAAAAA10' }}
          >{userLetter && userLetter}
          </Avatar>
          <Avatar alt={alt}
            className={className}
            style={{ ...style, backgroundColor: '#09090970', fontFamily: 'Gilroy', fontWeight: '600', color: '#DADADA', boxShadow: 'inset 2px 2px 0px 10px #AAAAAAA10' }}
          >{userLetter && userLetter}
          </Avatar>
        </ImageLoader>
      </ErrorBoundary>
    </Fade>
  )
}

UserAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  style: PropTypes.object,
  username: PropTypes.string.isRequired
}

export default UserAvatar
