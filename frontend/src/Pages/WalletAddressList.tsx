import axios from 'axios';
import PropTypes from 'prop-types';
import copy from "copy-to-clipboard";
import { usePDF } from 'react-to-pdf';
import Link from '@mui/material/Link';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Slide from '@mui/material/Slide';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Colorbtn } from '../Component/Button/ColorButton';
import { TransitionProps } from '@mui/material/transitions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DialogContentText from '@mui/material/DialogContentText';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Alert, Backdrop, Box, CircularProgress, Grid, MenuItem, Select, Snackbar, Tooltip, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props:TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(id:any,date:any,coin:String,noOfCoins:any,address:String,status:String) {
  return { id,date,coin,noOfCoins,address,status };
}

export interface CryptoDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  theme: String;
  setSelectedValue:any;
}

function WalletAddressDialog(props:CryptoDialogProps) {
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
  const { onClose, selectedValue, open ,theme } = props;
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const navigate = useNavigate();
  const [coin,setCoin] = React.useState<any>("");
  const [walletSubmit,setWalletSubmit] = React.useState<boolean>(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const HandleRequestWalletAddress = async () => {
    setWalletSubmit(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    if(coin != "") {
      await axios.post(`/${url}/v1/walletaddressrequest/add`, {
        "user": accountId?.data?.id,
        "coin": coin+"_TEST" ,
        "walletAddress": "",
        "status": "pending",
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
          onClose("");
          alertnotifyTwo(result.data.message,"success");
          setLoading(false);
          setWalletSubmit(false);
          window.location.href = '/crypto/wallet';
        },300)
       }
      })
      .catch(error => {
        setWalletSubmit(false);
        console.log("error", error);
        setLoading(false);
        alertnotifyTwo(error.response.data.message,"error");
      })
    } else {
      setLoading(false);
      setWalletSubmit(false);
      alertnotifyTwo("Please select coin","error");
    }
  }

  const options = ['SOL', 'BNB','BTC','DOGE','ADA','BCH'];

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
         <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} minWidth={"300px"}>Request Wallet Address</Grid>
         <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{cursor:'pointer'}} onClick={handleClose}>X</Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={walletSubmit}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <form>
          <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Select Coin</label>
          <Select
            labelId="walletAddress"
            id="walletAddress"
            fullWidth
            name="walletAddress"
            sx={{ border: `${theme ? '1px solid white': '1px solid transparent'}` , marginTop: '16px', color: `${theme ? 'white': 'black'}` }}
            onChange={(e) => setCoin(e.target.value)}
          >
          {
            options?.map((item:any,index:any) => (
             <MenuItem value={item} key={index} sx={{color: `${theme ? 'white': 'black'}`}}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' , gap: '12px' }}>
                <Grid>
                  <img
                    loading="lazy"
                    style={{ padding: '1px', cursor: 'pointer', height: '35px', width: '35px', borderRadius: '50px'}}
                    src={`https://assets.coincap.io/assets/icons/${item.toLowerCase()}@2x.png`}
                    alt={`${item}`}
                  />
                </Grid>
                <Grid>              
                  {item}
                </Grid>
              </Grid>
            </MenuItem>
            ))
          }
          </Select>
          <Grid sx={{display: 'flex', flexDirection: 'row', justifyItems: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Colorbtn variant="contained" onClick={() => HandleRequestWalletAddress()}>SUBMIT</Colorbtn>
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

export default function WalletAddressList() {

  const params = useParams();
  const [theme]:any = useOutletContext();
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const contentCopy = (wid: string) => {
    copy(wid);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    },900);
  };

  const [details,setDetails] = React.useState<any>({ add: '', coinn: '' });

  const handleClickOpen = (addd:any,coinn:any) => {
    setOpen(true);
    setDetails({ add:addd, coinn:coinn });
  };

  const handleClose = () => {
    setOpen(false);
    setDetails({ add: '', coinn: '' });
  };
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [WalletAddressOpen, setWalletAddressOpen] = React.useState(false);
  const { toPDF } = usePDF({filename: 'walletList.pdf'});
  const [list,setList] = React.useState<any>();

  const handleWalletAddressClose = () => {
    setWalletAddressOpen(false);
  };
  const handleClickWalletAddressOpen = () => {
    setWalletAddressOpen(true);
  };

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getList(accountId.data.id);
  },[params.id]);

  const getList = async(id:any) => {
    await axios.get(`/${url}/v1/walletaddressrequest/list/${id}`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })  
  }

  const exportExcellistforInvoice = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/walletaddressrequest/exportstatement/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status =="success")
      window.open(`${import.meta.env.VITE_PUBLIC_URL}/walletList.xlsx`);
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const requestNewAddress = async(coin:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/walletaddressrequest/request-newwalletaddress`,{
      "user": accountId?.data?.id,
      "coin": coin
    },
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setDetails({ add: result?.data?.data, coinn:coin });
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  let rows:any = [];
  rows = [
    list?.map((item:any) => (
     createData(item?._id,item?.createdAt,item?.coin,item?.noOfCoins,item?.walletAddress,item?.status)
    ))
  ].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const rowsNew:any = rows[0] || [];

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
     <Box sx={{ marginTop: {xs: '-10px', md:'23px'} , fontSize: '15px' }}>
      <Grid key={1} sx={{display: 'flex', flexDirection: 'column' , gap: '1px',borderRadius: '.5rem', color: 'black', fontWeight: '700', border: `${theme ? '2px solid lightblue': '1px solid transparent'}` , background: `${theme ? 'transparent': '#F5F6FA'}` , padding: '10px'}}> 
        <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' , gap: '10px' }}>
          <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontSize: '22px' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: `${theme ? 'white': 'black'}` }}>
              <Link underline="hover" href="/home" sx={{ color: `${theme ? 'white': 'black'}` }}>
                Home
              </Link>
              <Typography sx={{ color: `${theme ? 'white': 'black'}` }}>Wallet List</Typography>
            </Breadcrumbs>
          </Grid> 
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',gap: '10px' }}>
            <Grid>
              <Colorbtn onClick={() => handleClickWalletAddressOpen()}>Add New coin</Colorbtn>
            </Grid>
            <Grid onClick={exportExcellistforInvoice} sx={{ cursor: 'pointer' }}>
              <Tooltip title="Download Excel" sx={{ cursor: 'pointer' }} placement="top-start">
                <img src={`${import.meta.env.VITE_APP_URL}/icons/excel.png`} width={45} />
              </Tooltip>
            </Grid>
            {/* <Grid onClick={() => toPDF()} sx={{ cursor: 'pointer' }}>
            <Tooltip title="Download Pdf" sx={{ cursor: 'pointer' }} placement="top-start">
              <img src={`${import.meta.env.VITE_APP_URL}/icons/pdf.png`} width={41} />
            </Tooltip>     
            </Grid> */}
          </Grid>
        </Grid>

        <Grid container spacing={2} key={2}>
        {
          rowsNew?.map((item:any,index:number) => (
          <>
            <Grid item xs={12} sm={6} md={6} lg={4} key={index} sx={{ cursor: 'pointer' }}>
              {/* className='cryptoBox'  */}
              <Box sx={{ background: `${theme ? '' : '#FFFFFF'}`, border: `${theme ? '1px solid silver' : ''}`, padding: '6%', borderRadius: '12px' }}>
                <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '30px' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'normal' }}>
                      <Grid sx={{ color:'#635BFE', fontSize: '27px'}}>{item?.coin.replace("_TEST","") }</Grid>
                    </Grid>
                    <Grid>
                    {
                      item?.coin == "USDC_POLYGON_TEST" ?
                      <img
                        loading="lazy"
                        style={{height: '30px', width: '30px', borderRadius: '50px'}}
                        src={`https://assets.coincap.io/assets/icons/poly@2x.png`}
                        alt={`${item?.coin}`}
                      />  
                      :
                      <img
                        loading="lazy"
                        style={{height: '30px', width: '30px', borderRadius: '50px'}}
                        src={`https://assets.coincap.io/assets/icons/${ item?.coin.replace("_TEST","").toLowerCase()}@2x.png`}
                        alt={`${item?.coin}`}
                      />  
                    }  
                    </Grid>
                  </Grid>  
                  <Grid sx={{ color: `${theme ? '#FFFFFF' : ''}` }}>
                    {item?.noOfCoins}
                  </Grid>
                </Grid>
                <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '15px', color: `${theme ? '#FFFFFF' : ''}` }}>
                  <Colorbtn onClick={() => handleClickOpen(item?.address,item?.coin)}>View Address</Colorbtn>
                </Grid>
              </Box>
            </Grid>
          </>
          ))
        }

        {
          rowsNew?.length > 6 &&
          <>
            <Grid item xs={12} sm={4} sx={{ cursor: 'pointer' }}>
              <Box className='cryptoBox' sx={{ background: '#FFFFFF', padding: '6%', height: '127px', borderRadius: '12px' }}>
                <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding: '16px',alignItems: 'center' }}>
                  <Grid><AccountBalanceWalletIcon sx={{ fontSize: '52px' }} /></Grid>
                  <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'normal' }}>
                    <Grid>Check all</Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'normal' }}>
                      <Grid>Wallet Balance</Grid>
                      <Grid sx={{marginTop: '-16px',marginLeft: '12px'}}><ArrowRightAltIcon /></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        }
        {
         rowsNew?.length == 0 &&
          <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <CustomNoRowsOverlay />
          </Grid>
        }
        </Grid>
      </Grid>
    </Box>

    {/* // Modal box for view wallet address */}

    <Dialog
      fullWidth
      open={open}
      keepMounted
      maxWidth={'sm'}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ color: `${theme ? 'white': 'black'}` }}>{"Wallet Address for "}{details?.coinn.replace("_TEST","")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'space-between',color: `${theme ? 'white': 'black'}` }}>
            <Grid>{details?.add}</Grid>
            <Grid><ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => contentCopy(details?.add)} /></Grid>
            { details?.add == "" && <Grid><Colorbtn onClick={() => requestNewAddress(details?.coinn)}>Request Wallet address</Colorbtn></Grid>}
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Colorbtn onClick={handleClose}>Close</Colorbtn>
      </DialogActions>
    </Dialog>

    <div>
      <WalletAddressDialog
        selectedValue={selectedValue}
        open={WalletAddressOpen}
        onClose={handleWalletAddressClose}
        theme={theme}
        setSelectedValue={setSelectedValue}
      />
    </div>

    </>
  )
}
