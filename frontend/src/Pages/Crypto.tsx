import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import getSymbolFromCurrency from 'currency-symbol-map';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Colorbtn } from '../Component/Button/ColorButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Paper, Table , Box, Chip, Container, Grid, Stack, TableBody, TableContainer, TableFooter, TableHead, TablePagination, Tooltip, TableRow, TableCell } from '@mui/material';

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
  { id: 'side', label: 'Side', minWidth: 100 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
];

function createData(id:any,currency:any,date:any,coin:String,paymentType:String,noOfCoins:any,side:any,amount:Number,status:any) {
  return { id,currency,date,coin,paymentType,noOfCoins,side,amount,status };
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

export default function Crypto() {
  
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>([]);

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    localStorage.removeItem('camount');
    localStorage.removeItem('ccoin');
    localStorage.removeItem('ccryptofees');
    localStorage.removeItem('cexchangefees');
    localStorage.removeItem('cnoofcoins');
    localStorage.removeItem('crate');
    localStorage.removeItem('cside');
    localStorage.removeItem('cwalletAddress');
    localStorage.removeItem('sellcoin');
    localStorage.removeItem('sellcurrency');
    localStorage.removeItem('sellnoofcoins');
    localStorage.removeItem('sellamount');
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
      createData(item._id,item.currencyType,item.createdAt, item.coin, item.paymentType, item.noOfCoins, item.side, item?.amount, item.status)
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
      <Grid sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px',  marginTop: { xs: '-10px', md: '20px' }, border: `${theme ? '2px solid lightblue': '1px solid transparent'}` }}> 
        <Container maxWidth="lg" sx={{ padding: "10px 10px", px: { xs: 0, sm: 1 } }}>
          <Stack direction="row" gap={2} sx={{ marginLeft: '-7px',padding: "0px 1px" }}>
            <Colorbtn variant='contained' onClick={() => navigate('/crypto/buysell')}>Buy / Sell</Colorbtn>
          </Stack>
        </Container>
        {/* @ts-ignore */}
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
           <TableContainer component={Paper}>
            <Table>
            <TableHead sx={{ background: '#673ab7', color: 'white' }}>
              <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                {columns.map((column) => (
                <TableCell
                  key={column.id}
                  width="220"
                  align="center"
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
              <TableCell align="center" scope="row">
                {moment(row?.date).format("YYYY-MM-DD")}
              </TableCell>
              <TableCell align="center" scope="row">
                <Tooltip title={`${row?.coin.replace("_TEST","")}`} sx={{ cursor: 'pointer' }} placement="top-start">
                  <img
                    loading="lazy"
                    style={{ padding: '1px', cursor: 'pointer', height: '50px', width: '50px', borderRadius: '50px'}}
                    src={`https://assets.coincap.io/assets/icons/${row?.coin.replace("_TEST","").toLowerCase()}@2x.png`}
                    alt={`${row?.coin}`}
                  />  
                </Tooltip>
              </TableCell>
              <TableCell align="center" scope="row">
                {row?.paymentType == "" ? 'N/A' : row?.paymentType}
              </TableCell>
              <TableCell align="center" scope="row">
                {row?.noOfCoins}
              </TableCell>
              <TableCell align="center" scope="row">
                {row?.side == "buy" && 
                <Chip label={`BUY`} sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, fontWeight: '700', border: `${theme ? '1px solid green': '1px solid transparent'}` }} variant="outlined" />            
                }
                {row?.side == "sell" && 
                <Chip label={`SELL`} sx={{ background: `${theme ? 'red' : ''}`, color: `${theme ? 'white' : 'red'}`, fontWeight: '700', border: `${theme ? '1px solid red': '1px solid transparent'}` }} variant="outlined" />            
                }
              </TableCell>
              <TableCell align="center" scope="row">
                {row?.currency && getSymbolFromCurrency(row?.currency)}{parseFloat(row?.amount).toFixed(2)}
              </TableCell>
              <TableCell align="center" scope="row">
                {row?.status == "completed" && <Chip label="Completed" sx={{ background: `${theme ? 'green' : ''}`, color: `${theme ? 'white' : 'green'}`, border: `${theme ? '1px solid green': '1px solid green'}` }} variant="outlined" />}
                {row?.status == "Pending" && <Chip label="Pending" sx={{ background: `${theme ? 'orange' : ''}`, color: `${theme ? 'white' : 'orange'}`, border: `${theme ? '1px solid orange': '1px solid orange'}` }} variant="outlined" />}
                {row?.status == "pending" && <Chip label="Pending" sx={{ background: `${theme ? 'orange' : ''}`, color: `${theme ? 'white' : 'orange'}`, border: `${theme ? '1px solid orange': '1px solid orange'}` }} variant="outlined" />}
                {row?.status == "cancelled" && <Chip label="Cancelled" sx={{ background: `${theme ? 'red' : ''}`, color: `${theme ? 'white' : 'red'}`, border: `${theme ? '1px solid orange': '1px solid red'}` }} variant="outlined" />}
                {row?.status == "declined" && <Chip label="Decline" sx={{ background: `${theme ? 'red' : ''}`, color: `${theme ? 'white' : 'red'}`, border: `${theme ? '1px solid red': '1px solid red'}` }} variant="outlined" />}
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
                  }
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
  )
}
