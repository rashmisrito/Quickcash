import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Table,Thead, Tr, Td } from 'react-super-responsive-table';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Closebtn, Colorbtn } from "../../Component/Button/ColorButton";

import { TableBody, TableFooter, TablePagination, TableRow } from '@mui/material';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Menu, MenuItem, Switch, TextField } from '@mui/material';

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
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'mobile', label: 'Mobile', minWidth: 100 },
    { id: 'country', label: 'Country', minWidth: 100 },
    { id: 'currency', label: 'Currency', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'suspend', label: 'Suspend', minWidth: 100 },
    { id: 'action', label: 'Actions', minWidth: 30}
  ];
  
  function createData(id:any,date:any,username:String,email:String,mobile:any,country:any,currency:any,suspend:any,status:any) {
    return { id,date,username,email,mobile,country,currency,suspend,status };
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

export default function Users() {

  const [open, setOpen] = React.useState(false);
  const [open5,setOpen5] = React.useState(false);
  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();
  const [sessionlist,setSessionList] = React.useState<any>();
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
    await axios.get(`/${url}/v1/admin/userslist`, {
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

  const [viewData,setViewData] = React.useState<[viewType]>();

  const getDataById = async(id:any) => {
    await axios.get(`/${url}/v1/admin/usergetbyId/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setViewData(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [membersList,setMembersList] = React.useState<[]>();

  const getMemberLists = async() => {
    await axios.get(`/${url}/v1/member/adminlist/${moreVal}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setMembersList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [invoicesList,setInvoiceList] = React.useState<[]>();

  const getInvoiceLists = async() => {
    await axios.get(`/${url}/v1/invoice/adminlist/${moreVal}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setInvoiceList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [accountsList,setAccountList] = React.useState<[]>();

  const getAccountLists = async() => {
    await axios.get(`/${url}/v1/account/adminlist/${moreVal}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setAccountList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const [receipintsList,setReceipintList] = React.useState<[]>();

  const getReceipintLists = async() => {
    await axios.get(`/${url}/v1/receipient/adminlist/${moreVal}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setReceipintList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const getUserSessionHistory = async(id:any) => {
    await axios.get(`/${url}/v1/session/getusersession/${id}`)
    .then(result => {
      if(result.data.status == "201") {
       setSessionList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  let rows = [];
  rows = [
    list?.map((item:any) => (
     createData(item._id,item.createdAt,item.name,item.email,item.mobile,item.country,item.defaultCurrency,item.suspend,item.status)
    ))
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  const rowsNew = rows[0] || [];
  const [page, setPage] = React.useState(0);
  const [open3,setOpen3] = React.useState<any>('');
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

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const handleClose5 = () => {
    setOpen5(false);
    setAnchorEl(null);
  }

  const handleClose3 = () => {
    setOpen3(false);
    setAnchorEl(null);
  }

  const navigate = useNavigate();

  const handleClickOpen3 = (value: any) => {
    navigate(`/admin/user/${value}`)
  };

  const [memberOpen,setMemberOpen] = React.useState(false);
  const [invoiceopen,setInvoiceOpen] = React.useState(false);
  const [accountopen,setAccountOpen] = React.useState(false);
  const [receipintOpen,setReceipintOpen] = React.useState(false);

  const handleReceipintOpen = (value: any) => {
    getReceipintLists();
    setReceipintOpen(value);
  }

  const handleAccountOpen = (value: any) => {
    getAccountLists();
    setAccountOpen(value);
  }

  const handleInvoiceopen = (value: any) => {
    getInvoiceLists();
    setInvoiceOpen(value);
  }

  const handleMemberopen = (value: any) => {
    getMemberLists();
    setMemberOpen(value);
  }

  const handleClickOpen = (value: any) => {
    getUserSessionHistory(moreVal);
    setOpen3(value);
    setAnchorEl(null);
  }
  
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement> , val:any) => {
    await axios.patch(`/${url}/v1/user/updateuseradmin`, {
      user: val,
      status: event.target.checked
    }, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        getListData();
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  };

  const handleChangeSuspend = async (event: React.ChangeEvent<HTMLInputElement> , val:any) => {
    await axios.patch(`/${url}/v1/user/updateUserSuspend`, {
      user: val,
      suspend: event.target.checked
    }, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        getListData();
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  };

  const handleMemberClose = () => {
    setMemberOpen(false);
    setAnchorEl(null);
  }

  const handleInvoiceClose = () => {
    setInvoiceOpen(false);
    setAnchorEl(null);
  }

  const handleAccountClose = () => {
    setAccountOpen(false);
    setAnchorEl(null);
  }

  const handleReceipintClose = () => {
    setReceipintOpen(false);
    setAnchorEl(null);
  }

  const HandleSearchByEmail = async(emailText:any) => {
    setPage(0);
    await axios.get(`/${url}/v1/admin/userslist?email=${emailText}`, {
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

  return (
    <>
     <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '90%'}}}>
      <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px', padding: '3px'}}>
        <Grid>
          <TextField name="emailSearch" id="emailSearch" placeholder='Search by E-mail' onChange={(e) => HandleSearchByEmail(e.target.value)} />
        </Grid>
       </Grid>
       <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',padding: '3px'}}>
        {/* @ts-ignore     */}
        <Table style={{ background: `${theme ? '#183153' : '#F2F3FE'}`, color: `${theme ? 'white' : 'black'}`, }}>
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
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {moment(row?.date).format("YYYY-MM-DD")}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.username}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.email}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              {row?.mobile}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }}  scope="row">
              {row?.country}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }}  scope="row">
              {row?.currency}
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              <Switch
                checked={row?.status == true ?  true : false}
                value={row?.id}
                onChange={(e) => handleChange(e,row?.id)}
                color="warning"
                inputProps={{ 'aria-label': 'controlled' }}
              />
             </Td>
             <Td style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
              <Switch
                checked={row?.suspend == true ?  true : false}
                value={row?.id}
                onChange={(e) => handleChangeSuspend(e,row?.id)}
                color="warning"
                sx={{ color: '#E0E0E0' }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
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
               >
                <MoreVertIcon sx={{ color: `${theme ? 'white' : 'black'}` }} />
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
                <MenuItem onClick={() => handleClickOpen3(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>View</span></MenuItem>
                <MenuItem onClick={() => handleClickOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Login Session History</span></MenuItem>
                {/* <MenuItem onClick={() => handleMemberopen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>User Members List</span></MenuItem> */}
                <MenuItem onClick={() => handleInvoiceopen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Invoice Generated List</span></MenuItem>
                <MenuItem onClick={() => handleAccountOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Accounts List</span></MenuItem>
                <MenuItem onClick={() => handleReceipintOpen(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Reciepint List</span></MenuItem>
               </Menu>
             </Td>
            </Tr>
          ))}
          {rowsNew?.length == 0 && (
            <Tr>
             <Td colSpan={9}>
              <CustomNoRowsOverlay />
             </Td>
            </Tr>
          )}
          </TableBody>
          <TableFooter sx={{ background: `${theme ? 'white': ''}`, color: 'black' }}>
           <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={9}
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
       
       </Grid>
      </Box>

    {/**History Dialog Box**/}
    <Dialog
      open={open5}
      maxWidth={'md'}
      onClose={handleClose5}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose5();
        },
      }}
    >
        <DialogTitle sx={{textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>View Details</DialogTitle>
        <DialogContent>
        <table border={1} width="100%" style={{borderCollapse: 'collapse'}}>
          <tbody>
            <tr>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Id of Individual</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0].owneridofindividual}</td>
            </tr>
            <tr>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Tax ID Number</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0].ownertaxid}</td>
            </tr>
            <tr>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Image of Document</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>
                <img src={`http://localhost:5000/${viewData?.[0].ownerbrd}`} height="100px" width="200px" />
              </td>
            </tr>
            <tr>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>User Name</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.name}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Email</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.email}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Mobile</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.mobile}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Address</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.address}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Country</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.country}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Postal Code</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.postalcode}</td>
            </tr>
            <tr style={{width: '100%'}}>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Default Currency</td>
              <td style={{padding: '20px', textAlign: 'center'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{viewData?.[0]?.defaultCurrency}</td>
            </tr>
          </tbody>  
        </table>
        </DialogContent>
        <DialogActions>
         <Closebtn onClick={handleClose5}>Close</Closebtn>
        </DialogActions>
    </Dialog>
    {/**History Dialog Box**/} 

    {/**Login Session History Dialog Box**/}
    <Dialog
      open={open3}
      maxWidth={'md'}
      onClose={handleClose3}
    >
      <DialogTitle sx={{textAlign: 'center', fontFamily: 'mono'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Session History</DialogTitle>
        <DialogContent>
         <Box sx={{ overflow: "auto" }}>
         <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
         <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Device</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>OS</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Ip Address</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Is Active?</th>
            </tr>
          </thead>
          <tbody>
          {
            sessionlist?.map((item:any,index:number) => (
             <tr key={index}>
              <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
              <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.device}</td>
              <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.OS}</td>
              <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.ipAddress}</td>
              <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.isActiveNow ? 'LoggedIn' : 'Logout'}</td>
             </tr>
            ))
          }
          {
            sessionlist?.length == 0 &&
            <tr>
              <td colSpan={5} align='center' style={{padding: '20px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>No Result Found</td>
            </tr>
          }
          </tbody>
         </table>
         </Box>
         </Box>
        </DialogContent>
        <DialogActions>
       <Colorbtn onClick={handleClose3}>Close</Colorbtn>
      </DialogActions>
    </Dialog>
    {/**Login Session History Dialog Box**/}

    {/**Members List Dialog Box**/}
    <Dialog
      open={memberOpen}
      maxWidth={'lg'}
      onClose={handleMemberClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleMemberClose();
        },
      }}
    >
      <DialogTitle sx={{textAlign: 'center', fontFamily: 'mono'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Members List</DialogTitle>
        <DialogContent>
         <Box sx={{ overflow: "auto" }}>
         <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
         <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>UserName</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Mobile</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Email</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Permission List</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Account Expire Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {
              membersList?.map((item:any,index:number) => (
              <tr key={index}>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.username}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.mobile}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.email}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>
                  {item?.permissionlist?.map((item2:any) => (
                  <>
                   {item2} <br />
                  </>
                  ))}
                </td>
                <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>
                  {moment(item?.date_from).format("DD-MM-YYYY")}
                </td>
                <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.comment}</td>
              </tr>
              ))
            }
            {
              membersList?.length == 0 &&
              <tr>
                <td colSpan={7} align='center' style={{padding: '20px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>No Result Found</td>
              </tr>
            }
          </tbody>
         </table>
         </Box>
         </Box>
        </DialogContent>
        <DialogActions>
         <Colorbtn onClick={handleMemberClose}>Close</Colorbtn>
        </DialogActions>
    </Dialog>
    {/**Members List Dialog Box**/}

    {/**Invoice List Dialog Box**/}
    <Dialog
      open={invoiceopen}
      maxWidth={'lg'}
      onClose={handleInvoiceClose}
    >
      <DialogTitle sx={{textAlign: 'center', fontFamily: 'mono'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Invoices List</DialogTitle>
        <DialogContent>
         <Box sx={{ overflow: "auto" }}>
         <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
         <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Invoice Number</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Invoice Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Due Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Amount</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Currency</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Tax</th>
            </tr>
          </thead>
          <tbody>
            {
              invoicesList?.map((item:any,index:number) => (
              <tr key={index}>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.invoice_number}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.invoice_date}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.due_date}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.currency_text}{item?.total}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.currency}</td>
                <td align='center' style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.sub_tax}</td>
              </tr>
              ))
            }
            {
              invoicesList?.length == 0 &&
              <tr>
                <td colSpan={7} align='center' style={{padding: '20px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>No Result Found</td>
              </tr>
            }
          </tbody>
         </table>
         </Box>
         </Box>
        </DialogContent>
        <DialogActions>
         <Colorbtn onClick={handleInvoiceClose}>Close</Colorbtn>
        </DialogActions>
    </Dialog>
    {/**Invoice List Dialog Box**/}
    {/**Account List Dialog Box**/}
    <Dialog
      open={accountopen}
      maxWidth={'lg'}
      onClose={handleAccountClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleAccountClose();
        },
      }}
    >
      <DialogTitle sx={{textAlign: 'center', fontFamily: 'mono'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Accounts List</DialogTitle>
        <DialogContent>
         <Box sx={{ overflow: "auto" }}>
         <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
         <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Name</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Currency</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>IBAN / Account Number</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>BIC Code / IFSC Code</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              accountsList?.map((item:any,index:number) => (
              <tr key={index}>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.name}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.currency}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.iban}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.bic_code}{item?.total}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.status ? 'Active' : 'In Active'}</td>
              </tr>
              ))
            }
            {
              accountsList?.length == 0 &&
              <tr>
                <td colSpan={7} align='center' style={{padding: '20px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>No Result Found</td>
              </tr>
            }
          </tbody>
         </table>
         </Box>
         </Box>
        </DialogContent>
        <DialogActions>
         <Colorbtn onClick={handleAccountClose}>Close</Colorbtn>
        </DialogActions>
    </Dialog>
    {/**Account List Dialog Box**/}
    {/**Receipint List Dialog Box**/}
    <Dialog
      open={receipintOpen}
      maxWidth={'lg'}
      onClose={handleReceipintClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleReceipintClose();
        },
      }}
    >
      <DialogTitle sx={{textAlign: 'center', fontFamily: 'mono'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Receipint List</DialogTitle>
        <DialogContent>
         <Box sx={{ overflow: "auto" }}>
         <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
         <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Date</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Name</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Currency</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>IBAN / Account Number</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>BIC Code / IFSC Code</th>
              <th style={{padding: '10px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              receipintsList?.map((item:any,index:number) => (
              <tr key={index}>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.name}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.currency}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item?.iban}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.bic_code}{item?.total}</td>
                <td align='center' style={{ padding: '10px' }} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>{item.status ? 'Active' : 'In Active'}</td>
              </tr>
              ))
            }
            {
              receipintsList?.length == 0 &&
              <tr>
                <td colSpan={7} align='center' style={{padding: '20px'}} className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>No Result Found</td>
              </tr>
            }
          </tbody>
         </table>
         </Box>
         </Box>
        </DialogContent>
        <DialogActions>
         <Colorbtn onClick={handleReceipintClose}>Close</Colorbtn>
        </DialogActions>
    </Dialog>
    {/**Receipint List Dialog Box**/}
    </>
  )
}
