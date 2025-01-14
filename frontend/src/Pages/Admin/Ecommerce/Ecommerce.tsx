import axios from 'axios';
import Card from 'react-credit-cards-2';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Grid, TextField, Typography } from '@mui/material';
import { Colorbtn } from '../../../Component/Button/ColorButton';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { Backdrop, Box,CardContent, CircularProgress, Stack } from '@mui/material';

export default function Ecommerce() {

  const params = useParams();
  const navigate = useNavigate();
  const [open,setopen] = React.useState(false);
  const [amount,setAmount] = React.useState<number>(0);
  const [currency,setCurrency] = React.useState<any>('');
  const [userDetails,setUserDetails] = React.useState<[]>();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    getAmount();
  },[params?.id])

  const handleClose = () => {
    setopen(true);
  }

  const [state, setState] = React.useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  }); 

  useEffect(() => {
    getUserDetails();
  },[]);

  const getUserDetails = async () => {
    await axios.post(`/${url}/v1/user/auth`,{},{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
     })
    .then(result => {
      if(result.data.status == 201) {
        setUserDetails(result.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  const getAmount = async () => {
    await axios.get(`/${url}/v1/ecommerce/${params?.id}`, 
      { 
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       }
      })
      .then(result => {
        if(result.data.status == "201") {
          setAmount(result.data.data.amount);
          setCurrency(result.data.data.currency);
        }
      })
      .catch(error => {
        console.log("error", error);
      })
  }

  const HandleSubmitDetails = async () => {
    if(state.name == "" || state.number == "" || state.expiry == "" || state.cvc == "") {
      alert("Please fill all of the fields");
    } else {
      setopen(true);
      await axios.post(`/${url}/v1/itiopay/pay`, {
        userData: userDetails,
        amount: amount,
        currency: currency,
        cardsDetails: state
      })
      .then(result => {
        if(result.data.status == 201) {
          window.location.href = `${result.data.data}`;
        }
      })
      .catch(error => {
        setopen(false);
        console.log(error);
      })
    }
  }

  const handleInputChange = (evt:any) => {
    const { name, value } = evt.target;
    if(name == "expiry") {
      const bvalue = formatExpirationDate(value);
      setState((prev) => ({ ...prev, [name]: bvalue }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  }

  function clearNumber(value = "") {
    return value.replace(/\D+/g, "");
  }

  function formatExpirationDate(value:any) {
    const clearValue = clearNumber(value);
  
    if (clearValue.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }
  
    return clearValue;
  }

  const handleInputFocus = (evt:any) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  return (
   <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Box sx={{marginTop: {md: '1px'} }}>
      <Typography>
        <Colorbtn onClick={() => navigate('/ecommerce/list')} sx={{marginBottom: '20px'}}>
         <Grid sx={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
          <Grid><ArrowBackIosRoundedIcon /></Grid>
          <Grid>back</Grid>
         </Grid>
        </Colorbtn>
      </Typography>
      <Grid sx={{display: 'flex', flexDirection: 'row', borderLeft: '3px solid #5DADE2', borderRight: '3px solid #5DADE2',  justifyContent: 'center', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.6)' }}>
        <CardContent
          component={Stack}
          spacing={3}
          sx={{ height: "auto", justifyContent: "center", padding: 0 }}
        >
        <Card
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
        />
          <TextField
            label="Name"
            name="name"
            type="text"
            size="medium"
            InputLabelProps={{
             shrink: true,
              style: {
              color: `black`
             }
            }}
            value={state.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder='Name'
          />
          <TextField
            label="Card Number"
            name="number"
            type="tel"
            size="medium"
            InputLabelProps={{
              shrink: true,
              style: {
                color: `black`
              }
            }}
            inputProps={{ maxLength: 16 }}
            value={state.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
         
        <Box sx={{ display: "flex", gap: 3 }}>

          <TextField
            label="CVV"
            name="cvc"
            type="tel"
            size="medium"
            InputLabelProps={{
             shrink: true,
              style: {
              color: `black`,
             }
            }}
            value={state.cvc}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ maxLength: 3 }}
          />
        
          <TextField
            label="Expiry Date"
            name="expiry"
            type="tel"
            size="medium"
            InputLabelProps={{
             shrink: true,
              style: {
               color: `black`
              }
            }}
            value={state.expiry}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ maxLength: 5 , min: `${new Date().toISOString().split('T')[0]}` }}
          />
          
        </Box>

        <Colorbtn size="large" sx={{ fontWeight: "bold" }} onClick={() => HandleSubmitDetails()}>Submit</Colorbtn>

        </CardContent>
      </Grid>
    </Box>
    </>
  )
}
