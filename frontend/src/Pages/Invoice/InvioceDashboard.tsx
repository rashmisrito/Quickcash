import dayjs from "dayjs";
import axios from 'axios';
import {LineChart} from "@mui/x-charts";
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { PieChart,pieArcLabelClasses } from '@mui/x-charts/PieChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Gauge , gaugeClasses } from '@mui/x-charts/Gauge';
import { Colorbtn } from '../../Component/Button/ColorButton';
import { useNavigate, useOutletContext } from 'react-router-dom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Add, ArrowForward, Cancel, Category, Group, Inventory, RequestQuote, Task } from '@mui/icons-material';
import { Box, Card, CardContent, FormControlLabel, Grid, MenuItem, Select, Switch, Tooltip } from '@mui/material';

import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Table,Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";

import Link from '@mui/material/Link';
import { Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { toast } from "react-toastify";

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
  { id: 'invoice_number', label: 'Invoice Number', minWidth: 170 },
  { id: 'date', label: 'Payment Date', minWidth: 170 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'amount', label: 'Paid Amount', minWidth: 100 },
  { id: 'type', label: 'Transaction Type', minWidth: 100 }
];

function createData(tcurr:any, icurr:any,id:any,invoice_number:any, payment_date:any,total:any,paid_amount:any,type:any) {
  return { tcurr,icurr,id,invoice_number,payment_date,total,paid_amount,type };
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function InvioceDashboard() {

  const [theme]:any = useOutletContext();

  const [state, setState] = React.useState({
    switch: true
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const navigate = useNavigate();
  const [list,setlist] = React.useState<any>('');
  const [quoteList,setQuoteList] = React.useState<any>('');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    DashboardDetails();
    QuoteDetails();
    HandleFilterStats("Today");
    HandleFilterQuoteStats("Today");
  },[]);

  useEffect(() => {
    getTransactionsList();
  },[]);

  const [listtr,setList] = React.useState<any>([]);

   const getTransactionsList = async() => {
    await axios.get(`/${url}/v1/manualPayment/transaction-list`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setList(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  let rows = [];

  rows = [
    listtr?.map((item:any) => (
     createData(item?.toCurrency,item?.invoiceDetails?.[0]?.currency,item._id,item?.invoiceDetails?.[0]?.invoice_number,item?.dateadded,item?.convertAmount,item?.invoiceDetails?.[0]?.total,item?.trans_type)
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

  const DashboardDetails = async () => {
    await axios.get(`/${url}/v1/invoice/dashboard/details`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setlist(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const QuoteDetails = async () => {
    await axios.get(`/${url}/v1/invoice/dashboard/quote`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setQuoteList(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const [selectFilter,setSelectFilter] = React.useState<any>("Today");
  const [xAxisData,setxAxisData] = React.useState<any>([]);

  const [newjk,setnewjk] = React.useState<any>([]);
  
  const HandleFilterStats = async (filterValue:any) => {
    setSelectFilter(filterValue);
    setxAxisData([]);;
    setnewjk([]);
    await axios.get(`/${url}/v1/invoice/dashboard/filter?filter=${filterValue}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setnewjk(result?.data?.labelValue);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const [SelectQuoteFilter,setSelectQuoteFilter] = React.useState<any>('Today');
  const [xAxisDataquote,setxAxisDataquote] = React.useState<any>([]);

  const [jkquote,setjkquote] = React.useState<any>([]);

  const HandleFilterQuoteStats = async (filterValue:any) => {
    setSelectQuoteFilter(filterValue);
    setxAxisDataquote([]);
    setjkquote([]);
    await axios.get(`/${url}/v1/invoice/dashboard/quote-filter?filter=${filterValue}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setjkquote(result?.data?.jk);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
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

  var seriesData:any = [];

  if(newjk) {
    newjk?.map((item:any) => {
      xAxisData.push(new Date(item.label));
      seriesData.push(item?.value)
    })
  }

  var seriesDataquote:any = [];

  if(jkquote) {
    jkquote?.map((item:any) => {
      xAxisDataquote.push(new Date(item.element));
      seriesDataquote.push(item?.totalPaid2?.length)
    })
  }

  const invoiceSettings = async (type:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/invoice/settings-inv/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        if(result?.data?.data == null) {
          alertnotify("Please save invoice settings details first", "error");
          navigate("/settings");
        } else {
          navigate(`${type == "invoice" ? 'add-invoice' : 'quotes/add-quote'}`);
        }
      }
    })
    .catch(error => {
      console.log("error", error);
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

  return (
    <>
      <Grid sx={{ marginTop: '2%' , fontSize: '15px' }}>
        <Grid sx={{ marginBottom: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Grid>
            <FormControlLabel
              control={
                <Switch checked={state.switch} onChange={handleChange} name="switch" color="warning" />
              }
              label={`${state.switch ? 'Invoice': 'Quote'}`}
              sx={{ color: `${theme ? 'white': 'black'}` }}
            />
          </Grid>
          <Grid>
          {
            state.switch ? 
            <Colorbtn onClick={() => invoiceSettings('invoice')} startIcon={<Add />}>New Invoice</Colorbtn>
            :
            <Colorbtn onClick={() =>invoiceSettings('quote')} startIcon={<Add />}>New Quote</Colorbtn>
          }
          </Grid>
        </Grid>

        {
          state.switch ?
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#EB62D0', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Invoice
                      </Typography>
                      <Typography gutterBottom component="div">
                        <ReceiptIcon sx={{ fontSize: '5vh', marginLeft: '-3px' }} />
                        <br />
                        <span>${parseFloat(list?.totalInvoice).toFixed(2)}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#01A3FF', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Paid
                      </Typography>
                      <Typography gutterBottom component="div">
                        <CheckCircleOutlineIcon sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>${list?.totalPaid}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#1EBA62', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Unpaid
                      </Typography>
                      <Typography gutterBottom component="div">
                        <PendingActionsIcon sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>${parseFloat(list?.totalUnpaid).toFixed(2)}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#9568FF', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Overdue
                      </Typography>
                      <Typography gutterBottom component="div">
                        <AccessTimeFilledIcon sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>${list?.totalOverdue}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: { xs: 'auto', md: '190px' } , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem', width: {xs: '100%', md: '100%'} }}>  
              <Grid container>
                <Grid item xs={4} sm={4} md={4}>
                  <Gauge
                    minwidth={250} 
                    height={160} 
                    value={60}
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
                        <Inventory sx={{fontSize: {lg: '60px', xs: '20px'},color:"#65d1bc"}}/>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                          <Grid>
                            <span style={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{"Total Product"}</span>
                          </Grid>
                          <Grid>
                            <span style={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{list?.totalProducts}</span>
                          </Grid>
                        </Grid>
                      </Grid>
                      </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={4} sm={4} md={4}>
                  <Gauge
                    minwidth={250} 
                    height={160} 
                    value={50}
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
                        <Category sx={{fontSize: {lg: '60px', xs: '20px'},color:"#fc762f"}}/>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                          <Grid>
                            <span style={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{"Total Category"}</span>
                          </Grid>
                          <Grid>
                            <span style={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{list?.totalCategory}</span>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>

                </Grid>
              
                <Grid item xs={4} sm={4} md={4}>
                    <Gauge
                      minwidth={250} 
                      height={160} 
                      value={30}
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
                    <Grid item xs={12}><Group sx={{fontSize: {lg: '60px', xs: '20px'},color:"#8657e5"}}/></Grid>
                    <Grid item xs={12}>
                      <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , gap: '12px' }}>
                        <Grid>
                          <span style={{fontSize:"10px",position:'relative',top:'-10px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{"Total Clients"}</span>
                        </Grid>
                        <Grid>
                          <span style={{fontSize:"10px",position:'relative',top:'-20px',fontWeight:"900",color: `${theme ? 'white': 'black'}`}}>{list?.totalClients}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: { xs: 'auto', md: 'auto' } , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem', width: {xs: '100%', md: '100%'} }}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '12px' }}>
                <Grid><Typography variant='h5' sx={{ padding: '12px',color: {xs:`${theme ? 'white': 'black'}`, sm:`${theme ? 'white': 'black'}`} }}>Invoice Income Overview</Typography></Grid>
                <Grid>
                  <Select value={selectFilter} onChange={(e) => HandleFilterStats(e.target.value)} sx={{ minWidth: '200px',color:{xs:`${theme ? 'white': 'black'}`, sm:`${theme ? 'white': 'black'}`},border: `${theme ? '1px solid white': 'black'}` }} fullWidth>
                    <MenuItem value="Today" sx={{color: `${theme ? 'white': 'black'}`}}>Today</MenuItem>
                    <MenuItem value="This_Week" sx={{color: `${theme ? 'white': 'black'}`}}>This Week</MenuItem>
                    <MenuItem value="Last_Week" sx={{color: `${theme ? 'white': 'black'}`}}>Last Week</MenuItem>
                    <MenuItem value="This_Month" sx={{color: `${theme ? 'white': 'black'}`}}>This Month</MenuItem>
                    <MenuItem value="Last_Month" sx={{color: `${theme ? 'white': 'black'}`}}>Last Month</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <LineChart
                xAxis={[{
                  label: "Date",
                  data: xAxisData,
                  tickInterval: xAxisData,
                  scaleType: 'time',
                  valueFormatter: (date) => dayjs(date).format("MMM D"),
                }]}
                slotProps={{ legend: { 
                  labelStyle: {
                  fontSize: 14,
                  fill: `${theme ? 'white': 'black'}`,
                }, } }}
                sx={{ color: `${theme ? 'white': 'black'}` }}
                yAxis={[{ label: "Amount" }]}
                series={[
                  {label: "Invoice Income", data: seriesData,area: true}
                ]}
                height={300}
              />
            </Grid>   

            <Grid container spacing={2} sx={{ background: `${theme ? 'transparent' : 'white'}`, marginLeft: '1px', border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: { xs: 'auto', md: 'auto' } , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem',width: {xs: '100%', md: '100%'} }}>
              <Grid item xs={12} sm={6} sx={{ borderRight: '1px dotted silver' }}>
                <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: '5%',color: `${theme ? 'white': 'black'}` }}>Payment Overview</Typography>
                <PieChart
                  series={[
                    {
                      data: [ // @ts-ignore
                        { id: 0, value: `${list?.totalPaid}`, label: 'Paid' }, // @ts-ignore
                        { id: 1, value: `${list?.totalUnpaid}`, label: 'Unpaid' } // @ts-ignore
                      ],
                    },
                  ]}
                  slotProps={{ legend: { 
                    labelStyle: {
                      fontSize: 14,
                      fill: `${theme ? 'white': 'black'}`
                    }, 
                  } }}
                  height={200}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: '5%',color: `${theme ? 'white': 'black'}` }}>Invoice Overview</Typography>
                <PieChart
                  series={[
                    {
                      data: [ // @ts-ignore
                        { id: 0, value: `${list?.totalPaid}`, label: 'Paid' }, // @ts-ignore
                        { id: 1, value: `${list?.totalUnpaid}`, label: 'Unpaid' }, // @ts-ignore
                        { id: 2, value: `${list?.totalOverdue}`, label: 'Overdue' }, // @ts-ignore
                      ],
                    },
                  ]}
                  sx={{ marginBottom: '2%' }}
                  slotProps={{ legend: { 
                    labelStyle: {
                    fontSize: 14,
                    fill: `${theme ? 'white': 'black'}`,
                  }, } }}
                  height={200}
                />
              </Grid>
            </Grid>     

            <Grid container sx={{ background: `${theme ? 'transparent' : 'white'}`, marginLeft: '1px', border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: { xs: 'auto', md: 'auto' } , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem',width: {xs: '100%', md: '100%'} }}>
              <Typography sx={{ padding: '12px', color: `${theme ? 'white': 'black'}` }} variant="h6">Invoice Payment Transaction List</Typography>
                {/* @ts-ignore */}
              <Box sx={{ overflow: "auto" }}>
               <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}> 
               <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                      <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                      {columns.map((column) => (
                      <TableCell key={column.id} 
                        width="220"
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
                    <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                      <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                        <Grid>{row?.invoice_number}</Grid>
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                      {moment(row?.payment_date).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                      {getSymbolFromCurrency(row?.tcurr)}{row?.total}
                    </TableCell>
                    <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                    <span style={{background: 'green', color: 'white', padding: '10px', borderRadius: '10px'}}>{getSymbolFromCurrency(row?.tcurr)}{parseFloat(row?.total).toFixed(2)}</span>
                    </TableCell>
                    <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                      {row?.type}
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
            </Grid>

          </>
          :
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#EB62D0', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Quote
                      </Typography>
                      <Typography gutterBottom component="div">
                        <RequestQuote sx={{ fontSize: '5vh', marginLeft: '-3px' }} />
                        <br />
                        <span>{quoteList?.totalQuote}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#01A3FF', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Converted
                      </Typography>
                      <Typography gutterBottom component="div">
                        <RequestQuote sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <ArrowForward sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <ReceiptIcon sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>{quoteList?.totalConverted}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: '#1EBA62', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Accept
                      </Typography>
                      <Typography gutterBottom component="div">
                        <Task sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>{quoteList?.totalAccept}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                <CardContent sx={{ background: 'red', color: 'white' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography gutterBottom component="div">
                        Total Reject
                      </Typography>
                      <Typography gutterBottom component="div">
                        <Cancel sx={{ fontSize: '5vh', marginLeft: '-2px' }} />
                        <br />
                        <span>{quoteList?.totalReject}</span>
                      </Typography>
                      
                    </Grid>
                    <Grid>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <svg width="50" viewBox="0 0 121 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="135.5" cy="84.5" r="40" stroke="white"></circle>
                          <circle cx="136" cy="85" r="135.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="109.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="86.5" stroke="white"></circle>
                          <circle cx="136" cy="85" r="64.5" stroke="white"></circle>
                        </svg>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid sx={{ background: `${theme ? 'transparent' : 'white'}`, border: `${theme ? '2px solid lightblue' : '1px solid white'}`, height: { xs: 'auto', md: 'auto' } , boxShadow: '2px 10px 10px #8888883b', marginTop: '2%', borderRadius: '.5rem', width: {xs: '100%', md: '100%'} }}>
              {/* <Typography variant='h5' sx={{ padding: '12px' }}>Quote Statistics</Typography>
              <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                series={[
                  { dataKey: 'quote', label: 'Quote', valueFormatter }
                ]}
                {...chartSetting}
              />   */}
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '12px' }}>
                <Grid><Typography variant='h5' sx={{ padding: '12px',color: `${theme ? 'white': 'black'}` }}>Quote Generated Overview</Typography></Grid>
                <Grid>
                  <Select value={SelectQuoteFilter} onChange={(e) => HandleFilterQuoteStats(e.target.value)} sx={{ minWidth: '200px', color: `${theme ? 'white': 'black'}`, border: `${theme ? '1px solid white': '1px solid black'}` }} fullWidth>
                    <MenuItem value="Today" sx={{color: `${theme ? 'white': 'black'}`}}>Today</MenuItem>
                    <MenuItem value="This_Week" sx={{color: `${theme ? 'white': 'black'}`}}>This Week</MenuItem>
                    <MenuItem value="Last_Week" sx={{color: `${theme ? 'white': 'black'}`}}>Last Week</MenuItem>
                    <MenuItem value="This_Month" sx={{color: `${theme ? 'white': 'black'}`}}>This Month</MenuItem>
                    <MenuItem value="Last_Month" sx={{color: `${theme ? 'white': 'black'}`}}>Last Month</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <LineChart
                xAxis={[{
                  label: "Date",
                  data: xAxisDataquote,
                  tickInterval: xAxisDataquote,
                  scaleType: 'time',
                  valueFormatter: (date) => dayjs(date).format("MMM D"),
                }]}
                slotProps={{ legend: { 
                  labelStyle: {
                  fontSize: 14,
                  fill: `${theme ? 'white': 'black'}`,
                }, } }}
                yAxis={[{ label: "Amount" }]}
                series={[
                  {label: "Quote Generated", data: seriesDataquote}
                ]}
                height={300}
              />
            </Grid>   
          </>
        }
      


      </Grid>
    </>
  )
}
