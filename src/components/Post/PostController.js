import React, { memo, Component } from 'react'
import Post from '../Post/Post'
import PostHOC from './PostHOC'
import TextPost from './TextPost'
import LinkPreviewPost from './LinkPreviewPost'
import CoursePost from '../Post/CoursePost'
import ProfPost from '../Post/ProfPost'
import TweetPost from './TweetPost'
import VideoPost from './VideoPost'
import SoundPost from './SoundPost'
import SpotifyPost from './SpotifyPost'
import MusicPost from './MusicPost'
import TallPreviewPost from './TallPreviewPost'
import ObjectPost from './ObjectPost'
import NFTPost from './NFTPost'
import TwitchPost from './TwitchPost'
import InstagramPost from './InstagramPost'
import AudiusPost from './AudiusPost'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPostInfo } from '../../redux/actions'
import isEqual from 'lodash/isEqual'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const COLUMBIA_PROF_TAG = 'columbia-course-registration/professor'
const COLUMBIA_COURSE_TAG = 'columbia-course-registration/course'

const COLUMBIA_PROF_POST_TYPE = 'columbia-course-registration:professors'
const COLUMBIA_COURSE_POST_TYPE = 'columbia-course-registration:courses'

const MAPS_POST_TYPE = 'maps.google.com'

const US_PRES_ELECTIONS_TAG = 'politics'

// TODO: Simplify regular expression patterns

function isAudiusTrackPost (caption) {
  const audiusPattern = new RegExp('^(audius.co/|www.audius.co/|http://audius.co/|https://audius.co/)')
  return audiusPattern.test(caption)
}

function isObjPost (caption) {
  const objPattern = new RegExp('^(wikipedia.org/wiki/|en.wikipedia.org/wiki/|www.wikipedia.com/|http://wikipedia.com/*/|https://wikipedia.com/*/|http://www.wikipedia.com/*/|https://en.wikipedia.org/wiki/|https://www.amazon.com/|http://twitter.com/[^/]*$|https://twitter.com/[^/]*$|http://www.twitter.com/[^/]*$|https://www.twitter.com/[^/]*$|https://www.reddit.com/r/[^/]*[/]?$|http://www.reddit.com/r/[^/]*[/]?$|www.reddit.com/r/[^/]*[/]?$|reddit.com/r/[^/]*[/]?$|https://www.youtube.com/channel/[^/]*[/]?$|http://www.youtube.com/channel/[^/]*[/]?$|www.youtube.com/channel/[^/]*[/]?$|youtube.com/user/[^/]*[/]?$|https://www.youtube.com/user/*|http://www.youtube.com/user/[^/]*[/]?$|www.youtube.com/user/*?$|youtube.com/user/[^/]*[/]?$)')
  return objPattern.test(caption)
}

function isYoutubePost (caption) {
  const ytPattern = new RegExp('^(youtube.com/watch?|www.youtube.com/watch?|http://youtube.com/watch?|https://youtube.com/watch?|http://www.youtube.com/watch?|https://www.youtube.com/watch?)')
  return ytPattern.test(caption)
}

function isYoutubeChannelPost (caption) {
  const ytPattern = new RegExp('^(youtube.com/c?|www.youtube.com/channel?|youtube.com/user?|youtube.com/users?|http://youtube.com/c?|https://youtube.com/channel?|http://www.youtube.com/c?|https://www.youtube.com/channel?)')
  return ytPattern.test(caption)
}

function isSCPost (caption) {
  const scPattern = new RegExp('^(soundcloud.com/*/|www.soundcloud.com/*/|http://soundcloud.com/*/|https://soundcloud.com/*/|http://www.soundcloud.com/*/|https://www.soundcloud.com/*/)')
  return scPattern.test(caption)
}

function isSpotifyPost (caption) {
  const spPattern = new RegExp('^(open.spotify.com/*/|www.open.spotify.com/*/|http://open.spotify.com/*/|https://open.spotify.com/*/|http://www.open.spotify.com/*/|https://www.open.spotify.com/*/)')
  return spPattern.test(caption)
}

function isMusicPost (caption) {
  const appleMusicRe = new RegExp(`^((http:|https:)([/][/]))?(www.)?(music.apple.com/us/(artist|album)/(.)*/(.)*?i=(.)*)$`)
  return appleMusicRe.test(caption)
}

