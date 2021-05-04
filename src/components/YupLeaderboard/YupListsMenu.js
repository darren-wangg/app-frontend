import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core'
import CategoryMenu from './CategoryMenu'
import SiteMenu from './SiteMenu'
import SubjectMenu from './SubjectMenu'
import PropTypes from 'prop-types'
import { parseSettings } from '../../utils/yup-list'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import cap from 'lodash/capitalize'
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import YupListSearchBar from './YupListSearchBar'
import isEqual from 'lodash/isEqual'

const styles = theme => ({
  infoCard: {
    borderRadius: '1px',
    border: '1px solid #e6e6e6',
    boxShadow: '0px 0px 0px white',
    backgroundColor: '#060606',
    textAlign: 'left',
    marginLeft: '0%',
    marginRight: '0%',
    marginBottom: '10px',
    marginTop: '5px',
    padding: '3%'
  },
  infoContainer: {
    margin: '10px auto',
    maxHeight: '200px',
    width: '100%'
  },
  rootContainer: {
    margin: '45px auto 0px auto',
    width: '70%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'hidden',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      marginTop: '30px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '85%'
    }
  },
  Tab: {
    minWidth: '60px'
  },
  infoHeader: {
    marginTop: '10px',
    marginBottom: '10px',
    fontFamily: 'Gilroy'
  },
  MuiTab: {
    minWidth: '60px'
  },
  listTitle: {
    fontSize: '32px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '28px'
    }
  },
  hidden: {
    visibility: 'hidden'
  },
  minimizeTitle: {
    fontSize: '24px'
  },
  minimizeCard: {
    maxHeight: '60px',
    transition: 'max-height 0.15s linear',
    overflow: 'hidden'
  },
  filters: {
    marginTop: '15px'
  },
  search: {
    height: '60px',
    justify: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  subTitle: {
    color: '#a0a0a0',
    fontSize: '14px',
    fontWeight: 100,
    fontFamily: 'Gilroy',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  }
})

const theme = createMuiTheme({
  palette: {
    primary: { main: '#FAFAFA' },
    secondary: { main: '#ffffff' },
    third: { main: '#1A1A1A' },
    type: 'dark'
  },
  overrides: {
    MuiButton: {
      raisedSecondary: {
        color: '#2A2A2A'
      }
    }
  },
  button: {
    width: 16,
    height: 16,
    padding: 5
  },
  icon: {
    width: 25,
    height: 25,
    color: 'primary'
  },
  reactPlayer: {
    width: '100%'
  }
})

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <ErrorBoundary>
      <Typography
        component='div'
        role='tabpanel'
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    </ErrorBoundary>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class YupListsMenu extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }
  render () {
    const { classes, settings, isMinimize } = this.props

    const { site, preposition, category, subject } = settings
    const siteMeta = site.altName || cap(site.displayName)
    const catMeta = category.altName || cap(category.displayName)
    const subjectMeta = subject.altName || cap(subject.displayName)

    const siteText = preposition ? `${preposition} ${siteMeta}` : ''
    const customMetaTitle = `${catMeta} ${subjectMeta} ${siteText}| Yup`
    // TODO: The title doesn't change
    const defaultMetaTitle = 'Yup • Rate the Web. Earn & Influence.'
    const metaTitle = site.length ? customMetaTitle : defaultMetaTitle

    const catTitleText = category.altName || cap(category.displayName)
    const subjTitleText = subject.altName || (subject.displayName.includes('NFT') ? subject.displayName : cap(subject.displayName))
    const siteTitleText = site.altName || cap(site.displayName)
    const prepTitleText = preposition ? `${preposition} ${siteTitleText}` : ''
    const dynamicListTitle = `${catTitleText} ${subjTitleText} ${prepTitleText}`

    const hidden = isMinimize ? classes.hidden : null
    const listTitle = isMinimize ? classes.minimizeTitle : classes.listTitle
    const minimizeCard = isMinimize ? classes.minimizeCard : null

    return (
      <Fade in
        timeout={2000}
      >
        <div className={classes.rootContainer}>
          <Helmet>
            <meta charSet='utf-8' />
            <title> {metaTitle} </title>
            <meta name='description'
              content={dynamicListTitle}
            />
          </Helmet>
          <div className={`${classes.infoContainer} ${minimizeCard}`}>
            <MuiThemeProvider theme={theme}>
              <Grid container
                alignItems='flex-start'
                direction='column'
                spacing={24}
                tourname='LeaderboardMenu'
              >
                <Grid item>
                  <Typography
                    className={classes.subTitle}
                    style={{ }}
                  > LEADERBOARD
                  </Typography>
                  <Typography
                    className={listTitle}
                    style={{ color: '#fafafa', fontWeight: 600, fontFamily: 'Gilroy', letterSpacing: '0.1rem' }}
                  > {dynamicListTitle}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container
                    alignItems='center'
                    direction='row'
                    justify='space-between'
                    spacing={1}
                    className={`${classes.filters} ${hidden}`}
                    tourname='ListsFilters'
                  >
                    <Grid item
                      xs={12}
                      sm={8}
                      md={9}
                      lg={8}
                    >
                      <Grid container
                        spacing={2}
                      >
                        <Grid
                          item
                        >
                          <CategoryMenu />
                        </Grid>
                        <Grid
                          item
                        >
                          <SubjectMenu />
                        </Grid>
                        <Grid
                          item
                        >
                          <SiteMenu />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      sm={3}
                      md={3}
                      className={classes.search}
                    >
                      <YupListSearchBar />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </div>
        </div>
      </Fade>
  )
  }
}

const mapStateToProps = (state) => {
  const { router, yupListSettings } = state
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  }
  const { listOptions } = yupListSettings
  const settings = parseSettings(config, listOptions)
  return { settings }
}

YupListsMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(YupListsMenu))
