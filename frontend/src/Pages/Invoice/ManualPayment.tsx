import axios, { all } from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import copy from "copy-to-clipboard";
import { usePDF } from 'react-to-pdf';
import Menu from '@mui/material/Menu';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Country, State, City }  from 'country-state-city';
import { Closebtn, Colorbtn } from '../../Component/Button/ColorButton';
import Button, { ButtonProps } from '@mui/material/Button';
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Alert, Avatar, Backdrop, Box, Card, CardActions, CardContent, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Select, Snackbar, TextField, Tooltip } from '@mui/material';
import { Table,Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Label, ModeEditOutline } from '@mui/icons-material';
import useValidation from '../../Hooks/useValidation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

import { Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
 ) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TablePaginationActions(props:any) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event:any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event:any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event:any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event:any) => {
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
  { id: 'invoices', label: 'Invoices', minWidth: 170 },
  { id: 'date', label: 'Payment Date', minWidth: 170 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 120 }
];

function createData(id:any,clientInfo:any,invoice:any,date:any,currencyText:any,amount:Number) {
  return { id,clientInfo,invoice,date,currencyText,amount };
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

export default function ManualPayment() {

  const { errors, validate } = useValidation();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [msgLoading,setmsgLoading] = React.useState<boolean>(false);
  const [Modalopen, setModalOpen] = React.useState<boolean>(false);

  const [openView, setOpenView] = React.useState(false);

  const [firstName,setFirstName] = React.useState<any>('');
  const [lastName,setLastName] = React.useState<any>('');
  const [email,setEmail] = React.useState<any>('');
  const [mobile,setMobile] = React.useState('');
  const [postalCode,setPostalCode] = React.useState<any>('');
  const [address,setAddress] = React.useState<any>('');
  const [notes,setNotes] = React.useState<any>('');
  const [country,setCountry] = React.useState<any>('');
  const [state,setState] = React.useState<any>('');
  const [city,setCity] = React.useState<any>('');

  const [Countries,setCountries] = React.useState<any[]>(Country.getAllCountries() || []);
  const [States,setStates] = React.useState<any[]>([]);
  const [Cities,setCities] = React.useState<any[]>([]);

  const HandleGetStateOfCountry = (val:any) => {
    setCountry(val);
    setStates(State.getStatesOfCountry(val));
  }

  const HandleGetCityOfState = (val:any) => {
    setState(val);
    setCities(City.getCitiesOfState(country,val));
  }

  const handleClickOpenView = (val:any) => {
    HandleGetProductData(val);
    setAnchorEl(null);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setEditFlag(false);
  };

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditFlag(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [moreVal,setMoreVal] = React.useState<any>('');

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [unpaidInvoice,setUnpaidInvoice] = React.useState<any>([]);

  useEffect(() => {
   getTransactionsList();
   getUnpaidInvoiceLIst();
  },[]);

  const getUnpaidInvoiceLIst = async () => {
    // current user id
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/manualPayment/unpaidList/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setUnpaidInvoice(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const getTransactionsList = async() => {
    await axios.get(`/${url}/v1/manualPayment/list`, {
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

  let rows = [];

  rows = [
    list?.map((item:any) => (
     createData(item?._id,item?.clientInfo, item?.invoiceDetails?.[0]?.invoice_number,item?.paymentDate,item?.amountCurrencyText,item?.amount)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const HandleSearchFilter = async(filterData:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
     await axios.get(`/${url}/v1/client/list/${accountId?.data?.id}?title=${filterData}`, {
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

  const HandleEditModal = (id:any) => {
    setAnchorEl(null);
    HandleGetProductData(id);
    setTimeout(() => {
      setModalOpen(true);
    },100);
  }

  const [editFlag,setEditFlag] = React.useState<any>('');

  // Function for get individual category data

  const [viewDetails,setViewDetails] = React.useState<any>('');

  const HandleGetProductData = async (val:any) => {
    await axios.get(`/${url}/v1/manualPayment/${val}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == 201) {
        setViewDetails(result?.data?.data);
      }
    })
    .catch(error => {
      alertnotify(error?.response?.data?.message, "error");  
      console.log("error", error);
    }) 
  }

  // Delete Category function

  const HandleDeleteClient = async (val:any) => {
    var r = confirm("Are you sure?");
    if(r == true){
      await axios.delete(`/${url}/v1/client/delete/${val}`, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          setAnchorEl(null);
          getTransactionsList();
          alertnotify("Selected Client has been deleted Successfully", "success");
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error?.response?.data?.message, "error");
      })
    } else {
      return false;
    }
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

  const [clientDetails,setClientDetails] = React.useState<any>('');

  const [invoiceNumber,setInvoiceNumber] = React.useState<any>('');
  const [amount,setAmount] = React.useState<any>(0);

  // Product add function 
  const HandleSave = async () => {
    setmsgLoading(true);
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/manualPayment/add`,{
      "user": accountId?.data?.id,
      "invoice": invoiceD?._id,
      "client": invoiceD?.userid,
      "invoice_number": invoiceNumber,
      "dueAmount": invoiceD?.dueAmount,
      "amountCurrencyText": invoiceD?.currency_text,
      "paidAmount": invoiceD?.paidAmount,
      "amount": amount,
      "notes": notes,
      "payment_date": new Date().toISOString().substring(0, 10),
      "mode": "Cash"
    }, 
    {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setmsgLoading(false);
        setModalOpen(false);
        alertnotify(result?.data?.message, "Success");
        getTransactionsList();
      }
    })
    .catch(error => {
      setmsgLoading(false);
      alertnotify(error?.response?.data?.message, "error");  
      console.log("error", error);
    }) 
  }

  const HandleDiscard = () => {
    setModalOpen(false);
    setEditFlag(false);
  }

  const HandleBack = () => {
    setModalOpen(false);
    setInvoiceD([]);
  }

  const [invoiceD,setInvoiceD] = React.useState<any>([]);

  const HandleInvoiceDetails = async (val:any) => {
    await axios.get(`/${url}/v1/invoice/getinv/info/${val}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setInvoiceNumber(val);
        setInvoiceD(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    });
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={msgLoading}
        onClick={handleClose}
      >
       <CircularProgress color="inherit" />
      </Backdrop>
     <Box sx={{ marginTop: {xs: '-12px',md: '12px'} , fontSize: '15px' }}>
      <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '1px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}` , sm:`${theme ? '1px solid white' : 'white'}` } , padding: '3px'}}>      
       {
        !Modalopen ?
        <>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', margin: '1%' }}>
          <Grid>
            <TextField onChange={(e) => HandleSearchFilter(e.target.value)} placeholder='Search' sx={{ border: `${theme ? '1px solid silver': 'black'}`,width: '190px' }} />  
          </Grid>  
          <Grid>
           <Colorbtn sx={{ marginBottom:' 12px', padding: '15px' }} onClick={handleClickOpen}>+</Colorbtn>    
          </Grid>
          </Grid>   

          {/* @ts-ignore */}
         <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer component={Paper}>
           <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <div>
             <TableHead>
              <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  width="360"
                  style={{ padding: '12px', background: '#8657E5', color: 'white' }}  
                >
                {column.label}
                </TableCell>
              ))}
              </TableRow>
            </TableHead>
          <TableBody>
            {(rowsPerPage > 0
             ? rowsNew?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             : rowsNew
            ).map((row: any) => (
            <TableRow key={row?.date}>
             <TableCell style={{ padding: '6px', fontSize: '14px', fontWeight: '400' }} scope="row">
              <Grid sx={{ display:'flex', flexDirection: 'row', gap: '12px' }}>
                <Grid sx={{ display: {xs:'none', md:'flex'}, flexDirection: 'row',alignItems: 'center' }}>
                  <Avatar sx={{ color: 'white', background: '#8657E5' }}>
                    <AssignmentIcon />
                  </Avatar>
                </Grid>
                <Grid sx={{ display:'flex', flexDirection: 'column' }}>
                  <Grid>{ row?.clientInfo?.[0]?.name } <span>{row?.invoice}</span></Grid>
                  <Grid>{ row?.clientInfo?.[0]?.email }</Grid>
                </Grid>
              </Grid>
             </TableCell>
             <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {moment(row?.date).format("DD-MM-YYYY")}
             </TableCell>
             <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.currencyText}{row?.amount}
             </TableCell>
             <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'normal'}}>
                <Grid>
                  <IconButton
                    aria-label="more"
                    value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}-${row?.createdBy}`}
                    id={`long-button${row?.id}`}
                    aria-controls={open ? `long-menu${row?.id}` : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"  
                    sx={{ color: `${theme ? 'white': 'black'}`}}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    key={row?.id}
                    id={`long-menu${row?.id}`}
                    MenuListProps={{
                      'aria-labelledby': `long-button${row?.id}`
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleClickOpenView(moreVal)}>
                      <span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>View</span>
                    </MenuItem>
                    {/* <MenuItem onClick={() => HandleEditModal(moreVal)}>
                      <span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Edit</span>
                    </MenuItem> */}
                   
                  </Menu>
                </Grid>
                </Grid>
             </TableCell>
            </TableRow>
           ))}
           {rowsNew?.length == 0 && (
            <TableRow>
              <TableCell colSpan={7}>
               <CustomNoRowsOverlay />
              </TableCell>
            </TableRow>
           )}
          </TableBody>
          </div>
          <TableFooter sx={{ background: `${theme ? 'white': ''}` }}>
           <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={7}
              count={rowsNew.length}
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
              sx={{ color: 'black' }}
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
        </>
       : 
        <>
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', margin: '2%' }}>
            <Grid><Colorbtn onClick={() => HandleBack()}>Back</Colorbtn></Grid>
          </Grid> 

          <Grid container spacing={2} sx={{ padding: '2%',color: `${theme ? 'white' : 'black'}`}}>
            <Grid item xs={12} md={6}>
              <label htmlFor="Invoice">Invoice</label>
              <Select onChange={(e) => HandleInvoiceDetails(e.target.value)} sx={{ color: `${theme ? 'white': 'black'}`,border: `${theme ? '1px solid silver': 'black'}`}} fullWidth>
              {
                unpaidInvoice?.map((item:any,index:number) => (
                  <MenuItem value={item?.invoice_number} key={index} sx={{ color: `${theme ? 'white': 'black'}`}} >{item?.invoice_number}</MenuItem>
                ))
              }
              </Select>
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Due Amount">Due Amount </label>
              <FormControl fullWidth>
                <OutlinedInput
                  id="paid-amount"
                  sx={{ border: `${theme ? '1px solid silver': 'black'}`}} 
                  startAdornment={<InputAdornment position="start">{invoiceD?.currency_text || ''}</InputAdornment>}
                  value={invoiceD?.dueAmount || 0}
                />
              </FormControl>
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Paid Amount">Paid Amount </label>
              <FormControl fullWidth>
                <OutlinedInput
                  id="paid-amount"
                  sx={{ border: `${theme ? '1px solid silver': 'black'}` , color: `${theme ? 'white': 'black'}`}} 
                  startAdornment={<InputAdornment position="start" sx={{ color: `${theme ? 'white': 'black'}` }}><span style={{color: `${theme ? 'white': 'black'}`}}>{invoiceD?.currency_text || ''}</span></InputAdornment>}
                  value={invoiceD?.paidAmount || 0}
                />
              </FormControl>
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Payment Date">Payment Date </label>
              <TextField placeholder='Payment Date' value={new Date().toISOString().substring(0, 10)} sx={{ color: `${theme ? 'white': 'black'}`,border: `${theme ? '1px solid silver': 'black'}`}}  fullWidth />  
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Amount">Amount <span style={{ color: 'red' }}>*</span></label>
              <TextField placeholder='Amount' onChange={(e) => setAmount(e.target.value)} sx={{ border: `${theme ? '1px solid silver': 'black'}`}}  fullWidth />  
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Payment Mode">Payment Mode </label>
              <TextField placeholder='Payment Mode' value="Cash" sx={{ color: `${theme ? 'black': 'black'}`,border: `${theme ? '1px solid silver': 'black'}`}}  fullWidth  />  
            </Grid> 

            <Grid item xs={12} md={12}>
              <label htmlFor="Notes">Notes <sup style={{ fontSize: '19px', color: 'red', fontWeight: '900' }}></sup></label>
              <TextField placeholder='Notes' onChange={(e) => setNotes(e.target.value)} sx={{ border: `${theme ? '1px solid silver': 'black'}`}}  multiline={true} rows={7} fullWidth />  
            </Grid> 

            <Grid item xs={12}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid><Colorbtn onClick={HandleSave}>Pay</Colorbtn></Grid>
              <Grid><Closebtn onClick={ () => confirm("Are you sure?") ? HandleDiscard() : '' }>Cancel</Closebtn></Grid>  
              </Grid>    
            </Grid>

          </Grid>
        </> 
       }
     </Grid>
   </Box>

   <Dialog
     fullWidth
     maxWidth={"md"}
     open={openView}
     TransitionComponent={Transition}
     keepMounted
     onClose={handleCloseView}
     aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ color: `${theme ? 'white': 'black'}` }}>{"Transaction Details"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <table width={"100%"} border={1} style={{ borderCollapse: 'collapse', color: `${theme ? 'white': 'black'}` }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px' }}>Name</td>
                <td style={{ padding: '12px' }}>{viewDetails[0]?.clientInfo?.[0]?.name}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Email</td>
                <td style={{ padding: '12px' }}>{viewDetails[0]?.clientInfo?.[0]?.email}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Amount</td>
                <td style={{ padding: '12px' }}>{viewDetails[0]?.amountCurrencyText}{viewDetails[0]?.amount}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Payment Date</td>
                <td style={{ padding: '12px' }}>{moment(viewDetails[0]?.paymentDate).format("DD-MM-YYYY")}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Notes</td>
                <td style={{ padding: '12px' }}>{viewDetails[0]?.notes}</td>
              </tr>
            </tbody>
          </table>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseView} sx={{ color: `${theme ? 'white': 'black'}` }}>Close</Button>
      </DialogActions>
   </Dialog>

  </>
 )
}
