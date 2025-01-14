import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import TradeBox from '../Component/Spot/TradeBox';
import { useOutletContext } from "react-router-dom";
import RecentTrade from '../Component/Spot/RecentTrade';
import React, { useEffect, useRef, useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Backdrop, Box,CircularProgress,Grid, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#2196f3",
   '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

const SellButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "red",
   '&:hover': {
    backgroundColor: "red",
  },
}));

const BuyButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "green",
   '&:hover': {
    backgroundColor: "green",
  },
}));

function TradingViewWidget({coin}:any) {
  const container = useRef<any>();
  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${coin}",
        "interval": "5",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": false,
        "calendar": true,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }`;

    if (container.current) {
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }
    }

    container.current.appendChild(script);
      container.current.appendChild(script);
    },
    [coin]
  );

  return (
  <>
    <div className={`tradingview-widget-container`} ref={container} style={{ height: "100%", width: "100%"}}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text"></span></a></div>
    </div>
  </>
  );
}

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

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 100,
    label: '100%',
  },
];

export default function Spot() {
  
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [theme]:any = useOutletContext();
  const [message,setMessage] = useState<any>([]);
  const [coinNames,setCoinNames] = useState<any>('BTCUSDT');
  
  const HandleCoin = (val:any) => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        "method": "UNSUBSCRIBE",
        "params": [`${coinNames.toLowerCase()}@ticker`],
        "id": 1
      });
    }
    setCoinNames(val);
  }

  const WS_URL = "wss://stream.binance.com:9443/stream";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        "method": "SUBSCRIBE",
        "params": [`${coinNames.toLowerCase()}@ticker`],
        "id": 1
      });
    }
  }, [readyState,coinNames])

  useEffect(() => {
    setMessage(lastJsonMessage);
  }, [lastJsonMessage]);
  
 const [stopPrice,setStopPrice] = React.useState<any>(0);
 const [limitPrice,setLimitPrice] = React.useState<any>(0);
 const [limitBox,setLimitBox] = React.useState<boolean>(false);
 const [orderType,setOrderType] = React.useState<any>('Market'); 
 const [orderStatus,setorderStatus] = React.useState<boolean>(false);
 const [stoplimitBox,setStopLimitBox] = React.useState<boolean>(false);

 const HandleLimitOrder = () => {
  setLimitBox(true);
  setStopLimitBox(false);
  setOrderType("Limit");
 }

 const HandleMarketOrder = () => {
  setLimitBox(false);
  setStopLimitBox(false);
  setOrderType("Market");
 }

 const HandleStopLimitOrder = () => {
  setStopLimitBox(true);
  setLimitBox(false);
  setOrderType("StopLimit");
 }

 {/* @ts-ignore */} 
 const [amount,setAmount] = React.useState<number>(localStorage.getItem('amount'));

 const HandleSwapOrder = async (val:React.ReactNode) => {
  setorderStatus(true);
  const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  await axios.post(`/${url}/v1/crypto/swap`, {
    "user"          :  decoded?.data?.id,
    "coinPair"      :  coinNames,
    "amount"        :  orderType == "Limit" || orderType == "StopLimit" ? limitPrice : amount,
    "orderType"     :  orderType,
    "side"          :  val,
    "status"        :  "Pending",
    "currencyType"  :  localStorage.getItem('currency'),
    "marketPrice"   :  message?.data?.c,
    "limitPrice"    :  orderType == "Limit" || orderType == "StopLimit" ? limitPrice : 0,
    "stopPrice"     :  orderType == "StopLimit" ? stopPrice : 0
  },
  {
    headers: 
    {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    if(result.data.status == "201") {
      setorderStatus(false);
      alertnotify(result.data.message, "Success");
      setLimitBox(false);
      setLimitPrice(0);
      setStopLimitBox(false);
      setStopPrice(0);
      localStorage.setItem('amount',result.data.accountBalance);
    }
  })
  .catch(error => {
    setorderStatus(false);
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

 const coinsUSD = ["BTCUSDT","BNBUSDT","ADAUSDT","SOLUSDT","DOGEUSDT","LTCUSDT","ETHUSDT","SHIBUSDT"];
 const coinsEUR = ["BTCEUR","BNBEUR","ADAEUR","SOLEUR","DOGEEUR","LTCEUR","ETHEUR","SHIBEUR"];

 const [noOfCoinss,setNoOfCoinss] = React.useState<any>('');

 const HandleLimitPrice = async(val:any) => {
  setLimitPrice(val);
  setNoOfCoinss(val/message?.data?.c);
 }

 function valuetext(value: number) { 
  {/* @ts-ignore */} 
  const engageAmount = localStorage.getItem('amount') * value / 100;
  setAmount(engageAmount);
  setNoOfCoinss(engageAmount/message?.data?.c);
  return `${value}%`;
 }

 return (
  <>
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={orderStatus}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
       <Typography className={`${theme ? 'avatarDark' : 'avatarLight'}`}>SPOT TRADING OVERVIEW</Typography>
        <Grid container sx={{display:'flex' , flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px'}}>
          <Grid item xs={12} sm={12}>
            <Grid container sx={{marginBottom: '10px'}}>
             <Grid xs={12} sm={12} sx={{boxShadow: '3', background: `${theme ? '#183153' : 'white'}`, border: `${theme ? '1px solid white': ''}`, borderRadius: '12px', height: 'auto'}}>
                <Grid container sx={{display: 'flex', flexDirection: 'row', padding: '24px 12px' , fontSize: '14px', fontFamily: 'mono', flexWrap: 'wrap' , justifyContent: 'space-between'}}>
                  <Grid item xs={12} md={12} lg={2} sx={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    <Select value={coinNames} onChange={(e) => HandleCoin(e.target.value)} sx={{ width: '100%', border: '1px solid silver'}}>
                      {/* {
                        localStorage.getItem('currency') == "USD" || localStorage.getItem('currency') == "INR" ?
                        coinsUSD?.map((item,index) => (
                        <MenuItem key={index} value={item} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                          <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                           <Grid>
                             <img
                               loading="lazy"
                               style={{height: '30px', width: '30px', borderRadius: '50px'}}
                               src={`https://assets.coincap.io/assets/icons/${item.replace("USDT","").toLowerCase()}@2x.png`}
                               alt={item}
                             />   
                           </Grid>
                           <Grid sx={{marginTop: '3px'}} className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>{item}</Grid>
                          </Grid>
                         </MenuItem>
                        ))
                        : null
                      } */}
                      
                      {
                        localStorage.getItem('currency') == "EUR" ?
                        coinsEUR?.map((itm,index) => (
                        <MenuItem key={index} value={itm} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                          <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                           <Grid>
                            <img
                              loading="lazy"
                              style={{height: '30px', width: '30px', borderRadius: '50px'}}
                              src={`https://assets.coincap.io/assets/icons/${itm.replace("EUR","").toLowerCase()}@2x.png`}
                              alt={itm}
                            />   
                           </Grid>
                           <Grid sx={{marginTop: '3px'}}>
                            {itm}
                           </Grid>
                          </Grid>
                        </MenuItem>
                        ))
                        :
                        coinsUSD?.map((item,index) => (
                          <MenuItem key={index} value={item} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                            <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                             <Grid>
                               <img
                                 loading="lazy"
                                 style={{height: '30px', width: '30px', borderRadius: '50px'}}
                                 src={`https://assets.coincap.io/assets/icons/${item.replace("USDT","").toLowerCase()}@2x.png`}
                                 alt={item}
                               />   
                             </Grid>
                             <Grid sx={{marginTop: '3px'}}>{item}</Grid>
                            </Grid>
                           </MenuItem>
                          ))
                      }
                    </Select>
                    </Grid>
                    <Grid item xs={12} md={12} lg={10} sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                      <Grid container>
                      <Grid item xs={12} sm={6} md={6} lg={2.5} sx={{ textAlign: 'center', border: '1px solid silver', padding: '5px'}}>
                        <Grid>24h Change</Grid>
                        <Grid sx={{fontWeight: '900'}}>
                          <span style={{color: 'blue'}}>
                          {
                            Math.sign(message?.data?.P) == -1 ? 
                            <span style={{color: 'red'}}>{message?.data?.c}</span>
                            :
                            <span style={{color: 'green'}}>{message?.data?.c}</span>
                          }
                          </span>
                          <span style={{marginLeft: '10px'}}>
                          {
                            Math.sign(message?.data?.P) == -1 ? 
                            <span style={{color: 'red'}}>{message?.data?.P}%</span>
                            :
                            <span style={{color: 'green'}}>{message?.data?.P}%</span>
                          }
                          </span>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={2.5} sx={{textAlign: 'center', border: '1px solid silver', padding: '5px'}}>
                        <Grid>24h High</Grid>
                        <Grid sx={{fontWeight: '900'}}>{message?.data?.h}</Grid>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={2.5} sx={{textAlign: 'center', border: '1px solid silver', padding: '5px'}}>
                        <Grid>24h Low</Grid>
                        <Grid sx={{fontWeight: '900'}}>{message?.data?.l}</Grid>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={2.5} sx={{textAlign: 'center', border: '1px solid silver', padding: '5px'}}>
                        <Grid>24h Volume({coinNames.substring(0,3)})</Grid>
                        <Grid sx={{fontWeight: '900'}}>{message?.data?.v}</Grid>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={2} sx={{textAlign: 'center', border: '1px solid silver', padding: '5px'}}>
                        <Grid>24h Volume(USDT)</Grid>
                        <Grid sx={{fontWeight: '900'}}>{message?.data?.q}</Grid>
                      </Grid>
                      </Grid>
                    </Grid>
                </Grid>
             </Grid>
            </Grid>
            <Grid container>
             <Grid xs={12} sm={12} md={12} lg={4} sx={{height: '60vh', gap: '10px'}}>
              <Box sx={{borderRadius: '12px',boxShadow: '3', background: `${theme ? '' : 'white'}`,border: `${theme ? '1px solid white' : 'white'}`,height: '60vh', overflowY: 'scroll', marginBottom: '20px'}}>
                <Typography sx={{padding: '10px',color: {xs: `${theme ? 'white' : 'black'}` , sm: `${theme ? 'white' : 'black'}` }}}>Recent Trades</Typography>
                <hr />
                <RecentTrade coin={coinNames} />
              </Box>
             </Grid>
             <Grid xs={12} sm={12} md={12} lg={8} sx={{height: '60vh', marginTop: {xs: '12px' , lg: '0px' } }}>
              <Box sx={{marginLeft: '12px',boxShadow: '3', background: 'white', borderRadius: '12px', height: '60vh'}}>
                <TradingViewWidget coin={coinNames}/>
              </Box>
             </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} sx={{marginTop: '12px'}}>
            <Grid container>
              <Grid item xs={12} lg={4} sx={{marginTop: '10px', height: '100%'}}>
                <Grid sx={{boxShadow: '5',margin: '2px', borderRadius: '12px', height: 'auto' , border: `${theme ? '1px solid white' : 'white'}`, background: `${theme ? '' : 'white'}` , fontFamily: 'mono'}}>
                  <Typography sx={{textAlign: 'center', color: {xs: `${theme ? 'white' : 'black'}` , sm: `${theme ? 'white' : 'black'}`} }}>Spot</Typography>
                  <hr />

                  <Grid container spacing={2} sx={{padding: '16px'}}>
                    <Grid item xs={12} sm={4}>
                      <ColorButton sx={{ width: '100%', fontFamily: 'mono'}} className={limitBox ? 'limitActive': 'limitInActive'} onClick={() => HandleLimitOrder()}>Limit</ColorButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ColorButton sx={{ width: '100%', fontFamily: 'mono'}} className={orderType == "Market" ? 'limitActive': 'limitInActive'} onClick={() => HandleMarketOrder()}>Market</ColorButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ColorButton sx={{ width: '100%', fontFamily: 'mono'}} className={stoplimitBox ? 'limitActive': 'limitInActive'} onClick={() => HandleStopLimitOrder()}>Stop Limit</ColorButton>
                    </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex', flexDirection: 'column', marginTop: '12px', marginLeft: '3px', marginRight: '3px', background: `${theme ? '': 'black'}`}}>
                    <Grid sx={{display: 'flex', flexDirection: 'row', padding: '12px', justifyContent: 'space-between'}}>
                      <Grid sx={{ color: {xs: `${theme ? 'white' : 'white'}` , sm: `${theme ? 'white' : 'white'}`} }}>{localStorage.getItem('currency')} Balance</Grid>
                      <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                        <Grid sx={{fontWeight: '900',color: {xs: `${theme ? 'white' : 'white'}` , sm: `${theme ? 'white' : 'white'}`}}}>{localStorage.getItem('amount')}</Grid>
                        <Grid sx={{ color: {xs: `${theme ? 'white' : 'white'}` , sm: `${theme ? 'white' : 'white'}`} }}>{localStorage.getItem('currency')}</Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '12px', padding: '12px', border: '1px solid silver', marginLeft: '3px', marginRight: '3px'}}>
                    <Grid sx={{ color: {xs: `${theme ? 'white' : 'black'}` , sm: `${theme ? 'white' : 'black'}`} }}>Price</Grid>
                    <Grid sx={{display: 'flex', flexDirection:'row' , gap: '12px'}}>
                      <Grid sx={{fontWeight: '900',color: {xs: `${theme ? 'white' : 'black'}` , sm: `${theme ? 'white' : 'black'}`}}}>{message?.data?.c}</Grid>
                      <Grid>USDT</Grid>
                    </Grid>  
                  </Grid> 

                  <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', color: `${theme ? 'white' : 'black'}`, marginTop: '12px', padding: '12px', border: '1px solid silver', marginLeft: '3px', marginRight: '3px'}}>
                    <Grid sx={{ color: {xs: `${theme ? 'white' : 'black'}` , sm: `${theme ? 'white' : 'black'}`} }}>No of Coins</Grid>
                    <Grid sx={{display: 'flex', flexDirection:'row' , gap: '12px'}}>
                      <Grid sx={{fontWeight: '900',color: `${theme ? 'white': 'black'}`}}>
                      {
                        noOfCoinss ?
                         noOfCoinss
                        :
                        <>
                          {/* @ts-ignore */} 
                          {parseFloat(localStorage.getItem('amount') / message?.data?.c)}
                        </>   
                      }
                      </Grid>
                      <Grid>{coinNames.replace("USDT","")}</Grid>
                    </Grid>  
                  </Grid>

                  {
                    limitBox &&
                    <>
                      <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '12px', padding: '12px', border: '1px solid silver', marginLeft: '3px', marginRight: '3px'}}>
                      <label htmlFor="Limit Price">Limit Price</label> 
                      <TextField onChange={(e) => HandleLimitPrice(e.target.value)} sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth />
                      </Grid>
                    </>
                  }

                  {
                    stoplimitBox &&
                    <>
                      <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '12px', padding: '12px', border: '1px solid silver', marginLeft: '3px', marginRight: '3px'}}>
                      <label htmlFor="Limit Price">Limit Price</label> 
                      <TextField onChange={(e) => HandleLimitPrice(e.target.value)} sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth />
                      </Grid>

                      <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', marginTop: '12px', padding: '12px', border: '1px solid silver', marginLeft: '3px', marginRight: '3px'}}>
                        <label htmlFor="Stop Price">Stop Price</label> 
                        <TextField onChange={(e) => setStopPrice(e.target.value)} sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth />
                      </Grid>
                    </>
                  }

                  <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', background: `${theme ? '' : 'lavender'}`, marginTop: '12px', padding: '12px', marginLeft: '3px', marginRight: '3px'}}>
                    <label htmlFor="Amount Range">Amount Range</label>
                    <Slider
                      aria-label="Custom marks"
                      defaultValue={20}
                      getAriaValueText={valuetext}
                      step={10}
                      valueLabelDisplay="auto"
                      marks={marks}
                      sx={{ color: `${theme ? 'white' : 'black'}` }}
                    />
                  </Grid> 

                  <Grid sx={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', background: 'black', marginTop: '12px', padding: '12px', marginLeft: '3px', marginRight: '3px'}}>
                    <Grid sx={{fontWeight: '900',color: 'white'}}>Total</Grid>
                    <Grid sx={{display: 'flex', flexDirection:'row' , gap: '12px', color: 'white'}}>
                      <Grid sx={{fontWeight: '900'}}>{limitPrice ? limitPrice : amount}</Grid>
                      <Grid>{localStorage.getItem('currency')}</Grid>
                    </Grid>  
                  </Grid>

                  <Grid container spacing={2} sx={{padding: '16px'}}>
                    <Grid item xs={12} md={6}>
                      <BuyButton sx={{width: '100%', padding: '16px'}}>BUY</BuyButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SellButton sx={{width: '100%', padding: '16px'}}>SELL</SellButton>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={12} lg={8} sx={{ marginTop: '10px'}}>
                <Grid container>
                  <Grid item xs={12} lg={12}>
                    <Grid sx={{boxShadow: '5',marginLeft: '12px', borderRadius: '12px', height: '100%',background: 'white'}}>
                      {/* <Typography sx={{textAlign: 'center'}}>Order Box</Typography> */}
                       <TradeBox />
                    </Grid>
                   </Grid>
                   {/* <Grid item xs={12} lg={3}>
                    <Grid sx={{boxShadow: '5',marginLeft: '12px', borderRadius: '12px', height: '60vh',background: 'white'}}>
                      <Typography sx={{textAlign: 'center'}}>Order Book</Typography>
                      <OrderBook coin={coinNames}/>
                    </Grid>
                   </Grid> 
                   */}
                </Grid>
              </Grid>               
            </Grid>
          </Grid>
        </Grid>
    </Box>
  </>
  )
}
