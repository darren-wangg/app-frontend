import React from 'react'
import ContentLoader from 'react-content-loader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const FeedLoader = () => (
  <ErrorBoundary>
    <div>
      <ContentLoader
        height={16}
        primaryColor='#1a1a1a'
        secondaryColor='#2f2f2f'
        speed={2}
        width={400}
        style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
      >
        <rect height='10'
          rx='4'
          ry='40'
          width='117'
          x='3'
          y='6'
          style={{ boxShadow: '20px 20px 20px 0px rgb(255 255 255 / 2%), -2px -2px 20px rgb(0 0 0 / 3%), inset 12px 3px 20px 0px rgb(255 255 255 / 3%), inset -3px -7px 17px 0px #0404044a, 5px 5px 9px 0px rgb(255 255 255 / 5%), -20px -20px 12px rgb(0 0 0 / 3%), inset 1px 1px 6px 0px rgb(255 255 255 / 2%), inset -1px -1px 2px 0px #0404040f' }}
        />
      </ContentLoader>
      <ContentLoader
        height={8}
        primaryColor='#00E4FF'
        secondaryColor='#00FFA6'
        speed={2}
        width={400}
        style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
      >
        <rect height='3'
          rx='1'
          ry='7'
          width='105'
          x='4'
          y='0'
          style={{ boxShadow: '20px 20px 20px 0px rgb(255 255 255 / 2%), -2px -2px 20px rgb(0 0 0 / 3%), inset 12px 3px 20px 0px rgb(255 255 255 / 3%), inset -3px -7px 17px 0px #0404044a, 5px 5px 9px 0px rgb(255 255 255 / 5%), -20px -20px 12px rgb(0 0 0 / 3%), inset 1px 1px 6px 0px rgb(255 255 255 / 2%), inset -1px -1px 2px 0px #0404040f' }}
        />
      </ContentLoader>
      <div style={{ width: '100%', margin: 'auto', background: '#1a1a1a', borderRadius: '0.5rem', marginBottom: '10px' }} >
        <ContentLoader
          height={200}
          primaryColor='#1f1f1f'
          secondaryColor='#2f2f2f'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='117'
            x='50'
            y='15'
          />
          <rect height='4'
            rx='2'
            ry='7'
            width='105'
            x='56'
            y='28'
          />
          <circle cx='25'
            cy='25'
            r='18'
          />
          <rect height='150'
            rx='4'
            ry='4'
            width='580'
            x='5'
            y='50'
          />
        </ContentLoader>
        <ContentLoader
          height={20}
          primaryColor='#1f1f1f'
          secondaryColor='#00FFA6'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='10'
            y='10'
          />
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='80'
            y='10'
          />
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='150'
            y='10'
          />
        </ContentLoader>
        <ContentLoader
          height={16}
          primaryColor='#1a1a1a'
          secondaryColor='#2f2f2f'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='4'
            width='400'
            x='10'
            y='3'
          />
        </ContentLoader>
      </div>

      <ContentLoader
        height={17}
        primaryColor='#1a1a1a'
        secondaryColor='#2f2f2f'
        speed={2}
        width={400}
        style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
      >
        <rect height='10'
          rx='4'
          ry='40'
          width='117'
          x='3'
          y='6'
        />
      </ContentLoader>
      <ContentLoader
        height={10}
        primaryColor='#FFFB00'
        secondaryColor='#FFAE00'
        speed={2}
        width={400}
        style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
      >
        <rect height='3'
          rx='1'
          ry='7'
          width='105'
          x='4'
          y='0'
        />
      </ContentLoader>
      <div style={{ width: '100%', margin: 'auto', background: '#1a1a1a', borderRadius: '0.5rem' }} >
        <ContentLoader
          height={250}
          primaryColor='#1f1f1f'
          secondaryColor='#2f2f2f'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='117'
            x='50'
            y='15'
          />
          <rect height='4'
            rx='2'
            ry='7'
            width='105'
            x='56'
            y='28'
          />
          <circle cx='25'
            cy='25'
            r='18'
          />
          <rect height='200'
            rx='4'
            ry='4'
            width='580'
            x='5'
            y='50'
          />
        </ContentLoader>
        <ContentLoader
          height={20}
          primaryColor='#1f1f1f'
          secondaryColor='#FFFB00'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='10'
            y='10'
          />
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='80'
            y='10'
          />
          <rect height='10'
            rx='4'
            ry='4'
            width='50'
            x='150'
            y='10'
          />
        </ContentLoader>
        <ContentLoader
          height={16}
          primaryColor='#1a1a1a'
          secondaryColor='#2f2f2f'
          speed={2}
          width={600}
        >
          <rect height='10'
            rx='4'
            ry='4'
            width='400'
            x='10'
            y='3'
          />
        </ContentLoader>
      </div>
    </div>
  </ErrorBoundary>
)

export default FeedLoader
