import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import copy from "copy-to-clipboard";
import { usePDF } from 'react-to-pdf';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import getSymbolFromCurrency from 'currency-symbol-map';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Button, { ButtonProps } from '@mui/material/Button';
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Backdrop, Box, CircularProgress, Grid, Tooltip } from '@mui/material';
import { Table ,Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import { Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TransitionProps } from '@mui/material/transitions';

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
  { id: 'invoice_number', label: 'Invoice Number', minWidth: 170 },
  { id: 'date', label: 'Payment Date', minWidth: 170 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'amount', label: 'Paid Amount', minWidth: 100 },
  { id: 'type', label: 'Transaction Type', minWidth: 100 }
];

function createData(invoiceid:any,tcurr:any, icurr:any,id:any,invoice_number:any, payment_date:any,total:any,paid_amount:any,type:any) {
  return { invoiceid,tcurr,icurr,id,invoice_number,payment_date,total,paid_amount,type };
}

export default function InvoiceTransactions() {

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [msgLoading,setmsgLoading] = React.useState<boolean>(false);
  const { toPDF, targetRef } = usePDF({filename: 'invoices.pdf'});

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();

  const [openT, setOpenT] = React.useState(false);

  const handleCloseT = () => {
    setOpenT(false);
  };

  useEffect(() => {
   // current user id
   getTransactionsList();
  },[]);

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
    list?.map((item:any) => (
      createData(item?.invoiceDetails?.[0]?._id,item?.fromCurrency,item?.invoiceDetails?.[0]?.currency,item._id,item?.invoiceDetails?.[0]?.invoice_number,item?.dateadded,item?.amount,item?.invoiceDetails?.[0]?.total,item?.trans_type)
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

    // set variable for store Individual Invoice Transaction Details data.
    const [tinfoData,setInfoData] = React.useState<any>('');

    const getInvoiceIdByTransactionDetails = async(moreVal:any,type:any) => {
      if(type == "ITIOPAY") {
        await axios.get(`/${url}/v1/invoice/transaction/${moreVal}`, {
          headers: {
           'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
         })
         .then(result => {
           if(result.data.status == "201") {
            setInfoData(result.data.data);
            setOpenT(true);
           }
         })
         .catch(error => {
          console.log("error", error);
        }) 
      }
    }

  return (
    <>
     <Box sx={{ marginTop: '12px' , fontSize: '15px' }}>
      <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '1px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}` , sm:`${theme ? '1px solid white' : 'white'}` } , padding: '3px'}}>      
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
  
        </Grid>  
      <Box sx={{ overflow: "auto" }}>
       <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}> 
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
             <TableHead>
              <TableRow>
               {columns.map((column) => (
              <TableCell style={{ padding: '12px', background: '#8657E5', color: 'white' }} key={column.id}>
               {column.label}
              </TableCell>
             ))}
            </TableRow>
            </TableHead>
          <Tbody>
            {(rowsPerPage > 0
             ? rowsNew?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             : rowsNew
            ).map((row: any) => (
            <TableRow key={row?.date}>
            <TableCell style={{ padding: '20px', textAlign: 'center' }}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {
                  row?.type == "ITIOPAY" ?
                  <Tooltip title="View Transaction Details" placement="top" arrow>
                    <Grid sx={{ cursor: 'pointer' }} onClick={() => getInvoiceIdByTransactionDetails(row?.invoiceid,row?.type)}>{row?.invoice_number}</Grid>
                  </Tooltip> 
                  :
                  row?.invoice_number
                }
              </Grid>
            </TableCell>
            <TableCell style={{ padding: '20px', textAlign: 'center' }}>
              {moment(row?.payment_date).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell style={{ padding: '20px', textAlign: 'center' }}>
              {getSymbolFromCurrency(row?.tcurr)}{row?.total}
            </TableCell>
            <TableCell style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{background: 'green', color: 'white', padding: '10px', borderRadius: '10px'}}>{getSymbolFromCurrency(row?.tcurr)}{row?.paid_amount}</span>
            </TableCell>
            <TableCell style={{ padding: '20px', textAlign: 'center' }}>
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
          </Tbody>
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
   </Box>

      {/* // Modal Box for display Individial Invoice Transaction Details */}
      <Dialog
        fullWidth
        open={openT}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseT}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ color: `${theme ? 'white' : 'black'}` }}>{"Transaction Details"}</DialogTitle>
        <DialogContent>
          <table width="100%" border={1} style={{ borderCollapse: 'collapse', color: `${theme ? 'white' : 'black'}` }}>
            <tr>
              <td style={{ padding: '2%' }}>Trx: {tinfoData?.transID}</td>
            </tr>
            <tr>
              <td style={{ padding: '2%' }}>Reference: {tinfoData?.reference}</td>
            </tr>
            <tr>
              <td style={{ padding: '2%' }}>Payment Date: {tinfoData?.tdate}</td>
            </tr>
            <tr>
              <td style={{ padding: '2%' }}>Paid Amount: {tinfoData?.billAmt}</td>
            </tr>
            <tr>
              <td style={{ padding: '2%' }}>Currency: {tinfoData?.currency}</td>
            </tr>
            <tr>
              <td style={{ padding: '2%' }}>Status: {tinfoData?.status}</td>
            </tr>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseT} sx={{ color: `${theme ? 'white' : 'black'}` }}>Close</Button>
        </DialogActions>
     </Dialog>
  </>
 )
}
