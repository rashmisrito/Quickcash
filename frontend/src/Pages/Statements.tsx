import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { usePDF } from 'react-to-pdf';
import { jwtDecode } from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import React, { useRef,useEffect } from 'react';
import { useAccount } from '../Hooks/useAccount';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import getSymbolFromCurrency from 'currency-symbol-map';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import DialogContentText from '@mui/material/DialogContentText';
import { useLocation, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { Colorbtn, Dangerbtn } from '../Component/Button/ColorButton';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Box, Chip, Grid, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Paper,Table,TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

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
  { id: 'date', label: 'Date Of Transaction', minWidth: 120 },
  { id: 'info', label: 'Trx', minWidth: 100 },
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'postbalance', label: 'Balance', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 }
];

function createData(tr_type:any,fee:any,rec:any,to_currency:any,id:any,cAmount:any,cAmountText:any,extraType:any,from_currency:any,date:any,trx:String,type:String,amount:Number,amountText:any,details:String,postbalance:any,status:any) {
  return { tr_type,fee,rec,to_currency,id,cAmount,cAmountText,extraType,from_currency,date,trx,type,amount,amountText,details,postbalance,status };
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
      <Box sx={{ mt: 1 }}>No Transaction found</Box>
    </StyledGridOverlay>
  );
}

