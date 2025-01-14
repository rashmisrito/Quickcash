import axios from 'axios';
import * as React from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Card from 'react-credit-cards-2';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InfoIcon from '@mui/icons-material/Info';
import { useAccount } from '../Hooks/useAccount';
import ReactCountryFlag from 'react-country-flag';
import StartIcon from '@mui/icons-material/Start';
import useValidation from '../Hooks/useValidation';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Colorbtn } from '../Component/Button/ColorButton';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box,CardContent,FormControl,FormHelperText,Grid, MenuItem, Select, Stack, Tooltip } from '@mui/material';

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

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'right',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Data found</Box>
    </StyledGridOverlay>
  );
}

export default function Cards() {

  const navigate =  useNavigate();
  const { errors, validate } = useValidation();
  const [theme]:any = useOutletContext();
  const [open, setOpen] = React.useState(false);
  const [openCardPin, setOpenCardPin] = React.useState(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [generate,setGenerate] = React.useState<boolean>(true);
  const [currency,setCurrency] = React.useState<any>('');
  const [Account,setAccount] = React.useState<any>('');
  const [viewCrd,setViewCrd] = React.useState<any>([]);
  const [pin,setPin] = React.useState<any>('');
  const [tempValue,setTempvalue] = React.useState<any>(false);
  const [tempBackValue,setTempBackvalue] = React.useState<any>(false);

  const [state, setState] = React.useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  function convertNumberWithStar(id:any){
    const arr = id.split('');
    let valArr = '';
    arr.forEach((element:any,index:number) => {
      if(index == 4 || index == 5 || index == 6 || index > 8 || index == 9) {
        valArr += '*';
      } else {
        valArr += element;
      }
    });
    return valArr;
 }

  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  const {list} = useAccount(accountId?.data?.id);

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

  const handleClickOpen = () => {
   setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState({
      number: '',
      expiry: '',
      cvc: '',
      name: '',
      focus: '',
    });
  };

  const handleInputFocus = (evt:any) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  const generateCardDetails = () => {
    if(!validate('name',state.name) && !validate('currency',currency) ){
      var valueGen = Math.floor(Math.random() * 9999999999999999);
      setGenerate(false);
      {/* @ts-ignore */} 
      setState({ name: state?.name,number: valueGen , cvc: '123', expiry : '12/30' })
    } else {
      if(validate('name',state.name)){
        const result = validate('name',state.name);
      }
      if(validate('currency',currency)){
        const result = validate('currency',currency);
      }
    }
  }

  const [cardsDetails,setCardDetails] = React.useState<[]>();

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
      });
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
      });
    }
 }

 React.useEffect(() => {
  getCardsList();
 },[]);

 const handleClickOpenPin = (val:any) => {
  setOpenCardPin(true);
  HandleViewCard(val);
};

const handleCloseCardPin = () => {
  setOpenCardPin(false);
};

 const getCardsList = async () => {
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  await axios.get(`/${url}/v1/card/list/${accountId?.data?.id}`, {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
  if(result.data.status == "201") {
    setCardDetails(result.data.data);
  }
  })
  .catch(error => {
    console.log("error", error);
    if(error.response.data.status == 403) {
      localStorage.clear();
      navigate('/');
    } else {
      alertnotify(error.response.data.message,"error");
    }
  })
}
  
  const HandleCreateCard = async (e:any) => {
    var valGet = '';
    if(`${state?.number}`.length < 16) {
      valGet = valGet+"0";
    } else {
      valGet = state?.number;
    }
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    e.preventDefault();
    await axios.post(`/${url}/v1/card/add`, {
      "name": state.name,
      "user":  accountId?.data?.id,
      "cardnumber": valGet,
      "expiry": state.expiry,
      "cvv": state.cvc,
      "account": Account,
      "currency": currency
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
    if(result.data.status == "201") {
      alertnotify(result.data.message,"success");
      getCardsList();
      setOpen(false);
    }
    })
     .catch(error => {
      console.log("error", error);
      setGenerate(true);
      alertnotify(error.response.data.message,"error");
    })
  }

  const HandleViewCard = async (val:any) => {
  await axios.get(`/${url}/v1/card/${val}`, {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    if(result?.data?.status == "201") {
      setViewCrd(result?.data?.data);
    }
  })
  .catch(error => {
    console.log("error", error);
    if(error.response.data.status == 403) {
      localStorage.clear();
      navigate('/');
    } else {
      alertnotify(error.response.data.message,"error");
    }
  })
  }

 const HandleViewCardDetails = (value:any) => {
  setTempvalue(value);
 }

  const [combined,setCombined] = React.useState<any>('');

  const HandleCurrency = (val:any) => {
    setCombined(val);
    const splitVal = val.split("-");
    setAccount(splitVal[0]);
    setCurrency(splitVal[1]);
  }

