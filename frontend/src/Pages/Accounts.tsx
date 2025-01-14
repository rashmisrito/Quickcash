import axios from 'axios';
import Box from '@mui/material/Box';
import copy from "copy-to-clipboard";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ReactCountryFlag from 'react-country-flag';
import SearchIcon from '@mui/icons-material/Search';
import { useOutletContext } from "react-router-dom";
import getSymbolFromCurrency from 'currency-symbol-map';
import { Colorbtn } from '../Component/Button/ColorButton';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { Alert, Avatar, Dialog, DialogContent, DialogContentText, Fab, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Snackbar, TextField, Toolbar } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 399,
  bgcolor: 'background.paper',
  borderRadius: '.5rem',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ChildModal = () => {
  const [theme]:any = useOutletContext();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => { 
    setOpen(false);
  };

  const [name,setName] = React.useState<any>('');
  
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

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  const HandleUpdateAccountName = async () => {
    await axios.put(`/${url}/v1/account/change-name`, {
     "name": name,
     "user_id": localStorage.getItem('activeAccountId'),
   }, 
   {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify(result.data.message,"success");
    }
   })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
   });
  }
  
  return (
    <React.Fragment>
      <Button onClick={handleOpen}>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton autoFocus>
              <ListItemAvatar>
                <Avatar>
                  <CreateOutlinedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Change Account Name" />
            </ListItemButton>
            </ListItem>
          </List>
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 500 }}>
            <Grid sx={{display: 'flex' , flexDirection: 'row' , justifyContent: 'space-between'}}>
              <Grid><h2 id="child-modal-title" style={{ color: `${theme ? 'black': 'black'}` }}>Change Account Name</h2></Grid>
                <Grid>
                  <Fab size="small" color="secondary" aria-label="add" onClick={handleClose}>
                    X
                  </Fab>
                </Grid>
            </Grid>
            <TextField id="outlined-basic" fullWidth label="Account Name" onChange={(e) => setName(e.target.value)} variant="outlined" />
            <Button variant="contained" onClick={() => HandleUpdateAccountName()} sx={{marginTop: '10px'}} fullWidth startIcon={<DriveFileRenameOutlineOutlinedIcon />}>
              Update
            </Button>
          </Box>
        </Modal>
      </React.Fragment>
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
  bic_code: any;
  country: string;
  currency: any;
  defaultAccount: string;
  iban: any;
  name: string;
  status: Boolean;
}

