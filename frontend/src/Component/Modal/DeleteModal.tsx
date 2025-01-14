import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Colorbtn , Closebtn } from '../Button/ColorButton';
import { useOutletContext } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const DeleteModal = ({...props}) => {

  const [theme]:any = useOutletContext();

  const handleCancel = () => {
    props.setDeleteBox(false);
  };
  const handleClose = () => {
    props.setDeleteBox(false);
  };

  const handleProceed = () => {
    props.setDeleteConfirmation(props.val);
  }

  return (
   <>
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.val}
    >
     <DialogTitle sx={{ m: 0, p: 1 , background: 'red', color: 'white' }} id="customized-dialog-title">
       Delete Confirmation ?
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
     </IconButton>
     <DialogContent dividers>
      <Typography gutterBottom className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>
        Are you sure to delete ?
        Once deleted, data will permanently remove from the record
      </Typography>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', color: 'white' }}>
        <Colorbtn autoFocus onClick={handleProceed}>
          Proceed
        </Colorbtn>
        <Closebtn autoFocus onClick={handleCancel}>
          Cancel
        </Closebtn>
      </DialogActions>
      </BootstrapDialog>
    </>   
  );
}

export {DeleteModal};
