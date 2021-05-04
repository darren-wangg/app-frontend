import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DialogActions, SnackbarContent, Snackbar, Dialog, DialogTitle, Button, TextField, DialogContent, DialogContentText, CircularProgress, Link } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import wallet from '../../eos/scatter/scatter.wallet.js'

const BACKEND_API = process.env.BACKEND_API
const WEB_APP_URL = process.env.WEB_APP_URL

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
    left: 450
  }
})

const CollectionPostDialog = ({ postid, classes, dialogOpen, handleDialogClose }) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newCollectionInfo, setNewCollectionInfo] = useState({})

  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = (msg) => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')

  const handleCreateNewCollection = async () => {
    try {
      setIsLoading(true)
      const { eosname, signature } = await wallet.scatter.getAuthToken()
      const params = { name, description, signature, eosname, postId: postid }
      const { data } = await axios.post(`${BACKEND_API}/collections`, params)
      setNewCollectionInfo(data)
      setIsLoading(false)
      handleSnackbarOpen(`Succesfully created ${name}`)
      handleDialogClose()
    } catch (err) {
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
        <Link href={`${WEB_APP_URL}/collections/${newCollectionInfo.name}/${newCollectionInfo._id}`}>
          <SnackbarContent
            className={classes.snack}
            message={snackbarMsg}
          />

        </Link>
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
        >New Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Start here to make a new collection
          </DialogContentText>
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
          <Button onClick={handleCreateNewCollection}
            color='primary'
            fullWidth
            style={{ backgroundColor: '#00eab7', textTransform: 'none' }}
          >
            Create Collection
            {isLoading && (<CircularProgress size={20}
              className={classes.spinnerLoader}
                           />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

CollectionPostDialog.propTypes = {
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired
}

export default withStyles(styles)(CollectionPostDialog)
