import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../Hooks/useCurrency';
import { useOutletContext } from "react-router-dom";
import { Colorbtn } from '../Component/Button/ColorButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, Grid, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  data: {
    defaultcurr: string;
    email: string;
    id: string;
    name: string;
    type: string;
  };
}

export default function AddAccount() {

  const navigate = useNavigate();
  const {currencyList} = useCurrency();
  const [theme]:any = useOutletContext();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const [currency,setCurrency] = React.useState<any>();

  // Alert notification function, required two parameters / arguments
  // one is for text and another is for alert type

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

 const HandleCreateAccount = async (e:any) => {
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  e.preventDefault();
  await axios.post(`/${url}/v1/account/add`, {
    "user":  accountId?.data?.id,
    "currency": currency,
    "amount": 0
   }, 
   {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify(result.data.message,"success");
      localStorage.setItem("backtoaccount","true");
      navigate('/home');
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
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {md: '7%'}, border: `${theme ? '1px solid white': ''}`, background: `${theme ? '': 'white'}` , width: {lg: '80%'} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '87%'} }}>
         <Typography variant="h6" gutterBottom>Add Account</Typography>
         <Grid container spacing={3}>
          <Grid item xs={12}>
            <label>Currency</label>
            <Select sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setCurrency(e.target.value)} fullWidth>
            {
              currencyList?.map((item:any,index:number) => (
                <MenuItem value={item?.base_code} key={index}>{item?.base_code}</MenuItem>
              ))
            }
            </Select>
          </Grid>
               
          <Grid item xs={12}>
            <Colorbtn color="primary" onClick={(e) => HandleCreateAccount(e)}>
              <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                Submit
              </Colorbtn>
            </Grid>
           </Grid>
       </Box>
      </Toolbar>
    </>
 
  )
}
