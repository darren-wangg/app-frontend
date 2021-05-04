import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Grid, Typography } from '@material-ui/core'
import CircleLoader from 'react-spinners/CircleLoader'

const styles = theme => ({
    avatarImage: {
      width: 100 - theme.spacing(),
      height: 100 - theme.spacing(),
      minHeight: 100 - theme.spacing(),
      minWidth: 100 - theme.spacing(),
      fontSize: '70px',
      marginTop: '0px',
      marginBottom: '-4px',
      borderRadius: '100%',
      border: 'solid 3px #DADADA',
      position: 'absolute',
      [theme.breakpoints.down('xs')]: {
        fontSize: '50px',
        marginLeft: '25px',
        marginBottom: '6vw',
        borderRadius: '100%',
        width: '70px',
        height: '70px',
        minHeight: '70px',
        minWidth: '70px'
      }
    },
    bio: {
      color: '#AAAAAA',
      fontSize: '12px',
      padding: '0px',
      marginTop: theme.spacing(1),
      fontFamily: 'Gilroy',
      fontWeight: '100',
      display: 'inherit',
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        display: 'none'
      }
    },
    card: {
      paddingTop: theme.spacing(-10),
      paddingBottom: theme.spacing(-10),
      background: 'white',
      backgroundSize: 'cover',
      margin: 'auto',
      marginBottom: '20px',
      marginLeft: '2rem',
      maxWidth: '100%',
      position: 'relative',
      borderRadius: '0.5rem',
      border: '0px solid #ffffff',
      boxShadow: '20px 20px 20px 0px rgb(255 255 255 / 2%), -2px -2px 20px rgb(0 0 0 / 3%), inset 12px 3px 20px 0px rgb(255 255 255 / 3%), inset -3px -7px 17px 0px #0404044a, 5px 5px 9px 0px rgb(255 255 255 / 5%), -20px -20px 12px rgb(0 0 0 / 3%), inset 1px 1px 6px 0px rgb(255 255 255 / 2%), inset -1px -1px 2px 0px #0404040f',
      backgroundColor: '#1b1b1ba1',
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(10),
        marginBottom: '0px',
        width: '100%'
      }
    },
    content: {
      color: 'black'
    },
    eos: {
      display: 'none'
    },
    hidden: {
      display: 'none'
    },
    largeStat: {
      color: '#ffffff',
      fontSize: '28px',
      padding: '0px',
      fontFamily: 'Gilroy',
      fontWeight: '500',
      marginRight: '5px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '22px',
        width: '2rem'
      }
    },
    LinearProgress: {
      height: '3px'
    },
    minimize: {
      width: '42px',
      height: '42px',
      minWidth: '42px',
      minHeight: '42px',
      fontSize: '20px',
      [theme.breakpoints.down('xs')]: {
        width: '30px',
        height: '30px',
        minWidth: '30px',
        minHeight: '30px',
        fontSize: '15px'
      }
    },
    minimizeCard: {
      maxHeight: '50px',
      transition: 'max-height 0.2s linear',
      overflow: 'hidden'
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

    chart: {
      fontSize: '28px',
      fontWeight: '500',
      marginBottom: '10px',
      fontFamily: 'Gilroy',
      [theme.breakpoints.down('xs')]: {
        fontSize: '20px'
      }
    },
    chartheader: {
      padding: '2rem'
    },
    profileDetails: {
      ...theme.mixins.gutters(),
      paddingBottom: theme.spacing(1),
      boxShadow: 'none',
      maxHeight: '250px',
      height: '140px',
      display: 'inline-grid',
      width: '100%',
      position: 'relative',
      marginLeft: '100px',
      [theme.breakpoints.down('xs')]: {
        paddingTop: '10px',
        marginLeft: '100px',
        display: 'block',
        height: '100px'
      }
    },
    profileStats: {
      marginLeft: '0px',
      padding: '0px 0rem',
      width: '100%',
      flexWrap: 'nowrap',
      [theme.breakpoints.down('xs')]: {
        padding: '0px 2rem 0px calc(2rem - 12px)'
      }
    },
    text: {
      color: '#ffffff',
      fontSize: '12px',
      padding: '0px',
      fontFamily: 'Gilroy',
      fontWeight: '100',
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px'
      }
    },
    text2: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '500',
      fontFamily: 'Gilroy',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px'
      }
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
    }
  })

const DonutChart = (props) => {
  const color = '#00EAB7'
  const { classes, chartData, chartTitle } = props

  if (chartData && chartData.data) {
    const chart = {
      series: [Number(chartData.twitter.toFixed(2)), Number(chartData.youtube.toFixed(2)), Number(chartData.reddit.toFixed(2)), Number(chartData.general.toFixed(2))],
      dataLabels: {
        enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '55%'
          }
        }
      },
      fill: {
        type: 'gradient'
      },
      stroke: {
        colors: undefined
      },
      yaxis: {
        show: false
      },
      labels: ['Twitter', 'Youtube', 'Reddit', 'General'],
      legend: {
        position: 'bottom'
      }
    }
 return (
   <Card className={`${classes.card}`}>
     <div className='mixed-chart'
       style={{ marginBottom: '90px' }}
     >
       <div className={classes.chartheader} >
         <Typography align='left'
           className={classes.chart}
           style={{ color: 'white' }}
         >
           {chartTitle}
         </Typography>
       </div>
       <Chart
         options={chart}
         series={chart.series}
         type='donut'
         width='100%'
       />
     </div>
     <FontAwesomeIcon icon='coffee' />
   </Card>)
} else {
    return (<Card className={`${classes.card}`}>

      <div className='mixed-chart'>
        <div className={classes.chartheader} >
          <Typography align='left'
            className={classes.chart}
            style={{ color: 'white' }}
          >
            {chartTitle}
          </Typography>
        </div>
        <Grid container
          justify='center'
          style={{ margin: '70px 0 110px 0' }}
        >
          <CircleLoader loading
            color={color}
          />
        </Grid>
      </div>
    </Card>)
  }
}

DonutChart.propTypes = {
    classes: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
    chartTitle: PropTypes.string.isRequired
  }
export default withStyles(styles)(DonutChart)
