import React from 'react'
import ContentLoader from 'react-content-loader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const PostLoader = () => (
  <ErrorBoundary>
    <div>
      <div style={{ minWidth: '600px', marginBottom: '10px' }} >
        <ContentLoader
          height={50}
          primaryColor='#202020'
          secondaryColor='#1b1b1b'
          speed={1}
          width={800}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='550'
            x='10'
            y='20'
          />
        </ContentLoader>
      </div>
      <div style={{ minWidth: '600px', marginBottom: '10px' }} >
        <ContentLoader
          height={50}
          primaryColor='#202020'
          secondaryColor='#121212'
          speed={2}
          width={800}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='550'
            x='10'
            y='20'
          />
        </ContentLoader>
      </div>
      <div style={{ minWidth: '600px', marginBottom: '10px' }} >
        <ContentLoader
          height={50}
          primaryColor='#202020'
          secondaryColor='#121212'
          speed={3}
          width={800}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='550'
            x='10'
            y='20'
          />
        </ContentLoader>
      </div>
      <div style={{ minWidth: '600px', marginBottom: '10px' }} >
        <ContentLoader
          height={50}
          primaryColor='#202020'
          secondaryColor='#121212'
          speed={4}
          width={800}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='550'
            x='10'
            y='20'
          />
        </ContentLoader>
      </div>
      <div style={{ minWidth: '600px', marginBottom: '10px' }} >
        <ContentLoader
          height={50}
          primaryColor='#202020'
          secondaryColor='#121212'
          speed={5}
          width={800}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='9  kyefe0%'
            x='10'
            y='20'
          />
        </ContentLoader>
      </div>
    </div>
  </ErrorBoundary>
)

export default PostLoader
