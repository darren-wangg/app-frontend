import React, { Component } from 'react'
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
// import LinesEllipsis from 'react-lines-ellipsis'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Typography from '@material-ui/core/Typography'
import LinesEllipsis from 'react-lines-ellipsis'
import ReactPlayer from 'react-player'

const nftPattern = new RegExp('^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com/token/|www.rarible.com/token/|http://rarible.com/token/|https://rarible.com/*/|opensea.io/assets/|www.opensea.io/assets/|http://opensea.io/assets/|https://opensea.io/assets/|superrare.co/|www.superrare.co/|http://superrare.co/|https://superrare.co/|foundation.app/*/|www.foundation.app/*/|http://foundation.app/*/|https://foundation.app/*/|zora.co/|www.zora.co/|http://zora.co/|https://zora.co/)')
const { AUDIUS_EMBED } = process.env

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      margin: '2px 0px'
    }
  },
  image: {
    width: '60px',
    heigth: 'auto',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    objectFit: 'cover',
    [theme.breakpoints.down('md')]: {
      width: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '35px'
    }
  },
  nftArt: {
    maxWidth: '80px',
    maxHeight: '80px',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '20%',
    objectFit: 'cover',
    overflow: 'hidden'
  },
  caption: {
    textAlign: 'left',
    fontSize: '18px',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  rank: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem'
    }
  },
  audiusPost: {
    [theme.breakpoints.down('xs')]: {
      borderRadius: '0px'
    }
  }
})

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FAFAFA' }
  },
  typography: {
    useNextVariants: true,
    fontFamily: `'Gilroy', 'Helvetica', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    subtitle1: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '1.1rem'
    }
  }
})

class ListPreview extends Component {
  state = {
    faviconURL: null,
    faviconURLFallback: null
  }

  componentDidMount () {
    const { previewData } = this.props
    if (previewData && previewData.url !== null) {
      let url = 'https://api.faviconkit.com/' + this.trimURLStart(this.trimURLEnd(previewData.url)) + '64'
      let fallbackUrl = this.trimURLEnd(previewData.url) + 'favicon.ico'
      this.setState({
        faviconURL: url,
        faviconURLFallback: fallbackUrl
      })
    }
  }

  cutUrl (inUrl) {
    if (inUrl == null) { return '' }
    const protocol = 'https://'
    const pro2 = 'http://'

    if (inUrl.startsWith(protocol)) {
      inUrl = inUrl.substring(protocol.length)
    } else if (inUrl.startsWith(pro2)) {
      inUrl = inUrl.substring(pro2.length)
    }

    const web = 'www.'

    if (inUrl.startsWith(web)) {
      inUrl = inUrl.substring(web.length)
    }

    if (inUrl.endsWith('/')) {
      inUrl = inUrl.substring(0, inUrl.length - 1)
    }

    return inUrl
  }

  trimURLEnd (link) {
    let count = 0
    for (let i = 0; i < link.length; i++) {
      if (link.charAt(i) === '/') {
        count++
        if (count === 3) {
          return link.substring(0, i + 1)
        }
      }
    }
  }

  trimURLStart (link) {
    let count = 0
    for (let i = 0; i < link.length; i++) {
      if (link.charAt(i) === '/') {
        count++
        if (count === 2) {
          link = link.substring(i + 1, link.length)
        }
      }
    }
    if (link.substring(0, 4) === 'www.') {
      link = link.substring(4, link.length)
    }
    return link
  }

  addDefaultVid = (e) => {
    e.target.onerror = null
    this.setState({
      vidBroken: true
    })
  }

  addDefaultSrc = (e) => {
    e.target.onerror = null
    e.target.src = this.state.faviconURL || this.state.faviconURLFallback
    e.target.style = { border: 'none !important' }
  }

  render () {
    const { previewData, url, image, title, classes, rank } = this.props

    const AudiusComp = () => (
      <div className={classes.audiusPost}>
        <iframe src={`${AUDIUS_EMBED}?id=${previewData.trackId}&ownerId=${previewData.ownerId}&flavor=compact`}
          allow='encrypted-media'
          width='100%'
          height='120'
          style={{ border: 'none' }}
        />
      </div>
    )

    // TODO: Adjust this for Yup lists, should only get quantile for category and website being compared
    const isNftArt = url && url.match(nftPattern)
    const isAudiusPost = previewData && (previewData.trackId && previewData.ownerId)

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={theme}>
          <Fade in
            timeout={100}
          >
            <Grid
              container
              direction='row'
              justify='flex-start'
              alignItems='center'
              className={classes.container}
              spacing={3}
            >
              <Grid item
                xs={1}
              >
                <Typography
                  variant='subtitle1'
                  className={classes.rank}
                  color='primary'
                >
                  {rank}
                </Typography>
              </Grid>
              {isAudiusPost &&
                <Grid item
                  sm={11}
                >
                  <AudiusComp />
                </Grid>
              }
              {previewData && (previewData.url) && !isAudiusPost &&
                <>
                  <Grid item
                    xs={2}
                  >
                    {(image && image.includes('nft.mp4'))
                    ? <ReactPlayer
                      className={classes.nftArt}
                      target='_blank'
                      url={image}
                      playing
                      muted
                      loop
                      playsinline
                      light={this.state.vidBroken ? (this.state.faviconURL || this.state.faviconURLFallback) : ''}
                      onError={this.addDefaultVid}
                      />
                    : <img src={image || this.state.faviconURL || this.state.faviconURLFallback}
                      className={isNftArt ? classes.nftArt : classes.image}
                      onError={this.addDefaultSrc}
                      alt='favicon'
                      />
                  }
                  </Grid>
                  <Grid item
                    xs={9}
                    sm={9}
                  >
                    <a href={previewData.url}
                      target='_blank'
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography variant='subtitle1'
                        className={classes.caption}
                        color='primary'
                      >
                        <LinesEllipsis
                          basedOn='letters'
                          ellipsis='...'
                          maxLine='1'
                          text={title || previewData.url}
                          trimRight
                        />
                      </Typography>
                    </a>
                  </Grid>
                </>
              }
            </Grid>
          </Fade>
        </MuiThemeProvider>
      </ErrorBoundary>
    )
  }
}

ListPreview.propTypes = {
  previewData: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  rank: PropTypes.number
}

export default (withStyles(styles)(ListPreview))
