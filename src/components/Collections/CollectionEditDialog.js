import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DialogActions, SnackbarContent, Snackbar, Dialog, DialogTitle, Button, TextField, DialogContent, CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { withRouter } from 'react-router'
import wallet from '../../eos/scatter/scatter.wallet.js'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogTitleText: {
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: '#fafafa',
    marginLeft: '2%'
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  input: {
    color: '#fafafa',
    cssUnderline: {
      '&:after': {
        borderBottomColor: '#fafafa'
      }
    },
    marginBottom: '20px',
    fontFamily: 'Gilroy'
  },
  inputRoot: {
    color: '#fafafa'
  },
  inputInput: {
    color: '#fafafa'
  },
  inputUnderline: {
    borderBottomColor: '#fafafa'
  },
  textField: {
    color: '#fafafa',
    flexWrap: 'none',
    fontFamily: 'Gilroy'
  },
  snack: {
    justifyContent: 'center'
  },

spinnerLoader: {
  color: 'white',
  position: 'absolute',
  right: '3%'
}
})

const CollectionEditDialog = ({ collection, classes, dialogOpen, handleDialogClose, history }) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = (msg) => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')

  const handleEditCollection = async () => {
    try {
      setIsLoadingUpdate(true)
      const { eosname, signature } = await wallet.scatter.getAuthToken()
      const params = { name, description, signature, eosname }
      await axios.put(`${BACKEND_API}/collections/${collection._id}`, params)
      setIsLoadingUpdate(false)
      handleSnackbarOpen('Succesfully updated your collection')
      handleDialogClose()
    } catch (err) {
      handleSnackbarOpen('There was a problem updating your collection')
      console.error(err)
    }
  }

  const handleDeleteCollection = async () => {
    try {
      setIsLoadingDelete(true)
      const { eosname, signature } = await wallet.scatter.getAuthToken()
      const params = { signature, eosname }
      await axios.delete(`${BACKEND_API}/collections/${collection._id}`, { data: params })
      history.push(`/${eosname}`)
    } catch (err) {
      handleSnackbarOpen('There was a problem deleting your collection')
      console.error(err)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <SnackbarContent
          className={classes.snack}
          message={snackbarMsg}
        />
      </Snackbar>
      <Dialog open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
        PaperProps={{
          style: {
            backgroundColor: '#0A0A0A',
            borderRadius: '25px',
            boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
            width: '80%',
            padding: '1rem 0.5rem',
            maxWidth: '500px',
            color: '#fafafa'
          }
        }}
        BackdropProps={{
          style: {
            backdropFilter: 'blur(3px)'
          }
        }}
      >
        <DialogTitle className={classes.dialogTitleText}
          id='form-dialog-title'
        >Update {collection.name}</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.textField}
            fullWidth
            onChange={handleNameChange}
            id='name'
            inputProps={{ maxLength: 24, borderBottomColor: '#fafafa' }}
            InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput,
                          underline: classes.inputUnderline
                        },
                        className: classes.input }}
            InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
            label='Name'
            type='text'
          />
          <TextField
            className={classes.textField}
            color='#fafafa'
            fullWidth
            id='description'
            onChange={handleDescriptionChange}
            inputProps={{ maxLength: 140 }}
            InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput
                        },
                        className: classes.input }}
            InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
            label='Description'
            multiline
            type='text'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCollection}
            color='primary'
            fullWidth
            style={{ backgroundColor: '#1a1a1a' }}
          >
            Delete
            {isLoadingDelete && (<CircularProgress size={20}
              className={classes.spinnerLoader}
                                 />
            )}
          </Button>
          <Button onClick={handleEditCollection}
            color='primary'
            fullWidth
            style={{ backgroundColor: '#00eab7' }}
          >
            Update
            {isLoadingUpdate && (<CircularProgress size={20}
              className={classes.spinnerLoader}
                                 />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

CollectionEditDialog.propTypes = {
  collection: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(CollectionEditDialog))
