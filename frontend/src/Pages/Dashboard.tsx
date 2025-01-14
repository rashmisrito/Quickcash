import axios from "axios";
import '../carousel.css';
import List from '@mui/material/List';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import React , {useEffect} from 'react';
import { useKyc } from "../Hooks/useKyc";
import Paper from '@mui/material/Paper';
import { useFee } from "../Hooks/useFee";
import Marquee from "react-fast-marquee";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Carousel from "react-multi-carousel";
import { blue } from '@mui/material/colors';
import 'react-multi-carousel/lib/styles.css';
import {loadStripe} from '@stripe/stripe-js';
import Backdrop from '@mui/material/Backdrop';
import ListItem from '@mui/material/ListItem';
import InputBase from '@mui/material/InputBase';
import TransactionsList from "./TransactionList";
import ReactCountryFlag from "react-country-flag";
import IconButton from '@mui/material/IconButton';
import { Elements } from '@stripe/react-stripe-js';
import SearchIcon from '@mui/icons-material/Search';
import DialogTitle from '@mui/material/DialogTitle';
import { useOutletContext } from "react-router-dom";
import getSymbolFromCurrency from 'currency-symbol-map';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';
import AddMoneyRazorPay from "./Payment/AddMoneyRazorPay";
import LoopSharpIcon from '@mui/icons-material/LoopSharp';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import CryptoTransactionList from "./CryptoTransactionList";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DialogContentText from '@mui/material/DialogContentText';
import { AddMoneyStripe } from "./Payment/Stripe/AddMoneyStripe";
import LanguageSharpIcon from '@mui/icons-material/LanguageSharp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ControlPointSharpIcon from '@mui/icons-material/ControlPointSharp';
import { Colorbtn, DashboardItemBtn } from "../Component/Button/ColorButton";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import KeyboardDoubleArrowDownSharpIcon from '@mui/icons-material/KeyboardDoubleArrowDownSharp';
import { Box, Card, CardActionArea, CardContent, Chip, FormControl, Grid, Input, InputAdornment, InputLabel, MenuItem, Select, Skeleton, TextField, Tooltip, Typography } from '@mui/material';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

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

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  accountChange: (value: string) => void;
  loadr: (value: boolean) => void;
  theme: String;
  accountsList: any;
  setActiveAccountDetails: any;
  setActiveAccountBal: any;
  setAccountChange: any;
  setDefaultAccountItem:  any;
  setAccountsList: any;
  defaultAccountItem: any;
}

export interface CryptoDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  accountChange: (value: string) => void;
  loadr: (value: string) => void;
  theme: String;
  activeAccount: any;
}

export interface AddMoneyDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  accountChange: (value: string) => void;
  loadr: (value: string) => void;
  activeAccount: any;
  theme: String;
  accountBalance: any;
  acctDetails:any;
  accountList:any;
}

export interface ExchangeDialogProps {
  open: boolean;
  selectedValue: string;
  onExClose: (value: string) => void;
  activeToAccount: (value: string) => void;
  theme: string;
  accountsList: any;
  ActiveAccountDetails: any;
  DefaultAccountItem: any;
  activeAccountBal: any;
  fromValue: any;
  convertedValue: any;
  setFromValue: any;
  setConvertedValue: any;
  setToExchangeBox: any;
  setActiveRate: any;
  setCalCulateOpen: any;
  calCulateOpen: any;
  feeChargeAmount:any;
  reviewFlag:any;
}

function SimpleDialog(props:SimpleDialogProps) {
  const { onClose, selectedValue, open , accountChange , loadr ,theme , accountsList , setActiveAccountDetails ,setActiveAccountBal, setAccountChange , setDefaultAccountItem , setAccountsList,defaultAccountItem } = props;
  
  const handleClose = () => {
    onClose(selectedValue);
  };

  const getDefaultAccountList = async (id:any) => {
    await axios.get(`/${url}/v1/account/default/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
   .then(result => {
     if(result.data.status == "201" && result?.data?.data.length > 0) {
      setDefaultAccountItem(result.data.data[0]);
      setActiveAccountDetails(result.data.data[0].accountDetails);
      localStorage.setItem("currency",result.data.data[0].accountDetails?.currency);
      localStorage.setItem("amount",result.data.data[0].accountDetails?.amount);
      // localStorage.setItem("activeCurr",result?.data?.data[0]?.defaultCurrency);
     }
   })
   .catch(error => {
    console.log("error", error);
   })
  }

  const getAllAccountsList = async(id:string,text="") => {
    await axios.get(`/${url}/v1/account/list/${id}?title=${text}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
     if(result.data.status == "201") {
      setAccountsList(result?.data?.data);
      setActiveAccountBal(result?.data?.totalAmt);
      getDefaultAccountList(id);
     }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const navigate = useNavigate();
  // @ts-ignore
  const HandleAccountChange = (itm:any,type:any,bal:any,trans:any) => {
    if(type == "all_account") {
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getAllAccountsList(accountId?.data?.id);
      loadr(true);
      onClose("");
      setActiveAccountBal(defaultAccountItem?.accountDetails?.amount);
      setAccountChange(type);
      getDefaultAccountList(accountId?.data?.id)
      setTimeout(() => {
        loadr(false);
      },500);
     navigate(`/home?currency=all`);
    } else {
      onClose("");
      setActiveAccountDetails(itm);
      loadr(true);
      setAccountChange(type);
      setActiveAccountBal(bal);
      localStorage.setItem("currency",itm?.currency);
      localStorage.setItem('activeCurr', itm?._id);
      setTimeout(() => {
       loadr(false);
      },500);
      navigate(`/home?currency=${itm?.currency}`);
    }
  }

    return (
      <Dialog open={open} fullWidth maxWidth={'xs'}>
        <DialogTitle>
          <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
            <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Accounts</Grid>
            <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor:'pointer'}} onClick={handleClose}>X</Grid>
          </Grid>
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem key="0" sx={{marginBottom: '5px'}} onClick={() => HandleAccountChange([],'all_account','$0.00',[])}>
            <ListItemButton className='flag__hover' sx={{display: 'flex', justifyContent: 'left' , width: '290px', borderRadius: '.5rem', marginX: '20px', border: '2px solid white'}}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                 <LanguageSharpIcon />
                </Avatar>
              </ListItemAvatar>
              <Grid sx={{display: 'flex', flexDirection: 'column' , justifyContent: 'center'}}>
                <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}><span>All Accounts</span></Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
            {
              accountsList?.map((item:any,index:number) => (
              <>
                <ListItem sx={{marginBottom: '5px'}} key={index+1} onClick={() => HandleAccountChange(item,item.name,`${item.amount}`,item.transDetails)}>
                  <ListItemButton className='flag__hover' sx={{display: 'flex', justifyContent: 'left' , width: '290px', borderRadius: '.5rem', marginX: '20px', border: '2px solid white'}}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                        <ReactCountryFlag
                          countryCode={item.country}
                          svg
                          style={{
                            width: '2em',
                            height: '2em',
                            borderRadius: '50%'
                          }}
                          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                          cdnSuffix="svg"
                          title={item.country}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <Grid sx={{display: 'flex', flexDirection: 'column' , justifyContent: 'center'}}>
                      <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}><span>{item.name}</span></Grid>
                      <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}><span>{getSymbolFromCurrency(item.currency)}{parseFloat(item.amount).toFixed(2)} - {item.iban}</span></Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              </>
             ))
            }
        </List>
      </Dialog>
    );
}

