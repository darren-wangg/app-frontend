/* eslint-disable */
import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ReactPlayer from 'react-player'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import _ from 'lodash'

// util
import { parseText, linkMentions, fetchLinkPreviewData } from './Util/Util'

// components
import LinkPreview from './LinkPreview'
import HeaderSection from './HeaderSection'

const Original = ({ tweetData, classes }) => {
  const { caption } = tweetData
  const { user } = tweetData.tweetInfo
  const extended_entities = tweetData.tweetInfo.extended_entities ? tweetData.tweetInfo.extended_entities : false

  const [ previewData, setPreviewData ] = useState(null)
  const entities = tweetData.tweetInfo.entities ? tweetData.tweetInfo.entities : false
  const entitiesURLS = (entities && entities.urls.length > 0)

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const previewData = await fetchLinkPreviewData(entities.urls[0].expanded_url)
            setPreviewData(previewData)
          } catch (err) {
            console.error(err)
          }
        })()
      }
    }
  }, [])

  let hasMedia
  if (extended_entities) {
    hasMedia = extended_entities.media ? extended_entities.media.length > 0 : false
  }

  let mediaURL
  let mediaType
  let hasPhoto
  let hasVideo
  let tweetLink = tweetData.caption ? tweetData.caption : ''
  if (hasMedia) {
    mediaURL = extended_entities.media[0].media_url_https ? extended_entities.media[0].media_url_https : false
    mediaType = extended_entities.media[0].type
    hasPhoto = Boolean(mediaType === 'photo')
    hasVideo = Boolean(mediaType === 'video' || mediaType === 'animated_gif')

    if (hasVideo) mediaURL = extended_entities.media[0].video_info.variants[0].url
  }

  let initialText = tweetData.tweetInfo.full_text || tweetData.tweetInfo.text
  let text = parseText(initialText)

  if (tweetData.tweetInfo.text) {
    initialText = tweetData.tweetInfo.text
  } else if (tweetData.tweetInfo.full_text) {
    initialText = tweetData.tweetInfo.full_text
  } else {
    initialText = ''
  }

  let tweetText = text.split(' ').map((string) => linkMentions(string))

  let previewDataURL;
  if (previewData && previewData.url) {
    previewDataURL = previewData.url.length > 0 ? previewData.url : false
  }

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
          style={{
            marginBottom: 20
          }}
        >{tweetText}</div>
      </Link>
      {
          (previewData && !hasMedia && !mediaURL && !tweetData.excludeTweet) &&  (
          <div style={{ marginTop: 20 }}>
            <LinkPreview size={'large'}
            description={previewData.description}
            image={previewData.img}
            title={previewData.title}
            url={previewDataURL}
            caption={caption}
            classes={classes}
            />
          </div>)
      }

      {
        (hasPhoto && mediaURL)
        ? <div className={classes.tweetText}>
            <img className={classes.tweetImg}
            src={tweetData.excludeTweet ?  'https://api.faviconkit.com/twitter.com/128' : mediaURL }
            alt='tweet-image'
            />
          </div>
        : (hasVideo && mediaURL) &&
          <ReactPlayer
            className={classes.videoTweet}
            url={mediaURL}
            controls
          />
        }
    </div>
  )
}

export default Original
