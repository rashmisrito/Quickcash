import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import React, { useEffect, useState } from 'react';
import { useAccount } from '../../Hooks/useAccount';
import DialogTitle from '@mui/material/DialogTitle';
import getSymbolFromCurrency from 'currency-symbol-map';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate, useOutletContext } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Closebtn, Colorbtn, Dangerbtn, DisabledBtn } from '../../Component/Button/ColorButton';
import { Backdrop, Box, CircularProgress, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function BuySell() {

  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const coins           = ['SOL', 'BNB','BTC','DOGE','ADA','BCH'];
  const url             = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const accountIdData   = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  const {list}          = useAccount(accountIdData?.data?.id);

  const [buysell,setbuysell]           =  useState<any>('buy');
  const [amount,setAmount]             =  useState<number>(0);
  const [currency,setCurrency]         =  useState<any>('');
  const [coin,setCoin]                 =  useState<any>('');
  const [getNoOfCoins,setGetNoOfCoins] =  useState<any>(0);
  const [rates,setRates]               =  useState<any>(0);   
  const [proceed,setProceed]           =  useState<any>(false);
  const [cryptoFees,setCryotoFees]     =  useState<any>(0);
  const [exchangeFees,setExchangeFees] =  useState<any>(0);
  const [theme]:any                    =  useOutletContext();
  const [open, setOpen]                =  useState(false);
  const [openValue,setopenValue]       =  useState(false);

  const [sellCoin,setSellCoin]            = useState<any>(0);
  const [sellCurreny,setSellCurrency]     = useState<any>(0);
  const [sellgetAmount,setSellGetAmount]  = useState<any>(0);
  const [sellNoOfCoins,setSellNoOfCoins]  = useState<any>(0);
  const [nofCoinsAvailable,setNoOfCoinsAvailable] = useState<any>(0);

  const handleClose = () => {
    setOpen(false);
  };

  // Here, I delete localstorage value which i used in further action

  useEffect(() => {
    if(localStorage.getItem('ccryptofees')) {
      // @ts-ignore
      setAmount(localStorage.getItem('camount'));
      setCurrency(localStorage.getItem('ccurrency'));
      setCoin(localStorage.getItem('ccoin'));
      setGetNoOfCoins(localStorage.getItem('cnoofcoins'));
      setRates(localStorage.getItem('crate'));
      setCryotoFees(localStorage.getItem('ccryptofees'));
      setExchangeFees(localStorage.getItem('cexchangefees'));
      setSellCoin(localStorage.getItem('sellcoin'));
      setSellCurrency(localStorage.getItem('sellcurrency'));
      setSellGetAmount(localStorage.getItem('sellamount'));
      setSellNoOfCoins(localStorage.getItem('sellnoofcoins'));
      setbuysell(localStorage.getItem('cside'));
      setProceed(true);
    }
    if((localStorage.getItem('cside') == "sell") && (localStorage.getItem('sellcoin'))) {
      fetchNoOfCoins(localStorage.getItem('sellcoin'));
    }
  },[]);
  
  // used for store buy/sell value;

  const HandleSwitch = (value:any) => {
    setbuysell(value);
  }

  // used for store amount value;

  const HandleAmount = (value:any) => {
    if(value.length == 0 || Math.sign(value) != -1) {
      setAmount(value);
      if(currency != '' && coin != '') {
        calculation(coin,currency,value);
      }
    } else {
      alert("Negative value is not allowed");
    }
  }

  const HandleSellAmount = (value:any) => {
    setSellNoOfCoins(value);
    localStorage.setItem('sellnoofcoins', value);
    if(sellCoin != "" && sellCurreny != "" && value != 0) {
      calculationSellCoins(sellCoin,sellCurreny,value); 
    }
  }

  // used for store currency value;

  const HandleCurrency = (value:any) => {
  if(buysell == "buy") {
    if(currencyWarning(value)) {
      setOpen(true);
      setopenValue(value);
    } else {
      setCurrency(value);
      if(amount != 0 && coin != '') {
        calculation(coin,value,amount);
      }
    }
  } else {
    if(sellCoin != "") {
      if(sellNoOfCoins > 0) {
        setSellCurrency(value);
        localStorage.setItem('sellcurrency',value);
        calculationSellCoins(sellCoin,value,sellNoOfCoins);
      } else {
        alert("You have not sufficient number of coins to sell");
      }
    } else {
      alert("Make sure you have select coin");
    }
  } 
  }

  // used for proceed further crypto action like confirm and go

  const HandleProceedTo = (value:any) => {
    setCurrency(value);
    setOpen(false);
    calculation(coin,value,amount)
  }

  // used for currency warning regarding crypto buy/sell alert for country wise crypto rule;

  const currencyWarning = (value:any) => {
    if(value == "EUR" || value == "USD" || value == "AUD" || value == "JPY") {
      return false;
    } else {
      return true;
    }
  }

  // used for store coin value

  const HandleCoin = (value:any) => {
    if(amount == 0 && currency == '' && buysell == "buy") {
      alert("Make sure you have fill amount and currency field");
      setCoin('');
    } else {
      buysell == "buy" ? setCoin(value) : setSellCoin(value)
      buysell == "buy" ? calculation(value,currency,amount) : fetchNoOfCoins(value)
    }
  } 

  // used for calculation of crypto values like crypto fees, any exchange fees

  const calculation = async (value:any,curr:any,amt:any) => {
    setLoadingCrypto(true);
    await axios.post(`/${url}/v1/crypto/fetch-calculation`, {
      "coin": value,
      "amount": amt,
      "currency": curr,
      "side": buysell
    },
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setRates(result?.data?.data?.rate);
        setExchangeFees(result?.data?.data?.exchangeFees);
        setCryotoFees(result?.data?.data?.cryptoFees);
        setGetNoOfCoins(result?.data?.data?.numberofCoins);
        setTimeout(() => {
          setLoadingCrypto(false);
          setProceed(true);
        },1000);
      }
    })
     .catch(error => {
      setLoadingCrypto(false);
      console.log("error", error);
    })
  }

  // Used for sell coins amount

  const calculationSellCoins = async (sell_coin:any,sell_Curreny:any,sell_NoOfCoins:any) => {
    setLoadingCrypto(true);
    await axios.post(`/${url}/v1/crypto/fetch-symbolprice`, {
      "coin": sell_coin,
      "currency": sell_Curreny,
      "noOfCoins": sell_NoOfCoins
    },
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setLoadingCrypto(false);
        setSellGetAmount(result.data.data.amount);
        setCryotoFees(result.data.data.cryptoFees);
        setExchangeFees(result.data.data.exchangeFees);
        setProceed(true);
      }
    })
     .catch(error => {
      setLoadingCrypto(false);
      setSellNoOfCoins(0);
      setNoOfCoinsAvailable(0);
      setProceed(false);
      console.log("error", error);
    })
  }

  // Used for calculation of Number of Coins available in User Account

  const fetchNoOfCoins = async (value:any) => {
    setLoadingCrypto(true);
    await axios.get(`/${url}/v1/crypto/fetch-coins/${value+'_TEST'}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setLoadingCrypto(false);
        setNoOfCoinsAvailable(result?.data?.data);
      }
    })
     .catch(error => {
      setLoadingCrypto(false);
      setNoOfCoinsAvailable(0);
      console.log("error", error);
    });
  }

  // used for get wallet address for those who have already added wallet address in our record
  const getWalletAddress = async () => {
    await axios.get(`/${url}/v1/crypto/getWalletAddress/${coin}_TEST/${accountIdData?.data?.email}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "200") {
        localStorage.setItem('cwalletAddress', result?.data?.data?.addresses?.[0]?.address);
      }
    })
     .catch(error => {
      console.log("error", error);
      localStorage.setItem('cwalletAddress', '');
    });
  }

  // used for navigate to next phase confirm phase
  const HandleProceed = (val:any) => {
   setLoading(true);
   // @ts-ignore 
   localStorage.setItem('camount',amount);
   localStorage.setItem('ccoin',coin);
   localStorage.setItem('ccurrency',currency);
   localStorage.setItem('cnoofcoins',getNoOfCoins);
   localStorage.setItem('cside',buysell);
   localStorage.setItem('ccryptofees',cryptoFees);
   localStorage.setItem('cexchangefees',exchangeFees);
   localStorage.setItem('crate',rates);
   getWalletAddress();
   setTimeout(() => {
    setLoading(false);
    navigate(val);
   },2000);
  }

  // used for navigate to next phase confirm phase
  const HandleSellProceed = (val:any) => {
    setLoading(true);

    if(nofCoinsAvailable > sellNoOfCoins) {
        
      // @ts-ignore 
      localStorage.setItem('sellamount',sellgetAmount);
      localStorage.setItem('sellcoin',sellCoin);
      localStorage.setItem('sellcurrency',sellCurreny);
      localStorage.setItem('sellnoofcoins',sellNoOfCoins);
      localStorage.setItem('cside',buysell);
      localStorage.setItem('ccryptofees',cryptoFees);
      localStorage.setItem('cexchangefees',exchangeFees);
      setTimeout(() => {
        setLoading(false);
        navigate(val);
      },2000);
    } else {
      alert("You don't have enough coins to sell");
      setLoading(false);
    }

   }

  // Used for switch from current page to back crypto page
  const HandleBack = () => {
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
    navigate('/crypto');
  }

  const ResetValues = () => {
    localStorage.removeItem('camount');
    localStorage.removeItem('ccoin');
    localStorage.removeItem('ccryptofees');
    localStorage.removeItem('cexchangefees');
    localStorage.removeItem('cnoofcoins');
    localStorage.removeItem('crate');
    localStorage.removeItem('cwalletAddress');

    localStorage.removeItem('sellcoin');
    localStorage.removeItem('sellcurrency');
    localStorage.removeItem('sellnoofcoins');
    localStorage.removeItem('sellamount');
    window.location.href = '/crypto/buysell';
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid sx={{ display: 'flex' , background: {xs: `${theme ? '#183153': 'white'}`},color: `${theme ? 'white':' black'}`, flexDirection: 'column' , border: `${theme ? '1px solid white' : '1px solid white'}`, boxShadow: `${theme ? '': '2px 10px 10px #8888883b'}`, borderRadius: '.5rem', p: '10px',  marginTop: { xs: '-10px', md: '20px' }, marginLeft: {xs: '0%',md: '2%'},width: {xs: '100%', lg: '95%'} }}>
      <Grid sx={{ marginTop: {xs:'-10px', sm:'20px'}, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Grid>
          <DisabledBtn onClick={() => HandleBack()} sx={{ margin: '10px', width: '110px',height: '60px', border: `${theme ? '1px solid white': ''}`, background: `${theme ? '#183153' : ''}`,marginLeft: {xs: '0%',md: '2%'} }} startIcon={<KeyboardArrowLeft />} disableElevation>BACK</DisabledBtn>
        </Grid>
        <Grid>
         {localStorage.getItem('ccryptofees') && <Dangerbtn onClick={() => ResetValues()} sx={{ margin: '10px', width: '110px',height: '60px', border: `${theme ? '1px solid red': ''}`,marginLeft: {xs: '0%',md: '2%'} }}>RESET</Dangerbtn>}
        </Grid>
      </Grid>
        <Typography variant='h5' sx={{padding: '16px',textAlign: 'center', fontWeight: '700', color: `${theme ? 'white':' black'}`}}>CRYPTO EXCHANGE</Typography>
        <Typography sx={{ padding: '10px', textAlign: 'center',color: `${theme ? 'white':' black'}` }}>Step: 1 of 3</Typography>
        <Typography variant='h6' sx={{textAlign: 'center'}}>Setup Currency</Typography>
        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '12px', marginTop: '12px'}}>
          <Grid sx={{ border: '3px solid blue', width: '10%', height:'5px', borderRadius: '12px', background: 'blue' }}></Grid>
          <Grid sx={{ border: '3px solid #DDD3FD', width: '10%', height:'5px', borderRadius: '12px', background: '#DDD3FD' }}></Grid>
          <Grid sx={{ border: '3px solid #DDD3FD', width: '10%', height:'5px', borderRadius: '12px', background: '#DDD3FD' }}></Grid>
        </Grid>
        <Grid sx={{  display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '-18%', padding: '20%', marginBottom: {xs:'10px', md: '0px'}, fontSize: {xs: '12px', md: '15px'} }}>
          Exchange crypto manually from the comfort of your home, quickly, safely with minimal fees.
        </Grid>

        <Grid>
          <Box sx={{ marginTop: '-18%',display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px' }}>
              <Grid onClick={() => HandleSwitch("buy")} sx={{ background: `${buysell == 'buy' ? '#635BFE' : 'white'}`, border: `${buysell == 'sell' ? '1px solid #635BFE' : '1px solid white'}`, color: `${buysell == 'buy' ? 'white' : '#635BFE'}`, cursor:'pointer', textAlign: 'center', padding: '5px', width: '120px', borderRadius: '19px' }}>Crypto Buy</Grid>
              <Grid onClick={() => HandleSwitch("sell")} sx={{ background: `${buysell == 'sell' ? '#635BFE' : 'white'}`, border: `${buysell == 'sell' ? '1px solid white' : '1px solid #635BFE'}`, color: `${buysell == 'sell' ? 'white' : '#635BFE'}`, cursor:'pointer', textAlign: 'center', padding: '5px', width: '120px', borderRadius: '19px' }}>Crypto Sell</Grid>
            </Grid>
          </Box>  
        </Grid>

        {
          buysell == "buy" ?
          <>
            {/* Crypto Buy section */}
            <Grid container sx={{ display: 'flex', marginTop: {xs:'5%',sm: '-5%',md:'-16%'}, flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '21px' }}>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>Amount</label>
                  {/* @ts-ignore */}
                  <TextField className='crypto_textfield' sx={{ border: `${theme ? '1px solid white':' '}` }} value={amount} type="number" pattern="[0-9]*" inputMode="numeric" onChange={(e) => HandleAmount(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>Currency</label>
                  <Select placeholder='Select Currency' sx={{ minWidth: '120px',border: `${theme ? '1px solid white':' '}`,color: `${theme ? 'white':''}` }} value={currency} onChange={(e) => HandleCurrency(e.target.value)} fullWidth>
                  {
                    list?.map((item:any,index:number) => (
                      <MenuItem value={item?.currency} key={index+1} sx={{ color: `${theme ? 'white': 'black'}` }}>{item?.currency}</MenuItem>
                    ))
                  }
                  </Select>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center',flexWrap: 'wrap', marginTop: '12px', gap:'20px' }}>
                {(currency == "USD" || currency == "EUR" || currency == "AUD" || currency == "JPY") ? 
                    null 
                    : 
                    <Grid sx={{ fontWeight: '700' }}>Exchange Fees: {getSymbolFromCurrency(currency)}{exchangeFees}</Grid> 
                  }
                  <Grid sx={{ fontWeight: '700' }}>Crypto Fees: {getSymbolFromCurrency(currency)}{cryptoFees}</Grid>
                  <Grid sx={{ fontWeight: '700', textAlign: 'center' }}>Estimated rate: {rates ? rates : '0.000000'}</Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', marginTop: {xs:'5%',sm: '-5%',md:'-5%'}, flexDirection: 'row', justifyContent: 'center', gap: '21px' }}>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>You Get</label>
                  <TextField sx={{border: `${theme ? '1px solid white':' '}`}} placeholder='0.00' value={getNoOfCoins} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' , marginBottom: '10px' }}>
                  <label>Coin</label>
                  <Select sx={{ border: `${theme ? '1px solid white':' '}` }} value={coin} onChange={(e) => HandleCoin(e.target.value)} fullWidth>
                  {
                    coins?.map((item:any,index:number) => (
                      <MenuItem value={item} key={index}>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'normal', alignItems: 'center', gap: '10px' }}>
                          <Grid>
                            <img
                              loading="lazy"
                              style={{ padding: '1px', cursor: 'pointer', height: '30px', width: '30px', borderRadius: '50px'}}
                              src={`https://assets.coincap.io/assets/icons/${item.replace("_TEST","").toLowerCase()}@2x.png`}
                              alt={`${item}`}
                            /> 
                          </Grid>
                          <Grid sx={{ color: `${theme ? 'white':' black'}` }}>{item}</Grid>
                        </Grid>
                      </MenuItem>
                    ))
                  }
                  </Select>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '20px' }}>
                <Grid item xs={12} sm={7}>
                  {
                    proceed ?
                    <Colorbtn sx={{ width: '100%' ,minWidth: '230px', height: '60px',border: `${theme ? '1px solid white': ''}`, background: `${theme ? '#183153' : ''}` }} endIcon={<KeyboardArrowRightIcon />} onClick={() => HandleProceed('/crypto/confirm')}>
                      {loadingCrypto ? 
                      <>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
                          <Grid>fetching...  </Grid>
                          <Grid><CircularProgress color="secondary" /></Grid>
                        </Grid>
                      </>
                      : 'Proceed'}
                    </Colorbtn>
                    : 
                    <DisabledBtn sx={{ width: '100%' ,minWidth: '230px', height: '60px',border: `${theme ? '1px solid white': ''}`, background: `${theme ? '#183153' : ''}` }} endIcon={<KeyboardArrowRightIcon />} disableElevation>
                    {loadingCrypto ? 
                      <>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                          <Grid>fetching...  </Grid>
                          <Grid><CircularProgress color="secondary" /></Grid>
                        </Grid>
                      </>
                      : 'Proceed'}
                    </DisabledBtn>
                  }
                </Grid>
              </Grid>
            </Grid>
          </>
          :
          <>
            {/* Crypto Sell section */}
            <Grid container sx={{ display: 'flex', marginTop: {xs:'5%',sm: '-5%',md:'-16%'}, flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '21px' }}>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>No Of Coins</label>
                  {/* @ts-ignore */}
                  <TextField className='crypto_textfield' sx={{ border: `${theme ? '1px solid white':' '}` }} type="number" value={sellNoOfCoins} pattern="[0-9]*" inputMode="numeric" onChange={(e) => HandleSellAmount(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>Coin</label>
                  <Select sx={{ border: `${theme ? '1px solid white':' '}` , maxHeight: '58px' }} value={sellCoin} onChange={(e) => HandleCoin(e.target.value)} fullWidth>
                  {
                    coins?.map((item:any,index:number) => (
                      <MenuItem value={item} key={index}>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'normal', alignItems: 'center', gap: '10px' }}>
                          <Grid>
                            <img
                              loading="lazy"
                              style={{ padding: '1px', cursor: 'pointer', height: '30px', width: '30px', borderRadius: '50px'}}
                              src={`https://assets.coincap.io/assets/icons/${item.replace("_TEST","").toLowerCase()}@2x.png`}
                              alt={`${item}`}
                            /> 
                          </Grid>
                          <Grid sx={{ color: `${theme ? 'white':' black'}` }}>{item}</Grid>
                        </Grid>
                      </MenuItem>
                    ))
                  }
                  </Select>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '12px',flexWrap: 'wrap', gap:'20px' }}>
                <Grid>
                  No. Of Coins Available : {nofCoinsAvailable} {sellCoin}
                </Grid>
                {(sellCurreny == "USD" || sellCurreny == "EUR" || sellCurreny == "AUD" || sellCurreny == "JPY") ? 
                  null 
                  : 
                  <Grid sx={{ fontWeight: '700' }}>Exchange Fees: {getSymbolFromCurrency(sellCurreny)}{exchangeFees}</Grid> 
                }
                <Grid sx={{ fontWeight: '700' }}>Crypto Fees: {getSymbolFromCurrency(sellCurreny)}{cryptoFees}</Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', marginTop: {xs:'5%',sm: '-5%',md:'-5%'}, flexDirection: 'row', justifyContent: 'center', gap: '21px' }}>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' }}>
                  <label>You Get</label>
                  <TextField sx={{border: `${theme ? '1px solid white':' '}`}} placeholder='0.00' value={sellgetAmount} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ padding: '5%' , marginBottom: '10px' }}>
                  <label>Currency</label>
                  <Select placeholder='Select Currency' sx={{ minWidth: '120px',border: `${theme ? '1px solid white':' '}`,color: `${theme ? 'white':''}` }} value={sellCurreny} onChange={(e) => HandleCurrency(e.target.value)} fullWidth>
                  {
                    list?.map((item:any,index:number) => (
                      <MenuItem value={item?.currency} key={index+1} sx={{ color: `${theme ? 'white': 'black'}` }}>{item?.currency}</MenuItem>
                    ))
                  }
                  </Select>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '20px' }}>
                <Grid item xs={12} sm={7}>
                  {
                    proceed ?
                    <Colorbtn sx={{ width: '100%' ,minWidth: '230px', height: '60px',border: `${theme ? '1px solid white': ''}`, background: `${theme ? '#183153' : ''}` }} endIcon={<KeyboardArrowRightIcon />} onClick={() => HandleSellProceed('/crypto/confirm')}>
                      {loadingCrypto ? 
                      <>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
                          <Grid>fetching...  </Grid>
                          <Grid><CircularProgress color="secondary" /></Grid>
                        </Grid>
                      </>
                      : 'Proceed'}
                    </Colorbtn>
                    : 
                    <DisabledBtn sx={{ width: '100%' ,minWidth: '230px', height: '60px',border: `${theme ? '1px solid white': ''}`, background: `${theme ? '#183153' : ''}` }} endIcon={<KeyboardArrowRightIcon />} disableElevation>
                    {loadingCrypto ? 
                      <>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                          <Grid>fetching...  </Grid>
                          <Grid><CircularProgress color="secondary" /></Grid>
                        </Grid>
                      </>
                      : 'Proceed'}
                    </DisabledBtn>
                  }
                </Grid>
              </Grid>
            </Grid>
          </>
        }

      </Grid>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alert Note"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: `${theme ? 'white': 'black'}` }} id="alert-dialog-slide-description">
          Crypto is not available on selected currency
          You have to convert currency into USD in order to proceed.
          <br />
          <br />
          I am agree to convert my currency to USD in order to Buy/Sell Crypto
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Colorbtn onClick={handleClose}>Disagree</Colorbtn>
          <Closebtn onClick={() => HandleProceedTo(openValue)}>Agree</Closebtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
