import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { useOutletContext } from "react-router-dom";
import {Colorbtn,Closebtn} from '../Button/ColorButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Table,Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Backdrop, Box, Chip, CircularProgress, Grid, Menu, MenuItem,Select, TextField } from '@mui/material';
import { Paper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

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
    { id: 'createdAt', label: 'Date', minWidth: 170 },
    { id: 'username', label: 'User Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'coin', label: 'Coin', minWidth: 70 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 120}
  ];
  
  function createData(id:any,date:any,name:String,email:String,coin:any,status:any) {
    return { id,date,name,email,coin,status };
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

export default function WalletRequest() {

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [comment,setComment] = React.useState<any>('');
  const [history,setHistory] = React.useState<any>([]);
  const [currentWalletId,setCurrentWallletId] = React.useState<any>('');
  const [currentWalletRequestStatus,setcurrentWalletRequestStatus] = React.useState<any>('');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const handleClickOpen = (id:any) => {
   setOpen(true);
   setCurrentWallletId(id);
  };

  const handleClickOpen3 = (id:any) => {
    setOpen3(true);
    HandleGetHistory(id);
    setCurrentWallletId(id);
  };

  const handleClose = () => {
   setOpen(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    getListData();
  },[]);

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

  const getListData = async() => {
    await axios.get(`/${url}/v1/walletaddressrequest/listadmin`, {
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

  const [loader,setLoader] = React.useState<boolean>(false);

  const HandleUpdateStatus = async(id:any) => {
    setLoader(true);
    await axios.patch(`/${url}/v1/walletaddressrequest/update/${id}`,{
      comment: comment,
      status: currentWalletRequestStatus,
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
    }
    })
    .then(result => {
      if(result.data.status == 201) {
        setLoader(false);
        alertnotify(result.data.message, "Success");
        getListData();
        setOpen(false);
      }
    })
    .catch(error => {
      console.log("error", error);
      setLoader(false);
      alertnotify(error.response.data.message, "error");
    })
  }

  const HandleGetHistory = async(id:any) => {
    await axios.get(`/${url}/v1/walletaddressrequest/history/${id}`,{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
       setHistory(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  let rows = [];
  rows = [
    list?.map((item:any) => (
      createData(item?._id,item?.createdAt, item?.userDetails[0]?.name, item?.userDetails[0]?.email,item?.coin, item?.status)
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreVal,setMoreVal] = React.useState<any>('');
  const open2 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
   setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: {xs:'-10px',md:'12px'} , fontSize: '15px', width: {md: '91%'}}}>
       <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',fontWeight: '700',background: `${theme ? '#183153' : 'white'}`, color: `${theme ? 'white' : 'black'}`,padding: '3px 3px'}}>
       {/* @ts-ignore */}
       <Table style={{ background: `${theme ? '' : '#F2F3FE'}`, color: `${theme ? 'white' : 'black'}` }}>
          <Thead>
            <Tr className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
              {columns.map((column) => (
               <Td 
                  key={column.id}  
                  width="220"
                  style={{ padding: '12px', background: '#8657E5', color: 'white' }}>{column.label}</Td>
              ))}
            </Tr>
          </Thead>
          <TableBody>
            {(rowsPerPage > 0
            ? rowsNew?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rowsNew
            ).map((row: any) => (
            <Tr key={row?.date}>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {moment(row?.date).format("YYYY-MM-DD")}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.name}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.email}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' , gap: '10px' }}>
                <Grid>
                  <img
                    loading="lazy"
                    style={{height: '30px', width: '30px', borderRadius: '50px'}}
                    src={`https://assets.coincap.io/assets/icons/${ row?.coin?.replace("_TEST","").toLowerCase()}@2x.png`}
                    alt={`${row?.coin?.replace("_TEST","")}`}
                  />
                </Grid>
                <Grid>{row?.coin?.replace("_TEST","")}</Grid>
              </Grid>  
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {(row?.status === 'completed') && <span style={{ border: `${theme ? '1px solid green' : '1px solid green'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'green' : ''}` }}>Success</span> }
              {(row.status === 'cancelled') && <span style={{ border: `${theme ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'red' : ''}` }}>Cancelled</span> }
              {(row.status === 'declined') &&<span style={{ border: `${theme ? '1px solid red' : '1px solid red'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'red' : ''}` }}>Decline</span> }
              {(row.status === 'pending') && <span style={{ border: `${theme ? '1px solid orange' : '1px solid orange'}`, padding: '12px', borderRadius: '20px', background: `${theme ? 'orange' : ''}` }}>Pending</span> }
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {
                row?.status == "completed" ? "Completed" :
                <>
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
                  <MenuItem onClick={() => handleClickOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Update</span></MenuItem>
                </Menu>
                </>
              }
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

    {/**Update Status Dialog Box**/}
     <Dialog
        open={open}
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Update Wallet Address Request</DialogTitle>
         <DialogContent>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Select fullWidth value={currentWalletRequestStatus} onChange={(e) => setcurrentWalletRequestStatus(e.target.value)} placeholder="Select Status">
            <MenuItem value="completed">Complete</MenuItem>
            <MenuItem value="declined">Decline</MenuItem>
          </Select>
          <hr />
          <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Reason</label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="email"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setComment(e.target.value)}
            multiline={true}
          />
         </DialogContent>
         <DialogActions>
          <Closebtn onClick={handleClose}>Cancel</Closebtn>
          <Colorbtn type="button" onClick={() => HandleUpdateStatus(currentWalletId)}>Save</Colorbtn>
         </DialogActions>
     </Dialog>
    {/**Update Status Dialog Box**/}

    {/**History Dialog Box**/}
     <Dialog
        open={open3}
        fullWidth
        onClose={handleClose3}
      >
        <DialogTitle sx={{textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>History</DialogTitle>
         <DialogContent>
          <table border={1} width="100%" style={{borderCollapse: 'collapse'}}>
           <thead>
            <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
            <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Status</th>
            <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Comment</th>
           </thead>
           <tbody>
           {
            history?.map((item:any,index:number) => (
             <tr key={index}>
              <td style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} align='center'>{moment(item?.date).format("MMMM Do YYYY, h:mm:ss A")}</td>
              <td style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} align='center'>{item.status}</td>
              <td style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`} align='center'>{item.reason}</td>
             </tr> 
            ))
           }
           {
            history?.length == 0 &&
            <tr>
              <td colSpan={3} align='center' style={{padding: '10px'}}>No history found</td>
            </tr>
           }
           </tbody>
          </table>
         </DialogContent>
         <DialogActions>
          <Colorbtn onClick={handleClose3}>Close</Colorbtn>
         </DialogActions>
     </Dialog>
    {/**History Dialog Box**/}

   </>
  )
}