export default function Accounts() {

  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const [exchangeOpen, setExchangeOpen]      = React.useState(false);
  const [accountsList,setAccountsList]       = React.useState<[]>();
  const [selectedAccount,setSelectedAccount] = React.useState<ActiveAccDetails>();
  const [ActiveAccountDetails,setActiveAccountDetails] = React.useState<ActiveAccDetails>();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getAllAccountsList(accountId.data.id);
  },[]);

  const handleSearchAccount = (text:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getAllAccountsList(accountId.data.id,text);
  }

  const getAllAccountsList = async (id:any,text="") => {
    await axios.get(`/${url}/v1/account/list/${id}?title=${text}`, {
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

 const getDefaultAccountList = async (id:any) => {
  await axios.get(`/${url}/v1/account/default/${id}`, {
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    console.log("Result result",result.data.data);
    if(result.data.status == "201") {
     setActiveAccountDetails(result.data.data[0].accountDetails);
     localStorage.setItem('activeAccountId',result.data.data[0].accountDetails._id);
    }
  })
   .catch(error => {
    console.log("error", error);
  })
}

  const handleClickExchangeOpen = (item: any) => {
    setExchangeOpen(true);
    setSelectedAccount(item);
  };

  const handleExchangeClose = () => {
    setExchangeOpen(false);
  };

  const contentCopy = (wid: string) => {
    copy(wid);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    },900);
  };

 const [open, setOpen] = React.useState(false);
 const handleOpen = () => {
  setOpen(true);
 };
 const handleClose = () => {
  setOpenAlert(false);
 };

  const [openAlert, setOpenAlert] = React.useState(false);
  const handleClosealert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(event);
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClosealert} anchorOrigin={{ horizontal:'center', vertical:'top' }}>
        <Alert
          onClose={handleClosealert}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' }}>
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '70%'} }}>
          <KeyboardBackspaceIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor: 'pointer'}} onClick={() => navigate('/home')}/>
        </Box>

        <Grid sx={{display:'flex', flexDirection: 'row' , justifyContent: 'space-between' , width: {xs: '100%', md: '70%'}}}>
          <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontSize: {md: '30px', fontWeight: '700'} }}>All Accounts</Grid>
          <Grid><AddBoxOutlinedIcon className={`${theme ? 'avatarDark' : 'avatarLight'}`} onClick={() => navigate('/add-account')} sx={{ cursor: 'pointer', fontSize: {md: '30px', fontWeight: '700'} }}/></Grid>
        </Grid>

        <Grid sx={{display:'flex', flexDirection: 'row' , justifyContent: 'space-between' , width: {xs: '100%', md: '70%'}}}>
          <Paper
            component="form"
            sx={{ p: '2px 5px', marginTop: '15px', background: `${theme ? '#183153': 'white'}`, border: `${theme ? '1px solid white': ''}`, display: 'flex', width: '100%', alignItems: 'center'}}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by account name"
              inputProps={{ 'aria-label': 'search by account name' }}
              onChange={(e) => handleSearchAccount(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px', color: `${theme ? 'white': 'black'}` }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>

        <Box sx={{ flexGrow: '1',marginTop: '2%', width: {xs: '100%', md: '70%'}}}>
          <Box display="grid" sx={{gridTemplateColumns: { sm: 'repeat(12, 1fr)', md: 'repeat(6,1fr)', lg: 'repeat(12, 1fr)'}}} gap={2} >
            {
              accountsList?.map((item:any,index:number) => (
              <>
               <Box gridColumn="span 6" onClick={() => handleClickExchangeOpen(item)} key={index} sx={{ marginBottom: '15px' }}>
                <Grid className="account_flag_hover" item xs={6} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', border: `${theme ? '1px solid white': ''}`, background: `${theme ? '' : 'white'}`, borderRadius: '.5rem', }}>
                  <Grid sx={{display: 'flex', flexDirection: 'column' , p: '10px 10px', gap: '16px'}}>
                    <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
                     <Grid>
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
                     </Grid>
                     {
                      ActiveAccountDetails?.iban == item?.iban &&
                      <Grid sx={{p: '7px 7px' , marginX: '10px', borderRadius: '.5rem', background: 'blue', color: 'white', fontSize: {xs: 'auto' ,md: '12px'}, fontWeight: '700'}}>
                        Default
                      </Grid>
                     }
                    </Grid>
                    <Grid sx={{fontWeight: '700'}}>
                     <Grid>{item.name}</Grid>
                      <Grid>{getSymbolFromCurrency(item.currency)}{parseFloat(item.amount).toFixed(2)}</Grid>
                       </Grid>
                      {/* <Grid  onClick={() => navigate(`/edit-account/${item?._id}`)} className='edit_Account_hover' sx={{color: 'blue' , borderRadius: '12px', marginLeft: '-12px', padding: '10px 12px', width: '120px'}}>
                        Edit Account
                      </Grid> */}
                    </Grid>
                    </Grid>       
               </Box>
              </>
              ))
            }
            {
              accountsList?.length == 0 &&
              <>
               <Box gridColumn="span 12" sx={{display: 'flex', background: `${theme ? '': 'white'}`, padding: '10px', borderRadius: '10px', flexDirection: 'column'}}>No Account found</Box>
              </>
            }
            </Box>
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
                  <Grid sx={{display: 'flex' ,gap: '10px' , p: '10px 12px', borderRadius: '.5rem', color: `${theme ? 'white': 'black'}`, flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                    <Grid><ArrowBackOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => setExchangeOpen(!exchangeOpen)} /></Grid>
                    <Grid>{selectedAccount?.name}</Grid>
                    <Grid sx={{display: 'flex', flexDirection: 'row' , gap: '10px'}}>
                      <Grid sx={{ color: `${theme ? 'white': 'black'}`, fontWeight: '700' }}>
                        {getSymbolFromCurrency(selectedAccount?.currency)}{parseFloat(selectedAccount?.amount).toFixed(2)}
                      </Grid>
                      {/* <Grid>Main account</Grid> */}
                    </Grid>
                    <Grid sx={{display: 'flex', flexDirection: 'cplumn' , gap: '10px'}}>
                      <Grid>
                        <Colorbtn onClick={() => navigate('/statements')} variant="contained" startIcon={<ArticleOutlinedIcon />}>
                          Statement
                        </Colorbtn>
                      </Grid>
                    <Grid>
                     {/* <Colorbtn variant="contained" onClick={handleOpen} endIcon={<MoreHorizOutlinedIcon />}></Colorbtn> */}
                    </Grid>
                </Grid>
              </Grid>

              <Grid sx={{display: 'flex' ,gap: '10px', marginTop: '20px',flexDirection: 'column' , justifyContent: 'center' , marginX: {lg: '340px'}}}>
                <Grid sx={{fontWeight: '700'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  ACCOUNT DETAILS
                  <hr />
                </Grid>
                <Grid sx={{display: 'flex', p: '10px 12px', color: `${theme ? 'white': 'black'}`, flexDirection: 'column', gap: '30px',borderRadius: '10px'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row',  justifyContent: 'space-between' }}>
                    <Grid>
                      <Grid>Account Number</Grid>
                      <Grid>{selectedAccount?.iban}</Grid>
                    </Grid>
                  <Grid>
                  { 
                   <Fab color="info" sx={{color: 'white'}} aria-label="add" onClick={() => contentCopy(selectedAccount?.iban)}>
                    <ContentCopyOutlinedIcon />
                   </Fab> 
                  }
                </Grid>
              </Grid>
              <Grid sx={{display: 'flex',flexDirection: 'row',  justifyContent: 'space-between' }}>
                <Grid>
                  <Grid>IFSC Code</Grid>
                  <Grid>{selectedAccount?.bic_code}</Grid>
                </Grid>
                <Grid> 
                { 
                 <Fab color="info" sx={{color: 'white'}} aria-label="add" onClick={() => contentCopy(selectedAccount?.bic_code)} >
                  <ContentCopyOutlinedIcon />
                 </Fab> 
                }
              </Grid>
              </Grid>
              <Grid sx={{display: 'flex', flexDirection: 'row',  justifyContent: 'space-between' }}><Grid>
                <Grid>Currency</Grid>
                <Grid>{selectedAccount?.currency}</Grid>
              </Grid>
            </Grid>
            <Grid sx={{display: 'flex', flexDirection: 'row',  justifyContent: 'space-between' }}>
              <Grid>
                <Grid>Account Holding</Grid>
                <Grid>Currency Exchange</Grid>
              </Grid>
              </Grid>
            </Grid>
            </Grid>
            </DialogContentText>
            </DialogContent>    
            </Dialog>
            </React.Fragment>
          </div>

          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
            <Box sx={{ ...style, width: 400 }}>
              <Colorbtn sx={{display: 'flex',  flexDirection: 'row', justifyContent: 'center'}} onClick={() => setOpen(!open)}>X</Colorbtn>
              <ChildModal />
            </Box>
          </Modal>
        </div>
    </Toolbar>
   </>
  )
}
