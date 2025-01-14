import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Colorbtn } from '../../Component/Button/ColorButton';
import { Grid, MenuItem, Select, TextField, Toolbar } from '@mui/material'

export default function FeeType() {

  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [title,setTitle] = React.useState<string>('');  
  const [description,setDescription] = React.useState<string>('');
  const [status,setStatus] = React.useState<string>('active');

  const HandleSaveDetails = async () => {
    await axios.post(`/${url}/v1/admin/feetype/add`, {
      title,description,status
    }, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify(result.data.message, "Success");
        setTimeout(() => {
          navigate(`/admin/fee-structure`);
        },1000);
      }
    })
    .catch(error => {
      console.log(error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const alertnotify = (text:any,type:any) => {
    if(type == "error") {
      toast.error(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    } else {
      toast.success(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
  }

  return (
  <>
    <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%',md: '7%'}, background: {md: 'white', sm: 'transparent', xs: 'transparent'} , width: {xs: '100%', lg: '89%'} }}> 
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <label htmlFor="Fee Type">Title</label>
          <TextField
            required
            id="title"
            name="title"
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            sx={{border:'1px solid silver', borderRadius:'7px'}}
             inputProps={{
             shrink: true
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <label htmlFor="Fee Type">Description (Optional)</label>
          <TextField
            required
            multiline={true}
            rows={6}
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{border:'1px solid silver', borderRadius:'7px'}}
              inputProps={{
                shrink: true
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <label htmlFor="Status">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value={"active"}>Enable</MenuItem>
            <MenuItem value={"inactive"}>Disable</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={12}>
          <Colorbtn sx={{cursor: 'pointer'}} onClick={() => HandleSaveDetails()}>Save</Colorbtn>
        </Grid>
      </Grid>
    </Toolbar>    
    </>
  )
}
