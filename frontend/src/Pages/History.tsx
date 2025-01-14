import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

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
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'coin', label: 'Coin', minWidth: 100 },
  { id: 'paymentType', label: 'Payment Type', minWidth: 100 },
  { id: 'noOfCoins', label: 'No Of Coins', minWidth: 100 },
  { id: 'walletaddress', label: 'Wallet Address', minWidth: 100 },
  { id: 'side', label: 'Side', minWidth: 100 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 }
];

function createData(id:any,date:any,coin:String,paymentType:String,noOfCoins:any,walletAddress:any,side:any,amount:Number,status:any) {
  return { id,date,coin,paymentType,noOfCoins,walletAddress,side,amount,status };
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

export default function History() {

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getTransactionsList(accountId.data.id);
  },[]);

  const getTransactionsList = async(id:any) => {
    await axios.get(`/${url}/v1/crypto/list/${id}`,
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

  let rows = [];

  rows = [
    list?.map((item:any) => (
      createData(item._id,item.createdAt, item.coin, item.paymentType, item.noOfCoins, item.walletAddress, item.side, item.amount, item.status)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];
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
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  return (
    <>
     <Box sx={{ marginLeft: {md:  '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '90%'}}}>
      <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
      <Box sx={{ overflow: "auto" }}>
       <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow  className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
               {columns.map((column) => (
              <TableCell
                key={column.id}
                style={{ minWidth: column.minWidth }}
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
              {moment(row?.date).format("MMMM Do YYYY, h:mm:ss A")}
             </TableCell>
             <TableCell style={{ width: 50 }} component="th" scope="row">
              {row?.coin}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.paymentType}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.noOfCoins}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.walletAddress}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.side.toUpperCase()}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th"  scope="row">
              {parseFloat(row?.amount).toFixed(2)}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.status}
             </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
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
   </>
  )
}
