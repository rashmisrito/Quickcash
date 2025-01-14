import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useOutletContext } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Closebtn, Colorbtn } from "../../Component/Button/ColorButton";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Menu, MenuItem, Switch, Typography } from '@mui/material';
import { Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import getSymbolFromCurrency from 'currency-symbol-map';

import { Table,Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

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
    { id: 'username', label: 'Username', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 120 },
    { id: 'amount', label: 'Amount', minWidth: 100 },
    { id: 'info', label: 'Info', minWidth: 100 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 }
  ];
  
  function createData(curr:any,id:any,date:any,username:String,email:String,amount:any,info:any,type:any,status:any) {
    return { curr,id,date,username,email,amount,info,type,status };
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

export default function RevenueList() {

  const [open, setOpen] = React.useState(false);
  const [open5,setOpen5] = React.useState(false);
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [totalRevenueAmount,setTotalRevenueAmount] = React.useState<any>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreVal,setMoreVal] = React.useState<any>('');
  const open2 = Boolean(anchorEl);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
   getListData();
  },[]);

  const getListData = async() => {
    await axios.get(`/${url}/v1/admin/revenue/list`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result.data.data);
        setTotalRevenueAmount(result?.data?.total);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  interface viewType {
    owneridofindividual: any,
    ownertaxid: any,
    ownerbrd: any,
    email: string,
    name: string,
    mobile: any,
    address: any,
    country: any,
    postalcode: any,
    defaultCurrency: any
  }

  let rows = [];
  rows = [
    list?.map((item:any) => (
     createData(item?.fromCurrency,item?._id,item?.createdAt,item?.userDetails?.[0]?.name,item?.userDetails?.[0]?.email,item?.fee,item.info,item?.trans_type,item?.status)
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid sx={{ marginLeft: {md: '7%'} , marginTop: {xs:'-10px', md:'12px'} }}>
        <Typography variant='h5' style={{fontWeight: '700', color: `${theme ? 'white' : 'black'}`}}>{"Total Revenue: "}
          {getSymbolFromCurrency("USD")}{parseFloat(totalRevenueAmount).toFixed(2)}
        </Typography>
      </Grid>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: {xs:'0px', md:'12px'} , fontSize: '15px', width: {md: '90%'}}}>
       <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',background: `${theme ? '' : 'white'}`,padding: '3px'}}>
        {/* @ts-ignore */}
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
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
            <Tr key={row?.date}>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {moment(row?.date).format("YYYY-MM-DD")}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {row?.username}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {row?.email}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {getSymbolFromCurrency(row?.curr)}{parseFloat(row?.amount).toFixed(2)}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {row?.info}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {row?.type}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400',color: `${theme ? 'white': 'black'}` }} scope="row">
              {row?.status == "Success" || row?.status == "succeeded" || row?.status == "Success" ? "Success" : row?.status}
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
          <TableFooter sx={{ background: `${theme ? 'white': ''}` }}>
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

    </>
  )
}
