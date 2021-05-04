/* eslint-disable */
import React, { Component, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import _ from 'lodash'

const DEFAULT_TWITTER_PROF = '/images/default-twitter-prof.png'

const HeaderSection = ({ classes, user, tweetType, tweetLink, hideBird }) => {
  let userAvatar
  let twitterName
  let twitterBirdIcon

  if (tweetType === 'retweet') {
    userAvatar = classes.retweetUserAvatar
    twitterName = classes.retweetTwitterName
    twitterBirdIcon = classes.retweetTwitterBirdIcon
  } else if (tweetType === 'reply') {
    userAvatar = classes.userAvatar
    twitterName = classes.replyTwitterName
    twitterBirdIcon = classes.twitterBirdIcon
  } else {
    userAvatar = classes.userAvatar
    twitterName = classes.twitterName
    if (hideBird === true) {
      twitterBirdIcon = classes.retweetTwitterBirdIcon
    } else {
      twitterBirdIcon = classes.twitterBirdIcon
    }
  }

  const accountLink = `https://twitter.com/${user.screen_name}`

  const addDefaultSrc = (e) => {
    e.target.onerror = null
    e.target.src = DEFAULT_TWITTER_PROF
  }

  return (
    <div className={classes.header}>
      <div className={classes.userAvatarContainer}>
        <img className={userAvatar}
          src={user.profile_image_url_https}
          alt='user image'
          onError={addDefaultSrc}
        />
      </div>
      <div className={classes.userTags}>
        <Link href={accountLink}
          target='_blank'
          underline='none'
        >
          <h4 className={twitterName}
            style={{maxWidth: '300px'}}>
            {user && user.name && user.name.substring(0, 80)}
          </h4>
        </Link>
        <Link href={accountLink}
          target='_blank'
          underline='none'
        ><span className={classes.twitterHandle}>@{user.screen_name}</span></Link>
      </div>
      <span className={twitterBirdIcon}>
        <Link href={tweetLink}
          target='_blank'
          underline='none'
        >
          <img
            src='/images/icons/twitter.svg'
            style={{ height: '24px', paddingLeft: '10px', paddingRight: '10px' }}
          />
        </Link>
      </span>
    </div>
 )
}

export default HeaderSection
