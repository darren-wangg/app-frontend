import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LineChart from '../../components/Charts/LineChart'
import BarChart from '../../components/Charts/BarChart'
import RadialChart from '../../components/Charts/RadialChart'
import DotSpinner from '../../components/DotSpinner/DotSpinner'
import Footer from '../../components/Footer/Footer'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { withRouter } from 'react-router-dom'
import path from 'path'
import { isSameDay } from 'date-fns'
import UserAvatar from '../../components/UserAvatar/UserAvatar'
import { levelColors } from '../../utils/colors'
import { setCache, getCache } from '../../utils/cache'
import LinesEllipsis from 'react-lines-ellipsis'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  accountErrorHeader: {
    paddingTop: '10vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '2vh',
    color: '#ffffff'
  },
  accountErrorSub: {
    paddingTop: '1.5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.7vh',
    color: '#ffffff'
  },
  avatarImage: {
    width: 100 - theme.spacing(),
    height: 100 - theme.spacing(),
    minHeight: 100 - theme.spacing(),
    minWidth: 100 - theme.spacing(),
    fontSize: '70px',
    borderRadius: '100%',
    margin: '0 25px',
    border: 'solid 3px #DADADA',
    [theme.breakpoints.down('xs')]: {
      fontSize: '50px',
      marginBottom: '6vw',
      borderRadius: '100%',
      width: '70px',
      height: '70px',
      minHeight: '70px',
      minWidth: '70px'
    }
  },
  container: {
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      background: '#2a2a2a'
    }
  },
  cardContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  imgContainer: {
    margin: '0 25px'
  },
  infiniteScroll: {
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    },
    width: 'calc(100vw - 190px)',
    [theme.breakpoints.up('1700')]: {
      width: '100vw'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  name: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '500',
    padding: '0px',
    fontFamily: 'Gilroy',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    }
  },
  page: {
    width: '100%',
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 200,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      backgroundSize: 'contain',
      overflowX: 'hidden'
    },
    flex: 1
  },
  username: {
    color: '#ffffff',
    fontSize: '18px',
    padding: '0px',
    fontFamily: 'Gilroy',
    fontWeight: '100',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  graphContainers: {
    marginTop: '90px',
    marginBottom: '20px',
    [theme.breakpoints.up('xs')]: {
      marginTop: '90px'
    },
    [theme.breakpoints.up('960')]: {
      paddingLeft: '7%',
      marginTop: '90px'
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '15%',
      marginTop: '90px'
    }
  }
})

class Analytics extends Component {
  state = {
    isLoading: true,
    hasError: false,
    userEarnings: [],
    userHoldings: null,
    categoryDistribution: null,
    platformDistribution: null,
    ratingPower: 100
  }

  componentDidMount () {
    this.loadUserData()
    window.Intercom('update')
    window.analytics.page('User')
  }

  componentDidUpdate (prevProps) {
    const prevUser = path.basename(prevProps.location.pathname)
    const currUser = path.basename(this.props.location.pathname)
    if (currUser !== prevUser) {
      // eslint-disable-next-line
      this.setState({
        // eslint-disable-next-line
        avatar: null,
        // eslint-disable-next-line
        eosname: null,
        // eslint-disable-next-line
        fullname: null,
        // eslint-disable-next-line
        quantile: null,
        // eslint-disable-next-line
        username: null,
        // eslint-disable-next-line
        bio: null,
        isLoading: true,
        hasError: false
      })
      this.loadUserData()
    }
  }