export default function Statements() {

  const tableRef = useRef(null);
  const location = useLocation();
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [listOne,setListOne] = React.useState<any>();
  const { toPDF, targetRef } = usePDF({filename: 'Statements.pdf'});
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const handleClickOpen = (value: any) => {
    setOpen(true);
    getListById(value);
  };

  useEffect(() => {
    getTransactionsList();
  },[location])

  const getTransactionsList = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/transaction/list/${accountId?.data?.id}?status=Suc&page=1&size=1000`, 
    {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.status == 201) {
        setList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const exportExcellistforInvoice = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/transaction/exportstatement/${accountId?.data?.id}?status=Succ&account=${localStorage.getItem('accountFilter') || ''}&transType=${localStorage.getItem('transactionType') || ''}&startDate=${localStorage.getItem('startDate') || ''}&endDate=${localStorage.getItem('endDate') || ''}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status =="success")
      window.open(`${import.meta.env.VITE_PUBLIC_URL}/Statements.xlsx`);
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const getListById = async (id:any) => {
    await axios.get(`/${url}/v1/transaction/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setListOne(result.data.data)
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  let rows:any = [];
  rows = [
    list?.map((item:any) => (
      createData(item?.tr_type,item?.fee,item?.receipient,item?.to_currency,item._id,item?.conversionAmount,item?.conversionAmountText,item?.extraType,item?.from_currency,item.createdAt, item.trx, item.trans_type, item.amount, item.amountText, item.info, item?.postBalance
      ,item.status)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];

  const handleClose = () => {
    setOpen(false);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const FilterTransaction = ({setList}:any) => {

    const [transactionType,setTransactionType] = React.useState<any>(localStorage.getItem('transactionType') || '');
    const [accountIdq,setAccountId] = React.useState<any>(localStorage.getItem('accountFilter') || '');
    const [startDate,setStartDate] = React.useState<any>( localStorage.getItem('startDate') || '');
    const [endDate,setEndDate] = React.useState<any>(localStorage.getItem('endDate') || '');

    const HandleFilter = () => {
      getTransactionsFilterList();
    }

    const HandleReset = async () => {

      setTransactionType('');
      setAccountId('');
      setStartDate('');
      setEndDate('');
      localStorage.removeItem('transactionType');
      localStorage.removeItem('accountFilter');
      localStorage.removeItem('startDate');
      localStorage.removeItem('endDate');

      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      await axios.get(`/${url}/v1/transaction/list/${accountId?.data?.id}?page=1&size=1000`, 
      {
        headers: 
        {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.status == 201) {
          setList(result.data.data);
        }
      })
      .catch(error => {
        console.log("error", error);
      })
    }
  
    const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
    const accountIdd = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    const {list} = useAccount(accountIdd?.data?.id);
  
    const getTransactionsFilterList = async() => {
      setPage(0);
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      await axios.get(`/${url}/v1/transaction/list/${accountId?.data?.id}?transType=${transactionType}&status=Succ&account=${accountIdq}&startDate=${startDate}&endDate=${endDate}`, 
      {
        headers: 
        {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          console.log(transactionType);
          localStorage.setItem('transactionType',transactionType);
          localStorage.setItem('accountFilter', accountIdq);
          localStorage.setItem('startDate',startDate);
          localStorage.setItem('endDate',endDate);
          setList(result?.data?.data);
        }
      })
      .catch(error => {
        console.log("error", error);
      })
    }
  
    return (
      <Box>
        <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'normal', flexWrap: 'wrap', gap: '12px'}}>
          <Grid>
            <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',flexWrap: 'wrap',  gap: '12px'}}>
              <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
                 <Grid>
                  <label htmlFor="">Start Date</label>
                 </Grid>
                 <Grid className={`${theme ? 'clLight': ''}`}>
                  <TextField sx={{ border: `${theme ? '1px solid white' : ''}` }} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                 </Grid>
              </Grid>
              <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
                 <Grid>
                  <label htmlFor="">End Date</label>
                 </Grid>
                 <Grid className={`${theme ? 'clLight': ''}`}>
                   <TextField 
                      type="date" 
                      sx={{ border: `${theme ? '1px solid white' : ''}` }}
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}  
                      inputProps={{  
                        min: startDate ? startDate : new Date().toISOString().substring(0, 10)
                      }}  
                    />
                 </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid>
             <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
                <Grid>
                  <label htmlFor="Transaction Type">Transaction Type</label>
                </Grid>
                <Grid sx={{ border: `${theme ? '1px solid white' : ''}` }}>
                  <Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} fullWidth sx={{ border: `${theme ? '1px solid white': '1px solid transparent'}`, color: `${theme ? 'white': 'black'}`, minWidth: '150px'}}>
                    <MenuItem value="Add Money" sx={{color: `${theme ? 'white': 'black'}`}}>Add Money</MenuItem>
                    <MenuItem value="Exchange" sx={{color: `${theme ? 'white': 'black'}`}}>Exchange</MenuItem>
                    <MenuItem value="ransfer" sx={{color: `${theme ? 'white': 'black'}`}}>Money Transfer</MenuItem>
                  </Select>
                </Grid>
             </Grid> 
          </Grid>

          <Grid>
            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
              <Grid>
                <label htmlFor="Transaction Type">Account</label>
              </Grid>
              <Grid sx={{ border: `${theme ? '1px solid white' : 'black'}` }}>
                <Select value={accountIdq} onChange={(e) => setAccountId(e.target.value)} fullWidth sx={{border: `${theme ? '1px solid white': '1px solid transparent'}`,color: `${theme ? 'white': 'black'}`, minWidth: '150px'}}>
                {
                  list?.map((item:any,index:number) => (
                    <MenuItem value={item?._id} key={index} sx={{color: `${theme ? 'white': 'black'}`}}>{item?.name}</MenuItem>
                  ))
                }
                </Select>
              </Grid>
            </Grid> 
          </Grid>
  
          <Grid>
            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
              <Grid sx={{marginTop: '35px'}}>
                <Colorbtn fullWidth sx={{padding: '15px', minWidth: '120px'}} onClick={() => HandleFilter()}>Filter</Colorbtn>
              </Grid>
            </Grid>
          </Grid>

          <Grid>
            <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px'}}>
              <Grid sx={{marginTop: '35px'}}>
                <Dangerbtn fullWidth sx={{padding: '15px', minWidth: '120px'}} onClick={() => HandleReset()}>Reset</Dangerbtn>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    );
  }

  const [filterOpen,setFilterOpen] = React.useState<boolean>(false);
  
  return (
    <>
     <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', marginTop: {xs: '0px', md:'21px'}, fontWeight: '700', border: `${theme ? '2px solid white': '2px solid transparent'}`,  background: `${theme ? '#183153': 'white'}` , padding: {xs: '10px', md: '10px 12px'}}}>
        <Grid sx={{ display: 'flex', flexDirection: 'row',flexWrap: 'wrap', justifyContent: 'space-between' , gap: '10px' }}>
         <Grid className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontSize: '22px' }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: `${theme ? 'white': 'black'}` }}>
            <Link underline="hover" href="/home" sx={{ color: `${theme ? 'white': 'black'}` }}>
              Home
            </Link>
            <Typography component={'span'} sx={{ color: `${theme ? 'white': 'black'}` }}>Statements</Typography>
          </Breadcrumbs>
          </Grid>
          <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' , gap: '10px' }}>
          {
            rowsNew?.length > 0 &&
            <>
              <Grid onClick={() => setFilterOpen(!filterOpen)} sx={{ cursor: 'pointer' }}>
              <Tooltip title="Filter" sx={{ cursor: 'pointer' }} placement="top-start">
               <img src={`${import.meta.env.VITE_APP_URL}/icons/filter.png`} width={36} />
              </Tooltip>
              </Grid>
              <Grid onClick={exportExcellistforInvoice} sx={{ cursor: 'pointer' }}>
               <Tooltip title="Download Excel" sx={{ cursor: 'pointer' }} placement="top-start">
                <img src={`${import.meta.env.VITE_APP_URL}/icons/excel.png`} width={36} />
               </Tooltip>
              </Grid>
              <Grid onClick={() => toPDF()} sx={{ cursor: 'pointer' }}>
               <Tooltip title="Download Pdf" sx={{ cursor: 'pointer' }} placement="top-start">
                <img src={`${import.meta.env.VITE_APP_URL}/icons/pdf.png`} width={36} />
               </Tooltip>
              </Grid>
            </>
          }
          </Grid>
        </Grid>
          {
            filterOpen ? <><FilterTransaction setList={setList} /></> : null
          }
          {/* @ts-ignore */}
          <Box sx={{ overflow: "auto" }}>
            <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <TableContainer component={Paper} ref={targetRef}>
                <Table aria-label="custom pagination table" ref={tableRef}>
                  {/* <div ref={targetRef}> */}
                    <TableHead sx={{ background: '#673ab7', color: 'white' }}>
                    <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          width="220"
                          sx={{ color: 'white' }}
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
                    <TableCell component="th" scope="row">
                      {moment(row?.date).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell style={{ width: 50, cursor: 'pointer' }} component="th" scope="row" onClick={() => handleClickOpen(row?.id)}>
                    <Tooltip title="View transaction details" placement="top" arrow>
                      <Typography component={'span'} sx={{ color: { xs: `${theme ? 'white': 'black'}`} }}>{row?.trx}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell style={{ width: 160 }} component="th" scope="row">
                      {row?.type}
                    </TableCell>
                    <TableCell style={{ minWidth: 160 }} component="th" scope="row">
                    {
                      row?.extraType == "debit" ? 
                      // <Chip label={`-${getSymbolFromCurrency(row?.from_currency)}${ parseFloat(row?.amount) + parseFloat(row?.fee) }`} sx={{ background: `${theme ? 'red' : ''}`, color: `${theme ? 'white' : 'red'}`, fontWeight: '700', border: `${theme ? '1px solid red': '1px solid transparent'}` }} variant="outlined" />         
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'red' : ''}`, 
                          color: `${theme ? 'white' : 'red'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid red': '1px solid transparent'}` 
                        }}
                      >
                      -{getSymbolFromCurrency(row?.from_currency)}{ parseFloat(row?.amount) + parseFloat(row?.fee) }
                    </span> 
                      : 
                      row?.cAmount ?
                      row?.tr_type == "Stripe" ?
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid transparent'}` 
                        }}
                      >
                        +{getSymbolFromCurrency(row?.from_currency)}{ parseFloat(row?.cAmount).toFixed(2)}
                      </span> 
                      // <Chip label={`+${getSymbolFromCurrency(row?.from_currency)}${parseFloat(row?.cAmount).toFixed(2)}`} sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, fontWeight: '700', border: `${theme ? '1px solid green': '1px solid transparent'}` }} variant="outlined" />
                      :
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid transparent'}` 
                        }}
                      >
                        +{getSymbolFromCurrency(row?.to_currency)}{ parseFloat(row?.cAmount).toFixed(2)}
                      </span> 
                      // <Chip label={`+${getSymbolFromCurrency(row?.to_currency)}${parseFloat(row?.cAmount).toFixed(2)}`} sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, fontWeight: '700', border: `${theme ? '1px solid green': '1px solid transparent'}` }} variant="outlined" />
                      :
                      row?.tr_type == "Stripe" ?
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid transparent'}` 
                        }}
                      >
                        +{getSymbolFromCurrency(row?.to_currency)}{ parseFloat(row?.amount).toFixed(2)}
                      </span> 
                      // <Chip label={`+${getSymbolFromCurrency(row?.to_currency)}${parseFloat(row?.amount).toFixed(2)}`} sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, fontWeight: '700', border: `${theme ? '1px solid green': '1px solid transparent'}` }} variant="outlined" />         
                      :
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid transparent'}` 
                        }}
                      >
                        +{getSymbolFromCurrency(row?.to_currency)}{ parseFloat(row?.amount).toFixed(2)}
                      </span> 
                      // <Chip label={`+${getSymbolFromCurrency(row?.to_currency)}${parseFloat(row?.amount).toFixed(2)}`} sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, fontWeight: '700', border: `${theme ? '1px solid green': '1px solid transparent'}` }} variant="outlined" />         
                    }
                  </TableCell>
                  <TableCell style={{ width: 160 }} component="th"  scope="row">
                  {
                    row?.rec ?
                    getSymbolFromCurrency(row?.from_currency)
                    :
                    row?.extraType == "debit" ?
                    getSymbolFromCurrency(row?.from_currency)
                    :
                    row?.tr_type == "Stripe" ?
                    getSymbolFromCurrency(row?.from_currency)
                    :
                    getSymbolFromCurrency(row?.to_currency)
                  }
                  {parseFloat(row?.postbalance).toFixed(2)}
                  </TableCell>
                  <TableCell style={{ width: 160 }} component="th" scope="row">
                    {row?.status == "Success" && 
                    
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid green'}` 
                        }}
                      >
                        Success
                      </span>
                      // <Chip label="Success" sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, border: `${theme ? '1px solid green': '1px solid green'}` }} variant="outlined" />
                      
                    }
                    {row?.status == "succeeded" && 
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid green'}` 
                        }}
                      >
                        Success
                      </span>
                    }
                    {row?.status == "Complete" && 
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'green' : ''}`, 
                          color: `${theme ? 'white' : 'green'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid green': '1px solid green'}` 
                        }}
                      >
                        Success
                      </span>
                    }
                    {row?.status == "Pending" && 
                    <span 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '20px', 
                        background: `${theme ? 'orange' : ''}`, 
                        color: `${theme ? 'white' : 'orange'}`, 
                        fontWeight: '700', 
                        border: `${theme ? '1px solid orange': '1px solid orange'}` 
                      }}
                    >
                      Pending
                    </span>
                    }
                    {row?.status == "pending" && 
                    <span 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '20px', 
                        background: `${theme ? 'orange' : ''}`, 
                        color: `${theme ? 'white' : 'orange'}`, 
                        fontWeight: '700', 
                        border: `${theme ? '1px solid orange': '1px solid orange'}` 
                      }}
                    >
                      Pending
                    </span>
                    }
                    {row?.status == "Cancelled" && 
                    <span 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '20px', 
                        background: `${theme ? 'red' : ''}`, 
                        color: `${theme ? 'white' : 'red'}`, 
                        fontWeight: '700', 
                        border: `${theme ? '1px solid red': '1px solid red'}` 
                      }}
                    >
                      Cancelled
                    </span>
                    }
                    {row?.status == "Decline" && 
                      <span 
                        style={{ 
                          padding: '12px', 
                          borderRadius: '20px', 
                          background: `${theme ? 'red' : ''}`, 
                          color: `${theme ? 'white' : 'red'}`, 
                          fontWeight: '700', 
                          border: `${theme ? '1px solid red': '1px solid red'}` 
                        }}
                      >
                        Pending
                      </span>
                    }
                  </TableCell>
                  </TableRow>
                  ))}
                  {rowsNew?.length == 0 && (
                    <TableRow style={{ height: 53 * rowsNew }}>
                      <TableCell colSpan={7}>
                        <CustomNoRowsOverlay />
                      </TableCell>
                    </TableRow>
                  )}
                    </TableBody>
                  {/* </div> */}
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

    <Dialog
      fullWidth
      open={open}
      maxWidth="sm"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
        {"Transaction Details"}
      </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {
            <>
              <Grid container spacing={2} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                <Grid item xs={12}>
                  <table border={1} width="100%" style={{borderCollapse: 'collapse'}}>
                    <tbody>
                      <tr>
                        <td style={{padding: '10px'}}>Trx</td>
                        <td style={{padding: '10px'}}>{listOne?.[0]?.trx}</td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Requested Date</td>
                        <td style={{padding: '10px'}}>{moment(listOne?.[0]?.createdAt).format("YYYY-MM-DD hh:mm:ss:A")}</td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Fee</td>
                        <td style={{padding: '10px'}}>
                        {
                          listOne?.[0]?.extraType == "debit" ? 
                          `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.fee).toFixed(2)}`
                          : 
                          listOne?.[0]?.tr_type == "Stripe" ?
                          `${getSymbolFromCurrency(listOne?.[0]?.to_currency)}${parseFloat(listOne?.[0]?.fee).toFixed(2)}`
                          :
                          listOne?.[0]?.trans_type == "Exchange" ?
                          `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.fee).toFixed(2)}`
                          :
                          `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.fee).toFixed(2)}`
                        }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Bill Amount</td>
                        <td style={{padding: '10px'}}>
                        {
                        listOne?.[0]?.extraType == "debit" ?
                        `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.amount) + parseFloat(listOne?.[0]?.fee)}`
                          :
                          listOne?.[0]?.tr_type == "Stripe" ?
                          `${getSymbolFromCurrency(listOne?.[0]?.to_currency)}${parseFloat(listOne?.[0]?.amount + listOne?.[0]?.fee).toFixed(2)}`
                          :
                          listOne?.[0]?.trans_type == "Exchange" ? 
                          `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.amount + listOne?.[0]?.fee).toFixed(2)}`
                          :
                          `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${parseFloat(listOne?.[0]?.amount + listOne?.[0]?.fee).toFixed(2)}`
                        }
                      </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Transaction Type</td>
                        <td style={{padding: '10px'}}>{listOne?.[0]?.receipient ? "Transfer Money" : (`${listOne?.[0]?.extraType} - ${listOne?.[0]?.trans_type}`)}</td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px', fontWeight: '700'}} colSpan={2}>SENDER INFORMATION</td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && "Sender Email"}
                          {listOne?.[0]?.tr_type != "UPI" && "Sender Name"}
                        </td>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && listOne?.[0]?.upi_email}
                          {
                            listOne?.[0]?.tr_type != "UPI" && listOne?.[0]?.tr_type == "bank-transfer" 
                            ? 
                            listOne?.[0]?.receipient ?
                            listOne?.[0]?.senderAccountDetails?.[0]?.name
                            :
                            listOne?.[0]?.senderAccountDetails?.[0]?.name 
                            :
                            listOne?.[0]?.extraType == "credit" 
                            ? listOne?.[0]?.transferAccountDetails?.[0]?.name 
                            : listOne?.[0]?.senderAccountDetails?.[0]?.name 
                          }
                          {
                            listOne?.[0]?.trans_type == "Invoice" && listOne?.[0]?.upi_contact
                          }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && "UPI VPA"}
                          {listOne?.[0]?.tr_type != "UPI" && listOne?.[0]?.trans_type != "Invoice" && "Account Number"}
                          {listOne?.[0]?.tr_type != "UPI" && listOne?.[0]?.trans_type == "Invoice" && "Email"}
                        </td>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && listOne?.[0]?.upi_id}
                          {
                            listOne?.[0]?.tr_type != "UPI" && listOne?.[0]?.tr_type == "bank-transfer" 
                            ? 
                            listOne?.[0]?.receipient ?
                            listOne?.[0]?.senderAccountDetails?.[0]?.iban
                            :
                            listOne?.[0]?.senderAccountDetails?.[0]?.iban 
                            :
                            listOne?.[0]?.extraType == "credit" 
                            ? listOne?.[0]?.transferAccountDetails?.[0]?.iban 
                            : listOne?.[0]?.senderAccountDetails?.[0]?.iban 
                          }
                          {
                            listOne?.[0]?.trans_type == "Invoice" && listOne?.[0]?.upi_email
                          }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && "Contact Number"}
                          {listOne?.[0]?.tr_type != "UPI" && "Sender Address"}
                        </td>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.tr_type == "UPI" && listOne?.[0]?.upi_contact}
                          {
                            listOne?.[0]?.tr_type != "UPI" && listOne?.[0]?.tr_type == "bank-transfer" 
                            ? 
                            listOne?.[0]?.receipient ?
                            listOne?.[0]?.senderAccountDetails?.[0]?.address
                            :
                            listOne?.[0]?.senderAccountDetails?.[0]?.address 
                            :
                            listOne?.[0]?.extraType == "credit" 
                            ? listOne?.[0]?.transferAccountDetails?.[0]?.address 
                            : listOne?.[0]?.senderAccountDetails?.[0]?.address 
                          }
                        </td>
                      </tr>

                      <tr>
                        <td style={{padding: '10px', fontWeight: '700'}} colSpan={2}>RECEIVER INFORMATION</td>
                      </tr>
                    
                      <tr>
                        <td style={{padding: '10px'}}>Receiver Name</td>
                        <td style={{padding: '10px'}}>
                        {listOne?.[0]?.extraType == "credit" 
                        ? listOne?.[0]?.senderAccountDetails?.[0]?.name 
                        :
                         listOne?.[0]?.receipient ?
                         listOne?.[0]?.recAccountDetails?.[0]?.name 
                        :
                         listOne?.[0]?.transferAccountDetails?.[0]?.name 
                        }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Account Number</td>
                        <td style={{padding: '10px'}}>
                        {listOne?.[0]?.extraType == "credit" 
                        ? listOne?.[0]?.senderAccountDetails?.[0]?.iban 
                        :
                         listOne?.[0]?.receipient ?
                         listOne?.[0]?.recAccountDetails?.[0]?.iban 
                        :
                         listOne?.[0]?.transferAccountDetails?.[0]?.iban 
                        }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Receiver Address</td>
                        <td style={{padding: '10px'}}>
                        {listOne?.[0]?.extraType == "credit" 
                        ? listOne?.[0]?.senderAccountDetails?.[0]?.address 
                        :
                         listOne?.[0]?.receipient ?
                         listOne?.[0]?.recAccountDetails?.[0]?.address 
                        :
                         listOne?.[0]?.transferAccountDetails?.[0]?.address 
                        }
                        </td>
                      </tr>
                    
                      <tr>
                        <td style={{padding: '10px', fontWeight: '700'}}>TRANSACTION STATUS</td>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.status == "succeeded" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "Success" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "pending" && <><span style={{padding: '9px', background: 'blue', color: 'white', borderRadius: '12px'}}>Pending</span></>}
                          {listOne?.[0]?.status == "Complete" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "Decline" && <><span style={{padding: '9px', background: 'red', color: 'white', borderRadius: '12px'}}>Decline</span></>}
                        </td>
                      </tr>

                      <tr>
                        <td style={{padding: '10px', fontWeight: '700'}} colSpan={2}>BANK STATUS</td>
                      </tr>
                    
                      <tr>
                        <td style={{padding: '10px'}}>Trx</td>
                        <td style={{padding: '10px'}}>
                         {listOne?.[0]?.trx }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Trans Amt</td>
                        <td style={{padding: '10px'}}>
                        { 
                          listOne?.[0]?.receipient ?
                          getSymbolFromCurrency(listOne?.[0]?.from_currency)
                          :
                          listOne?.[0]?.extraType == "debit" ?
                          getSymbolFromCurrency(listOne?.[0]?.from_currency)
                          :
                          listOne?.[0]?.tr_type == "Stripe" ?
                          getSymbolFromCurrency(listOne?.[0]?.to_currency)
                          :
                          listOne?.[0]?.trans_type == "Exchange" ? 
                          getSymbolFromCurrency(listOne?.[0]?.from_currency)
                          :
                          getSymbolFromCurrency(listOne?.[0]?.from_currency)
                        }
                        {listOne?.[0]?.amount}
                        {
                          listOne?.[0]?.receipient && listOne?.[0]?.conversionAmount &&
                          <>
                            {" "}(Convert {getSymbolFromCurrency(listOne?.[0]?.from_currency)}{listOne?.[0]?.amount} to {getSymbolFromCurrency(listOne?.[0]?.to_currency)}{listOne?.[0]?.conversionAmount})
                          </>
                        }
                        {
                          !listOne?.[0]?.receipient && listOne?.[0]?.conversionAmount ?
                          <>
                            {" "}
                            (
                              Convert
                              {" "}
                              {
                                listOne?.[0]?.tr_type == "Stripe" ?
                                `${getSymbolFromCurrency(listOne?.[0]?.to_currency)}${listOne?.[0]?.amount} to ${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${listOne?.[0]?.conversionAmount}`
                                :
                                listOne?.[0]?.tr_type == "UPI" ?
                                `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${listOne?.[0]?.amount} to ${getSymbolFromCurrency(listOne?.[0]?.to_currency)}${listOne?.[0]?.conversionAmount}`
                                :
                                listOne?.[0]?.trans_type == "Exchange" ?
                                `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${listOne?.[0]?.amount} to ${getSymbolFromCurrency(listOne?.[0]?.to_currency)}${listOne?.[0]?.conversionAmount}`
                                :
                                `${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${listOne?.[0]?.amount} to ${getSymbolFromCurrency(listOne?.[0]?.from_currency)}${listOne?.[0]?.conversionAmount}`
                              }
                              
                            )
                          </>
                          :
                          null
                        }
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Settlement Date</td>
                        <td style={{padding: '10px'}}>
                        {listOne?.[0]?.status == "Complete" || listOne?.[0]?.status == "Success" || listOne?.[0]?.status == "succeeded" ? moment(listOne?.[0]?.updatedAt).format("YYYY-MM-DD hh:mm:ss A") : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{padding: '10px'}}>Transaction Status</td>
                        <td style={{padding: '10px'}}>
                          {listOne?.[0]?.status == "succeeded" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "Success" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "pending" && <><span style={{padding: '9px', background: 'blue', color: 'white', borderRadius: '12px'}}>Pending</span></>}
                          {listOne?.[0]?.status == "Complete" && <><span style={{padding: '9px', background: 'green', color: 'white', borderRadius: '12px'}}>Success</span></>}
                          {listOne?.[0]?.status == "Decline" && <><span style={{padding: '9px', background: 'red', color: 'white', borderRadius: '12px'}}>Decline</span></>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Grid>
              </Grid>
            </>
          }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Colorbtn onClick={handleClose} variant='contained'>Close</Colorbtn>
        </DialogActions>
    </Dialog>
   </>
  )
}

