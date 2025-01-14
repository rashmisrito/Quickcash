import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Colorbtn, DisabledBtn } from '../../Component/Button/ColorButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Backdrop, Box, CircularProgress, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import getSymbolFromCurrency from 'currency-symbol-map';

// Jwtpayload refers for type interface

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

export default function Confirm() {

  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(540);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [theme]:any =  useOutletContext();

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const progress = (540 - timeLeft) / 540;

  // This function is used for convert seconds into time format (MM:SS) -> MM: Minutes , SS: Seconds

  function format(time:any) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
  
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + String(mins).padStart(2, '0') + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  const [loading,setLoading] = useState<boolean>(false);

  // This arrow function will request/get wallet address for requested coin

  const HandleWalletRequest = async () => {
    setLoading(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/walletaddressrequest/add`, {
      "user": accountId?.data?.id,
      "coin": `${localStorage.getItem('ccoin')}_TEST`,
      "email": accountId?.data?.email
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
     if(result.data.status == "201") {
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('cwalletAddress', result?.data?.data);
      },300)
    }
    })
    .catch(error => {
      console.log("error", error);
      setLoading(false);
      alertnotifyTwo(error.response.data.message,"error");
    });
  }

  // This arrow function will create crypto transaction record into the table

  const proceedBuyCrypto = async() => {
    setLoading(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/crypto/add`, {
     "user": accountId?.data?.id,
     "coin": `${localStorage.getItem('ccoin')}_TEST`,
     "paymentType": "Bank Transfer",
     "amount": localStorage.getItem('camount'), // @ts-ignore
     "noOfCoins": parseFloat(localStorage.getItem('cnoofcoins')).toFixed(7),
     "side": localStorage.getItem('cside'),
     "walletAddress": localStorage.getItem('cwalletAddress'),
     "currencyType": localStorage.getItem('ccurrency'), // @ts-ignore
     "fee": parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees')),
     "status": "pending"
    }, 
    {
     headers: 
     {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
    })
    .then(result => {
    if(result.data.status == "201") {
      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem('camount');
        localStorage.removeItem('ccoin');
        localStorage.removeItem('ccryptofees');
        localStorage.removeItem('cexchangefees');
        localStorage.removeItem('cnoofcoins');
        localStorage.removeItem('crate');
        localStorage.removeItem('cside');
        localStorage.removeItem('cwalletAddress');
        window.location.href = `/crypto/complete/${result?.data?.data?._id}`;
      },1000);
    }
    })
    .catch(error => {
      console.log("error", error);
      setLoading(false);
      alertnotifyTwo(error.response.data.message,"error");
    });
  } 

  const proceedSellCrypto = async() => {
    // @ts-ignore
    const amountCheck =  parseFloat(localStorage.getItem('sellamount')) - (parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees')));
    if(Math.sign(amountCheck) == -1) {
      alert("Amount should not be in negative");
    } else {
      setLoading(true);
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      await axios.post(`/${url}/v1/crypto/sell`, {
      "user": accountId?.data?.id,
      "coin": `${localStorage.getItem('sellcoin')}_TEST`, // @ts-ignore
      "amount": parseFloat(localStorage.getItem('sellamount')), // @ts-ignore
      "noOfCoins": parseFloat(localStorage.getItem('sellnoofcoins')),
      "side": "sell",
      "currencyType": localStorage.getItem('sellcurrency'), // @ts-ignore
      "fee": parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees')),
      "status": "pending"
      }, 
      {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
      })
      .then(result => {
      if(result.data.status == "201") {
        setTimeout(() => {
          setLoading(false);
          localStorage.removeItem('camount');
          localStorage.removeItem('ccoin');
          localStorage.removeItem('ccryptofees');
          localStorage.removeItem('cexchangefees');
          localStorage.removeItem('cnoofcoins');
          localStorage.removeItem('crate');
          localStorage.removeItem('cside');
          localStorage.removeItem('cwalletAddress');

          localStorage.removeItem('sellcoin');
          localStorage.removeItem('sellcurrency');
          localStorage.removeItem('sellnoofcoins');
          localStorage.removeItem('sellamount');
          window.location.href = `/crypto/complete/${result?.data?.data?._id}`;
        },1000);
      }
      })
      .catch(error => {
        console.log("error", error);
        setLoading(false);
        alertnotifyTwo(error.response.data.message,"error");
      });
      }
    } 

    // This arrow function for alert notification where it could be error alert or success alert

    const alertnotifyTwo = (text:any,type:any) => {
      if(type == "error") {
        toast.error(text, {
          position: "top-center",
          autoClose: 7000,
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
          autoClose: 7000,
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
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container sx={{ display: 'flex' , background: {xs: `${theme ? '#183153': 'white'}`}, color: `${theme ? 'white':' black'}`, flexDirection: 'column' , border: `${theme ? '1px solid white' : '1px solid white'}`, boxShadow: `${theme ? '': '2px 10px 10px #8888883b'}`, borderRadius: '.5rem', p: '10px',  marginTop: { xs: '-10px', md: '20px' }, marginLeft: {xs: '0%',md: '2%'},width: {xs: '100%', lg: '95%'} }}>
        {/* @ts-ignore */}
        <Typography variant='h5' sx={{padding: '16px',textAlign: 'center', fontWeight: '700'}}>CRYPTO {localStorage.getItem('cside').toUpperCase()}</Typography>
        <Typography sx={{ padding: '10px', textAlign: 'center', color: `${theme ? 'white': 'black'}` }}>Step: 2 of 3</Typography>
        <Typography variant='h6' sx={{textAlign: 'center'}}>Confirm {localStorage.getItem('cside')?.toUpperCase()}</Typography>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '12px', marginTop: '12px'}}>
          <Grid sx={{ border: '3px solid blue', width: '10%', height:'5px', borderRadius: '12px', background: 'blue' }}></Grid>
          <Grid sx={{ border: '3px solid blue', width: '10%', height:'5px', borderRadius: '12px', background: '#DDD3FD' }}></Grid>
          <Grid sx={{ border: '3px solid #DDD3FD', width: '10%', height:'5px', borderRadius: '12px', background: '#DDD3FD' }}></Grid>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', marginTop: '20px', justifyContent: 'center', alignItems:'center', padding: '0%', marginBottom: {xs:'10px', md: '0px'}, fontSize: {xs: '12px', md: '15px'} }}>
          <Grid sx={{ width: '50%' }}>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '3px' }}>
              <Grid>Time Remaining:</Grid>
              <Grid>{timeLeft != 0 ? format(timeLeft) : <span style={{ color: 'red' }}>Expired</span>}</Grid>
            </Grid>
            <Grid>
              <div style={{ backgroundColor: "#ddd", height: 5, borderRadius: '20px' }}>
                <div
                  style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    backgroundColor: "#FFAF30",
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', padding: '6%', marginBottom: {xs:'10px', md: '0px'}, fontSize: {xs: '12px', md: '15px'} }}>
          <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
            <Grid item xs={10} sm={5} md={5} sx={{ marginLeft: '10px',background: `${theme ? '' : '#F5F6FA'}`, border: `${theme ? '1px solid white': ''}`, borderRadius: '5px', padding: '25px' }}>
            {
              localStorage.getItem('cside') == "buy" ?
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <Grid>Amount</Grid>
                <Grid sx={{ }}>{localStorage.getItem('camount')} <span style={{ color: '#635BFE' }}>{localStorage.getItem('ccurrency')}</span></Grid>
                {/* @ts-ignore */}
                <Grid>Fees = {parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees'))} {localStorage.getItem('ccurrency')}</Grid>
                {/* @ts-ignore */}
                <Grid>Total Amount = {parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees')) + parseFloat(localStorage.getItem('camount'))} {localStorage.getItem('ccurrency')}</Grid>
              </Grid>
              :
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <Grid>No Of Coins</Grid>
                <Grid sx={{ }}>{localStorage.getItem('sellnoofcoins')} <span style={{ color: '#635BFE' }}>{localStorage.getItem('sellcoin')}</span></Grid>
                {/* @ts-ignore */}
                <Grid>Fees = {parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees'))} {localStorage.getItem('sellcurrency')}</Grid>
               {/* @ts-ignore */}
               <Grid>Amount for {localStorage.getItem('sellnoofcoins')} {localStorage.getItem('sellcoin')} = {parseFloat(localStorage.getItem('sellamount'))} {localStorage.getItem('sellcurrency')}</Grid>
              </Grid>
            }
            </Grid>

            <KeyboardArrowRightIcon sx={{ marginTop: { xs: '30px', sm: '70px', md: '89px' }, display: { xs: 'none', sm: 'block' }, marginLeft: '5px', border: '1px solid white', position: 'absolute', borderRadius: '50%', background: `${theme ? 'black': 'white'}` }} />

            {
              localStorage.getItem('cside') == "buy" ?
              <Grid item xs={10} sm={5} md={5} sx={{  marginLeft: {xs: '10px', sm: '0px'}, background: `${theme ? '' : '#635BFE'}`, border: `${theme ? '1px solid white': ''}`, borderRadius: '5px', padding: '25px' }}>  
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', color: 'white' }}>
                <Grid>You will get</Grid>
                <Grid sx={{  }}>{localStorage.getItem('cnoofcoins')} <span style={{ color: '#FFAF30' }}>{localStorage.getItem('ccoin')}</span></Grid>
                <Grid>1{localStorage.getItem('ccurrency')} = {localStorage.getItem('crate')} {localStorage.getItem('ccoin')}</Grid>
              </Grid>
            </Grid> 
            :
            <Grid item xs={10} sm={5} md={5} sx={{  marginLeft: {xs: '10px', sm: '0px'}, background: `${theme ? '' : '#635BFE'}`, border: `${theme ? '1px solid white': ''}`, borderRadius: '5px', padding: '25px' }}>  
              <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', color: 'white' }}>
                <Grid>You will get</Grid>
                {/* @ts-ignore */}
                <Grid>Total Amount = Amount - Fees</Grid>
                {/* @ts-ignore */}
                <Grid sx={{  }}>{localStorage.getItem('sellcurrency')}{localStorage.getItem('cnoofcoins')} <span style={{ color: '#FFAF30' }}>{parseFloat(localStorage.getItem('sellamount'))-(parseFloat(localStorage.getItem('cexchangefees')) + parseFloat(localStorage.getItem('ccryptofees')))}</span></Grid>
              </Grid>
            </Grid> 
            }  

          </Grid> 
        </Grid>

        <Grid item xs={8.8} sx={{ display: 'flex', flexDirection: 'column', marginLeft: '14%', justifyContent: 'center', gap: '20px' }}>
        {
          localStorage.getItem('cside') == "buy" &&
          <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', gap: '21px' }}>
           <Grid>
             <label>Transfer Type</label>
             <Select value="Bank Transfer" sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth>
              <MenuItem value="Bank Transfer" sx={{ color: `${theme ? 'white': 'black'}` }}>Bank Transfer</MenuItem>
             </Select>
           </Grid>
           <Grid>
            <label>Wallet Address</label>
            <TextField sx={{ border: `${theme ? '1px solid white': ''}` }} placeholder='0.00' value={localStorage.getItem('cwalletAddress')} fullWidth />
            {
              localStorage.getItem('cwalletAddress') == "" && 
              <Colorbtn sx={{ marginTop: '12px' }} onClick={() => HandleWalletRequest()}>Request Wallet Address</Colorbtn>
            }
           </Grid>
          </Grid>
        }   
        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
          <Colorbtn startIcon={<KeyboardArrowLeftIcon />} sx={{ color: 'white', background: `${theme ? '' : '#635BFE'}` }} onClick={() => navigate('/crypto/buysell')} fullWidth>Back</Colorbtn>
          {
            localStorage.getItem('cside') == "buy" ?      
            localStorage.getItem('cwalletAddress') != "" ?
            <Colorbtn sx={{ background: `${theme ? '' : '#635BFE'}` }} endIcon={<KeyboardArrowRightIcon />} onClick={() => proceedBuyCrypto()} fullWidth>Confirm</Colorbtn>
            :
            <DisabledBtn sx={{ background: `${theme ? '' : '#635BFE'}` }} endIcon={<KeyboardArrowRightIcon />} fullWidth>Confirm</DisabledBtn>
            :
            <Colorbtn sx={{ background: `${theme ? '' : '#635BFE'}` }} endIcon={<KeyboardArrowRightIcon />} onClick={() => proceedSellCrypto()} fullWidth>Confirm</Colorbtn>
          }
        </Grid>
      </Grid>  
      </Grid>
    </>
  )
}