function ExchangeDialog(props:ExchangeDialogProps) {
  
  const [exchangeError,setExchangeError] = React.useState<any>(false);

  const { 
    onExClose, 
    selectedValue, 
    open, 
    activeToAccount,
    theme, 
    accountsList,
    ActiveAccountDetails,
    DefaultAccountItem,
    activeAccountBal,
    fromValue,
    convertedValue,
    setFromValue,
    setConvertedValue,
    setToExchangeBox,
    setActiveRate,
    setCalCulateOpen, 
    calCulateOpen,
    feeChargeAmount,
    reviewFlag
  } = props;

  const handleExchangefClose = () => {
   onExClose(selectedValue);
  }

  const HandleSwitchAccount = (item:any) => {
    activeToAccount(item);
    onExClose(item);
    setToExchangeBox(item);
    calCulateExChangeCurrencyValue(item);
  }

  const calCulateExChangeCurrencyValue = async (item:any) => {
    // setFromValue(activeAccountBal);
    if(fromValue && localStorage.getItem('currentCurrency') != item?.currency) {
      localStorage.setItem("currentCurrency",item?.currency);
      setCalCulateOpen(true);
      const options = {
        method: 'GET',
        url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
        params: {
          from: ActiveAccountDetails ? ActiveAccountDetails.currency : DefaultAccountItem?.currency,
          to: item?.currency,
          amount: 1
        },
        headers: {
         'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
         'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
        }
      };
       
      try {
        const response = await axios.request(options);
        if(response.data.success) {
          setCalCulateOpen(false);
          setConvertedValue(response.data.result.convertedAmount*fromValue);
          setActiveRate(parseFloat(response.data.result.convertedAmount).toFixed(3));
        } else {
          setCalCulateOpen(false);
          setExchangeError(response.data.validationMessage[0]);
        }
      } catch (error) {
        console.error(error);
        setCalCulateOpen(false);
      }
    }
  } 

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
          <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Change Account</Grid>
          <Grid 
            sx={{cursor:'pointer'}} 
            onClick={handleExchangefClose} 
            className={`${theme ? 'avatarDark' : 'avatarLight'}`}
          >
           X
          </Grid>
        </Grid>
        <Grid 
          className={`${theme ? 'avatarDark' : 'avatarLight'}`} 
          sx={{
            marginTop: '10px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            fontSize: '15px' 
          }}>
            Select your preferred account for currency exchange. Easily switch between 
            different currencies to manage your transactions.
        </Grid>
        <Grid>
          <Paper
            component="form"
            sx={{ p: '2px 5px', marginTop: '15px',  display: 'flex', alignItems: 'center'}}
          >
            <InputBase
              className={`${theme ? 'avatarDark' : 'avatarLight'}`}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search By Account Name"
              inputProps={{ 'aria-label': 'search by account name' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
      </DialogTitle>
        <List sx={{ pt: 0 }}>
          {
            accountsList?.map((item:any,index:number) => (
            <>
            {
              item?.currency != ActiveAccountDetails?.currency &&
              <>
                <ListItem key={index} onClick={() => HandleSwitchAccount(item)}>
                 <ListItemButton className='flag__hover' sx={{display: 'flex', justifyContent: 'left' , borderRadius: '.5rem', border: '2px solid white'}}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <ReactCountryFlag
                        countryCode={item?.country}
                        svg
                        style={{
                          width: '2em',
                          height: '2em',
                          borderRadius: '50%'
                        }}
                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                        cdnSuffix="svg"
                        title={item?.country}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <Grid sx={{display: 'flex', flexDirection: 'column' , justifyContent: 'center'}}>
                    <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>{item?.name}</Grid>
                    <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                      {getSymbolFromCurrency(item?.currency)}{item?.amount} - {item?.iban}
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
              </>
            }
            </>
          ))
        }
      </List>
    </Dialog>
  );
}

function AddMoneyDialog(props:AddMoneyDialogProps) {
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PRIVATE_KEY}`);
  const [bic,setBic] = React.useState<any>('');
  const [iban,setIban] = React.useState<any>('');
  const [amount,setAmount] = React.useState<any>(0);
  const [currencyType,setCurrencyType] = React.useState<any>('');
  const [transactionType,setTransactionType] = React.useState<any>('');
  const [tranferAccount,setTranferAccount] = React.useState<any>('');
  const [depositFee,setDepositFee] = React.useState<any>(0);
  const [convValue,setConvValue] = React.useState<any>(0);

  const DepositFeesd = useFee("Debit");
  const navigate1 = useNavigate();
  const alertnotify = (text:any,type:any) => {
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

  const { onClose, selectedValue, open , accountChange ,activeAccount,accountBalance,acctDetails, loadr ,theme,accountList } = props;
  const [loading, setLoading] = React.useState(false);
  
  const handleClose = () => {
    onClose(selectedValue);
    setDepositFee(0);
    setAmount(0);
    setTransactionType('');
    setCurrencyType('');
  };

  const AddMoneyBankTransfer = async () => {
    setLoading(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/wallet/add`, {
      user: accountId?.data?.id,
      account: activeAccount,
      currency: currencyType,
      transactionType: transactionType,
      amount: amount
    }, 
    {
      headers: 
      {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(async result => {
     if(result.data.status == "201") {
      addMoneyTowallet(accountId?.data?.id,activeAccount,currencyType,transactionType,amount);
      alertnotify(result.data.message, "success");
      onClose(selectedValue);
      setLoading(false);
      navigate1(`/home?currency=${currencyType}`);
     }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
      setLoading(false);
    })
  }

  const optionsStripe = {
    mode: 'payment',
    amount: (parseFloat(amount)+parseFloat(depositFee))*100,
    currency: currencyType.toString().toLowerCase(),
    appearance: {},
  };

  const AddMoney = async () => {
    if(transactionType && currencyType && amount) {
      setDisplayRazorpay(false);
      setLoading(true);
      if(transactionType == "upi") {
        setLoading(false);
        razorPay(amount,currencyType,onClose,setLoading);
      } else if(transactionType == "bank-transfer") {
        setLoading(false);
        AddMoneyBankTransfer();
      } else if(transactionType == "stripe") {
        setLoading(false);
        setdisplayStripe(true);
      }
    }
  }

  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  
  const addMoneyTowallet = async(user:any,acct:any,ctype:any,TType:any,amount:any) => {
    await axios.post(`/${url}/v1/transaction/add`, {
     "user": user,
     "source_account": acct,
     "transfer_account": tranferAccount,
     "trans_type": "Add Money",
     "tr_type": transactionType,
     "receipient": "",
     "iban": iban,
     "bic": bic,
     "fee": depositFee ? depositFee : 0,
     "info": `${TType}`,
     "country": ``,
     'amount': parseFloat(amount),
     'conversionAmount': convValue,
     "conversionAmountText": `${getSymbolFromCurrency(acctDetails?.currency)}${parseFloat(convValue).toFixed(2)}`,
     "amountText": `${getSymbolFromCurrency(ctype)}${parseFloat(amount) + parseFloat(depositFee)}`,
     "remainingAmount": '',
     "from_currency": `${currencyType}`,
     "to_currency":  `${acctDetails?.currency}`,
     "status": "pending",
     "addedBy": accountId?.data.name
    },
    {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      console.log(result);
      setDepositFee(0);
      setAmount(0);
      setTransactionType('');
      setCurrencyType('');
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  useEffect(() => {
    getCurrencyList();
  },[]);

  const [currencyList,setCurrencyList] = React.useState<any[]>([]);

  const getCurrencyList = async () => {
    await axios.get(`/${url}/v1/currency/list`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setCurrencyList(result.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  const [displayRazorpay, setDisplayRazorpay] = React.useState(false);
  const [displayStripe,setdisplayStripe] = React.useState(false);

  const [orderDetails, setOrderDetails] = React.useState({
    orderId: null,
    currency: null,
    amount: null,
   });

   const HandleAmount = async (amt_val:any) => {

    setAmount(amt_val);
    var feeVal = 0;
    var feeType = '';

    if(DepositFeesd?.feeCommision) {
      feeVal = DepositFeesd?.feeCommision?.value;
      feeType = DepositFeesd?.feeCommision?.commissionType;
    }

    if(feeType == "percentage") {
      // @ts-ignore
      var feeCharge:number = parseFloat(amt_val)*parseFloat(feeVal)/100;
    } else {
      // @ts-ignore
      var feeCharge:number = parseFloat(feeVal);
    }

    var minFeecharge = feeCharge >= DepositFeesd?.feeCommision?.minimumValue ? feeCharge : DepositFeesd?.feeCommision?.minimumValue;

    if(acctDetails?.currency != currencyType) {
      setAmount(amt_val);
      setDepositFee(minFeecharge);
      calCulateExChangeCurrencyValue(parseFloat(amt_val),minFeecharge);
    } else {
      setDepositFee(minFeecharge);
    }
   }

   const calCulateExChangeCurrencyValue = async (amt:any,valDeposit:any) => {
    console.log(valDeposit);
    const options = {
      method: 'GET',
      url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
      params: {
        from: currencyType,
        to: acctDetails.currency,
        amount: 1
      },
      headers: {
       'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
       'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
      }
     };
     
     try {
      const response = await axios.request(options);
      if(response.data.success) {
        setConvValue(response.data.result.convertedAmount*amt);
      } 
     } catch (error) {
        console.error(error);
     }
  } 

  const HandleCurrencyType = (val:any) => {
    setAmount(0);
    setDepositFee(0);
    setConvValue(0);
    setCurrencyType(val);
  }

  const razorPay = async (amount:any,currency:any,onClose:any,setLoading:any) => {
    await axios.post(`/${url}/v1/razorpay/createOrder`,
    {
     amount: (parseFloat(amount)+parseFloat(depositFee))*100, 
     currency: currency
    }
    )
    .then(result => {
      if(result?.data?.order_id) {
        setOrderDetails({
         orderId: result?.data?.order_id,
         currency: result?.data?.currency,
         amount: result?.data?.amount,
        });
        setDisplayRazorpay(true);
        onClose(false);
        setLoading(false);
      };
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data,"error")
    })
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
          <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Add Money</Grid>
          <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor:'pointer'}} onClick={handleClose}>X</Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <form>
        <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
          Currency Type
          </label>
          <Select
            sx={{ border: `${theme ? '1px solid white': ''}` }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
            name="paymentType"
            onChange={(e) => HandleCurrencyType(e.target.value)}
          >
            
            {
              currencyList?.map((item,index) => (
              <MenuItem value={item.base_code} key={index}>
                <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                  <Grid>
                    <span className={`${theme ? 'avatarDark' : 'avatarLight'}`} style={{height: '30px', width: '30px', borderRadius: '50px' }}>{getSymbolFromCurrency(item?.base_code)}</span> 
                  </Grid>
                  <Grid sx={{marginTop: '3px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>{item.base_code}</Grid>
                </Grid>
              </MenuItem>
              ))
            }
            
          </Select>
          <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
           Transfer Type
          </label>
          <Select
            sx={{ border: `${theme ? '1px solid white': ''}` }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
            name="transactionType"
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <MenuItem value={"stripe"}>
              <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                <Grid>
                  <img
                    loading="lazy"
                    style={{height: '30px', width: '60px'}}
                    src={`${import.meta.env.VITE_APP_URL}/stripe.png`}
                    alt="Stripe"
                  />   
                </Grid>
                <Grid sx={{marginTop: '3px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  Stripe
                  <span style={{fontSize: '10px', marginLeft: '12px'}}>* Supports Other USD, EUR and Others Currency</span>
                </Grid>
              </Grid>
            </MenuItem>
            <MenuItem value={"upi"}>
              <Grid sx={{display: 'flex', flexDirection: 'row', gap:'10px', justifyContent: 'normal'}}>
                <Grid>
                  <img
                    loading="lazy"
                    style={{height: '30px', width: '60px'}}
                    src={`${import.meta.env.VITE_APP_URL}/upi.png`}
                    alt="UPI"
                  />   
                </Grid>
                <Grid sx={{marginTop: '3px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  UPI
                  <span style={{fontSize: '10px', marginLeft: '12px'}}>* Currently Support Only INR Currency</span>
                </Grid>
              </Grid>
            </MenuItem>
          </Select>

            <>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Amount</label>
              <TextField
                name="amount"
                id="outlined-start-adornment"
                sx={{width: '100%' , marginBottom: '10px', border: `${theme ? '1px solid white': ''}`}}
                type="number"
                value={amount}
                onChange={(e) => HandleAmount(e.target.value)}
                className={`${theme ? 'avatarDark' : 'avatarLight'}`}
              />
            </>

            <Grid sx={{display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '12px'}}>
              <Grid>
              { <span style={{fontSize: '12px', fontWeight: '700'}}>Deposit Fee: {getSymbolFromCurrency(currencyType)}{parseFloat(depositFee).toFixed(2)}</span> }
              </Grid>
              <Grid>
              { acctDetails?.currency == currencyType && <span style={{fontSize: '12px', fontWeight: '700'}}>Amount: {getSymbolFromCurrency(currencyType)}{parseFloat(amount)+parseFloat(depositFee)}</span> }
              </Grid>
              <Grid>
              { acctDetails?.currency != currencyType && <span style={{fontSize: '12px', fontWeight: '700'}}>Amount: {getSymbolFromCurrency(currencyType)}{parseFloat(amount)+parseFloat(depositFee)}</span> }
              </Grid>
              <Grid>
              { acctDetails?.currency != currencyType && <span style={{fontSize: '12px', fontWeight: '700'}}>Conversion Amount: {getSymbolFromCurrency(acctDetails?.currency)}{parseFloat(convValue).toFixed(2)}</span> }
              </Grid>
            </Grid>

            {
              transactionType == "bank-transfer" &&
                <>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Account</label>
                  {/* <TextField
                    name="amount"
                    id="outlined-start-adornment"
                    sx={{width: '100%' , marginBottom: '10px' , background: '#fff'}}
                    type="text"
                    onChange={(e) => setIban(e.target.value)}
                    className={`${theme ? 'avatarDark' : 'avatarLight'}`}
                  /> */}
                  <Select value={tranferAccount} onChange={(e) => setTranferAccount(e.target.value)} fullWidth>
                    {
                      accountList?.map((item:any,index:any) => (
                        <MenuItem value={item?._id} key={index}>{item?.name} - {item?.iban}</MenuItem>
                      ))
                    }
                  </Select>
                  {/* <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>BIC / IFSC Code</label>
                  <TextField
                    name="amount"
                    id="outlined-start-adornment"
                    sx={{width: '100%' , marginBottom: '10px' , background: '#fff'}}
                    type="text"
                    onChange={(e) => setBic(e.target.value)}
                    className={`${theme ? 'avatarDark' : 'avatarLight'}`}
                  /> */}
                </>
            }
          <Grid sx={{display: 'flex', flexDirection: 'row', justifyItems: 'center', justifyContent: 'center', alignItems: 'center'}}>
           <Box sx={{ m: 1, position: 'relative' }}>
            <Colorbtn variant="contained" onClick={() => AddMoney()}>ADD MONEY</Colorbtn>
            {
              displayRazorpay && (
                <AddMoneyRazorPay
                  amount={amount}
                  currency={currencyType}
                  orderId={orderDetails?.orderId}
                  details={accountId?.data.name}
                  account={activeAccount}
                  acctDetails={acctDetails}
                  convertedAmount={convValue}
                  fee={depositFee}
                  keyId={"rzp_test_TR6pZnguGgK8hQ"}
                  keySecret={"vOOrz3WBt8g7053lAZWGHPnz"}
                />
              )
            }
            
            {
              displayStripe && (
                <Dialog
                  fullWidth
                  maxWidth={'sm'}
                  open={true}
                  onClose={handleClose}
                >
                  <DialogTitle>Stripe</DialogTitle>
                  <DialogContent>
                    {/* @ts-ignore */}
                    <Elements stripe={stripePromise} options={optionsStripe}>
                      <AddMoneyStripe 
                        notes="Stripe Payment for Add Money"
                        amount={parseFloat(amount) + parseFloat(depositFee)}
                        currency={currencyType}
                        userData={accountId?.data?.id}
                        account={activeAccount}
                        accountData={acctDetails}
                        convertedAmount={convValue}
                        fee={depositFee}
                      />
                    </Elements>
                  </DialogContent>
                </Dialog>    
              )
            }
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'black',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
           </Box>
         </Grid>
        </form>
      </DialogContent>
    </Dialog>
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

interface ActiveAccDetails {
  _id: string;
  amount: any;
  bic_code: string;
  country: string;
  currency: any;
  defaultAccount: string;
  iban: string;
  name: string;
  status: Boolean;
}

// Fiat Symbol Card
function CardData({ theme,status , countryCode, currencyCode, name, balance ,accountText,cstatus }:any) {
  console.log(name);
  return (
    <Card className={`${status && cstatus == "" ? 'activeCard__Currency' : 'notActiveCard__Currency'}`} sx={{  borderRadius: "15px", border: `${theme ? '2px solid lightblue' : '1px solid transparent'}`}}>
      <CardActionArea className={`${theme ? 'avatarDark dashboard_Card_data' : 'avatarLight dashboard_Card_data'}`}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
              <Grid>
                <ReactCountryFlag
                  countryCode={countryCode}
                  svg
                  style={{
                    width: '2em',
                    height: '2em',
                    borderRadius: '50%'
                  }}
                  cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                  cdnSuffix="svg"
                  title={countryCode}
                />
              </Grid>
              <Grid className={`${theme ? 'avatarDark' : ''}`}>
                <Typography variant="h6" component="div">
                  {currencyCode}
                </Typography>
              </Grid>
            </Grid>
           
          </Grid>
          <Grid item xs={12} className={`${theme ? 'avatarDark' : ''}`}  sx={{display: 'flex', flexDirection: 'row', gap: '10px',justifyContent: 'space-between', flexWrap: 'nowrap'}}>
            <Grid>
              <Typography
                marginTop="5px"
                fontWeight="Bolder"
                component="div"
                sx={{ fontSize: '13px' }}
              >
                {accountText}
              </Typography>
            </Grid>
            <Grid>
             <Typography
                marginTop="5px"
                fontWeight="Bolder"
                component="div"
                sx={{ fontSize: '13px' }}
              >
                {getSymbolFromCurrency(currencyCode)}{parseFloat(balance).toFixed(3)}
            </Typography> 
            </Grid>
          </Grid>

          <Grid item xs={12} className={`${theme ? 'avatarDark' : ''}`} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Grid>
             <Typography
               marginTop="5px"
               fontWeight="Bolder"
               component="div"
              >
                {/* {name?.length > 14 ? name?.substring(0,14)+'...': name} */}
            </Typography> 
            </Grid>
          </Grid>

        </Grid>
      </CardContent>
      </CardActionArea>
    </Card>
  );
}

// Crypto Coins Card
// @ts-ignore
function CryptoCardData({ theme, status ,id,coin , noofCoins, walletAddress }:any) {
  return (
    <Card className={`${status == id ? 'activeCard__CryptoCurrency' : 'notActiveCard__Currency'}`} sx={{ borderRadius: "15px", border: `${theme ? '2px solid lightblue' : '1px solid transparent'}`}}>
     <CardActionArea className={`${theme ? 'avatarDark dashboard_Card_data' : 'avatarLight dashboard_Card_data'}`}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
              <Grid>
                <img
                  loading="lazy"
                  style={{height: '30px', width: '30px', borderRadius: '50px'}}
                  src={`https://assets.coincap.io/assets/icons/${ coin.replace("_TEST","").toLowerCase()}@2x.png`}
                  alt={`${coin}`}
                />  
              </Grid>
              <Grid className={`${theme ? 'avatarDark' : ''}`}>
                <Typography variant="h6" component="div">
                  {coin.replace("_TEST","")}
                </Typography>
              </Grid>
            </Grid>
           
          </Grid>
          <Grid item xs={12} className={`${theme ? 'avatarDark' : ''}`}  sx={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Grid>
              <Typography
                marginTop="5px"
                fontWeight="Bolder"
                component="div"
                sx={{ fontSize: '13px' }}
              >
                {noofCoins?.length > 7 ? noofCoins?.substring(0,7)+'...': noofCoins}
              </Typography>
            </Grid>
            <Grid>
              <Typography
                marginTop="5px"
                fontWeight="Bolder"
                component="div"
                sx={{ fontSize: '13px' }}
              >
                {walletAddress?.length > 7 ? walletAddress?.substring(0,7)+'...': walletAddress}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} className={`${theme ? 'avatarDark' : ''}`} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Grid>
             <Typography
               marginTop="5px"
               fontWeight="Bolder"
               component="div"
              >
                {/* {name?.length > 14 ? name?.substring(0,14)+'...': name} */}
            </Typography> 
            </Grid>
          </Grid>
          
        </Grid>
      </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Dashboard() {

  const [theme]:any = useOutletContext();
  const ExchangeFees = useFee("Exchange");
  const [open, setOpen] = React.useState(false);
  const [Excopen, setExcOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [AddMoneyOpen,setAddMoneyOpen] = React.useState(false);
  const [exchangeOpen, setExchangeOpen] = React.useState(false);
  const location = useLocation();
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [selectedExchangeValue, setSelectedExchangeValue] = React.useState<string>(emails[1]);

  const [accountsList,setAccountsList] = React.useState<[]>();
  const [activeAccountBal,setActiveAccountBal] = React.useState<any>();
  const [DefaultAccountItem,setDefaultAccountItem] = React.useState<any>();
  const [ActiveAccountDetails,setActiveAccountDetails] = React.useState<ActiveAccDetails>();

  const [fromValue,setFromValue] = React.useState<any>(0);
  const [convertedValue,setConvertedValue] = React.useState<any>(0);

  const [activeRate,setActiveRate] = React.useState<any>(0);
  const [toExchangeBox,setToExchangeBox] = React.useState<any>('');

  const [calCulateOpen,setCalCulateOpen] = React.useState<any>(false);

  const [reviewFlag,setReviewFlag] = React.useState<boolean>(false);

  useEffect(() => {
    if(localStorage.getItem('exChangeAcive')) {
      setExchangeOpen(true);
      localStorage.removeItem('exChangeAcive');
    }
  },[]);

  useEffect(() => {
    if(localStorage.getItem('token')) {
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getAllAccountsList(accountId.data.id);
      getDashboardData(accountId.data.id);
      fetchCyrptoCoins(accountId.data.id);

      var valSearch = location?.search?.replace("?currency=","").replace("?","");
      if(valSearch.substring(0,6) == "crypto") {
        setDisplayCryptoItem(valSearch?.replace("crypto=",""));
      }
    }
  },[]);

  const [dashboardData,setDashboardData] = React.useState<any>('');

  const getDashboardData = async (id:any) => {
    await axios.get(`/${url}/v1/admin/revenue/dashboard/${id}`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setDashboardData(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const accountIdF = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  const KycDetails = useKyc(accountIdF?.data?.id);

  const alertnotify = (text:any,type:any) => {
   if(type == "error") {
    toast.error(text, {
      position: "top-left",
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

  const getAllAccountsList = async(id:string,text="") => {
    await axios.get(`/${url}/v1/account/list/${id}?title=${text}`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setAccountsList(result.data.data);
       setActiveAccountBal(result?.data?.totalAmt);
       getDefaultAccountList(id);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const activeAccountDetails = async (id:any) => {
    await axios.get(`/${url}/v1/account/accountbyid/${id}`, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setActiveAccountDetails(result?.data?.data);
       setActiveAccountBal(result?.data?.data?.amount);
       setAccountChange(result?.data?.data?.name);
       localStorage.setItem("currency",result?.data?.data?.currency);
       localStorage.setItem("amount",result?.data?.data?.amount);
       localStorage.setItem("activeCurr",result?.data?.data?._id);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const getDefaultAccountList = async (id:any) => {
    if(!localStorage.getItem('activeCurr')) {
      await axios.get(`/${url}/v1/account/default/${id}`, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
         setDefaultAccountItem(result?.data?.data?.[0]);
         setActiveAccountDetails(result?.data?.data?.[0]?.accountDetails);
         localStorage.setItem("currency",result?.data?.data?.[0]?.accountDetails?.currency);
         localStorage.setItem("amount",result?.data?.data?.[0]?.accountDetails?.amount);
         localStorage.setItem("activeCurr",result?.data?.data?.[0]?.accountDetails?._id);
        }
      })
      .catch(error => {
        console.log("error", error);
      })
    } else {
      activeAccountDetails(localStorage.getItem('activeCurr'));
    }
  }
  
  const handleClickExchangeOpen = () => {
    if(ActiveAccountDetails?.amount > 0) {
      localStorage.removeItem("currentCurrency");
      setToExchangeAccount('');
      setTimeout(() => {
        setExchangeOpen(true);
      },100);
    } else {
      alertnotify("Default account has 0 amount, please add amount in default account otherwise switch account","error")
    }
  };

  const handleAddMoneyOpen = () => {
    setAddMoneyOpen(true);
  };

  const handleClickReviewOpen = () => {
    setReviewOpen(true);
  };

  const [exchangeLoader,setExchangeLoader] = React.useState<boolean>(false);

  const HandleTransactions = async () => {
    setExchangeLoader(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    // var amountfeevalValue = ExchangeFees?.feeCommision?.commissionType == "percentage" ? convertedValue * ExchangeFees?.feeCommision?.value / 100 : ExchangeFees?.feeCommision?.value;
    // var feevalValue = ExchangeFees?.feeCommision?.commissionType == "percentage" ? fromValue * ExchangeFees?.feeCommision?.value / 100 : ExchangeFees?.feeCommision?.value;
    await axios.post(`/${url}/v1/transaction/add`, {
     "user": accountId?.data.id,
     "source_account": ActiveAccountDetails?._id,
     "transfer_account": toExchangeBox?._id,
     "trans_type": "Exchange",
     "receipient": "",
     "fee": feeChargeAmount,
     "recfee": feeChargeAmount,
     "info": `Convert ${ActiveAccountDetails?.currency} to ${toExchangeBox?.currency}`,
     "country": `${ActiveAccountDetails?.country}`,
     "fromAmount": parseFloat(fromValue),
     'amount':  parseFloat(convertedValue),
     "amountText": `${getSymbolFromCurrency(toExchangeBox?.currency)}${parseFloat(convertedValue).toFixed(2)}`,
     "fromamountText": `${getSymbolFromCurrency(ActiveAccountDetails?.currency)}${parseFloat(fromValue).toFixed(2)}`,
     "remainingAmount": parseFloat(toExchangeBox?.amount),
     "from_currency": `${ActiveAccountDetails?.currency}`,
     "to_currency":  `${toExchangeBox?.currency}`,
     "status": "Success",
     "addedBy": accountId?.data?.name
   },
   {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    if(result.data.status == "201") {
      setExchangeLoader(false);
      setToExchangeBox(null);
      getAllAccountsList(accountId?.data?.id);
      setReviewOpen(false);
      setExchangeOpen(false);
      setTimeout(() => {
       alertnotify("Exchange has been done successfully", "success");
      },300);
      getDashboardData(accountId?.data?.id);
      navigate(`/home?currency=${ActiveAccountDetails?.currency}`);
    }
  })
  .catch(error => {
    console.log("error", error);
    setExchangeLoader(false);
    alertnotify(error?.response?.data?.message, "error");
  })
 }

  const [toExchangeAccount,setToExchangeAccount] = React.useState<any>('');

  const handleClickExchangeAccountOpen = () => {
    setExcOpen(true);
  };

  const handleExchangeClose = () => {
    setExchangeOpen(false);
    setFromValue(0);
    setConvertedValue(0);
    localStorage.removeItem('currentCurrency');
    setToExchangeBox('');
    setFeeChargeAmount(0);
    setToExchangeAccount('');
    setErrorExchangeMessage('');
  };

  const handleAddMoneyClose = () => {
    setAddMoneyOpen(false);
  };

  const handleReviewClose = () => {
    setReviewOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value:any) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleExcClose = (value:any) => {
    setExcOpen(false);
    setSelectedExchangeValue(value);
  };

  const navigate = useNavigate();
  const [loader,setLoader] = React.useState<any>(false);
  const [loaderCr,setLoaderCr] = React.useState<any>(false);
  const [feeChargeAmount,setFeeChargeAmount] = React.useState<any>(0);
  const [accountChange,setAccountChange] = React.useState("all_account");
  const [errorExchangeMsg,setErrorExchangeMessage] = React.useState<any>('');

  const HandleFromAmountExchange = async (amtt:any) => {
    setLoaderCr(true);
    var feeCharge2:Number = 0;
    if(ExchangeFees?.feeCommision?.commissionType == "percentage") {
      if(parseFloat(amtt) > parseFloat(ExchangeFees?.feeCommision?.minimumValue)) {
        feeCharge2 = parseFloat(amtt) * parseFloat(ExchangeFees?.feeCommision?.value) / 100; // @ts-ignore
        if(parseFloat(feeCharge2) >= parseFloat(ExchangeFees?.feeCommision?.minimumValue)) {
          setFeeChargeAmount(feeCharge2);
        } else {
          setFeeChargeAmount(ExchangeFees?.feeCommision?.minimumValue);
        }
      } else {
        feeCharge2 = parseFloat(ExchangeFees?.feeCommision?.minimumValue);
        setFeeChargeAmount(feeCharge2);
      }
    } else {
      feeCharge2 = parseFloat(ExchangeFees?.feeCommision?.value); // @ts-ignore
      setFeeChargeAmount(feeCharge2);
    }
    
    
    /** @ts-ignore **/
    const totalAm = parseFloat(feeCharge2) + parseFloat(amtt);
     /** @ts-ignore **/
    if(parseFloat(ActiveAccountDetails?.amount) >= parseFloat(totalAm)) {
      setFromValue(amtt);
      setReviewFlag(true);
      CalculateExchangeValues(amtt);
      localStorage.setItem("currentCurrency",toExchangeBox?.currency);
      setErrorExchangeMessage('');
    } else {
      setReviewFlag(false);
      setLoaderCr(false);
      setErrorExchangeMessage("Total amount should be less than or equal to current balance amount");
      //alertnotify("Total amount sholud be less than or equal to current balance amount", "error");
    }
  }

  const CalculateExchangeValues = async (amty:any) => {
    const from = ActiveAccountDetails?.currency;
    const to = toExchangeBox?.currency;
    // const totalFeesandAmount = parseFloat(amty) + parseFloat(depositFee)
    //if(localStorage.getItem('currentCurrency') != toExchangeBox?.currency) {
      await axios.post(`/${url}/v1/currency/getExchange`, {from, to} , 
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          setLoaderCr(false);
          setActiveRate(result?.data?.data);
          setConvertedValue(amty*result?.data?.data);
        }
      })
      .catch(error => {
        setLoaderCr(false);
        console.log(error);
      });
    // } else {
    //   setConvertedValue(amty*activeRate);
    // }
  }

  // Fetch Cyrpto Coins of User
  const [cryptoCoins,setCryptoCoins] = React.useState<any>([]);

  const fetchCyrptoCoins = async(id:any) => {
    await axios.get(`/${url}/v1/walletaddressrequest/list/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setCryptoCoins(result.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  // @ts-ignore
  const HandleAccountChange = (itm:any,type:any,bal:any,trans:any) => {
    setDisplayCryptoItem('');
    if(type == "all_account") {
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getAllAccountsList(accountId.data.id);
      setAccountChange(type);
      getDefaultAccountList(accountId.data.id)
      setTimeout(() => {
     },500);
     navigate(`/home?currency=all`);
    } else {
      setActiveAccountDetails(itm);
      setAccountChange(type);
      setActiveAccountBal(bal);
      localStorage.setItem("currency",itm?.currency);
      localStorage.setItem('activeCurr', itm?._id);
      setTimeout(() => {
      },500);
      navigate(`/home?currency=${itm?.currency}`);
    }
  }

  const [coinData, setCoinData] = React.useState([]);
  // This Function will fetch the crypto icons price , symbol
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/ticker?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22DOGEUSDT%22,%22ADAUSDT%22,%22SOLUSDT%22,%22LTCUSDT%22,%22ETHUSDT%22,%22SHIBUSDT%22]");
        setTimeout(() => {
          setCoinData(response.data);
        },0);
        
        console.log(response);
      } catch (err){
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // marquee Start Mobile
  const MarqueeMobile = () => {
  return (
    coinData.length != 0 ? (
    // @ts-ignore
    <marquee behavior="scroll" direction="left" scrollamount="5" scrolldelay="0" style={{ paddingTop: "5px" }}>
      <Grid sx={{ display: 'flex'}}>
       { coinData.map((data:any) => (
        <Grid sx={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '5px' }}>
          <Grid>
            <img
              loading="lazy"
              style={{ padding: '1px', cursor: 'pointer', height: '30px', width: '30px', borderRadius: '50px'}}
              src={`https://assets.coincap.io/assets/icons/${data?.symbol.replace("USDT","").toLowerCase()}@2x.png`}
              alt={`${data?.symbol}`}
            />
          </Grid>
          <Grid>
            {data?.symbol.replace("USDT","")}
          </Grid>
          <Grid>
            ${data?.lastPrice}
          </Grid>
        </Grid>
       ))}
      </Grid>
      {/* @ts-ignore */}
   </marquee>
  )
   :
  (
    ''
  )
 );
};
// marquee End Mobile

const [displayCryptoItem,setDisplayCryptoItem] = React.useState<any>('');

const HandleDisplayCryptoItemData = (id:any) => {
  setDisplayCryptoItem(id);
  navigate(`/home?crypto=${id}`);
}
 
  // Crypto Cards
 
  const responsive = {
    // Define responsive settings for different screen sizes
    superLargeDesktop: {
    // the naming can be any, depends on you.
      breakpoint: { max: 12000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 764 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 764, min: 0 },
      items: 1,
    },
  };

  const ButtonGroup = ({ next, previous, goToSlide, ...rest }:any) => {
    const { carouselState: { currentSlide, totalItems , slidesToShow } } = rest;
    const totalRemiaining = totalItems - currentSlide;
    return (
      <div className="carousel-button-group">
        <div className={currentSlide === 0 ? 'prevCardisable prevCar--left prevCar' : 'prevCar--left prevCar'} onClick={() => previous()} />
        <div className={slidesToShow === totalRemiaining || slidesToShow >= totalRemiaining ?  'nextCardisable nextCar nextCar--right' : 'nextCar nextCar--right'} onClick={() => next()} />
      </div>
    );
  };

  return (
    <>
      <Grid sx={{ display: 'flex' , flexDirection: 'column' }}>
       <Box sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: 'auto' , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
          <Grid>
          <Grid sx={{ display: {xs: 'none', sm: 'none', md: 'block'} }}>
            {
              coinData.length > 0 ? (
                <Marquee speed={100}>
                  <Grid sx={{ display: 'flex', padding: '20px' , gap: '20px' }}>
                  { coinData.map((data:any) => (
                    <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: "12px", borderRadius: '12px' }}>
                      <Grid>
                        <Chip 
                          avatar={
                          <Avatar alt={data.symbol} src={`https://assets.coincap.io/assets/icons/${data.symbol.replace("USDT", "").toLowerCase()}@2x.png`} style={{width:"35px", height:"35px"}} />
                          }
                          label={data.symbol.replace("USDT","")}
                          style={{color:`${theme ? 'white': 'black'}`, fontSize:"18px", background: 'transparent'}}
                        />
                        ${parseFloat(data?.lastPrice).toFixed(9)}
                      </Grid>
                      <Grid sx={{ marginTop: '-5px' }}>
                        {
                          Math.sign(data?.priceChangePercent) == -1 ?
                          <span style={{ color: 'red', fontWeight: '700', fontFamily: 'monospace' }}>{data?.priceChangePercent}%</span>
                          :
                          <span style={{ color: 'green', fontWeight: '700' }}>{data?.priceChangePercent}%</span>
                        }
                      </Grid>
                    </Grid>
                  ))}
                  </Grid>
                </Marquee>
               ) :(
                <>
                  <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                  <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                </>
              )
            }
          </Grid>
          <Grid sx={{ display: {xs: 'block', sm: 'block', md: 'none'} }}>
            <MarqueeMobile />
          </Grid>
        </Grid>      
       </Box>
      {
        KycDetails?.kcyDetails?.[0]?.status == "completed" ?
        <>
          <Grid sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: '190px' , boxShadow: '2px 10px 10px #8888883b', marginTop: {xs:'1%',md:'2%'}, borderRadius: '.5rem' }}>  
            <Grid container>
              <Grid item xs={3} sm={3} md={3}>
                <Gauge
                  minwidth={250} 
                  height={160} // @ts-ignore
                  value={dashboardData?.depositTotal > 0 ? parseFloat(parseFloat(dashboardData?.depositTotal) / parseFloat(dashboardData?.depositTotal + dashboardData?.debitTotal) * 100).toFixed(2) : '0'} 
                  innerRadius={'60%'}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 40,
                      transform: 'translate(0px, 46px)' 
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: "#65d1bc",
                    },
                    
                  }}
                  text={
                    ({}) => ``
                  }
                />

                <Grid sx={{position:'relative',top: {lg: '-90px', xs: '-80px'},textAlign:"center"}} >
                  <Grid container spacing={1} style={{position:'relative',right:"0px"}}>
                    <Grid item xs={12}>
                      <ArrowUpwardOutlinedIcon sx={{fontSize: {lg: '60px', xs: '20px'},color:"#65d1bc"}}/>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                      <Grid sx={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900", color: {sm:`${theme ? 'white': 'black'}`} }}>
                        {"Credit"}
                      </Grid>
                      <Grid sx={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900",color: {sm:`${theme ? 'white': 'black'}`}}}>
                        ${ dashboardData?.depositTotal ? parseFloat(dashboardData?.depositTotal).toFixed(2) : 0}
                      </Grid>
                    </Grid>
                  </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={3} sm={3} md={3}>
                <Gauge
                  minwidth={250} 
                  height={160}  // @ts-ignore
                  value={dashboardData?.debitTotal > 0 ? parseFloat(parseFloat(dashboardData?.debitTotal) / parseFloat(dashboardData?.depositTotal + dashboardData?.debitTotal) * 100).toFixed(2) : '0'} 
                  innerRadius={'50%'}
                  startAngle={-110} 
                  endAngle={110}
                  sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      fontWeight:"bold",
                      transform: 'translate(0px, 46px)' 
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: "#fc762f",
                    },
                  }}
                  text={
                    ({}) => ``
                  }
                />

              <Box sx={{position:'relative',top: {lg: '-90px', xs: '-80px'},textAlign:"center"}}>
                <Grid container spacing={1} style={{position:'relative',right:"0px"}}>
                  <Grid item xs={12}>
                    <ArrowDownwardOutlinedIcon sx={{fontSize: {lg: '60px', xs: '20px'},color:"#fc762f"}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                      <Grid sx={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900",color: {sm:`${theme ? 'white': 'black'}`}}}>
                        {"Debit"}
                      </Grid>
                      <Grid sx={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900",color: {sm:`${theme ? 'white': 'black'}`}}}>
                        ${ dashboardData?.debitTotal ? parseFloat(dashboardData?.debitTotal).toFixed(2) : 0}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              </Grid>
          
              <Grid item xs={3} sm={3} md={3}>
                <Gauge
                  minwidth={250} 
                  height={160} // @ts-ignore
                  value={dashboardData?.investingTotal > 0 ? parseFloat(parseFloat(dashboardData?.investingTotal) / parseFloat(dashboardData?.investingTotal + dashboardData?.earningTotal) * 100).toFixed(2) : '0'} 
                  innerRadius={'60%'}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                    transform: 'translate(0px, 46px)' 
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#8657e5",
                  },
                }}
                text={
                  ({}) => ``
                }
              />
            <Grid sx={{position:'relative',top: {lg: '-90px', xs: '-80px'},textAlign:"center"}} >
              <Grid container spacing={1} style={{position:'relative',right:"0px"}}>
                <Grid item xs={12}><AttachMoneyIcon sx={{fontSize: {lg: '60px', xs: '20px'},color:"#8657e5"}}/></Grid>
                <Grid item xs={12}>
                  <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                    <Grid sx={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900", color: {sm:`${theme ? 'white': 'black'}`}}}>
                      {"Investing"}
                    </Grid>
                    <Grid sx={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900", color: {sm:`${theme ? 'white': 'black'}`}}}>
                      ${ dashboardData?.investingTotal ? parseFloat(dashboardData?.investingTotal).toFixed(2) : 0}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            </Grid>

            <Grid item xs={3} sm={3} md={3}>
              <Gauge
                minwidth={250} 
                height={160} // @ts-ignore
                value={dashboardData?.earningTotal > 0 ? parseFloat(parseFloat(dashboardData?.earningTotal) / parseFloat(dashboardData?.investingTotal + dashboardData?.earningTotal) * 100).toFixed(2) : '0'} 
                innerRadius={'60%'}
                startAngle={-110}
                endAngle={110}
                sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: 'translate(0px, 46px)' 
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#80982A",
                },
              }}
              text={
                ({}) => ``
              }
            />
            <Grid sx={{position:'relative',top: {lg: '-90px', xs: '-80px'},textAlign:"center"}} >
              <Grid container spacing={1} style={{position:'relative',right:"0px"}}>
                <Grid item xs={12}><AttachMoneyIcon sx={{fontSize: {lg: '60px', xs: '20px'},color:"#80982A"}}/></Grid>
                <Grid item xs={12}>
                  <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                    <Grid sx={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900", color: {sm:`${theme ? 'white': 'black'}`}}}>
                      {"Earning"}
                    </Grid>
                    <Grid sx={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900", color: {sm:`${theme ? 'white': 'black'}`}}}>
                      ${ dashboardData?.earningTotal ? parseFloat(dashboardData?.earningTotal).toFixed(2) : 0}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
         </Grid>
        </Grid>
        </>
        :
        null
      }

      {
        KycDetails?.kcyDetails?.[0]?.status == "completed" && accountsList && accountsList?.length > 0 &&
        <Box sx={{ display: 'block' , background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: '15em' , boxShadow: '12px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
        <Grid sx={{ fontWeight: '700', textAlign: 'center', marginTop: '3%' }}>FIAT</Grid>
        <Grid>
        {/* @ts-ignore */}
        { 
          KycDetails?.kcyDetails?.[0]?.status == "completed" && accountsList && accountsList?.length > 0 &&
          <div style={{ position: 'relative', width: '100%' }}>
            {/* @ts-ignore */}
            <div className={`${accountsList?.length < 4 ? 'carouselcenter' : 'carouselstart'}`} style={{ position: 'absolute', width: '100%', zIndex: '999' }}>
              <Carousel
                swipeable={false}
                draggable={false}
                infinite={false}
                renderArrowsWhenDisabled={true}
                shouldResetAutoplay={false}
                transitionDuration={500}
                showDots={false}
                itemClass="custom-item-class"
                responsive={responsive}
                ssr={false}
                autoPlay={false}
                customTransition="all .5s linear"
                arrows={false}
                customButtonGroup={<ButtonGroup />}
                renderButtonGroupOutside={true}
              >
                { accountsList && accountsList.map((item:any, index:number) => (
                <div key={item.id} style={{ gap: '10px', margin: '12px' }}>
                  <Grid key={index} onClick={() => HandleAccountChange(item,item?.name,`${item?.amount}`,item?.transDetails)}>
                    <Grid>
                      <CardData
                        theme={theme}
                        status={item?._id == ActiveAccountDetails?._id ? true : false}
                        countryCode={item?.country}
                        currencyCode={item?.currency}
                        name={item?.name}
                        balance={item?.amount}
                        accountText={item?.iban}
                        cstatus={displayCryptoItem}
                      />
                    </Grid>
                  </Grid>  
                </div>
                ))}
              </Carousel>
            </div>
          </div>
        }
        </Grid>
        </Box>
      }
     
      {
        KycDetails?.kcyDetails?.[0]?.status == "completed" && cryptoCoins?.length > 0 &&
        <Box sx={{ display: 'block' , background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: '15em' , boxShadow: '12px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
          <Grid sx={{ fontWeight: '700', textAlign: 'center', marginTop: '3%' }}>
            CRYPTO
          </Grid>
          <Grid>
          {/* @ts-ignore */}
          { KycDetails?.kcyDetails?.[0]?.status == "completed" && cryptoCoins?.length > 0 &&
          <div style={{ position: 'relative', width: '100%' }}> 
            {/* @ts-ignore */}
            <div className={`${cryptoCoins?.length < 4 ? 'carouselcenter' : 'carouselstart'}`}  style={{ position: 'absolute', width: '100%', zIndex: '999' }}>
            <Carousel
              swipeable={false}
              draggable={false}
              infinite={false}
              renderArrowsWhenDisabled={true}
              shouldResetAutoplay={false}
              transitionDuration={500}
              showDots={false}
              itemClass="custom-item-class"
              responsive={responsive}
              ssr={false}
              autoPlay={false}
              customTransition="all .5s linear"
              arrows={false}
              customButtonGroup={<ButtonGroup />}
              renderButtonGroupOutside={true}
            >
              { 
                cryptoCoins && cryptoCoins.map((item:any, index:number) => (
                <div key={item.id} style={{ gap: '10px', margin: '12px' }}>
                  <Grid key={index} onClick={() => HandleDisplayCryptoItemData(item?.coin)}>
                    <CryptoCardData
                      theme={theme}
                      status={displayCryptoItem}
                      id={item?.coin}
                      coin={item?.coin}
                      noofCoins={item?.noOfCoins}
                      walletAddress={item?.walletAddress}
                    />
                  </Grid> 
                </div>
                ))
              }
            </Carousel>
            </div>
          </div>

          }
          </Grid>
        </Box>
      }
      
      <Box sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: 'auto' , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
        <Grid container spacing={1} sx={{ display: 'flex',justifyContent: 'normal' , padding: '12px', marginLeft: '0px' }}>
          {
            (KycDetails?.kcyDetails?.[0]?.status == "Pending") &&
            <Grid item xs={12} sm={12} md={12}>
             <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
               <Grid>
                 <img src={`${import.meta.env.VITE_APP_URL}/kyc.png`} style={{width: '100%', height: '120px'}} />
               </Grid>
               <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                {
                  (KycDetails?.kcyDetails?.[0]?.documentPhotoFront == '') ?
                  <>
                    <Grid>
                      <Typography>Kyc is pending</Typography>
                    </Grid>
                    <Grid>
                      Click here to complete the <Link to="/kyc">KYC</Link> 
                    </Grid>
                  </>
                  :
                  <>
                    <Grid>
                      Your details are submitted, Admin will approve after review your kyc details !!!
                    </Grid>
                  </>
                } 
               </Grid>
             </Grid>
           </Grid>
          }

          {
            (KycDetails?.kcyDetails?.[0]?.status == "declined") &&
            <Grid item xs={12} sm={12} md={12}>
             <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
               <Grid>
                <img src={`${import.meta.env.VITE_APP_URL}/kyc.png`} style={{width: '100%', height: '120px'}} />
               </Grid>
               <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
               {
                <>
                  <Grid>
                    <Typography>{KycDetails?.kcyDetails?.[0]?.comment}</Typography>
                  </Grid>
                  <Grid>
                    Click here to re-submit your details <Link to="/kyc">KYC</Link> 
                  </Grid>
                </>
               } 
               </Grid>
             </Grid>
           </Grid>
          }

        </Grid>
      
        {
          KycDetails?.kcyDetails?.[0]?.status == "completed" && displayCryptoItem == "" ?
            <Grid padding={1} sx={{ color: `${theme ? 'white': 'black'}`,gap: '12px', display: 'flex', flexDirection: {xs: 'column' , sm: 'row', md: 'row'}, justifyContent: {xs: 'center' , sm: 'center', md: 'space-between'}, flexWrap: 'wrap' }}>
             <Grid sx={{ textAlign: 'center',marginX: '10px' , padding: '10px' }} className={`${loader ? 'loaderAmount': activeAccountBal == undefined ? 'loaderAmount': ''}`}>
             <Grid sx={{ color: { sm: `${theme ? 'white' : 'black'}`} }}>{ accountChange == "all_account" ? 'All Account' :  accountChange?.length > 14 ? accountChange?.substring(0,14)+'...' : accountChange}</Grid>
              <Grid sx={{ display: 'flex', direction: 'row', justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' } , color: { sm: `${theme ? 'white' : 'black'}`}, fontSize: '23px' , fontWeight: '700' }}>
               <Grid sx={{ color: { sm: `${theme ? 'white' : 'black'}`} }}>                    
                {ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)} 
                {activeAccountBal != undefined ? parseFloat(activeAccountBal).toFixed(2) : '0.00'}
               </Grid>
               <Grid sx={{marginLeft: '3px' , cursor: 'pointer'}}>
                <ExpandMoreIcon fontSize='large' onClick={handleClickOpen}/>
               </Grid>
              </Grid>
             </Grid>
             <Grid sx={{ color: 'blue',borderRadius: '.5rem' }}>
              <DashboardItemBtn 
                onClick={handleAddMoneyOpen} 
                fullWidth 
                startIcon={<ControlPointSharpIcon /> } 
                sx={{
                  color: `${theme ? 'white' : 'white'}`,
                  marginTop: '12px',
                  padding: '20px 40px 16px 40px',
                  background: "#0BB2D4",
                  minWidth: '200px'
                }}
              >
                <span>Add Money</span>
              </DashboardItemBtn>  
             </Grid>
             <Grid sx={{ color: 'blue',borderRadius: '.5rem' }}>
              <DashboardItemBtn onClick={handleClickExchangeOpen} fullWidth startIcon={<LoopSharpIcon />} sx={{color: `${theme ? 'white' : 'white'}`, background: '#00A86B', marginTop: '12px', padding: '20px 50px 16px 50px',minWidth: '200px'}}>Exchange</DashboardItemBtn>
             </Grid>
             <Grid sx={{ color: 'blue', borderRadius: '.5rem' }}>
              <DashboardItemBtn onClick={() => navigate('/send')} fullWidth startIcon={<SendSharpIcon />} sx={{color: `${theme ? 'white' : 'white'}`, background: '#80982A', marginTop: '12px', padding: '20px 60px 16px 60px',minWidth: '200px' }}>Send</DashboardItemBtn>
             </Grid> 
             <Grid sx={{ display: { xs:'none', sm: 'none', md: 'block' }, padding: '20px 60px 16px 60px' , color: { sm: `${theme ? 'white' : 'black'}`}, cursor: 'pointer'}}>
              <Tooltip title="Account Section">
               <AppsSharpIcon sx={{ fontSize: 40 }} onClick={() => navigate('/accounts')} className='hover__on__rightIcon' />
              </Tooltip>
             </Grid>
             <Grid sx={{ display: { xs:'block', sm: 'block', md: 'none' }, color: { sm: `${theme ? 'white' : 'black'}`}, cursor: 'pointer'}}>
              <DashboardItemBtn onClick={() => navigate('/accounts')} fullWidth startIcon={<LoopSharpIcon />} sx={{color: `${theme ? 'white' : 'white'}`, background: '#00A86B', marginTop: '12px', padding: '20px 50px 16px 50px',minWidth: '200px'}}>Account Section</DashboardItemBtn>
             </Grid>         
            </Grid>
           :
          null
        }

        {
          KycDetails?.kcyDetails?.[0]?.status == "completed" && displayCryptoItem != "" ?
            <Grid padding={1} sx={{ color: `${theme ? 'white': 'black'}`,marginTop: '-10px' , gap: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
             <Grid sx={{ color: 'blue', borderRadius: '.5rem' }}>
              <DashboardItemBtn onClick={() => navigate('/crypto/buysell')} fullWidth startIcon={<SendSharpIcon />} sx={{color: `${theme ? 'white' : 'white'}`, background: '#6AC579', padding: '20px 60px 16px 60px',minWidth: '200px' }}>Buy/Sell</DashboardItemBtn>
             </Grid>
             <Grid sx={{ color: 'blue', borderRadius: '.5rem' }}>
              <DashboardItemBtn onClick={() => navigate('/crypto/wallet')} fullWidth startIcon={<SendSharpIcon />} sx={{color: `${theme ? 'white' : 'white'}`, background: '#4FC3F7', padding: '20px 60px 16px 60px',minWidth: '200px' }}>Wallet Address</DashboardItemBtn>
             </Grid>       
            </Grid>
           :
           null
        }

          <div>
            <SimpleDialog
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              accountChange={setAccountChange}
              loadr={setLoader}
              theme={theme}
              accountsList={accountsList}
              setActiveAccountDetails={setActiveAccountDetails}
              setActiveAccountBal={setActiveAccountBal}
              setAccountChange={setAccountChange}
              setDefaultAccountItem={setDefaultAccountItem}
              setAccountsList={setAccountsList}
              defaultAccountItem={DefaultAccountItem}
            />
          </div>

          <div>
            <ExchangeDialog
              selectedValue={selectedExchangeValue}
              open={Excopen}
              onExClose={handleExcClose}
              activeToAccount={setToExchangeAccount}
              theme={theme}
              accountsList={accountsList}
              ActiveAccountDetails={ActiveAccountDetails}
              DefaultAccountItem={DefaultAccountItem}
              activeAccountBal={activeAccountBal}
              fromValue={fromValue}
              convertedValue={convertedValue}
              setFromValue={setFromValue}
              setConvertedValue={setConvertedValue}
              setToExchangeBox={setToExchangeBox}
              setActiveRate={setActiveRate}
              setCalCulateOpen={setCalCulateOpen}
              calCulateOpen={calCulateOpen}
              feeChargeAmount={feeChargeAmount}
              reviewFlag={reviewFlag}
            />
          </div>
          <div>
            <React.Fragment>
              <Dialog
                open={exchangeOpen}
                fullScreen
                fullWidth
                onClose={() => handleExchangeClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{justifyContent: 'center'}}
              >
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loaderCr}
              >
                <CircularProgress color="inherit" />
              </Backdrop>        
              <DialogContent sx={{marginTop: '60px'}}>
                <DialogContentText id="alert-dialog-description">
                  <Grid sx={{display: 'flex' ,gap: '30px',  flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Grid sx={{display: 'flex' , flexDirection: 'column' ,}}>
                      <Grid><ArrowBackSharpIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor: 'pointer'}} onClick={() => handleExchangeClose()} /></Grid>
                        <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                          <Grid sx={{ display: 'flex' }}>
                            <Backdrop
                              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                              open={calCulateOpen}
                              onClick={handleClose}
                            >
                             <CircularProgress color="inherit" />
                            </Backdrop>
                            <ReactCountryFlag
                              countryCode={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                              svg
                              style={{
                                width: '2em',
                                height: '2em',
                                borderRadius: '50%',
                                marginTop: '10px',
                              }}
                              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                              cdnSuffix="svg"
                              title={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                            />
                                      
                            <ReactCountryFlag
                              countryCode={toExchangeBox?.country}
                              svg
                              style={{
                                width: '2em',
                                height: '2em',
                                borderRadius: '50%',
                                marginLeft: '-10px'
                              }}
                              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                              cdnSuffix="svg"
                              title={toExchangeBox?.country}
                            />

                          </Grid>
                          <Grid>
                            <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{fontWeight: '700'}}>Exchange {ActiveAccountDetails ? ActiveAccountDetails?.currency : DefaultAccountItem?.currency}</Grid>
                             <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{fontWeight: '700'}}>
                             {
                              activeRate && toExchangeBox ? 
                              <>
                                1{ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)} = {toExchangeBox ? getSymbolFromCurrency(toExchangeBox?.currency)+parseFloat(activeRate).toFixed(3) : ''}
                              </>
                              :
                              toExchangeBox  ? null : 
                              "Select Currency"
                             }
                             </Grid>
                            </Grid>
                          </Grid>
                    </Grid>
                    {errorExchangeMsg && <span style={{ color: 'red' }}>{errorExchangeMsg}</span>}
                    <Grid>
                        <Grid sx={{border: '1px solid white' , borderRadius: '.5rem', padding: '20px', background: `${theme ? '': 'white'}`}}>
                          <Grid sx={{display: 'flex' , flexDirection: 'row' , justifyContent: 'space-between'}} container padding={1}>
                            <Grid item xs={6} sx={{color: 'black', fontSize: '23px', fontWeight: '700', flexWrap: 'wrap'}}>
                              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="standard-adornment-amount" sx={{ color: `${theme ? 'white': 'black'}` }}>Amount</InputLabel>
                                <Input
                                  type="number" 
                                  sx={{fontWeight: '700', borderBottom: `${theme ? '1px solid white': ''}`, color: `${theme ? 'white': 'black'}`}}
                                  id="standard-adornment-amount"
                                  startAdornment={<InputAdornment position="start">
                                    <span style={{fontWeight: '700', color: `${theme ? 'white': 'black'}`}}>{ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)}</span>
                                  </InputAdornment>}
                                  onBlur={(e )=> HandleFromAmountExchange(e.target.value)}
                                  disabled={ toExchangeAccount?.currency ? false :  true }
                                />
                              </FormControl>
                            </Grid>
                            
                            <Grid className="exchange_flag_hover" 
                              sx={{
                                display:'flex' , 
                                gap: '6px' , 
                                justifyContent: 'center' , 
                                background: '#0c75e92b',
                                color:'#1111c6',
                                padding: '12px 15px 12px 15px',
                                borderRadius: '2rem',
                                cursor: 'pointer',
                                fontWeight: '700',
                                minWidth: '100px'
                              }}
                            >
                              <Grid>
                                <ReactCountryFlag
                                  countryCode={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                                  svg
                                  style={{
                                    width: '2em',
                                    height: '2em',
                                    borderRadius: '50%',
                                  }}
                                  cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                  cdnSuffix="svg"
                                  title="IN"
                                />
                            </Grid>

                            <Grid sx={{margin:'auto', color: `${theme ? 'white': 'black'}`}}>{ActiveAccountDetails?.name.substring(0,9)+'...'}</Grid>
                              <Grid sx={{margin:'auto', color: `${theme ? 'white': 'black'}`}}><ArrowForwardIosSharpIcon /></Grid>
                              </Grid>
                            </Grid>

                            <Grid sx={{display: 'flex' , flexDirection: 'row' , justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '12px'}}>
                              <Grid sx={{ fontWeight: '700', marginLeft: '10px', color: `${theme ? 'white': 'black'}`}}>
                                Fee: {ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency): ''}
                                { feeChargeAmount }
                              </Grid>
                              <Grid sx={{marginLeft: '12px',fontWeight: '700',color: `${theme ? 'white': 'black'}`}}>Balance: {ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency): ''}{ActiveAccountDetails ? parseFloat(ActiveAccountDetails?.amount).toFixed(2) : ''}</Grid>
                            </Grid>
                        </Grid>

                        <Grid sx={{display: 'flex', justifyContent: 'center'}}>
                          <KeyboardDoubleArrowDownSharpIcon 
                            sx=
                              {{ 
                                background: 'blue' , 
                                color: 'white' , 
                                fontSize: '46px' ,
                                borderRadius: '50%',
                                marginTop: '-16px'
                              }} 
                          />
                        </Grid>

                        <Grid sx={{border: '1px solid white' , flexWrap: 'wrap', marginTop: '-16px', borderRadius: '.5rem', padding: '20px', background: `${theme ? '' : 'white'}`}}>
                          <Grid sx={{display: 'flex' , flexDirection: 'row' , justifyContent: 'space-between'}} container>
                            <Grid item xs={6} sx={{color: `${theme ? 'white': 'black'}`, fontSize: '23px', fontWeight: '700'}}>{getSymbolFromCurrency(toExchangeBox?.currency)}{parseFloat(convertedValue).toFixed(2)}</Grid>
                              <Grid className="exchange_flag_hover" 
                                sx={{
                                  display:'flex' , 
                                  gap: '6px' , 
                                  justifyContent: 'center' , 
                                  background: '#0c75e92b',
                                  color:'#1111c6',
                                  padding: '12px 15px 12px 15px',
                                  borderRadius: '2rem',
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                  minWidth: '100px',
                                  flexWrap: 'wrap'
                                }} 
                                onClick={handleClickExchangeAccountOpen}
                              >
                              <Grid>
                              {
                                !toExchangeAccount ?
                                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <LanguageSharpIcon />
                                  </Avatar>
                                  :
                                  <ReactCountryFlag
                                    countryCode={toExchangeAccount?.country}
                                    svg
                                    style={{
                                      width: '2em',
                                      height: '2em',
                                      borderRadius: '50%',
                                    }}
                                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                    cdnSuffix="svg"
                                    title={toExchangeAccount?.country}
                                  />
                              } 
                              </Grid>
                              <Grid sx={{margin:'auto',color: `${theme ? 'white': 'black'}`}}>
                                {!toExchangeAccount ? ('Select Account').substring(0,9)+'...' : (toExchangeAccount?.name).substring(0,9)+'...'}
                              </Grid>
                             <Grid sx={{margin:'auto', color: `${theme ? 'white': 'black'}`}}><ArrowForwardIosSharpIcon /></Grid>
                            </Grid>
                          </Grid>

                          <Grid sx={{display: 'flex' , flexDirection: 'row' , justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap'}}>
                            <Grid sx={{color: `${theme ? 'white': 'black'}`, fontWeight: '700'}}>Will get exactly</Grid>
                            <Grid sx={{textAlign: {sm: 'right'}, fontWeight: '700' , color: `${theme ? 'white': 'black'}`}}>Balance: {getSymbolFromCurrency(toExchangeBox?.currency)}{toExchangeBox ? parseFloat(toExchangeBox?.amount).toFixed(3) || "0" : 0}</Grid>
                          </Grid>
                            
                        </Grid>
                    </Grid> 
                    {
                      convertedValue == 0 ?
                      <Button className='review_order_hover' sx={{ display: 'flex', cursor: 'pointer', color: 'white' ,justifyContent: 'center', flexWrap: 'wrap', borderRadius: '9999px' , p: '23px 15px', border: `${theme ? '1px solid white': ''}`, background: `${theme ? '': 'silver'}` }} >
                          Review Order
                      </Button>
                      :
                      reviewFlag ?
                      <Button variant="contained" className='review_order_hover' onClick={() => handleClickReviewOpen()} sx={{ display: 'flex', cursor: 'pointer', color: 'white' , background: '#1d4ed8 ',justifyContent: 'center', flexWrap: 'wrap', borderRadius: '9999px' , p: '23px 15px' }}>
                          Review Order
                      </Button>
                      :
                      <Button variant="contained" className='review_order_hover' sx={{ display: 'flex', cursor: 'pointer', color: 'white' ,justifyContent: 'center', flexWrap: 'wrap', borderRadius: '9999px' , p: '23px 15px' }} disabled>
                          Review Order
                      </Button>
                    }       
                  </Grid>
                </DialogContentText>
              </DialogContent>
              </Dialog>
            </React.Fragment>
          </div>

          {/*** Review Order Dialogue* */}
            
          <div>
            <React.Fragment>
              <Dialog
                open={reviewOpen}
                fullScreen
                fullWidth
                onClose={handleReviewClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{justifyContent: 'center'}}
              >
                        
              <DialogContent sx={{marginTop: '60px'}}>
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={exchangeLoader}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <DialogContentText id="alert-dialog-description">
                  <Grid sx={{display: 'flex' ,gap: '30px',  flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Grid sx={{display: 'flex' , flexDirection: 'column'}}>
                    <Grid><ArrowBackSharpIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor: 'pointer'}} onClick={handleReviewClose} /></Grid>
                   </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex' ,gap: '30px', color: 'black' , fontWeight: '600', flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
                     <Grid>
                      <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}> 
                        - {ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) :  getSymbolFromCurrency(DefaultAccountItem?.currency)}{parseFloat(fromValue).toFixed(2)}
                      </Grid>
                    <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                      {getSymbolFromCurrency(toExchangeBox?.currency)}
                      {parseFloat(convertedValue).toFixed(2)}
                    </Grid>
                  </Grid>
                  <Grid sx={{ display: 'flex' }}>
                    <ReactCountryFlag
                      countryCode={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                      svg
                      style={{
                        width: '2em',
                        height: '2em',
                        borderRadius: '50%',
                        marginTop: '10px',
                      }}
                      cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                      cdnSuffix="svg"
                      title={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                    />
                                        
                  <ReactCountryFlag
                    countryCode={toExchangeBox?.country}
                    svg
                    style={{
                      width: '2em',
                      height: '2em',
                      borderRadius: '50%',
                      marginLeft: '-10px'
                    }}
                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                    cdnSuffix="svg"
                    title={toExchangeBox?.country}
                  />         
                </Grid>
                </Grid>
                <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{display: 'flex',flexDirection: 'column', fontWeight: '600' }}>
                  <Grid>to <span style={{color: 'blue'}}>{toExchangeBox?.name}</span></Grid>
                  <Grid>{toExchangeBox?.iban}</Grid>
                </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex' , background: 'white', p: '12px 12px', borderRadius: '12px', marginTop: '30px',  flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                <Grid sx={{display: 'flex', color: 'black', fontWeight: '700', flexDirection: 'column' , gap: '30px', justifyContent: 'space-between' }}>
                  <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                    <Grid>Exchange</Grid>
                    <Grid>
                      {ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)}{parseFloat(fromValue).toFixed(2)}
                    </Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                    <Grid>Rate</Grid>
                    <Grid>1{ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)} = {getSymbolFromCurrency(toExchangeBox?.currency)}{activeRate}</Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                    <Grid>Fee</Grid>
                    <Grid>
                      {getSymbolFromCurrency(ActiveAccountDetails?.currency)}
                      {feeChargeAmount}
                    </Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                    <Grid>Total Charge</Grid>
                    <Grid>
                      {getSymbolFromCurrency(ActiveAccountDetails?.currency)}
                      {parseFloat(fromValue) + parseFloat(feeChargeAmount)}
                    </Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                    <Grid>Will get Exactly</Grid>
                    <Grid>
                      {getSymbolFromCurrency(toExchangeAccount?.currency)}
                      {parseFloat(convertedValue).toFixed(2)}
                    </Grid>
                  </Grid>
                </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex' , background: 'white', p: '12px 12px', borderRadius: '12px', marginTop: '30px',  flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Grid sx={{display: 'flex', color: 'black', fontWeight: '700', flexDirection: 'column' , gap: '10px', justifyContent: 'space-between' }}>
                      <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
                        <Grid>Source Account</Grid>
                      </Grid>
                      <Grid sx={{display: 'flex', flexDirection: 'row' , p: '7px 10px', justifyContent: 'space-between' }}>
                        <Grid sx={{display: 'flex', flexDirection: 'row' , gap: '10px',  justifyContent: 'space-between' }}>
                          <Grid>
                            <ReactCountryFlag
                              countryCode={ActiveAccountDetails ? ActiveAccountDetails?.country : DefaultAccountItem?.country}
                              svg
                              style={{
                                width: '3em',
                                height: '3em',
                                borderRadius: '50%',
                                marginLeft: '-10px'
                              }}
                              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                              cdnSuffix="svg"
                              title="IN"
                            />
                          </Grid>
                        <Grid>
                        <Grid>{ActiveAccountDetails ? ActiveAccountDetails?.name : DefaultAccountItem?.name}</Grid>
                        <Grid>{ActiveAccountDetails ? ActiveAccountDetails?.iban : DefaultAccountItem?.iban}</Grid>
                      </Grid>
                      </Grid>
                      <Grid>{ActiveAccountDetails ? getSymbolFromCurrency(ActiveAccountDetails?.currency) : getSymbolFromCurrency(DefaultAccountItem?.currency)}{ActiveAccountDetails ? parseFloat(ActiveAccountDetails?.amount).toFixed(2): 0}</Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid sx={{display: 'flex' , p: '12px 12px', borderRadius: '12px', marginTop: '30px',  flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Button variant="contained" className='review_order_hover' onClick={() => HandleTransactions()} sx={{ display: 'flex', cursor: 'pointer', color: 'white' , background: '#1d4ed8 ',justifyContent: 'center', flexWrap: 'wrap', borderRadius: '9999px' , p: '23px 15px' }}>
                      Exchange
                      {/* {ActiveAccountDetails ? ActiveAccountDetails?.currency : DefaultAccountItem?.currency} to {toExchangeBox?.currency} */}
                    </Button>
                  </Grid>

                </DialogContentText>
              </DialogContent>
           </Dialog>
          </React.Fragment>
          </div>
        {/*****Review Order Dialgoue */}

        {/***Add Money* */}  
        <AddMoneyDialog
          selectedValue={selectedValue}
          open={AddMoneyOpen}
          onClose={handleAddMoneyClose}
          accountChange={setAccountChange}
          loadr={setLoader}
          activeAccount={ActiveAccountDetails?._id}
          accountBalance={ActiveAccountDetails?.amount}
          acctDetails={ActiveAccountDetails}
          theme={theme}
          accountList={accountsList}
        />
        {/****Add Money */}                          

      </Box>

      {
        displayCryptoItem == "" ? 
        <>
          {/***Transactions List***/}  
          <Box sx={{ background: `${theme ? 'transparent' : 'white'}` , border: `${theme ? '2px solid lightblue' : '1px solid transparent'}` , height: 'auto' , display: 'flex', flexDirection: 'column', boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
            {
              ActiveAccountDetails ? <TransactionsList currency={ActiveAccountDetails} /> : 
              <>
                <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Grid sx={{width: '30%'}}><Skeleton width="92%" sx={{margin: '12px'}}/></Grid>
                  <Grid sx={{width: '30%'}}><Skeleton width="92%" sx={{margin: '12px'}}/></Grid>
                </Grid>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
              </>
            }
          </Box>
          {/***Transactions List***/}
        </>
        :
        <>
          {/***Crypto Transactions List***/}  
          <Box sx={{ background: `${theme ? 'transparent' : 'white'}` , border: `${theme ? '2px solid lightblue' : '1px solid transparent'}` , height: 'auto' , display: 'flex', flexDirection: 'column', boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem' }}>
            {
              displayCryptoItem != "" ? <CryptoTransactionList /> : 
              <>
                <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Grid sx={{width: '30%'}}><Skeleton width="92%" sx={{margin: '12px'}}/></Grid>
                  <Grid sx={{width: '30%'}}><Skeleton width="92%" sx={{margin: '12px'}}/></Grid>
                </Grid>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
                <Skeleton sx={{padding: '12px', margin: '12px'}}/>
              </>
            }
          </Box>
          {/***Crypto Transactions List***/}   
        </>
      }               
      </Grid>
    </>
  )
}