 getAllActions = async (voter, start, limit, type, actions) => {
  const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
  try {
    await delay(3000)
    let data = (await axios.get(`https://eos.hyperion.eosrio.io/v2/history/get_actions?&filter=token.yup&account=${voter}&skip=${start}&limit=${limit}&sort=desc&${type}=${voter}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).data
    actions = actions.concat(data.actions)
    if (actions.length >= data.total.value) return actions

    actions = await this.getAllActions(voter, start + limit, limit, type, actions)
    return actions
  } catch (e) {
    console.log(e)
    return actions
  }
}
  getHoldingsUser = async (account, income, outgoing) => {
      try {
        let formattedIncome = []
        let formattedOutgoing = []
        // Checking if ratelimited and missing some incoming transactions
        // If so, remove outgoing transactions that are older than the oldest income
         let oldestOutgoing = outgoing[outgoing.length - 1]
          let oldestIncome = income[income.length - 1]
          if (oldestOutgoing && oldestIncome) {
          if (new Date(oldestOutgoing.timestamp).getTime() < new Date(oldestIncome.timestamp)) {
            outgoing = outgoing.filter(item => !(new Date(item.timestamp) < new Date(oldestIncome.timestamp)))
          }
        }

        income.forEach((data, index) => {
          if (data.act.data.symbol === 'YUP') {
            formattedIncome[index] = { timestamp: new Date(data.timestamp).getTime(), amount: data.act.data.amount, type: 'incoming' }
          }
        })
        outgoing.forEach((data, index) => {
          if (data.act.data.symbol === 'YUP') {
          formattedOutgoing[index] = { timestamp: new Date(data.timestamp).getTime(), amount: data.act.data.amount, type: 'outgoing' }
          }
        })
        let sortedArray = formattedIncome.concat(formattedOutgoing).sort((a, b) => b.timestamp - a.timestamp)
        let dailyData = [[new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), account.balance.YUP]]
        sortedArray.forEach(transaction => {
          if (dailyData.length > 0) {
            if (isSameDay(new Date(transaction.timestamp), dailyData[dailyData.length - 1][0])) {
              dailyData[dailyData.length - 1][1] = transaction.type === 'incoming' ? +(dailyData[dailyData.length - 1][1] - transaction.amount).toFixed(4) : +(dailyData[dailyData.length - 1][1] + transaction.amount).toFixed(4)
            } else {
              dailyData.push([ new Date(new Date(transaction.timestamp).getFullYear(), new Date(transaction.timestamp).getMonth(), new Date(transaction.timestamp).getDate()), transaction.type === 'incoming' ? +(dailyData[dailyData.length - 1][1] - transaction.amount).toFixed(4) : +(dailyData[dailyData.length - 1][1] + transaction.amount).toFixed(4) ])
            }
          }
        })
        this.setState({ isLoading: false, userHoldings: dailyData })
      } catch (err) {
        console.log(err)
      }
  }

  getEarningsUser = async (account, income) => {
      try {
        let sortedArray = []
        income.forEach(payment => {
          if (payment.act.data.memo === 'Yup Curator Rewards') { sortedArray.push([new Date(payment.timestamp).getTime(), payment.act.data.amount]) }
        })
        sortedArray = sortedArray.sort((a, b) => b[0] - a[0])
        let dailyData = [[new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), account.total_claimed_rewards]]
        sortedArray.forEach(transaction => {
          if (dailyData.length > 0) {
            if (isSameDay(new Date(transaction[0]), dailyData[dailyData.length - 1][0])) {
              dailyData[dailyData.length - 1][1] = dailyData[dailyData.length - 1][1] - transaction[1]
            } else {
               dailyData.push([ new Date(new Date(transaction[0]).getFullYear(), new Date(transaction[0]).getMonth(), new Date(transaction[0]).getDate()), dailyData[dailyData.length - 1][1] - transaction[1] ])
            }
          }
        })
        this.setState({ isLoading: false, userEarnings: dailyData })
      } catch (e) {
        console.log(e)
      }
  }
  getDistributions = async (account) => {
    try {
      const data = (await axios.get(`${BACKEND_API}/analytics/distribution/${account}`)).data

      let valuesCat = Object.values(data.categoryDistribution).sort((a, b) => b - a).slice(0, 5)
      let keysCat = Object.keys(data.categoryDistribution).sort((a, b) => data.categoryDistribution[b] - data.categoryDistribution[a]).slice(0, 5)
      let resultCat = []; let i = -1
      let valuesPlat = Object.values(data.platformDistribution).sort((a, b) => b - a).slice(0, 5)
      let keysPlat = Object.keys(data.platformDistribution).sort((a, b) => data.platformDistribution[b] - data.platformDistribution[a]).slice(0, 5)
      let resultPlat = []; let k = -1
     while (valuesCat[++i]) {
      resultCat.push([ keysCat[i], valuesCat[i] ])
     }
     while (valuesPlat[++k]) {
      resultPlat.push([ keysPlat[k], valuesPlat[k] ])
     }
     const entriesCat = new Map(
      resultCat
    )
    const entriesPlat = new Map(
      resultPlat
   )
    const objCat = Object.fromEntries(entriesCat)

    const objPlat = Object.fromEntries(entriesPlat)
      this.setState({ isLoading: false, categoryDistribution: objCat, platformDistribution: objPlat })
    } catch (e) {
      console.log(e)
    }
}

ratingPower = async () => {
  const { account } = this.state
  const MIN_VOTE_LIMIT = 20
  const MID_VOTE_LIMIT = 30
  const MAX_VOTE_LIMIT = 40
  let yupBal = account.balance.YUP
  let maxVoteCount = yupBal > 100 ? MAX_VOTE_LIMIT : yupBal < 0.5 ? MIN_VOTE_LIMIT : MID_VOTE_LIMIT
  let voteCount = 0
  const actionUsage = (await axios.get(`${BACKEND_API}/accounts/actionusage/${account._id}`)).data
  const now = (new Date()).getTime()
  const oneDayInMs = 60 * 60 * 24 * 1000
  if (actionUsage.lastReset + oneDayInMs >= now) {
    voteCount = actionUsage.createVoteCount
  }

  if (maxVoteCount < voteCount) { return 0 }
  this.setState({ isLoading: false, ratingPower: Math.round(((maxVoteCount - voteCount) / maxVoteCount) * 100) })
}
  loadUserData = () => {
    (async () => {
      try {
        const { pathname } = this.props.location
        const username = pathname.split('/')[1]

        const account = (await axios.get(`${BACKEND_API}/levels/user/${username}`)).data
        this.setState({ isLoading: false, account: account })
        let income = await getCache('income:' + account._id, 24 * 60 * 60000)
        let outgoing = await getCache('outgoing:' + account._id, 24 * 60 * 60000)

        if (!outgoing || !outgoing.length) {
          outgoing = await this.getAllActions(account._id, 0, 1000, 'transfer.from', [])
            setCache('outgoing:' + account._id, outgoing)
         }
        if (!income || !income.length) {
         income = await this.getAllActions(account._id, 0, 1000, 'transfer.to', [])
           setCache('income:' + account._id, income)
        }
        this.setState({ totalClaimedRewards: account.total_claimed_rewards })

        await Promise.all([
          this.ratingPower(),
          this.getEarningsUser(account, income),
          this.getHoldingsUser(account, income, outgoing),
          this.getDistributions(account._id)
        ])
      } catch (err) {
        this.setState({ hasError: true, isLoading: false })
      }
    })()
  }

  render () {
    const { classes } = this.props
    const { account, totalClaimedRewards, isLoading, hasError, userEarnings, userHoldings, categoryDistribution, platformDistribution, ratingPower } = this.state

    const influence = account && account.weight
    const quantile = account && account.quantile
    const socialLevelColor = levelColors[quantile]
    const isMirror = account && account.twitterInfo && account.twitterInfo.isMirror
    if (!isLoading && hasError) {
      return (
        <ErrorBoundary>
          <div className={classes.container}>
            <div className={classes.page}>
              <Header />
              <div align='center'>
                <Typography
                  className={classes.accountErrorHeader}
                  color='#ffffff'
                  variant='h1'
                >
                  <strong>
                    Sorry this page is not available.
                  </strong>
                </Typography>
                <Typography
                  className={classes.accountErrorSub}
                  color='#ffffff'
                  variant='h2'
                >
                  The page you're looking for does not exist.
                </Typography>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )
    } else if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
        >
          <DotSpinner />
        </div>
      )
    }
    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.page}>
            <Header />
            <Grid container
              direction='row'
              alignItems='center'
              justify='left'
              className={classes.graphContainers}
            >
              <Grid item>
                <UserAvatar
                  alt={account._id}
                  username={account.username}
                  className={classes.avatarImage}
                  src={account.avatar}
                  style={{ border: `solid 3px ${socialLevelColor}` }}
                />
              </Grid>
              <Grid item>
                <Typography align='left'
                  className={classes.name}
                  color='inherit'
                  display='inline'
                >
                  <LinesEllipsis
                    basedOn='letters'
                    ellipsis='...'
                    maxLine='4'
                    text={account.fullname || account.username || account._id}
                    trimRight
                  />
                </Typography>
                <Typography align='left'
                  className={`${classes.username}`}
                >
                  <span style={{
                    textDecoration: socialLevelColor ? 'none' : 'none',
                    textDecorationColor: socialLevelColor,
                    textDecorationStyle: socialLevelColor ? 'solid' : 'none',
                    fontWeight: isMirror ? '200' : '200',
                    color: isMirror ? '#b1b1b1' : '#ffffff',
                    padding: '0px'
                  }}
                  >
                    @{account.username}
                  </span>
                </Typography>
              </Grid>
              <Grid item
                lg={3}
                md={2}
                xs={0}
              />
            </Grid>

            <Grid container
              direction='row'
              alignItems='center'
              justify='center'
            >
              <Grid item
                lg={2}
                md={1}
                xs={0}
              />
              <Grid item
                lg={4}
                md={5}
                xs={12}
              >
                <BarChart
                  chartData={influence}
                  chartTitle='Influence'
                  color={socialLevelColor}
                />
              </Grid>
              <Grid item
                lg={4}
                md={5}
                xs={12}
              >
                <BarChart
                  chartData={ratingPower}
                  chartTitle='Rating Power'
                  color={'white'}
                  unit='%'
                />
              </Grid>
              <Grid item
                lg={2}
                md={1}
                xs={0}
              />

              <Grid item
                lg={2}
                md={1}
                xs={0}
              />
              <Grid item
                lg={4}
                md={5}
                xs={12}
              >
                <LineChart
                  headerNumber={totalClaimedRewards}
                  chartData={{ name: 'Earnings', data: userEarnings }}
                  chartTitle='Earnings'
                />
              </Grid>
              <Grid item
                lg={4}
                md={5}
                xs={12}
              >
                <LineChart
                  headerNumber={account.balance.YUP}
                  chartData={{ name: 'Holdings', data: userHoldings }}
                  chartTitle='Holdings'
                />
              </Grid>
              <Grid item
                lg={2}
                md={1}
                xs={0}
              />
            </Grid>

            <Grid container
              direction='row'
              alignItems='center'
              justify='center'
            >
              <Grid item
                xs={6}
                md={5}
                lg={4}
              >
                <RadialChart
                  chartData={platformDistribution}
                  colors={['#1DA1F2', '#FF0000', '#FF5700', '#00EAB7']}
                  className={classes}
                  chartTitle='Platform Distribution'
                />
              </Grid>
              <Grid item
                xs={6}
                md={5}
                lg={4}
              >
                <RadialChart
                  chartData={categoryDistribution}
                  className={classes}
                  chartTitle='Categories Distribution'
                />
              </Grid>
            </Grid>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { account: ethAccount } = state.ethAuth
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account

  const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
  const twitterInfo = cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)
  let account = twitterInfo || scatterIdentity || state.ethAccount
  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  const eosname = account && account.name
  return {
    level: state.socialLevels.levels[eosname] || {
      isLoading: true,
      error: false,
      levelInfo: {}
    },
    account,
    push: state.scatterInstallation.push
  }
}

Analytics.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Analytics)))
