import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { usePDF } from 'react-to-pdf';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import DialogTitle from '@mui/material/DialogTitle';
import PaymentIcon from '@mui/icons-material/Payment';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useOutletContext } from "react-router-dom";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Alert, Box, Fab, Grid, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { Closebtn, Colorbtn, Dangerbtn, Processingbtn, Successbtn } from '../../Component/Button/ColorButton';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import CryptoJS from 'crypto-js';
import copy from "copy-to-clipboard";
import VerifiedIcon from '@mui/icons-material/Verified';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import getSymbolFromCurrency from 'currency-symbol-map';

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
  
  const columns = [
    { id: 'date', label: 'Date', width: '100%' },
    { id: 'title', label: 'Title', width: '100%' },
    { id: 'user', label: 'User', width: '100%' },
    { id: 'currency', label: 'Currency', width: '100%' },
    { id: 'amount', label: 'Amount', width: '100%' },
    { id: 'status', label: 'Status', width: '100%' },
    { id: 'payment', label: 'Payment', width: '100%' },
    { id: 'action', label: 'Action', width: '100%' }
  ];

  function createData(id:any,reference:any,date:any,title:any,user:any,currency:any,amount:String,status:String,url:any) {
    return { id,reference,date,user,title,currency,amount,status,url };
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

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

export default function List() {
  const [openAlert, setOpenAlert] = React.useState(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const handleClosealert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(event);
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const contentCopy = (wid: string) => {
    copy(wid);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    },900);
  };
  
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [theme]:any = useOutletContext();
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [transDetails,setTransDetails] = React.useState<any>([]);
  const [list,setList] = React.useState<[]>([]);
  const [user,setUser] = React.useState<any>('');
  const [title,setTitle] = React.useState<any>('');
  const [amount,setAmount] = React.useState<any>('');
  const [dueDate,setDueDate] = React.useState<any>('');
  const [ecommid,setEcommid] = React.useState<any>('');
  const [status,setStatus] = React.useState<any>('');
  const [currency,setCurrency] = React.useState<any>('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [userDetails,setUserDetails] = React.useState<[]>();
  const [editStatus,setEditStatus] = React.useState<any>(false);
  const { toPDF, targetRef } = usePDF({filename: 'transactionList.pdf'});
  const account_id = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  
  useEffect(() => {
    getList();
    getUserDetails();
  },[]);

  const getList = async () => {
    await axios.get(`/${url}/v1/ecommerce/list/${account_id?.data?.id}`,{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
     })
    .then(result => {
      if(result.data.status == 201) {
        setList(result.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  const getUserDetails = async () => {
    await axios.get(`/${url}/v1/member/members/${account_id?.data?.id}`,{
      headers: 
      {
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

  const handleClickOpen = (val:any) => {
    setOpen(true);
    if(val != null) {
      setEditStatus(true);
      getItemDetails(val);
    }
  };

  const [openView,setViewOpen] = React.useState<any>(false);
  const [openUpdateView,setOpenUpdateView] = React.useState<any>(false);

  const HandleUpdateTransaction = (val:any) => {
    setOpenUpdateView(true);
    getItemDetails(val);
  }

  const HandleViewTransaction = (val:any) => {
    setViewOpen(true);
    getViewDetails(val);
  }

  const getItemDetails = async (val:any) => {
    await axios.get(`/${url}/v1/ecommerce/${val}`, 
    { 
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setTransDetails(result.data.data);
        setAmount(result.data.data.amount);
        setTitle(result.data.data.title);
        setUser(result.data.data.user);
        setCurrency(result.data.data.currency);
        setDueDate(result.data.data.duedate);
        setEcommid(result.data.data._id);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  const getViewDetails = async (val:any) => {
    await axios.get(`/${url}/v1/ecommerce/transaction/${val}`, 
    { 
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
    })
    .then(result => {
      if(result.data.status == "201") {
        setTransDetails(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }


  const handleClose = () => {
    setAmount('');
    setCurrency('');
    setDueDate('');
    setTitle('');
    setUser('');
    setEditStatus(false);
    setOpen(false);
  };

  let rowsAdd:any = [];
  let rows:any = [];

  rowsAdd = [
    list?.map((item:any) => (
      createData(item._id,item?.reference,item?.createdAt,item.title,item.user,item.currency,item.amount,item.status,item.url)
    ))
  ];

  rows = rowsAdd[0] || [];

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log("New Page", event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const HandleCreateEcommerce = async () => {
    var reference = Math.floor(Math.random() * 10000000);
    var ciphertext = CryptoJS.AES.encrypt(`${user}-${reference}`, 'ganesh').toString();
    await axios.post(`/${url}/v1/ecommerce/add`, 
    {
      title:title,user,userType:"user",currency,amount,amounttext: getSymbolFromCurrency(currency),reference:reference,dueDate,comment:'N/A',status: 'unpaid',createdBy:account_id?.data?.id,
      url: `${import.meta.env.VITE_APP_URL}/payment/${ciphertext}`
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
      setOpen(false);
      getList();
      navigate('/ecommerce/list');
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  }

  // Edit Function ...
  const HandleUpdateEcommerce = async () => {
    await axios.patch(`/${url}/v1/ecommerce/update/${ecommid}`, 
    {
      title:title,user,userType:"user",currency,amount,amounttext: getSymbolFromCurrency(currency),dueDate,createdBy:account_id?.data?.id
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
      setOpen(false);
      setOpenUpdateView(false);
      getList();
      navigate('/ecommerce/list');
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  }

  const HandleUpdateStatusEcommerce = async () => {
    await axios.patch(`/${url}/v1/ecommerce/update/${ecommid}`, 
    {
      status:status
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
      setOpen(false);
      setOpenUpdateView(false);
      getList();
      navigate('/ecommerce/list');
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  }
  // Alert Notification Arrow Function here...
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

  // Send payment link to the user
  const HandleSendPaymentLink = async (val:any) => {
    var r = confirm("Are you sure to send payment link to the user?");
    if(r == true) {
      await axios.get(`/${url}/v1/ecommerce/sendlink/${val}`, 
      { 
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          alertnotify("Payment link has been sent on user registered mail address", "Success");
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error.response.data.message, "error");
      })
    }
  }

  // Delete item data function here...
  const HandleDeleteItem = async (val:any) => {
    var r = confirm("Are you sure to delete?");
    if(r == true) {
      await axios.delete(`/${url}/v1/ecommerce/delete/${val}`, {
        headers: 
        {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          getList();
          alertnotify(result.data.message,"success");
        }
      })
      .catch(error => {
        console.log("Error", error);
        alertnotify(error.response.data.message,"error");
      })
    }
  }

  return (
    <div>

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
      
     <Typography variant='h5' sx={{marginBottom: '30px'}}>Ecommerce</Typography>
      <Box sx={{ overflow: "auto" }}>
       <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , gap: '10px' }}>
          <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <Grid><Colorbtn onClick={() => toPDF()}>PDF</Colorbtn></Grid>
          </Grid>
          <Grid><Successbtn sx={{cursor: 'pointer'}} onClick={() => handleClickOpen(null)}>Create</Successbtn></Grid>
        </Grid>
        <hr />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" ref={tableRef}>
          <div ref={targetRef}>
            <TableHead>
              <TableRow  className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
               {columns.map((column) => (
              <TableCell
                key={column.id}
                style={{ width: '300px' }}
              >
              {column.label}
              </TableCell>
             ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {(rowsPerPage > 0
             ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             : rows
            ).map((row: any) => (
            <TableRow key={row?.date}>
             <TableCell component="th" scope="row">
              {moment(row?.date).format("MMMM Do YYYY, h:mm:ss A")}
             </TableCell>
             <TableCell  component="th" scope="row">
              {row?.title}
             </TableCell>
             <TableCell component="th" scope="row">
             {
              userDetails?.map((item:any) => (
              <>
                {item._id == row?.user && item.username}
              </>
              ))
             }
             </TableCell>
             <TableCell  component="th" scope="row">
              {row?.currency}
             </TableCell>
             <TableCell  component="th" scope="row">
              {getSymbolFromCurrency(row?.currency)}{row?.amount}
             </TableCell>
             <TableCell  component="th" scope="row">
             {
              row?.status == "unpaid" && 
              <>
                <Dangerbtn sx={{width: '100%'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px', padding : '3px'}}>
                    <Grid><PendingActionsIcon sx={{color: 'white'}} /></Grid>
                    <Grid>Unpaid</Grid>
                  </Grid>
                </Dangerbtn>
              </>
             }
             {
              row?.status == "Complete" &&
              <>
                <Successbtn sx={{width: '100%'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px', padding : '3px'}}>
                    <Grid><VerifiedIcon sx={{color: 'white'}} /></Grid>
                    <Grid>Completed</Grid>
                  </Grid>
                </Successbtn>
              </>
             }
             {
              row?.status == "processing" &&
              <>
                <Processingbtn sx={{width: '100%'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px', padding : '3px'}}>
                    <Grid><PendingActionsIcon sx={{color: 'white'}} /></Grid>
                    <Grid>Prcoessing</Grid>
                  </Grid>
                </Processingbtn>
              </>
             }
             {
              row?.status == "failed" &&
              <>
                <Dangerbtn sx={{width: '100%'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px', padding : '3px'}}>
                    <Grid><CancelIcon sx={{color: 'white'}} /></Grid>
                    <Grid>Failed</Grid>
                  </Grid>
                </Dangerbtn>
              </>
             }
             </TableCell>
             <TableCell  component="th" scope="row" align='left'>
              {
                 row?.status == "unpaid" ?
                 <Fab color="info" sx={{color: 'white'}} aria-label="add" onClick={() => contentCopy(row?.url)} >
                  <ContentCopyOutlinedIcon />
                 </Fab> 
                 :
                 <Fab color="info" sx={{color: 'white'}} aria-label="add" onClick={() => contentCopy(row?.url)} disabled>
                  <ContentCopyOutlinedIcon  />
                 </Fab>
              }
               
             </TableCell>
             <TableCell component="th" scope="row">
              <Grid sx={{display: 'flex', flexDirection: 'row',  justifyContent: 'space-between', gap: '2px'}}>
                <Grid>
                  {
                    row?.status == "unpaid" &&
                    <BootstrapTooltip title="Send Payment link to the user" placement="top-start">
                      <Colorbtn onClick={() => HandleSendPaymentLink(row?.id)}>Send</Colorbtn>
                    </BootstrapTooltip>
                  }
                </Grid>  
               
                <Grid>
                {
                  row?.status != "unpaid" &&
                  <Colorbtn onClick={() => HandleViewTransaction(row?.id)}>View</Colorbtn>
                } 
                </Grid>
                <Grid>
                {
                  row?.status != "unpaid" && row?.status != "Complete" &&
                  <Colorbtn onClick={() => HandleUpdateTransaction(row?.id)}>Update</Colorbtn>
                } 
                </Grid>
                <Grid>
                {
                  row?.status == "unpaid" &&
                  <Colorbtn onClick={() => handleClickOpen(row?.id)}>Edit</Colorbtn>
                }
                </Grid>
                <Grid>
                {
                  row?.status == "unpaid" &&
                  <Dangerbtn onClick={() => HandleDeleteItem(row?.id)}>Delete</Dangerbtn>
                }
                </Grid>
                <Grid>
                {
                  row?.status == "paid" &&
                  <>
                    <Successbtn sx={{width: '100%'}}>
                      <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px', padding : '3px'}}>
                        <Grid><CheckCircleIcon sx={{color: 'white'}} /></Grid>
                        <Grid>Complete</Grid>
                      </Grid>
                    </Successbtn>
                  </>
                }
              </Grid>
            </Grid>
            </TableCell>
          </TableRow>
        ))}
        {
          rows?.length == 0 && (
          <TableRow style={{ height: 53 * rows }}>
            <TableCell colSpan={8}>
              <CustomNoRowsOverlay />
            </TableCell>
          </TableRow>
        )}
        </TableBody>
          </div>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                native: true,
                },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
          </Table>
        </TableContainer>
       </Box>
      </Box>

    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={open}
      onClose={handleClose}
    > 
     <DialogTitle>Ecommerce</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <label htmlFor="Title">Title</label>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              type="text"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="User">Select Currency</label>
            <Select value={currency} fullWidth onChange={(e) => setCurrency(e.target.value)}>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="User">Select User</label>
            <Select value={user} fullWidth onChange={(e) => setUser(e.target.value)}>
            {
              userDetails?.map((item:any,index:number) => (
                <MenuItem key={index} value={item?._id}>{item?.username}</MenuItem>
              ))
            }
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label htmlFor="Amount">Amount</label>
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="due date">Due Date</label>
            <TextField
              autoFocus
              required
              margin="dense"
              id="duedate"
              name="duedate"
              type="date"
              value={moment(dueDate).format('YYYY-MM-DD')}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          {
            editStatus ?
            <Colorbtn sx={{marginTop: '20px', width: '100%'}} onClick={() => HandleUpdateEcommerce()}>Update</Colorbtn>
            :
            <Colorbtn sx={{marginTop: '20px', width: '100%'}} onClick={() => HandleCreateEcommerce()}>Save</Colorbtn>
          }
         </Grid>
       </Grid>
     </DialogContent>
     <DialogActions>
      <Closebtn onClick={handleClose}>Close</Closebtn>
     </DialogActions>
    </Dialog>

    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={openView}
      onClose={handleClose}
    > 
     <DialogTitle>Transaction Details</DialogTitle>
      <DialogContent>
      <table border={1} style={{borderCollapse: 'collapse'}}>
        <tr>
          <td style={{padding: '16px'}}>Reference</td><td style={{padding: '16px'}}>{transDetails?.reference}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Transaction Id</td><td style={{padding: '16px'}}>{transDetails?.transID}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Response</td><td style={{padding: '16px'}}>{transDetails?.response}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Transaction Date</td><td style={{padding: '16px'}}>{transDetails?.tdate}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Paid Amount</td><td style={{padding: '16px'}}>{getSymbolFromCurrency(transDetails?.currency)}{transDetails?.billAmt}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Currency</td><td style={{padding: '16px'}}>{transDetails?.currency}</td>
        </tr>
        <tr>
          <td style={{padding: '16px'}}>Status</td><td>{transDetails?.status}</td>
        </tr>
      </table>
     </DialogContent>
     <DialogActions>
      <Closebtn onClick={() => setViewOpen(!openView)}>Close</Closebtn>
     </DialogActions>
    </Dialog>

    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={openUpdateView}
      onClose={handleClose}
    > 
     <DialogTitle>Transaction Details</DialogTitle>
      <DialogContent>
       <label htmlFor="Status">Status</label>
       <Select fullWidth onChange={(e) => setStatus(e.target.value)}>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Complete">Complete</MenuItem>
        <MenuItem value="Processing">Processing</MenuItem>
        <MenuItem value="Failed">Failed</MenuItem>
       </Select>
       <Colorbtn sx={{marginTop: '12px'}} onClick={() => HandleUpdateStatusEcommerce()}>Submit</Colorbtn>
     </DialogContent>
     <DialogActions>
      <Closebtn onClick={() => setOpenUpdateView(!openUpdateView)}>Close</Closebtn>
     </DialogActions>
    </Dialog>

   </div>
  )
}


