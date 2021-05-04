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

const Retweet = ({ tweetData, classes }) => {
const { user, retweeted_status } = tweetData.tweetInfo
const { user: retweetedUser } = retweeted_status
const retweet_extended_entities = tweetData.tweetInfo.retweeted_status.extended_entities ? tweetData.tweetInfo.retweeted_status.extended_entities : false

const [ previewData, setPreviewData ] = useState(null)
const { caption } = tweetData
const entities = tweetData.tweetInfo.entities ? tweetData.tweetInfo.entities : false
const entitiesURLS = (entities ? (entities.urls && entities.urls.length > 0) : false)

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const previewData = await fetchLinkPreviewData(entities.urls[0].expanded_url)
            setPreviewData(previewData)
          } catch (e) {
            console.log(e)
          }
        })()
      }
    }
  }, [])

  let retweetHasMedia
  if (retweet_extended_entities) {
    retweetHasMedia = retweet_extended_entities.media ? retweet_extended_entities.media.length > 0 : false
  }

  let retweetMediaURL
  let retweetMediaType
  let retweetHasPhoto
  let retweetHasVideo

  if (retweetHasMedia) {
    retweetMediaURL = retweet_extended_entities.media[0].media_url_https ? retweet_extended_entities.media[0].media_url_https : false
    retweetMediaType = retweet_extended_entities.media[0].type
    retweetHasPhoto = Boolean(retweetMediaType === 'photo')
    retweetHasVideo = Boolean(retweetMediaType === 'video' || retweetMediaType === 'animated_gif')

    if (retweetHasVideo) retweetMediaURL = retweet_extended_entities.media[0].video_info.variants[0].url
  }

  let tweetLink
  if (tweetData.caption) {
    tweetLink = tweetData.caption
  }

  let initialText = tweetData.tweetInfo.full_text || tweetData.tweetInfo.text
  let text = parseText(initialText)
  let tweetText = text.split(' ').map((string) => linkMentions(string))

  return (
    <div className={classes.container}>

      <HeaderSection classes={classes}
        user={user}
        tweetLink={tweetLink}
      />

      { (previewData && !retweetHasMedia && !retweetMediaURL) && (<div style={{ marginTop: 20 }}>
        <LinkPreview classes={classes}
          description={previewData && previewData.description}
          image={previewData && previewData.img}
          title={previewData && previewData.title}
          url={previewData && previewData.url}
          caption={caption}
        /></div>
         )}

      <Link href={tweetLink}
        target='_blank'
        underline='none'
      >
      <div className={classes.retweetContainer}>
        <HeaderSection classes={classes}
          user={retweetedUser}
          tweetType={'retweet'}
        />
        <div className={classes.tweetText}
          style={{ marginBottom: 20 }}
        >{tweetText}</div>
        {
                  (retweetHasPhoto && retweetMediaURL)
                  ? <div className={classes.tweetText}>
                    <img className={classes.tweetImg}
                      src={tweetData.excludeTweet?  'https://api.faviconkit.com/twitter.com/128': retweetMediaURL }
                      alt='tweet-image'
                    />
                  </div>
                  : (retweetHasVideo && retweetMediaURL) &&
                    <ReactPlayer
                      className={classes.videoTweet}
                      url={retweetMediaURL}
                      controls
                    />
                }
      </div>
      </Link>
    </div>
    )
}

export default Retweet
