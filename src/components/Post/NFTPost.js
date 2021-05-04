import React, { memo } from 'react'
import PropTypes from 'prop-types'
import NFTPreview from '../LinkPreview/NFTPreview'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

function NFTPost (props) {
  const { previewData, postHOC: PostHOC, quantiles, rankCategory, caption } = props

  const ObjectComp = (_props) => (
    <NFTPreview previewData={previewData}
      description={previewData && previewData.description}
      image={previewData && previewData.img}
      title={previewData && previewData.title}
      mimeType={previewData && previewData.mimeType}
      url={previewData && previewData.url}
      caption={caption}
      quantiles={quantiles}
      rankCategory={rankCategory}
    />
  )
  return (
    <ErrorBoundary>
      <PostHOC
        component={ObjectComp}
        {...props}
      />
    </ErrorBoundary>
  )
}

NFTPost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string
}

export default memo(NFTPost)