function isTallPreviewPost (caption) {
  const tallPattern = new RegExp('^(giphy.com/*/|www.giphy.com/*/|http://giphy.com/*/|https://giphy.com/*/|http://www.giphy.com/*/|https://www.giphy.com/*/)')
  return tallPattern.test(caption)
}

function isIGPost (caption) {
  const igPattern = new RegExp('^(instagram.com/*/|www.instagram.com/*/|http://instagram.com/*/|https://instagram.com/*/|http://www.instagram.com/*/|https://www.instagram.com/*/)')
  return igPattern.test(caption)
}

function isTwitchChannelPost (caption) {
  const twPattern = new RegExp('^(twitch.tv/*/|www.twitch.tv/*/|http://twitch.tv/*/|https://twitch.tv/*/|http://www.twitch.tv/*/|https://www.twitch.tv/*/)')
  return twPattern.test(caption)
}

function isTwitterStatusPost (caption) {
  const twitterPattern = new RegExp('^(twitter.com/.*/status/|www.twitter.com/.*/status/|http://twitter.com/.*/status/|https://twitter.com/.*/status/|http://www.twitter.com/.*/status/|https://www.twitter.com/.*/status/|http://mobile.twitter.com/.*/status/|https://mobile.twitter.com/.*/status/)')
  return twitterPattern.test(caption)
}

function isNftPost (caption) {
  const nftPattern = new RegExp('^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com/*|www.rarible.com/*|http://rarible.com/*|https://www.rarible.com/*|https://rarible.com|rarible.com/token/|www.rarible.com/token/|http://rarible.com/token/|https://rarible.com/*/|opensea.io/assets/|www.opensea.io/assets/|http://opensea.io/assets/|https://opensea.io/assets/|superrare.co/|www.superrare.co/|http://superrare.co/|https://superrare.co/|foundation.app/*/|www.foundation.app/*/|http://foundation.app/*/|https://foundation.app/*/|zora.co/|www.zora.co/|http://zora.co/|https://zora.co/|(^((http:|https:)([/][/]))?(www.)?knownorigin.io/gallery/[^/]*[/]?$))')
  return nftPattern.test(caption)
}

class PostController extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  render () {
    const { classes, dispatch, post, hideInteractions, renderObjects } = this.props
    if (!post) return null

    dispatch(setPostInfo(post._id.postid, post))
    const isTextPost = (post.imgHash == null || post.imgHash.trim() === '') && (post.videoHash == null || post.videoHash.trim() === '')
    const isVideoPost = isYoutubePost(post.caption)
    const isChannelPost = isYoutubeChannelPost(post.caption)
    const isObjectPost = isObjPost(post.caption)
    const isNFTPost = isNftPost(post.caption)
    const isSoundPost = isSCPost(post.caption)
    const isSpotPost = isSpotifyPost(post.caption)
    const isMusPost = isMusicPost(post.caption)
    const isGiphPost = isTallPreviewPost(post.caption)
    const isTwitchPost = isTwitchChannelPost(post.caption)
    const isTwitterPost = isTwitterStatusPost(post.caption)
    const isInstagramPost = isIGPost(post.caption)
    const isAudiusPost = isAudiusTrackPost(post.caption)

