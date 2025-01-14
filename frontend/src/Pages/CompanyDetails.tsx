import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Colorbtn } from '../Component/Button/ColorButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

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
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'businessType', label: 'Business Type', minWidth: 100 },
  { id: 'businessRegistrationNumber', label: 'Registration Number', minWidth: 100 },
  { id: 'taxIdentificationNumber', label: 'Tax Identification Number', minWidth: 100 },
  { id: 'tradingAddress', label: 'Trading Address', minWidth: 100 },
  { id: 'proofoftradingAddress', label: 'Proof of Trading Address', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 120}
];

function createData(id:any,date:any, businessType:String , businessRegistrationNumber:String , taxIdentificationNumber:any , tradingAddress:any, proofoftradingAddress:any) {
  return { id,date,businessType,businessRegistrationNumber,taxIdentificationNumber,tradingAddress,proofoftradingAddress };
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

export default function CompanyDetails() {

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [tid,setTid] = React.useState<any>();
  const [theme]:any = useOutletContext();

  const handleClickOpen = (value: any) => {
    setOpen(true);
    setTid(value);
    getListById(value);
  };

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [list,setList] = React.useState<any>();
  const [listOne,setListOne] = React.useState<any>();
  const [moreVal,setMoreVal] = React.useState<any>('');

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getTransactionsList(accountId.data.id);
  },[]);

  const getTransactionsList = async(id:any) => {
    await axios.get(`/${url}/v1/company/list/${id}`, {
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

  const getListById = async (id:any) => {
    await axios.get(`/${url}/v1/company/${id}`, {
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

  let rows = [];

  rows = [
    list?.map((item:any) => (
      createData(item._id,item.createdAt,item.businessType,item.businessRegistrationNumber,item.taxIdentificationNumber,item.tradingAddress, item.proofoftradingAddress)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];

  const handleClose = () => {
    setOpen(false);
    setTid('');
  };
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (newPage:any) => {
   setPage(newPage);
  };

  const handleChangeRowsPerPage = (event:any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose2 = () => {
    setAnchorEl(null);
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

  const HandleDelete = async (val:any) => {
    var r = confirm("Are you sure?");
    if(r == true){
      await axios.delete(`/${url}/v1/company/delete/${val}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
          getTransactionsList(accountId.data.id);
          alertnotify("Selected company deltails has been deleted Successfully", "success");
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

  return (
    <>
      <Box sx={{ marginLeft: {md:  '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '89%'}}}>
      <Grid sx={{display: 'flex', flexDirection: 'column',gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
        <Typography>
          <Colorbtn onClick={() => navigate('/new-company-list')}>Add Company List</Colorbtn>
        </Typography>
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
                  {row?.businessType}
                </TableCell>
                <TableCell style={{ width: 160 }} component="th" scope="row">
                  {row?.businessRegistrationNumber}
                </TableCell>
                <TableCell style={{ width: 160 }} component="th" scope="row">
                  {row?.taxIdentificationNumber}
                </TableCell>
                <TableCell style={{ width: 160 }} component="th"  scope="row">
                  {row?.tradingAddress}
                </TableCell>
                <TableCell>
                  <img 
                    crossOrigin="anonymous"
                    src={`${import.meta.env.VITE_PUBLIC_URL}/company/${row?.proofoftradingAddress}`}
                    width="100%"
                    height="100%"
                    alt="prooftrading"
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                    <IconButton
                      aria-label="more"
                      value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}`}
                      id={`long-button${row?.id}`}
                      aria-controls={open ? `long-menu${row?.id}` : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
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
                      open={open2}
                      onClose={handleClose2}
                    >
                      <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><VisibilityIcon sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(moreVal)}/></span></MenuItem>
                      <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><EditIcon sx={{ cursor: 'pointer' }} onClick={() => navigate(`/edit-company-details/${moreVal}`)}/></span></MenuItem>
                      <MenuItem><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}><DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => HandleDelete(`${moreVal}`)}/></span></MenuItem>
                    </Menu>
                </TableCell>
                </TableRow>
              ))}
              {rowsNew?.length == 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7}>
                  <CustomNoRowsOverlay />
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
              <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={7}
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

       </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
        {"Company Details"}
      </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <TableContainer component={Paper}>
            <Table sx={{ height: 200 }} aria-label="simple table">
              <TableBody sx={{height: '200px'}}>
                <TableRow>
                  <TableCell>Created Date</TableCell>
                  <TableCell>{moment(listOne?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business Registration Number</TableCell>
                  <TableCell>{listOne?.businessRegistrationNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business Type</TableCell>
                  <TableCell>{listOne?.businessType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax Identification Number</TableCell>
                  <TableCell>{listOne?.taxIdentificationNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trading Address</TableCell>
                  <TableCell>{listOne?.tradingAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business Registration Document</TableCell>
                  <TableCell>
                  {
                    listOne?.businessRegistrationDocument ?
                    <img
                      crossOrigin="anonymous"
                      width="100%"
                      height="200px"
                      alt="businessRegistrationDocument"
                      src={`${import.meta.env.VITE_PUBLIC_URL}/company/${listOne?.businessRegistrationDocument}`}
                    /> 
                    :
                    'Please Upload'                     
                  }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Proof of Trading Address</TableCell>
                  <TableCell>
                    {
                      listOne?.proofoftradingAddress ?
                      <img
                        crossOrigin="anonymous"
                        width="100%"
                        height="100%"
                        alt="proofTradingAddress"
                        src={`${import.meta.env.VITE_PUBLIC_URL}/company/${listOne?.proofoftradingAddress}`}
                      /> 
                      :
                      'Please Upload'                     
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Colorbtn onClick={handleClose} variant='contained'>Close</Colorbtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
