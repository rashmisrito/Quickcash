import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import copy from "copy-to-clipboard";
import { usePDF } from 'react-to-pdf';
import Menu from '@mui/material/Menu';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import getSymbolFromCurrency from 'currency-symbol-map';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Closebtn, Colorbtn } from '../../../Component/Button/ColorButton';
import {
  Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, 
  TablePagination, TableRow, Typography, Alert, Box, Card, CardActions, CardContent, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Select, 
  Snackbar, 
  Tooltip
} from '@mui/material';

import { Table,Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

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
  { id: 'date', label: 'Invoice Date', minWidth: 170 },
  { id: 'due_date', label: 'Due Date', minWidth: 100 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'transaction', label: 'Transactions', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 120 }
];

function createData(id:any,createdBy:any,dueAmount:Number,invoice_number:any,date:any,due_date:String,total:String,transaction:string,status: string,action: string,currency:string,recurring:any) {
  return { id,createdBy,dueAmount,invoice_number,date,due_date,total,transaction,status,action,currency,recurring };
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

export default function Invoices() {

  const tableRef = React.useRef(null);
  const { toPDF, targetRef } = usePDF({filename: 'invoices.pdf'});
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [copyopen, setCopyOpen] = React.useState(false);
  const contentCopy = (wid: string) => {
    setCopyOpen(true);
    copy(wid);
    setAnchorEl(null);
  };

  const handleCloseCopy = () => {
    setCopyOpen(false);
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [invoiceNumber,setInvoiceNumber] = React.useState<any>('');
  const [moreVal,setMoreVal] = React.useState<any>('');
  const [status,setStatus] = React.useState<any>('');
  const [recurring,setRecurring] = React.useState<any>('');

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setStatus(valpo[1]);
    setRecurring(valpo[2]);
    setInvoiceNumber(valpo[3]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();

  useEffect(() => {
   const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
   getTransactionsList(accountId.data.id);
  },[]);

  const getTransactionsList = async(id:any) => {
    await axios.get(`/${url}/v1/admin/invoice/list/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
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
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.get(`/${url}/v1/admin/invoice/export/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status =="success")
      alertnotify("Excel Report has been generated Successfully", "Success")
      window.open(`${import.meta.env.VITE_PUBLIC_URL}/users.xlsx`);
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  let rows = [];

  rows = [
    list?.map((item:any) => (
     createData(item._id,item.createdBy,item.dueAmount,item.invoice_number,item.invoice_date,item.due_date,item.total,item.status,item.status,item._id,item.currency,item.recurring)
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

  const [filterStatus,setFilterStatus] = React.useState<any>('');
  const [filterRecurring,setFilterRecurring] = React.useState<any>('');
 
  const getFilterResults = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
     await axios.get(`/${url}/v1/admin/invoice/list/${accountId?.data?.id}?status=${filterStatus}&recurring=${filterRecurring}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
     })
     .then(result => {
       if(result.data.status == "201") {
        setList(result.data.data);
        setOpen2(false);
       }
     })
     .catch(error => {
      console.log("error", error);
    }) 
  }

  const [TransactionsResult,setTransactionsResult] = React.useState([]);

  const getValues = async(val:any) => {
    await axios.get(`/${url}/v1/admin/invoice/transactions/${val}`)
    .then(result => {
      if(result.data.status == 201) {
        setTransactionsResult(result.data.data);
      }
    })
    .catch(error => {
     console.log("error", error);
    }) 
  }

  const HandleUpdateInvoice = async (id:any,val:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.patch(`/${url}/v1/admin/invoice/update/${id}`, {
     "user": accountId?.data?.id,
     "recurring": val,
     "recurring_cycle": val == "yes" ? 1 : '',
   }, 
   { 
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify("Recurring status updated successfully","success");
      setAnchorEl(null);
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
      getTransactionsList(accountId.data.id);
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  };

  const HandleDeleteInvoice = async (val:any) => {
    var r = confirm("Are you sure?");
    if(r == true){
      await axios.delete(`/${url}/v1/admin/invoice/delete/${val}`, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
          setAnchorEl(null);
          getTransactionsList(accountId.data.id);
          alertnotify("Selected Invoice has been deleted Successfully", "success");
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error.response.data.message, "error");
      })
    } else {
      return false;
    }
  }

  const [TransactionsModelOpen,setTransactionsModelOpen] = React.useState(false);

  const handleClickTransactionsOpen = (val:any) => {
    getValues(val);
    setTransactionsModelOpen(true);
  }

  const handleCloseTransaction = () => {
    setTransactionsModelOpen(false);
  }

  const HandleResetFilter = () => {
    setOpen2(false);
    setFilterRecurring('');
    setFilterStatus('');
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    getTransactionsList(accountId.data.id);
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

  return (
    <>
      <Snackbar open={copyopen} autoHideDuration={6000} onClose={handleCloseCopy} anchorOrigin={{ horizontal:'center', vertical:'top' }}>
        <Alert
          onClose={handleCloseCopy}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Invoice URL Copied!
        </Alert>
      </Snackbar>
     <Box sx={{ marginLeft: {md: '7%'} , marginTop: {xs:'-10px',md:'12px'} , fontSize: '15px', width: {md: '89%'}}}>
      <Grid sx={{display: 'flex', flexDirection:'row' , justifyContent: 'flex-end' , gap: '10px'}}>
        <Grid><Typography><Colorbtn onClick={handleOpen}><FilterAltIcon /></Colorbtn></Typography></Grid>
        {
            rowsNew?.length > 0 &&
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , gap: '10px' }}>
            <Grid onClick={exportExcellistforInvoice} sx={{ cursor: 'pointer' }}>
            <Tooltip title="Download Excel" sx={{ cursor: 'pointer' }} placement="top-start">
              <img src={`${import.meta.env.VITE_APP_URL}/icons/excel.png`} width={45} />
            </Tooltip>
            </Grid>
            <Grid onClick={() => toPDF()} sx={{ cursor: 'pointer' }}>
            <Tooltip title="Download Pdf" sx={{ cursor: 'pointer' }} placement="top-start">
              <img src={`${import.meta.env.VITE_APP_URL}/icons/pdf.png`} width={41} />
            </Tooltip>     
            </Grid>
            </Grid>
          }
      </Grid>
      <Grid sx={{display: 'flex', flexDirection: 'column' , marginTop: '12px',borderRadius: '.5rem',fontWeight: '700', background: `${theme ? '#183153' : 'white'}`, color: `${theme ? 'white' : 'black'}`, padding: '3px'}}>
       <div>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>Filter Options</Grid>
                    <Grid><CancelIcon sx={{cursor: 'pointer'}} onClick={() => HandleResetFilter()}/></Grid>
                  </Grid>
                </Typography>
                <hr />
                <label style={{ color: `${theme ? 'white': 'black'}` }}>Status:</label>
                 <Select fullWidth sx={{marginBottom: '20px', color: `${theme ? 'white' : 'black'}`,border: `${theme ? '1px solid white': ''}`}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="" sx={{ color: `${theme ? 'white' : 'black'}` }}>All</MenuItem>
                  <MenuItem value="overdue" sx={{ color: `${theme ? 'white' : 'black'}` }}>Overdue</MenuItem>
                  <MenuItem value="partial" sx={{ color: `${theme ? 'white' : 'black'}` }}>Partially Paid</MenuItem>
                  <MenuItem value="paid" sx={{ color: `${theme ? 'white' : 'black'}` }}>Paid</MenuItem>
                  <MenuItem value="unpaid" sx={{ color: `${theme ? 'white' : 'black'}` }}>Unpaid</MenuItem>
                </Select>
                <label style={{ color: `${theme ? 'white': 'black'}` }}>Recurring Status :</label>
                <Select fullWidth sx={{ border: `${theme ? '1px solid white': ''}` }} value={filterRecurring} onChange={(e) => setFilterRecurring(e.target.value)}>
                  <MenuItem value="yes" sx={{ color: `${theme ? 'white' : 'black'}` }}>On</MenuItem>
                  <MenuItem value="no" sx={{ color: `${theme ? 'white' : 'black'}` }}>Off</MenuItem>
                </Select>
              </CardContent>
              <CardActions sx={{float: 'right'}}>
                <Colorbtn onClick={() => getFilterResults()}>Filter</Colorbtn>
                <Closebtn onClick={() => HandleResetFilter()}>Reset</Closebtn>
              </CardActions>
            </Card>
          </Box>
        </Modal>
       </div>

        {/* @ts-ignore */}
        <Table style={{ background: `${theme ? '#183153' : '#F2F3FE'}`, color: `${theme ? 'white' : 'black'}` }}>
          <div ref={targetRef}>
            <Thead>
              <Tr className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
               {columns.map((column) => (
              <Td 
                key={column.id} 
                width="220"
                style={{ padding: '12px', background: '#8657E5', color: 'white' }}
              >
               {column.label}
              </Td>
              ))}
              </Tr>
            </Thead>
          <TableBody>
            {(rowsPerPage > 0
             ? rowsNew?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             : rowsNew
            ).map((row: any) => (
            <Tr key={row?.invoice_date}>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.invoice_number}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {moment(row?.invoice_date).format("DD-MM-YYYY")}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {moment(row?.due_date).format("DD-MM-YYYY")}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {getSymbolFromCurrency(row?.currency)}{parseFloat(row?.total).toFixed(2)}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} align='center'  scope="row">
             {getSymbolFromCurrency(row?.currency)}{row?.dueAmount > 0 ? parseFloat(row?.dueAmount).toFixed(2) : parseFloat(row?.total).toFixed(2)}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              { (row?.status == "paid" || row?.status == "Test" || row?.status == "Approved") && <><span style={{background: 'green', borderRadius: '12px', color: 'white' , padding: '10px'}}>Paid</span></>}
              {row?.status == "unpaid" && <><span style={{background: 'red', borderRadius: '12px', color: 'white', padding: '10px'}}>Unpaid</span></>}
              {row?.status == "partial" && 
              <>
                <span style={{background: 'magenta', borderRadius: '12px', color: 'white', padding: '10px'}}>Partial</span>
              </>
              }
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                <IconButton
                  aria-label="more"
                  value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}`}
                  id={`long-button${row?.id}`}
                  aria-controls={open ? `long-menu${row?.id}` : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  sx={{ color: `${theme ? 'white': 'black'}` }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  key={row?.id}
                  id={`long-menu${row?.id}`}
                  MenuListProps={{
                  'aria-labelledby': `long-button${row?.id}`,
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {/* { status == "unpaid" && row?.createdBy == "admin" && <MenuItem onClick={() => navigate(`/admin/edit-invoice/${moreVal}`)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Edit</span></MenuItem>} */}
                  <MenuItem onClick={() => contentCopy(`${import.meta.env.VITE_PUBLIC_URL}/invoicepdf/${invoiceNumber}`)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Invoice URl</span></MenuItem>
                  {/* {/* { (status == "unpaid") && <MenuItem onClick={() => HandleDeleteInvoice(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Delete</span></MenuItem> } */}
                  { (status == "paid" || status == "partial" || status == "Test" || status == "Approved") && <MenuItem onClick={() => handleClickTransactionsOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Transactions</span></MenuItem>}
                </Menu>
             </Td>
            </Tr>
           ))}
           {rowsNew?.length == 0 && (
            <Tr>
              <Td colSpan={7}>
               <CustomNoRowsOverlay />
              </Td>
            </Tr>
           )}
          </TableBody>
          </div>
          <TableFooter sx={{ background: `${theme ? 'white': ''}`, color: 'black' }}>
           <Tr>
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
           </Tr>
          </TableFooter>
        </Table>

    </Grid>
   </Box>

    <Dialog
      maxWidth={'lg'}
      open={TransactionsModelOpen}
      onClose={handleCloseTransaction}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleCloseTransaction();
        },
      }}
    >
    <DialogTitle sx={{ color: `${theme ? 'white': 'black'}` }}>Transactions Details</DialogTitle>
      <DialogContent>
        <DialogContentText>
         <table border={1} width="100%" style={{ color: `${theme ? 'white': 'black'}` }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}}>Transaction Date</th>
              <th style={{padding: '10px'}}>Transaction ID</th>
              <th style={{padding: '10px'}}>Payment Mode</th>
              <th style={{padding: '10px'}}>Paid Amount</th>
            </tr>
          </thead>
          <tbody>
          {
            TransactionsResult?.map((item:any,index:number) => (
              <tr key={index}>
                <td style={{padding: '10px'}}>{item?.dateadded}</td>
                <td style={{padding: '10px'}}>{item?._id}</td>
                <td style={{padding: '10px'}}>{item?.trans_type}</td>
                <td style={{padding: '10px'}}>{getSymbolFromCurrency(item?.toCurrency)}{item?.convertAmount}</td>
              </tr>
            ))    
          }
          </tbody>
         </table>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Colorbtn onClick={handleCloseTransaction}>Close</Colorbtn>
      </DialogActions>
    </Dialog>
  </>
 )
}