    if (post.tag === COLUMBIA_PROF_TAG) {
      return (
        <ErrorBoundary>
          <ProfPost
            caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            previewData={post.previewData}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            postType={COLUMBIA_PROF_POST_TYPE}
            hideInteractions={hideInteractions}
          />
        </ErrorBoundary>
        )
    } else if (post.tag === COLUMBIA_COURSE_TAG) {
      return (
        <ErrorBoundary>
          <CoursePost
            caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            previewData={post.previewData}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            rating={post.rating}
            postHOC={PostHOC}
            postType={COLUMBIA_COURSE_POST_TYPE}
            hideInteractions={hideInteractions}
          />
        </ErrorBoundary>
    )
  } else if (post.tag === US_PRES_ELECTIONS_TAG) {
    return (
      <ErrorBoundary>
        <TweetPost caption={post.caption}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          previewData={post.previewData}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          tweetObject={post}
          postType={US_PRES_ELECTIONS_TAG}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </ErrorBoundary>

    )
  } else if (isTwitterPost) {
       return (
         <ErrorBoundary>
           <TweetPost caption={post.caption}
             comment={post.comment}
             author={post.author}
             postid={post._id.postid}
             quantiles={post.quantiles}
             previewData={post.previewData}
             tweetObject={post}
             votes={post.upvotes - post.downvotes}
             weights={post.weights}
             postHOC={PostHOC}
             rating={post.rating}
             hideInteractions={hideInteractions}
             classes={classes}
           />
         </ErrorBoundary>
      )
    } else if (isVideoPost) {
      return (
        <ErrorBoundary>
          <VideoPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isSoundPost) {
      return (
        <ErrorBoundary>
          <SoundPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isSpotPost) {
      return (
        <ErrorBoundary>
          <SpotifyPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isMusPost) {
      return (
        <ErrorBoundary>
          <MusicPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isTwitchPost) {
      return (
        <ErrorBoundary>
          <TwitchPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isInstagramPost) {
      return (
        <ErrorBoundary>
          <InstagramPost caption={post.caption}
            comment={post.comment}
            author={post.author}
            postid={post._id.postid}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isNFTPost) {
      return (
        <ErrorBoundary>
          <NFTPost
            comment={post.comment}
            key={post._id.postid}
            postid={post._id.postid}
            author={post.author}
            caption={post.caption}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isGiphPost) {
      return (
        <ErrorBoundary>
          <TallPreviewPost
            comment={post.comment}
            key={post._id.postid}
            postid={post._id.postid}
            author={post.author}
            caption={post.caption}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
    } else if (isObjectPost || isChannelPost) {
      if (renderObjects) {
        return (
          <ErrorBoundary>
            <ObjectPost
              comment={post.comment}
              key={post._id.postid}
              postid={post._id.postid}
              author={post.author}
              caption={post.caption}
              previewData={post.previewData}
              quantiles={post.quantiles}
              votes={post.upvotes - post.downvotes}
              weights={post.weights}
              postHOC={PostHOC}
              rating={post.rating}
              hideInteractions={hideInteractions}
              classes={classes}
            />
          </ErrorBoundary>
        )
      }
      return null
    } else if (isTextPost) {
      if (post.previewData == null) {
        return (
          <ErrorBoundary>
            <TextPost
              caption={post.caption}
              comment={post.comment}
              key={post._id.postid}
              author={post.author}
              postid={post._id.postid}
              previewData={post.previewData}
              quantiles={post.quantiles}
              votes={post.upvotes - post.downvotes}
              weights={post.weights}
              postHOC={PostHOC}
              rating={post.rating}
              postType={post.tag === MAPS_POST_TYPE ? MAPS_POST_TYPE : null}
              hideInteractions={hideInteractions}
              classes={classes}
            />
          </ErrorBoundary>
        )
      } else if (isAudiusPost) {
          return (
            <ErrorBoundary>
              <AudiusPost
                caption={post.caption}
                comment={post.comment}
                key={post._id.postid}
                author={post.author}
                postid={post._id.postid}
                previewData={post.previewData}
                quantiles={post.quantiles}
                votes={post.upvotes - post.downvotes}
                weights={post.weights}
                postHOC={PostHOC}
                rating={post.rating}
                hideInteractions={hideInteractions}
                classes={classes}
              />
            </ErrorBoundary>
          )
      } else {
        return (
          <ErrorBoundary>
            <LinkPreviewPost
              comment={post.comment}
              key={post._id.postid}
              postid={post._id.postid}
              author={post.author}
              caption={post.caption}
              previewData={post.previewData}
              quantiles={post.quantiles}
              votes={post.upvotes - post.downvotes}
              weights={post.weights}
              postHOC={PostHOC}
              rating={post.rating}
              hideInteractions={hideInteractions}
              classes={classes}
            />
          </ErrorBoundary>
        )
      }
    }
      return (
        <ErrorBoundary>
          <Post
            caption={post.caption}
            comment={post.comment}
            image={post.imgHash}
            key={post._id.postid}
            author={post.author}
            postid={post._id.postid}
            quantiles={post.quantiles}
            video={post.videoHash}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </ErrorBoundary>
      )
  }
}

PostController.propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  hideInteractions: PropTypes.bool,
  renderObjects: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = () => { return {} }
export default memo(connect(mapStateToProps)(PostController))