// This function is used for change pin of selected card  
const HandleChangePin = async (cardId:any) => {
  await axios.patch(`/${url}/v1/card/change-pin`, {
    pin,
    cardId: cardId
  }, {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    if(result.data.status == "201") {
      alertnotify("Card Pin has been updated Successfully", "Success");
      setOpenCardPin(false);
    }
  })
  .catch(error => {
    console.log("error", error);
    alertnotify(error.response.data.message,"error");
  })
}

  return (
    <>
      <Box sx={{ marginTop: {xs:  '-12px' , md: '12px'} , fontSize: '15px' }}>
        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
          <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px', height: 'auto',borderRadius: '.5rem', color: 'black', fontWeight: '700', border: `${theme ? '2px solid lightblue' : 'white'}`, background: `${theme ? 'transparent' : 'white'}` , padding: '10px 12px'}}>
            <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between', gap: '20px'}}>
              <Colorbtn variant="contained" onClick={handleClickOpen} startIcon={<AddIcon />}>Add Card</Colorbtn>
              <Colorbtn variant="contained" onClick={() => navigate('/cards-list')} startIcon={<StartIcon />}>Action</Colorbtn>
            </Grid>
            <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
             {
              cardsDetails?.map((item:any,index:number) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={6} md={8} lg={4} key={index} margin={1}>
                   <Tooltip title={`Click over card to view ${tempBackValue ?  (tempBackValue == item?.cardNumber ? 'front side' : 'back side') : 'back side'}`} placement="top-start" arrow>
                    <div className="card-container">  
                      <div className={`card-vertical ${tempBackValue ?  (tempBackValue == item?.cardNumber ? 'card-verticalflip' : '') : ''}`}>
                        <div className="card-front">
                         <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} onClick={() => HandleViewCardDetails(item?.cardNumber)}><InfoIcon sx={{ fontSize: '19px',  cursor: 'pointer', color: 'white' }} /></Grid>
                         <article className="card-front-content" style={{ cursor: 'pointer' }} onClick={() => setTempBackvalue(item?.cardNumber)}>
                          <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '-16px'}}>
                            <Grid><img src={`${import.meta.env.VITE_APP_URL}/icons/chip.png`} /></Grid>
                            <Grid sx={{ fontSize: '19px' }}> 
                              <ReactCountryFlag
                                countryCode={item?.currency.substring(0,2)}
                                svg
                                style={{
                                  width: '2em',
                                  height: '2em',
                                  borderRadius: '50%'
                                }}
                                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                cdnSuffix="svg"
                                title={list?.country}
                              />  
                            </Grid>
                          </Grid>
                          <Grid sx={{fontSize: {xs: '16px' , md: '23px'}, marginTop: '10px', fontFamily:'"Consolas", "Courier", monospace', marginBottom: '10px', display: 'flex', flexDirection: 'row'}}>
                            {tempValue ? (tempValue == item.cardNumber ?  tempValue.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ') : convertNumberWithStar(item.cardNumber.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '))) : convertNumberWithStar(item.cardNumber.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '))}
                          </Grid>
                          <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Grid>{item?.name}</Grid>
                            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'normal', gap: '10px'}}>
                              <Grid sx={{ fontSize: {xs: '12px' , md: '16px'}, marginTop: '-12px'  }}>valid thru</Grid>
                              <Grid sx={{ fontSize: {xs: '12px' , md: '16px'}, marginTop: '-26px' }}>{item?.expiry}</Grid>
                            </Grid>
                          </Grid>
                         </article>
                        </div>
                        <div className="card-back" style={{ cursor: 'pointer' }} onClick={() => setTempBackvalue('back')}>
                          <Grid sx={{ background: 'black',height: '36px', marginTop:'20px' }}></Grid>
                          <Grid className='rccs__signature'>
                            <Grid sx={{color: 'black', display: 'flex', padding: '6px', flexDirection: 'row', justifyContent: 'flex-end'}}>{item?.cvv}</Grid>
                            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '12px' }}>
                              <Grid><Colorbtn onClick={() => handleClickOpenPin(item?._id)}>Set Pin</Colorbtn></Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                   </Tooltip>
                  </Grid>
                </React.Fragment>
              ))
             }
             {
              cardsDetails?.length == 0 && 
              <>
                <CustomNoRowsOverlay />
              </>
             }
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Grid sx={{display: 'flex' , justifyContent: 'space-between'}}>
            <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Card</Grid>
            <Grid sx={{cursor: 'pointer'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`} onClick={handleClose}>X</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent sx={{background: `${theme ? '' : 'white'}`}}>
          <DialogContentText sx={{marginBottom: '10px'}} >
            <p style={{color:  `${theme ? 'white': 'black'}`}}>Add card details here in order to save your card</p>
          </DialogContentText>
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
                <Grid container>
                  <Grid item xs={12}>
                    <label>Name</label>
                    <TextField
                      fullWidth
                      name="name"
                      type="text"
                      size="medium"
                      value={state.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleBlur}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{ border: `${theme ? '1px solid silver' : ''}` }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="Currency">Currency</label>
                    <Select 
                      value={combined} 
                      name='currency'
                      onBlur={handleBlur}
                      error={!!errors.currency}
                      onChange={(e) => HandleCurrency(e.target.value)} 
                      sx={{ border: `${theme ? '1px solid silver' : ''}`, color: `${theme ? 'white': 'black'}` }}
                      fullWidth
                    >
                      {
                        list?.map((item:any,index:number) => (
                          <MenuItem sx={{ color: `${theme ? 'white' : 'black'}` }} value={`${item?._id}-${item?.currency}`} key={index}>{item?.currency}</MenuItem>
                        ))
                      }
                    </Select>
                    <FormControl fullWidth error={!!errors.currency}>
                      {errors.currency&& <FormHelperText>{errors.currency}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
            {
              generate ?
              <Colorbtn size="large" sx={{ fontWeight: "bold" }} onClick={() => generateCardDetails()}>
               Generate
              </Colorbtn>
              :
              <Colorbtn size="large" sx={{ fontWeight: "bold" }} onClick={(e) => HandleCreateCard(e)}>
               Submit
              </Colorbtn>
            }    
          </CardContent>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={openCardPin}
        onClose={handleCloseCardPin}
      >
        <DialogTitle>
          <Grid sx={{display: 'flex' , justifyContent: 'space-between'}}>
            <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Set Pin</Grid>
            <Grid sx={{cursor: 'pointer'}} onClick={handleCloseCardPin}>X</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent sx={{background: 'white'}}>
          <DialogContentText sx={{marginBottom: '10px'}} >
          </DialogContentText>
          <CardContent
            component={Stack}
            spacing={2}
            sx={{ height: "auto", color: `${theme ? 'black': 'black'}`, justifyContent: "center", padding: 0 }}
            >
            <label htmlFor="Card Name">Card Name : {viewCrd?.name}</label>
            <label htmlFor="Card Number">Card Number : {viewCrd?.cardNumber}</label>
            <label htmlFor="Old Pin">Old PIN : {viewCrd?.pin}</label>
            <label htmlFor="PIN">PIN</label>
            {/* @ts-ignore */}
            <input style={{width: '100%', height: '40px', border: '1px solid silver'}} id="cvv" type="number" onInput={(e)=> {setPin(e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3))}} /> 
            <Colorbtn onClick={() => HandleChangePin(viewCrd?._id)}>Submit</Colorbtn>     
          </CardContent>
        </DialogContent>
      </Dialog>
    </>
  )
}
