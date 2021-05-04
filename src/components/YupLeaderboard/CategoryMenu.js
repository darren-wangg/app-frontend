import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import { MenuItem, InputLabel } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { parseSettings } from '../../utils/yup-list'
import { connect } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    marginRight: '10px',
    [theme.breakpoints.down('xs')]: {
      minWidth: 20
    }
  },
  textField: {
    fontFamily: 'Gilroy',
    color: 'white',
    fontSize: '12px'
  },
  menu: {
    fontFamily: 'Gilroy', fontSize: '11px'
  }
})

class CategoryMenu extends Component {
  handleChange = (e) => {
    const { config, history, listOptions } = this.props
    const newCategory = e.target.value
    const newSettings = parseSettings({
      ...config,
      category: newCategory
    }, listOptions)

    const { site, subject, category } = newSettings
    const levelsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(levelsUrl)
  }

  render () {
    const { classes, settings } = this.props
    const { category: currCategory, subjCats } = settings

    return (
      <ErrorBoundary>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='age-native-helper'
            style={{ opacity: '0.5', fontSize: '12px' }}
          >Category</InputLabel>
          <Select
            label='Age'
            className={classes.textField}
            inputProps={{
              className: classes.textField
            }}
            MenuProps={{
             getContentAnchorEl: null,
             anchorOrigin: {
               vertical: 'bottom'
             }
           }}
            value={currCategory.name}
            onChange={this.handleChange}
            size='small'
          > {
            subjCats.map(cat => (
              <MenuItem
                key={cat.name}
                className={classes.menu}
                value={cat.name}
              > { cat.displayName } </MenuItem>
            ))
          }
          </Select>
        </FormControl>
      </ErrorBoundary>
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
  return { config, settings, listOptions }
}

CategoryMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(CategoryMenu)))
