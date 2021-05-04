/* eslint-disable */
import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import _ from 'lodash'

// util
import { parseText, linkMentions, fetchLinkPreviewData } from './Util/Util'

// components
import LinkPreview from './LinkPreview'
import HeaderSection from './HeaderSection'

const Quoted = ({ tweetData, classes }) => {
  const { user, quoted_status } = tweetData.tweetInfo
  const { user: quotedUser } = quoted_status
  const extended_entities = tweetData.tweetInfo.extended_entities ? tweetData.tweetInfo.extended_entities : false
  const quoted_extended_entities = tweetData.tweetInfo.quoted_status.extended_entities ? tweetData.tweetInfo.quoted_status.extended_entities : false

  // CHECK EXISTENCE OF ORIGINAL POST VARIABLES AND ASSIGN VALUES
  let originalMediaRootID
  let quotedMediaRootID
  let differentMedia
  let originalHasMedia

  if (extended_entities) {
    originalMediaRootID = extended_entities.media && extended_entities.media[0].id
    quotedMediaRootID = quoted_extended_entities && quoted_extended_entities.media[0].id
    differentMedia = originalMediaRootID !== quotedMediaRootID
    originalHasMedia = extended_entities.media ? extended_entities.media.length > 0 : false
  }

  let originalMediaURL
  let originalMediaType
  let originalHasPhoto
  let originalHasVideo

  if (originalHasMedia) {
    originalMediaURL = extended_entities.media[0].media_url_https ? extended_entities.media[0].media_url_https : false
    originalMediaType = extended_entities.media[0].type
    originalHasPhoto = Boolean(originalMediaType === 'photo')
    originalHasVideo = Boolean(originalMediaType === 'video' || originalMediaType === 'animated_gif')

    if (originalHasVideo) originalMediaURL = extended_entities.media[0].video_info.variants[0].url
  }

    let initialText
    if (tweetData.tweetInfo.text) {
      initialText = tweetData.tweetInfo.text
    } else if (tweetData.tweetInfo.full_text) {
      initialText = tweetData.tweetInfo.full_text
    } else {
      initialText = ''
    }

    let text = parseText(initialText)
    let tweetText = text.split(' ').map((string) => linkMentions(string))

  // CHECK EXISTENCE OF QUOTED POST VARIABLES AND ASSIGN VALUES
  let quotedHasMedia

  if (quoted_extended_entities) {
    quotedHasMedia = quoted_extended_entities.media ? quoted_extended_entities.media.length > 0 : false
  }

  let quotedLink
  let quotedMediaURL
  let quotedMediaType
  let quotedHasPhoto
  let quotedHasVideo
  let tweetLink
  if (tweetData.caption) {
    tweetLink = tweetData.caption
  }

  if (tweetData.tweetInfo.quoted_status_permalink.expanded) {
    quotedLink = tweetData.tweetInfo.quoted_status_permalink.expanded
  } else {
    quotedLink = ''
  }

  if (quotedHasMedia) {
    quotedMediaURL = quoted_extended_entities.media[0].media_url_https ? quoted_extended_entities.media[0].media_url_https : false
    quotedMediaType = quoted_extended_entities.media[0].type
    quotedHasPhoto = Boolean(quotedMediaType === 'photo')
    quotedHasVideo = Boolean(quotedMediaType === 'video' || quotedMediaType === 'animated_gif')

    if (quotedHasVideo) quotedMediaURL = quoted_extended_entities.media[0].video_info.variants[0].url
  }

  let quotedInitialText
  if (tweetData.tweetInfo.quoted_status.text) {
    quotedInitialText = tweetData.tweetInfo.quoted_status.text
  } else if (tweetData.tweetInfo.quoted_status.full_text) {
    quotedInitialText = tweetData.tweetInfo.quoted_status.full_text
  } else {
    quotedInitialText = ''
  }

  let quotedText = parseText(quotedInitialText)
  let quotedTweetText = quotedText.split(' ').map((string) => linkMentions(string))

  return (
    <div className={classes.container}>
      <HeaderSection classes={classes}
        user={user}
        tweetLink={tweetLink}
      />
      <Link href={tweetLink}
        target='_blank'
        underline='none'
      >
        <div className={classes.tweetText}
          style={{ marginBottom: '22px' }}
        >
          {tweetText}
        </div>
      </Link>

      {
        (originalHasPhoto && originalMediaURL) && differentMedia
            ? <div className={classes.tweetText}>
              <img className={classes.tweetImg}
                src={tweetData.excludeTweet ? 'https://api.faviconkit.com/twitter.com/128' : originalMediaURL }
                alt='tweet-image'
              />
            </div>
            : (originalHasVideo && originalMediaURL) &&
              <ReactPlayer
                className={classes.videoTweet}
                url={originalMediaURL}
                controls
              />
      }
      <div className={classes.retweetContainer}>
        <HeaderSection classes={classes}
          user={quotedUser}
          tweetType={'retweet'}
        />
        <Link href={quotedLink}
          target='_blank'
          underline='none'
        >
          <div className={classes.tweetText}>
            {quotedTweetText}
          </div>
        </Link>
        {
            (quotedHasPhoto && quotedMediaURL)
            ? <div className={classes.tweetText}>
              <img className={classes.tweetImg}
                style={{ borderRadius: '0px 0px 20px 20px', marginTop: 10 }}
                src={tweetData.excludeTweet ? 'https://api.faviconkit.com/twitter.com/128' : quotedMediaURL }
                alt='tweet-image'
              />
            </div>
            : (quotedHasVideo && quotedMediaURL) &&
              <ReactPlayer
                className={classes.videoTweet}
                url={quotedMediaURL}
                controls
              />
         }
        </div>
    </div>
  )
}

export default Quoted
