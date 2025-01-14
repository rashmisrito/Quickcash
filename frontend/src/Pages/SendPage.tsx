
import axios from 'axios';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { useFee } from '../Hooks/useFee';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import InputBase from '@mui/material/InputBase';
import { useAccount } from '../Hooks/useAccount';
import IconButton from '@mui/material/IconButton';
import ReactCountryFlag from 'react-country-flag';
import Typography from '@mui/material/Typography';
import React , {useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import { useOutletContext } from "react-router-dom";
import getSymbolFromCurrency from 'currency-symbol-map';
import DialogActions from '@mui/material/DialogActions';
import { Closebtn, Colorbtn } from '../Component/Button/ColorButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Dialog, DialogContent, DialogContentText, Divider, Grid, MenuItem, Select, TextField, Toolbar, Tooltip } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  bic_code: any;
  country: any;
  currency: any;
  defaultAccount: string;
  iban: any;
  name: string;
  status: Boolean;
}

function TabPanel(props:any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SendPage() {

  const [openbt, setOpenbt] = React.useState(false);
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  const handleClickOpenbt = () => {
    setOpen(true);
  };

  const handleClosebt = () => {
    setAmountBT(0);
    setBtConvertValue(0);
    setOpenbt(false);
    setSelectedAcc('');
  };

  const navigate = useNavigate();
  const {feeCommision} = useFee("Debit");
  const [sendCurrAccountId,setSendCurrAccountId] = React.useState<any>('');
  const {list} = useAccount(accountId?.data?.id);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const [sendCurrency,setSendCurrency] = React.useState<any>('');
  const [receiveCurrency,setRecieveCurrency] = React.useState<any>('');

  const [exchangeOpen, setExchangeOpen] = React.useState(false);
  const [accountsList,setAccountsList]  = React.useState<[]>();
  const [receipientList,setRecepientList] = React.useState<[]>();
  const [ActiveAccountDetails,setActiveAccountDetails] = React.useState<ActiveAccDetails>();

  const [Name,setName] = React.useState<any>('');
  const [Email,setEmail] = React.useState<any>('');
  const [Mobile,setMobile] = React.useState<any>('');
  const [BankName,setBankName] = React.useState<any>('');
  const [Iban,setIban] = React.useState<any>('');
  const [Bic_Code,setBicCode] = React.useState<any>('');
  const [recAddress,setRecAddress] = React.useState<any>('');

  const [theme]:any = useOutletContext();
  
  useEffect(() => {
   if(localStorage.getItem('setExchangeOpen2')) {
    setExchangeOpen2(true);
    localStorage.removeItem('setExchangeOpen2');
   }
  },[]);

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getReceipientList(accountId.data.id);
    getAllAccountsList(accountId.data.id);
  },[]);

  const [fromAmount,setFromAmount] = React.useState<any>(0);

  useEffect(() => {
    calCulateExChangeCurrencyValue();
  },[sendCurrency,receiveCurrency, fromAmount]);

  const [Rate,setRate] = useState<any>(0);
  const [ExchangeError,setExchangeError] = useState<any>('');
  const [convertedValue,setConvertedValue] = useState<any>(0);

  const [feeCharge,setFeeCharge] = React.useState<any>(0);

  const calCulateExChangeCurrencyValue = async () => {
    if(sendCurrency && receiveCurrency && fromAmount) {
      
      var valCharge = 0;
      
      if(feeCommision?.commissionType == "percentage") {
        console.log("minimumValue",feeCommision.minimumValue);
        valCharge = fromAmount*feeCommision?.value/100;
        if(valCharge < feeCommision.minimumValue) {
          setFeeCharge(feeCommision.minimumValue);
        } else {
          setFeeCharge(valCharge);
        }
      } else {
        valCharge = feeCommision?.value;
        setFeeCharge(valCharge);
      }

      // @ts-ignore
      var checkVal = parseFloat(fromAmount) + parseFloat(valCharge); 
      if(checkVal > currentBalance) {
        alertnotify("User doesn't have sufficient balance to send money", "error");
        setFromAmount(0);
      } else if(fromAmount > currentBalance) {
        alertnotify("User doesn't have enough balance to send money", "error");
        setFromAmount(0);
      }

      const options = {
        method: 'GET',
        url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
        params: {
          from: sendCurrency,
          to: receiveCurrency,
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
          setConvertedValue(response.data.result.convertedAmount*fromAmount);
          setRate(parseFloat(response.data.result.convertedAmount).toFixed(2));
        } else {
          setExchangeError(response.data.validationMessage[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  } 

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

  const HandleSwitchAccount = async (id:any) => {
    const splitVal = id.split('-');
    await axios.patch(`/${url}/v1/user/update-profile`, {
      "user_id": splitVal[0],
      "defaultCurrency": splitVal[2],
      "country": splitVal[1]
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify("Default Currency Account has been changed Successfully", "Success");
        getNewActiveAccounts(splitVal[0]);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const getNewActiveAccounts = async(id:any) => {
    await axios.get(`/${url}/v1/account/accountbyid/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      setOpen(false);
      if(result.data.status == "201") {
       console.log("New Active Account", result?.data?.data);
       setActiveAccountDetails(result.data.data);
      }
    })
    .catch(error => {
      setOpen(false);
      console.log("error", error);
    })
  }

  const HandleFromAmount = (value:any) => {
    setFromAmount(value);
    var checkVal = parseFloat(value) + parseFloat(feeCharge);
    if(sendCurrency && checkVal > currentBalance) {
      alertnotify("User doesn't have sufficient balance to send money", "error");
      setFromAmount(0);
    } else if(sendCurrency && value > currentBalance) {
      alertnotify("User doesn't have enough balance to send money", "error");
      setFromAmount(0);
    }
  }

  const [sendSideVal,setSendSideVal] = React.useState<any>('');
  const [currentBalance,setCurrentBalance] = React.useState<any>(0);

  const HandleSendCurrency = (val:any) => {
    var valChn = val.split('-');
    setSendSideVal(valChn[1]);
    setSendCurrAccountId(valChn[1]);
    setSendCurrency(valChn[0]);
    setRecieveCurrency('');
    setFeeCharge(0);
    ValidateSendAmountToCurrentAccountBalance(valChn[1]);
  }

  const ValidateSendAmountToCurrentAccountBalance = async (itemValue:any) => {
    if(itemValue) {
      await axios.get(`/${url}/v1/account/accountbyid/${itemValue}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
      if(result.data.status == 201) {
        setCurrentBalance(result?.data?.data?.amount);
        var checkVal = parseFloat(fromAmount) + parseFloat(feeCharge);
        if(checkVal > result?.data?.data?.amount) {
          alertnotify("User doesn't have enough balance to send money", "error");
          setFromAmount(0);
        } else if(fromAmount > result?.data?.data?.amount) {
          alertnotify("User doesn't have enough balance to send money", "error");
          setFromAmount(0);
        }
       }
      })
      .catch(error => {
        console.log("Account Details Hook API Error", error);
      })
    }
  }

  const getAllAccountsList = async (id:any,text="") => {
    await axios.get(`/${url}/v1/account/list/${id}?title=${text}`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setAccountsList(result.data.data);
       getDefaultAccountList(id);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const HandleSearchReceipient = (text:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getReceipientList(accountId?.data?.id,text);
  }

  const getReceipientList = async(id:string,text="") => {
    await axios.get(`/${url}/v1/receipient/list/${id}?title=${text}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setRecepientList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const getDefaultAccountList = async (id:any) => {
    await axios.get(`/${url}/v1/account/default/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      console.log("Result result",result.data.data);
      if(result.data.status == "201") {
       console.log("Default Account", result?.data?.data);
       setActiveAccountDetails(result.data.data[0].accountDetails);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const handleClickExchangeOpen = () => {
   setExchangeOpen(true);
  };

  const handleExchangeClose = () => {
   setExchangeOpen(false);
  };

  const [exchangeOpen2, setExchangeOpen2] = React.useState(false);

  const handleClickExchangeOpen2 = () => {
   setExchangeOpen2(true);
  };

  const handleExchangeClose2 = () => {
   setExchangeOpen2(false);
  };

  const [exchangeOpen3, setExchangeOpen3] = React.useState(false);
  
  const handleClickExchangeOpen3 = () => {
   setExchangeOpen3(true);
  };
  const handleExchangeClose3 = () => {
   setExchangeOpen3(false);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RedirectToExchange = () => {
    localStorage.setItem('exChangeAcive', "true");
    navigate('/home');
  }

  const HandleSaveIndividualData = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/receipient/add`, {
      "name": Name,
      "rtype": "Individual",
      "user":  accountId?.data?.id,
      "iban": Iban,
      "bic_code": Bic_Code,
      "country": receiveCurrency.slice(0,2),
      "currency": receiveCurrency,
      "amount": 0,
      "mobile": Mobile,
      "email": Email,
      "address": recAddress,
      "bankName": BankName,
      "status": true
     }, 
     {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
     if(result.data.status == "201") {
       alertnotify(result.data.message,"success");
       addMoneyTowallet(accountId?.data?.id,sendCurrAccountId,sendCurrency,'Bank Transfer',fromAmount,result.data.data?._id);
     }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error.response.data.message,"error");
     })
  }

  const addMoneyTowallet = async(user:any,acct:any,ctype:any,TType:any,amount:any,recipientAcc:any) => {
    await axios.post(`/${url}/v1/transaction/addsend`, {
     "user": user,
     "source_account": acct,
     "transfer_account": acct,
     "trans_type": "Add Money",
     "tr_type": "rbank-transfer",
     "receipient": recipientAcc,
     "iban": Iban,
     "bic": Bic_Code,
     "fee": feeCharge ? feeCharge : 0,
     "info": `${TType}`,
     "country": ``,
     'amount': parseFloat(fromAmount),
     'conversionAmount': convertedValue,
     "conversionAmountText": `${getSymbolFromCurrency(receiveCurrency)}${parseFloat(convertedValue).toFixed(2)}`,
     "amountText": `${getSymbolFromCurrency(ctype)}${parseFloat(amount) + parseFloat(feeCharge)}`,
     "remainingAmount": 0,
     "from_currency": `${sendCurrency}`,
     "to_currency":  `${receiveCurrency}`,
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
      setFeeCharge(0);
      setFromAmount(0);
      setConvertedValue(0);
      setSendCurrency('');
      setRecieveCurrency('');
      navigate('/home');
      console.log(result.data.status);
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [amountBT,setAmountBT] = React.useState<any>(0);
  const [selectedAcc,setSelectedAcc] = React.useState<any>('');
  const [feeCommValue,setFeeCommValue] = React.useState<any>(0);
  const [btConvertValue,setBtConvertValue] = React.useState<any>(0);
  const [activeBeneDetails,setActiveBeneDetails] = React.useState<any>('');
  const [activeAccountBT,setActiveAccountBT] = React.useState<any>('');
  const [minFee,setMinFee] = React.useState<any>(0);

  const HandleAmountBT = async (value:any) => {
    if(value > 0) {
      await axios.get(`/${url}/v1/admin/feetype/type?type=debit`)
      .then(result => {
      if(result.data.status == 201) {
        if(result.data.data.length > 0) {
          var valGet = result?.data?.data?.[0]?.feedetails?.[0];
          setMinFee(valGet?.minimumValue);
          if(valGet?.commissionType == "percentage") {
            value >= valGet?.minimumValue ? 
            setFeeCommValue((parseFloat(value)*parseFloat(valGet?.value)/100)) 
            : 
            setFeeCommValue(valGet?.minimumValue);
            if(selectedAcc) {
              ValidateAccountBalance(selectedAcc,value);
            } else {
              console.log(ActiveAccountDetails?._id)
              ValidateAccountBalance(ActiveAccountDetails?._id,value);
            }
          } else {
            setFeeCommValue(valGet?.value);
            if(selectedAcc) {
              ValidateAccountBalance(selectedAcc,value);
            } else {
              console.log(ActiveAccountDetails?._id)
              ValidateAccountBalance(ActiveAccountDetails?._id,value);
            }
          }
        }
       }
      })
      .catch(error => {
        console.log("Fee Commission Hook API Error", error);
      })
    }
    
    setAmountBT(value);
  }

  const ValidateAccountBalance = async (itemValue:any,amt:any) => {
    if(itemValue) {
      await axios.get(`/${url}/v1/account/accountbyid/${itemValue}`,{
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(async result => {
      if(result.data.status == 201) {
        setActiveAccountBT(result?.data?.data);
        var checkVal = parseFloat(amt) + parseFloat(feeCommValue);
        if(checkVal > result?.data?.data?.amount) {
          alertnotify("We regret to inform you that your account does not have enough funds to complete this transaction. Please ensure you have sufficeint balance before attempting to send money.", "error");
          setAmountBT(0);
        } else if(amt > result?.data?.data?.amount) {
          alertnotify("We regret to inform you that your account does not have enough funds to complete this transaction. Please ensure you have sufficeint balance before attempting to send money.", "error");
          setAmountBT(0);
        } else {
          if(result?.data?.data?.currency != activeBeneDetails?.currency) {
            const options = {
              method: 'GET',
              url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
              params: {
                from: result?.data?.data?.currency,
                to: activeBeneDetails?.currency,
                amount: amt
              },
              headers: {
               'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
               'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
              }
            };
             
            try {
              const response = await axios.request(options);
              if(response.data.success) {
                setBtConvertValue(response.data.result.convertedAmount);
              } else {
                setExchangeError(response.data.validationMessage[0]);
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            setBtConvertValue(amt);
          }
        }
       }
      })
      .catch(error => {
        console.log("Account Details Hook API Error", error);
      })
    }
  }

  const HandleSelectedAcc = (values:string) => {
    setSelectedAcc(values);
    console.log(values, ActiveAccountDetails?._id);
  }

  const HandleTransactionsBene = async (values:any) => {
    setOpenbt(true);
    setActiveBeneDetails(values);
  }  

  const HandleSendTransBene = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/transaction/addsend`, {
      "user": accountId?.data?.id,
      "source_account": selectedAcc ? selectedAcc : ActiveAccountDetails?._id,
      "transfer_account": selectedAcc ? selectedAcc : ActiveAccountDetails?._id,
      "trans_type": "Add Money",
      "tr_type": "bank-transfer",
      "receipient": activeBeneDetails?._id,
      "iban": "",
      "bic": "",
      "fee": feeCommValue ? minFee > feeCommValue ? minFee : feeCommValue : 0,
      "info": `Bank Transfer`,
      "country": ``,
      'amount': parseFloat(amountBT),
      'conversionAmount': activeBeneDetails?.currency == activeAccountBT?.currency ? 0: btConvertValue,
      "conversionAmountText": `${getSymbolFromCurrency(activeAccountBT?.currency)}${parseFloat(btConvertValue).toFixed(2)}`,
      "amountText": `${getSymbolFromCurrency(activeAccountBT?.currency)}${parseFloat(amountBT) + parseFloat(feeCommValue)}`,
      "remainingAmount": 0,
      "from_currency": `${activeAccountBT?.currency}`,
      "to_currency":  `${activeBeneDetails?.currency}`,
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
      if(result.data.status == 201) {
        setOpenbt(false);
        setAmountBT(0);
        setSelectedAcc(0);
        setBtConvertValue(0);
        console.log(result.data.status);
        alertnotify(result?.data?.message,"Success");
      }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error?.response?.data?.message,"error");
     })
  }

  const confirmHandle = () => {
    var co = confirm("Are you sure?");
    if(co == true) {
      HandleSendTransBene();
    }
  }

  return (
    <Toolbar sx={{ display: 'flex' , flexDirection: 'column' }}>
      <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '70%'} }}>
        <KeyboardBackspaceIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor: 'pointer'}} onClick={() => navigate('/home')}/>
      </Box>

      <Grid sx={{display:'flex', flexDirection: 'row' , justifyContent: 'space-between' , width: {xs: '100%', md: '70%'}}}>
        <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontSize: {md: '30px', fontWeight: '700'} }}>Send Money</Grid>
      </Grid>

      <Box sx={{flexGrow: '1',marginTop: '2%', width: {xs: '100%', md: '70%'}}}>
        <Grid sx={{display: 'flex', flexDirection: 'column'}}>
          <Grid onClick={() => handleClickExchangeOpen3()} sx={{display: 'flex', background: `${theme ? '' : 'white'}`, cursor: 'pointer' ,borderRadius: '.5rem' ,border: '1px solid silver', padding: '10px 12px', flexDirection: 'row' , justifyContent: 'space-between'}}>
            <Grid sx={{display: 'flex', flexDirection: 'row'}}>
              <Grid sx={{ padding: '10px 1px' }}><AddBoxIcon sx={{fontSize: '50px'}} /></Grid>
              <Grid sx={{ padding: '10px 6px' }}>
              <Grid sx={{ color: `${theme ? 'white' : 'black'}`, fontWeight: '700' }}>Someone new</Grid>
              <Grid>Pay a recipient's bank account</Grid>
            </Grid>
          </Grid>
          <Grid><KeyboardArrowRightIcon sx={{fontSize: '50px' , cursor: 'pointer'}}  /></Grid>
          </Grid>
          {/* className='statement__hover' */} 
          <Grid onClick={() => handleClickExchangeOpen2()} sx={{display: 'flex', background: `${theme ? '' : 'white'}`,cursor: 'pointer' ,borderRadius: '.5rem' ,border: '1px solid silver', padding: '10px 12px', flexDirection: 'row' , justifyContent: 'space-between'}}>
            <Grid sx={{display: 'flex', flexDirection: 'row'}}>
              <Grid sx={{ padding: '10px 1px' }}><AccountCircleIcon sx={{fontSize: '50px'}} /></Grid>
                <Grid sx={{ padding: '10px 6px' }}>
                <Grid sx={{ color: `${theme ? 'white' : 'black'}`, fontWeight: '700' }}>Recipients</Grid>
                <Grid>Pay a recipient's bank account</Grid>
              </Grid>
            </Grid>
            <Grid><KeyboardArrowRightIcon sx={{fontSize: '50px' , cursor: 'pointer'}}  /></Grid>
          </Grid>
          {/* <Grid onClick={() => handleClickExchangeOpen()} sx={{display: 'flex', background: `${theme ? '' : 'white'}`,cursor: 'pointer' ,borderRadius: '.5rem' ,border: '1px solid silver', padding: '10px 12px', flexDirection: 'row' , justifyContent: 'space-between'}}>
            <Grid sx={{display: 'flex', flexDirection: 'row'}}>
              <Grid sx={{ padding: '10px 1px' }}><AccountBalanceIcon sx={{fontSize: '50px'}} /></Grid>
                <Grid sx={{ padding: '10px 6px' }}>
                <Grid sx={{ color: `${theme ? 'white' : 'black'}`, fontWeight: '700' }}>My Accounts</Grid>
                <Grid>Change Primary account from available sub accounts</Grid>
                </Grid>
              </Grid>
              <Grid><KeyboardArrowRightIcon sx={{fontSize: '50px' , cursor: 'pointer'}}  /></Grid>
          </Grid> */}
          {/* <Grid onClick={() => RedirectToExchange()} sx={{display: 'flex', background: `${theme ? '' : 'white'}`, cursor: 'pointer' ,borderRadius: '.5rem' ,border: '1px solid silver', padding: '10px 12px', flexDirection: 'row' , justifyContent: 'space-between'}}>
            <Grid sx={{display: 'flex', flexDirection: 'row'}}>
              <Grid sx={{ padding: '10px 1px' }}><AutorenewIcon sx={{fontSize: '50px'}} /></Grid>
              <Grid sx={{ padding: '10px 6px' }}>
              <Grid sx={{ color: `${theme ? 'white' : 'black'}`, fontWeight: '700' }}>Exchange</Grid>
              <Grid>Move funds between accounts</Grid>
              </Grid>
            </Grid>
            <Grid><KeyboardArrowRightIcon sx={{fontSize: '50px' , cursor: 'pointer'}}  /></Grid>
          </Grid> */}
        </Grid>
      </Box>

      <div>
        <React.Fragment>
          <Dialog
            open={exchangeOpen}
            fullScreen
            fullWidth
            onClose={handleExchangeClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{justifyContent: 'center'}}
          >        
            <DialogContent sx={{marginTop: '60px'}}>
              <DialogContentText id="alert-dialog-description">
                <Grid sx={{display: 'flex' ,gap: '10px' , p: '10px 12px', borderRadius: '.5rem', flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                  <Grid><ArrowBackOutlinedIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ cursor: 'pointer' }} onClick={() => setExchangeOpen(!exchangeOpen)} /></Grid>
                    <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontWeight: '700' }}>Select account to move money</Grid>
                      <Grid sx={{display: 'flex', fontWeight: '700', flexDirection: 'column' , background: `${theme ? '' : '#e2e8f0'}`, borderRadius: '.5rem', padding: '10px 12px', color: `${theme ? 'white': 'black'}`, border: `${theme ? '2px solid white' : '3px solid white'}`, gap: '10px'}}>
                        <Grid>Sending from</Grid>
                          <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px',justifyContent: 'space-between'}}>
                             <Grid>
                                <ReactCountryFlag
                                  countryCode={ActiveAccountDetails?.country}
                                  svg
                                  style={{
                                    width: '2em',
                                    height: '2em',
                                    borderRadius: '50%',
                                    marginTop: '10px',
                                  }}
                                  cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                  cdnSuffix="svg"
                                  title={ActiveAccountDetails?.country}
                                />
                              </Grid>
                            <Grid sx={{ padding: '15px 1px', }}>{ActiveAccountDetails?.name}</Grid>
                        </Grid>
                      <Grid>
                      <Colorbtn variant="contained" onClick={handleOpen}>Change</Colorbtn>
                    </Grid>
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Grid>Available Balance</Grid>
                    <Grid>{getSymbolFromCurrency(ActiveAccountDetails?.currency)}{parseFloat(ActiveAccountDetails?.amount).toFixed(2)}</Grid>
                    </Grid>
                    </Grid>
                </Grid>

                <Grid sx={{ display: 'flex', padding: '10px', flexDirection: 'row', marginX: {lg: '350px'} }}>
                    <Grid sx={{border: '1px solid silver', width: '50%', height: '1%', marginTop: '1%', position: 'relative', zIndex: '10'}}></Grid>
                      <Grid sx={{textAlign: 'center', justifyContent: 'center', position: 'relative', marginTop: '7px', zIndex: '100'}}>
                        <ArrowCircleDownIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} style={{marginTop: '-19px',fontSize: '39px'}}/>
                      </Grid> 
                       <Grid sx={{border: '1px solid silver', width: '50%', height: '1%',marginTop: '1%', position: 'relative', zIndex: '10'}}></Grid>
                </Grid>

                <Grid sx={{display: 'flex' ,gap: '10px', marginTop: '20px',flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '350px'}}}>
                {
                  accountsList?.map((item:any,index:number) => (
                  <>
                    { ActiveAccountDetails?._id != item?._id &&
                     <>
                      <Grid key={index} sx={{display: 'flex', padding: '10px 12px', borderRadius: '.5rem', background: `${theme ? '' : 'white'}`,  color: `${theme ? 'white': 'black'}`, border: `${theme ? '2px solid white' : '3px solid white'}`,flexDirection: 'row', gap: '10px'}}>
                        <Grid>
                          <ReactCountryFlag
                            countryCode={item?.country}
                            svg
                            style={{
                              width: '3em',
                              height: '3em',
                              borderRadius: '50%',
                              marginTop: '10px',
                            }}
                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                            cdnSuffix="svg"
                            title={item?.country}
                          />
                        </Grid>
                        <Grid sx={{ fontWeight: '700 ', color: `${theme ? 'white': 'black'}`, padding: '10px' }}>
                          <Grid>
                            {item?.name}
                          </Grid>
                          <Grid>
                            {getSymbolFromCurrency(item?.currency)}{parseFloat(item?.amount).toFixed(2)} - {item?.iban}
                          </Grid>
                        </Grid>
                      </Grid> 
                      </>
                    }   
                   </>
                  ))
                }          
              </Grid>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      </div>

      <div>
        <React.Fragment>
          <Dialog
            open={exchangeOpen2}
            fullScreen
            fullWidth
            onClose={handleExchangeClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{justifyContent: 'center'}}
          >      
          <DialogContent sx={{marginTop: '60px'}}>
            <DialogContentText id="alert-dialog-description">
              <Grid sx={{display: 'flex' ,gap: '10px' , p: '10px 12px', borderRadius: '.5rem', flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                <Grid onClick={() => setExchangeOpen2(!exchangeOpen2)}> 
                  <button className="enter-button">
                  <ArrowBackOutlinedIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ cursor: 'pointer', color: 'white' }} onClick={() => setExchangeOpen2(!exchangeOpen2)} />
                    Back
                  </button>
                </Grid>
                  <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ display: 'flex', borderRadius: '.5rem', flexDirection: 'row' , justifyContent: 'space-between', fontWeight: '700' }}>
                    <Grid>Select Beneficiary</Grid>
                    <Grid sx={{cursor: 'pointer'}} onClick={() => navigate('/beneficiary/add')}>
                      <div className="plusButton">
                        <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                          <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                          </g>
                        </svg>
                      </div>
                    </Grid>
                 </Grid>
                 <Grid sx={{display:'flex', flexDirection: 'row' , justifyContent: 'space-between' , width: {xs: '100%', md: '100%'}}}>
                   <Paper
                     component="form"
                     sx={{ p: '2px 5px', marginTop: '15px',background: `${theme ? '' : 'white'}`,border: `${theme ? '1px solid white' : ''}`, display: 'flex', width: '100%', alignItems: 'center'}}
                    >
                     <InputBase
                       sx={{ ml: 1, flex: 1 }}
                       placeholder="Search by account name, iban"
                       inputProps={{'aria-label': 'search by account name,iban'}}
                       onChange={(e) => HandleSearchReceipient(e.target.value)}
                     />
                      <IconButton type="button" sx={{ p: '10px', color: `${theme ? 'white' : 'black'}` }} aria-label="search">
                        <SearchIcon />
                        </IconButton>
                      </Paper>
                  </Grid>
                </Grid>

                <Grid sx={{display: 'flex' ,gap: '10px', marginTop: '20px',flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '350px'}}}>
                  <Grid sx={{display: 'flex', padding: '10px 12px', borderRadius: '.5rem', background: `${theme ? '': 'white'}`,border: `${theme ? '1px solid white': ''}`, flexDirection: 'column', gap: '10px'}}>
                    <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Grid sx={{color: `${theme ? 'white': 'black'}` }}>Recipients</Grid>
                    </Grid>
                    {
                      receipientList?.map((item:any,index) =>  (
                      <>
                        {/* className='receipient__hover' */}
                        <Grid key={index} onClick={() => HandleTransactionsBene(item)} sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'row',color: `${theme ? 'white': 'black'}`, padding: '10px 12px'}}>
                          <Grid><WorkIcon style={{ fontSize: '50px' }}/></Grid>
                          <Grid sx={{ padding: '1px 12px' , fontSize: '15px', color: `${theme ? 'white': 'black'}`, fontWeight: '700'}}>
                            <Grid>{item?.name}</Grid>
                            <Grid>{item?.iban}</Grid>
                          </Grid>
                        </Grid>
                      </>
                      ))
                    }
                    {
                      receipientList?.length == 0 && <Typography sx={{ color: `${theme ? 'white': 'black'}` }}>No Result found</Typography>
                    }
                  </Grid>              
                </Grid>
                    
                <Dialog
                  fullWidth
                  open={openbt} 
                  keepMounted
                  onClose={handleClosebt}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Beneficairy Account Details"}</DialogTitle>
                    <hr style={{width: '100%'}}/>
                    <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px'}}>
                      <Grid>IBAN / Account Number : {activeBeneDetails?.iban}</Grid>
                      <Grid>BIC Code  / IFSC Code : {activeBeneDetails?.bic_code}</Grid>
                      <Grid>Currency : {activeBeneDetails?.currency} </Grid>
                      <Grid>
                        <label htmlFor="Select Account">Select Account</label>
                        <Select onChange={(e) => HandleSelectedAcc(e.target.value)} value={selectedAcc ? selectedAcc : ActiveAccountDetails?._id} fullWidth>
                        {
                          accountsList?.map((item:any,index:number) => (
                           <MenuItem value={item?._id} key={index}>{item?.name} - {item?.iban} - {getSymbolFromCurrency(item?.currency)}{parseFloat(item?.amount).toFixed(2)}</MenuItem>
                          ))
                        } 
                        </Select>
                      </Grid>
                      <Grid>
                        <label htmlFor="Amount">Enter Amount</label>
                        <TextField fullWidth  value={amountBT} onChange={(e) => HandleAmountBT(e.target.value)} />  
                      </Grid>
                      {
                        amountBT ?
                        <>
                          <Grid>
                            Fee : {getSymbolFromCurrency(activeAccountBT?.currency)}
                            { minFee > feeCommValue ? minFee : feeCommValue}
                          </Grid>
                          <Grid>
                            Total amount deduction : {getSymbolFromCurrency(activeAccountBT?.currency)}
                            { minFee > feeCommValue ? parseFloat(minFee) + parseFloat(amountBT) : parseFloat(feeCommValue) + parseFloat(amountBT) }
                          </Grid>
                          <Grid>
                            You will get this amount : {getSymbolFromCurrency(activeBeneDetails?.currency)}{btConvertValue}
                          </Grid>
                        </>
                        :
                        null
                      }
                    </Grid>  
                    <DialogActions>
                      <Colorbtn onClick={() => confirmHandle()}>Submit</Colorbtn>
                      <Closebtn onClick={handleClosebt}>Cancel</Closebtn>
                    </DialogActions>
                  </Dialog>
                 </DialogContentText>
                </DialogContent>
              </Dialog>
            </React.Fragment>
      </div>

      <div>
          <React.Fragment>
            <Dialog
              open={exchangeOpen3}
              fullScreen
              fullWidth
              onClose={handleExchangeClose3}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              sx={{justifyContent: 'center'}}
            >          
            <DialogContent sx={{marginTop: '60px'}}>
              <DialogContentText id="alert-dialog-description">
                <Grid sx={{display: 'flex' , gap: '10px' , p: '10px 12px', borderRadius: '.5rem', flexDirection: 'column' , justifyContent: 'center' , marginLeft: {lg: '200px'}}}>
                  <Grid><ArrowBackOutlinedIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ cursor: 'pointer' }} onClick={() => setExchangeOpen3(!exchangeOpen3)} /></Grid>
                  <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontWeight: '700' }}>Recipient</Grid>
                  <Box className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ marginTop: '32px' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4} sx={{marginLeft: '14px', boxShadow: '1px 1px 10px silver', borderRadius: '7px'}}>
                        <Typography sx={{padding: '12px', color: `${theme ? 'white': 'black'}`}}>Payment Information</Typography>
                        <Divider variant="middle" />
                        <Grid container spacing={2} padding={2}>
                          <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'normal'}}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={8}> 
                                <Tooltip title={`${parseFloat(currentBalance).toFixed(2)}`} arrow>
                                  <label htmlFor="Send">Send
                                    {sendCurrency && <>{"(Avl. Bal = "}{getSymbolFromCurrency(sendCurrency)}{parseFloat(currentBalance).toFixed(2).length > 5 ? parseFloat(currentBalance).toFixed(2)?.substring(0,5)+'...' : parseFloat(currentBalance).toFixed(2) }{")"}</>}
                                </label>
                                </Tooltip>
                                <TextField type='number' sx={{width: '100%', border: `${theme ? '1px solid white': ''}`}} value={fromAmount} onChange={(e) => HandleFromAmount(e.target.value)} fullWidth />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <label htmlFor="Currency">Currency</label>
                                <Select value={`${sendCurrency}-${sendSideVal}`} onChange={(e) => HandleSendCurrency(e.target.value)} sx={{border: `${theme ? '1px solid white': ''}`,maxHeight: '57px' }} fullWidth>
                                {
                                  list?.map((item:any,index:number) => (
                                    <MenuItem value={`${item?.currency}-${item?._id}`} key={index}>
                                      <ReactCountryFlag
                                        className='rounded-full'
                                        countryCode={item?.country}
                                        style={{
                                          width: '2em',
                                          height: '2em',
                                          borderRadius: '50%',
                                          marginRight: '10px'
                                        }}
                                        svg
                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                        cdnSuffix="svg"
                                        title={item?.country}
                                      />
                                      {item?.currency}
                                    </MenuItem>
                                  ))
                                }
                                </Select>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'normal'}}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={8}>
                                <label htmlFor="Send">Recipient will receive</label>
                                <TextField type='number' value={convertedValue} sx={{ color: `${theme ? 'white': 'white'}`, border: `${theme ? '1px solid white': ''}` }} fullWidth  />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <label>Currency</label>
                                <Select value={receiveCurrency} onChange={(e) => setRecieveCurrency(e.target.value)} fullWidth sx={{border: `${theme ? '1px solid white': ''}`,maxHeight: '57px', width: '100%'}}>
                                {
                                  list?.map((item:any,index:number) => (
                                    // disabled={sendCurrency == item?.currency ? true : false}
                                    <MenuItem value={item?.currency} key={index}>
                                      <ReactCountryFlag
                                        className='rounded-full'
                                        countryCode={item?.country}
                                        style={{
                                          width: '2em',
                                          height: '2em',
                                          borderRadius: '50%',
                                          marginRight: '10px'
                                        }}
                                        svg
                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                        cdnSuffix="svg"
                                        title={item?.country}
                                      />
                                      {item?.currency}
                                    </MenuItem>
                                  ))
                                }
                                </Select>
                              </Grid>
                            </Grid>
                          </Grid>

                           <Grid sx={{width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '19px'}}>
                            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'normal'}}>
                              <Grid>Charge {sendCurrency}</Grid>
                              <Grid>{feeCharge}</Grid>
                            </Grid>
                            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'normal'}}>
                              <Grid>Payable {sendCurrency}</Grid>
                              <Grid>{parseFloat(fromAmount) + parseFloat(feeCharge)}</Grid>
                            </Grid>
                           </Grid>        

                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={7} sx={{ marginTop: {xs: '12px', md: '0px'}, marginLeft: {xs: '14px', md: '10px'}, boxShadow: '1px 1px 10px silver', borderRadius: '7px'}}>
                         <Grid sx={{display: 'flex',flexDirection: 'column', justifyContent: 'normal'}}>
                          <Grid container spacing={2} padding={2}>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="Full Name">Full Name</label>
                              <TextField fullWidth placeholder='Full Name' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setName(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="Email">Email</label>
                              <TextField fullWidth placeholder='Email Address' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setEmail(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="Mobile">Mobile</label>
                              {/* @ts-ignore */}
                              <TextField type="number" pattern="[0-9]*" inputmode="numeric" sx={{ border: `${theme ? '1px solid white': ''}` }} fullWidth placeholder='Mobile' onChange={(e) => setMobile(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="Bank Name">Bank Name</label>
                              <TextField fullWidth placeholder='Bank Name' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setBankName(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="IBAN / AC">IBAN / AC</label>
                              <TextField fullWidth placeholder='IBAN / AC' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setIban(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <label htmlFor="Routing/IFSC/BIC/SwiftCode">Routing/IFSC/BIC/SwiftCode</label>
                              <TextField fullWidth placeholder='Routing/IFSC/BIC/SwiftCode' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setBicCode(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <label htmlFor="Address Line 1">Recipient Address</label>
                              <TextField fullWidth placeholder='Recipient Address' sx={{ border: `${theme ? '1px solid white': ''}` }} onChange={(e) => setRecAddress(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Colorbtn sx={{marginBottom: '12px'}} onClick={() => HandleSaveIndividualData()}>Make Payment</Colorbtn>
                            </Grid>
                          </Grid>
                         </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </DialogContentText>
             </DialogContent>
           </Dialog>
          </React.Fragment>     
      </div>

      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: `${theme ? 'black': 'black'}` }}>
              Default Account Change
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <label>Select Account</label>
              <Select onChange={(e) => HandleSwitchAccount(e.target.value)} name="account" id="account" style={{display:'flex',width:'100%',height:'30px',border: '1px solid silver',cursor:'pointer'}}>  
              {
                accountsList?.map((item:any,index:number) => (
                <MenuItem key={index} value={`${item._id}-${item.country}-${item.currency}`}>{item?.name}</MenuItem>
                ))
              }
              </Select>
            </Typography>
          </Box>
      </Modal>
    </Toolbar>
  )
}
