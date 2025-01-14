import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useOutletContext } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { Colorbtn } from '../Component/Button/ColorButton';
import { Box, Grid, Toolbar, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';

export default function EditAccount() {
  
  const params = useParams();
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const [userId,setUserId]     =  React.useState();
  const [name,setName]         =  React.useState<any>();
  
  useEffect(() => {
    getAccountDetails(params?.id);
  },[params.id]);

  const getAccountDetails = async(id:any) => {
    await axios.get(`/${url}/v1/account/accountbyid/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setName(result.data.data.name);
        setUserId(result.data.data._id);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const alertnotify = (text:string,type:string) => {
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

  const HandleEditAccount = async (id:any) => {
    await axios.patch(`/${url}/v1/account/update/${id}`, 
    {
      "name": name,
      "user_id": id
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/accounts');
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  return (
    <>
      <Box sx={{ marginTop: '0%', borderRadius: '.5rem', marginLeft: {md: '7%'}, width: {xs: '100%', md: '87%'} }}>
        <KeyboardBackspaceIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} onClick = {() => navigate('/accounts')} sx={{cursor: 'pointer'}} />
      </Box>
       <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {md: '7%'}, border: `${theme ? '1px solid white' : ''}` , background: `${theme ? '#183153' : 'white'}` , width: {lg: '80%'} }}>
         <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '87%'} }}>
          <Typography variant="h6" gutterBottom>
            Edit Account
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <label>Account Name</label>
              <TextField
                required
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
              />
            </Grid>
            <Grid item xs={12}>
              <Colorbtn color="primary" onClick={() => HandleEditAccount(userId)}>
                <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                Update
              </Colorbtn>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
