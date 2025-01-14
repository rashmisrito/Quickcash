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
import HelpIcon from '@mui/icons-material/Help';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Closebtn, Colorbtn } from '../../Component/Button/ColorButton';
import Button, { ButtonProps } from '@mui/material/Button';
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Alert, Backdrop, Box, Card, CardActions, CardContent, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Select, Snackbar, TextField, Tooltip } from '@mui/material';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Label } from '@mui/icons-material';

import { Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
 ) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "silver",
  '&:hover': {
    backgroundColor: "silver",
  },
}));

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
  { id: 'date', label: 'Created Date', minWidth: 170 },
  { id: 'product', label: 'Product Name', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 120 }
];

function createData(id:any,date:any,product:any,category:Number,price:any) {
  return { id,date,product,category,price };
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

export default function Products() {

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [msgLoading,setmsgLoading] = React.useState<boolean>(false);
  const [Modalopen, setModalOpen] = React.useState<boolean>(false);

  const [openView, setOpenView] = React.useState(false);

  const handleClickOpenView = (val:any) => {
    HandleGetProductData(val);
    setAnchorEl(null);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setEditFlag(false);
    setCatName('');
    setProductCode('');
    SetCategory('');  
    setDescription('');
    setUnitPrice('')
  };

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditFlag(false);
    setCatName('');
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [moreVal,setMoreVal] = React.useState<any>('');

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [theme]:any = useOutletContext();
  const [list,setList] = React.useState<any>();

  useEffect(() => {
   // current user id
   const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
   getTransactionsList(accountId.data.id);
   getCategoryList();
  },[]);

  const getTransactionsList = async(id:any) => {
    await axios.get(`/${url}/v1/product/list/${id}`, {
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
     createData(item._id,item.createdAt,item.name,item.category,item?.unitPrice)
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

  const HandleSearchFilter = async(filterData:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
     await axios.get(`/${url}/v1/product/list/${accountId?.data?.id}?title=${filterData}`, {
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

  const HandleEditModal = (id:any) => {
    setAnchorEl(null);
    HandleGetProductData(id);
    setTimeout(() => {
      setModalOpen(true);
    },100);
  }

  const [editFlag,setEditFlag] = React.useState<any>('');

  // Function for get individual category data

  const HandleGetProductData = async (val:any) => {
    await axios.get(`/${url}/v1/product/${val}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setEditFlag(val);
        setCatName(result?.data?.data?.name);
        setProductCode(result?.data?.data?.productCode);
        SetCategory(result?.data?.data?.category);
        setDescription(result?.data?.data?.description);
        setUnitPrice(result?.data?.data?.unitPrice);
        setProductDetails(result?.data?.data);
      }
    })
    .catch(error => {
      alertnotify(error?.response?.data?.message, "error");  
      console.log("error", error);
    }) 
  }

  const HandleUpdateProduct = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/product/update/${editFlag}`, {
     "user_id": accountId?.data?.id,
     "name": catName,
     "productCode": productCode,
     "category": category,
     "unitPrice": unitPrice,
     "description": description
   }, 
   { 
    headers: 
    {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify("Catgegory data has been updated successfully","success");
      setAnchorEl(null);
      setModalOpen(false);
      setCatName('');
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getTransactionsList(accountId.data.id);
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  };

  // Delete Category function

  const HandleDeleteProduct = async (val:any) => {
    var r = confirm("Are you sure?");
    if(r == true){
      await axios.delete(`/${url}/v1/product/delete/${val}`, {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
          setAnchorEl(null);
          getTransactionsList(accountId.data.id);
          alertnotify("Selected Product has been deleted Successfully", "success");
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error?.response?.data?.message, "error");
      })
    } else {
      return false;
    }
  }

  const HandleResetFilter = () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
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

  const [catName,setCatName] = React.useState<string>('');
  const [productCode,setProductCode] = React.useState<any>('');
  const [category,SetCategory] = React.useState<any>('');
  const [unitPrice,setUnitPrice] = React.useState<any>('');
  const [description,setDescription] = React.useState<any>('');
  const [categoriesList,setCategoriesList] = React.useState<any>([]);
  const [productDetails,setProductDetails] = React.useState<any>('');

  // get category list function

  const getCategoryList = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/category/list/${accountId?.data?.id}`, 
    {
      headers: 
      {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setCategoriesList(result?.data?.data);
      }
    })
    .catch(error => {
      alertnotify(error?.response?.data?.message, "error");  
      console.log("error", error);
    }) 
  }
  
  const [errorAlert,setErrorAlert] = React.useState<boolean>(false);

  // Product add function 
  const HandleSave = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/product/add`,{
      "name": catName,
      "user": accountId?.data?.id,
      "productCode": productCode,
      "category": category,
      "unitPrice": unitPrice,
      "description": description
    }, 
    {
      headers: 
      {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setErrorAlert(false);
        setModalOpen(false);
        setCatName('');
        alertnotify(result?.data?.message, "Success");
        const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
        getTransactionsList(accountId.data.id);
      }
    })
    .catch(error => {
      setErrorAlert(true);
      alertnotify(error?.response?.data?.message, "error");  
      console.log("error", error);
    }) 
  }

  const HandleDiscard = () => {
    setModalOpen(false);
    setEditFlag(false);
    setCatName('');
    setProductCode('');
    SetCategory('');  
    setDescription('');
    setUnitPrice('')
  }

  const HandleBack = () => {
    setModalOpen(false);
    setEditFlag(false);
    setCatName('');
    setProductCode('');
    SetCategory('');  
    setDescription('');
    setUnitPrice(''); 
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={msgLoading}
        onClick={handleClose}
      >
       <CircularProgress color="inherit" />
      </Backdrop>
     <Box sx={{ marginTop: '12px' , fontSize: '15px' }}>
      <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '1px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '': 'white'}` , md: `${theme ? '' : ''}`} , border: { xs: `${theme ? '1px solid white': ''}`, sm: `${theme ? '1px solid white':''}` },  padding: '3px'}}>      
      {
        !Modalopen ?
        <>         
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', gap: '2px', margin: '1%' }}>
            <Grid>
              <TextField onChange={(e) => HandleSearchFilter(e.target.value)} placeholder='Search'  sx={{  background: { xs: `${theme ? '#183153': 'white'}` , sm: `${theme ? '' : ''}` }, border: `${theme ? '1px solid silver': 'black'}`,width: '190px' }} fullWidth />  
            </Grid>  
          <Grid>
           <Colorbtn sx={{ marginBottom:' 12px', padding: '15px' }} onClick={handleClickOpen}>+</Colorbtn>    
          </Grid>
          </Grid>   
            {/* @ts-ignore */}
          <Box sx={{ overflow: "auto" }}>
            <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <div>
                <TableHead>
                  <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    width="320"
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
                  {moment(row?.date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                  {row?.product}
                </TableCell>
                <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                    {categoriesList?.map((item:any) => (
                    <>
                      {
                        item?._id == row?.category ? item?.name : null
                      }
                    </>
                    ))}
                </TableCell>
                <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                  {row?.price}
                </TableCell>
                <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                    <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'normal'}}>
                      <Grid>
                        <IconButton
                          aria-label="more"
                          value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}-${row?.createdBy}`}
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
                            'aria-labelledby': `long-button${row?.id}`
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={() => handleClickOpenView(moreVal)}>
                            <span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>View</span>
                          </MenuItem>
                          <MenuItem onClick={() => HandleEditModal(moreVal)}>
                            <span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Edit</span>
                          </MenuItem>
                          <MenuItem onClick={() => HandleDeleteProduct(moreVal)}>
                            <span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Delete</span>
                          </MenuItem>
                        </Menu>
                      </Grid>
                    </Grid>
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
              </div>
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
        </>        
       : 
        <>
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '2%' }}>
            <Grid sx={{ background: `${theme ? '' :'#B8D6F4'}`, color: `${theme ? 'white' :'#2E3192'}`, padding: '6px' }}>
              {editFlag ? "Edit Product Form" : "Add Product Form"}
            </Grid>
            <Grid><Colorbtn onClick={() => HandleBack()}>Back</Colorbtn></Grid>
          </Grid> 

          <Grid container spacing={2} sx={{ padding: '2%',color: `${theme ? 'white': 'black'}` }}>
            <Grid item xs={12} md={6}>
              <label htmlFor="Name">Name <sup style={{ fontSize: '19px', color: 'red', fontWeight: '900' }}>*</sup></label>
              <TextField onChange={(e) => setCatName(e.target.value)} value={catName} placeholder='Name' sx={{ border: `${theme ? '1px solid silver': 'black'}` }} fullWidth />  
              {
                errorAlert && catName == "" ? <span style={{ color: 'red' }}>Name is required</span> : null
              }
            </Grid> 

            <Grid item xs={12} md={6}>
              <label>Product Code <sup style={{ fontSize: '19px', color: 'red', fontWeight: '900' }}>*</sup></label>
              <Tooltip title="Click refresh icon to generate product code" arrow placement="top-start">
                <HelpIcon sx={{ cursor: 'pointer', fontSize: '16px' }} />
              </Tooltip>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={'text'}
                  value={productCode}
                  sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        sx={{ color: `${theme ? 'white' : 'black'}` }}
                        onClick={() => setProductCode(Math.random().toString(36).slice(2).toUpperCase())}
                      >
                        <SyncIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  fullWidth
                />
                {
                  errorAlert && productCode == "" ? <span style={{ color: 'red' }}>Product Code is required</span> : null
                }
            </Grid>  

            <Grid item xs={12} md={6}>
              <label htmlFor="Name">Category <sup style={{ fontSize: '19px', color: 'red', fontWeight: '900' }}>*</sup></label>
              <Select onChange={(e) => SetCategory(e.target.value)} value={category} sx={{ border: `${theme ? '1px solid silver': 'black'}` }} fullWidth>
              {
                categoriesList?.map((item:any,index:number) => (
                  <MenuItem value={item?._id} key={index}>{item?.name}</MenuItem>  
                ))
              }
              </Select>  
              {
                errorAlert && category == "" ? <span style={{ color: 'red' }}>Category is required</span> : null
              }
            </Grid> 

            <Grid item xs={12} md={6}>
              <label htmlFor="Unit Price">Unit Price <sup style={{ fontSize: '19px', color: 'red', fontWeight: '900' }}>*</sup></label>
              {/* @ts-ignore */}
              <TextField onChange={(e) => setUnitPrice(e.target.value)} value={unitPrice} type="number" pattern="[0-9]*" inputmode="numeric" placeholder='Unit Price' sx={{ border: `${theme ? '1px solid silver': 'black'}` }} fullWidth />  
              {
                errorAlert && unitPrice == "" ? <span style={{ color: 'red' }}>Price is required</span> : null
              }
            </Grid> 

            <Grid item xs={12}>
              <label htmlFor="Name">Description</label>
              <TextField onChange={(e) => setDescription(e.target.value)} value={description} multiline={true} rows={5} placeholder='Description' sx={{ border: `${theme ? '1px solid silver': 'black'}` }} fullWidth />  
            </Grid> 

            <Grid item xs={12}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              {
                editFlag ?
                <Grid><Colorbtn onClick={HandleUpdateProduct}>Update</Colorbtn></Grid>:
                <Grid><Colorbtn onClick={HandleSave}>Save</Colorbtn></Grid>
              }
              <Grid><Closebtn onClick={ () => confirm("Are you sure?") ? HandleDiscard() : '' }>Discard</Closebtn></Grid>  
              </Grid>    
            </Grid>

          </Grid>
        </> 
       }
     </Grid>
   </Box>

   <Dialog
     fullWidth
     maxWidth={"md"}
     open={openView}
     TransitionComponent={Transition}
     keepMounted
     onClose={handleCloseView}
     aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle  sx={{ color: `${theme ? 'white': 'black'}` }}>{"Product Details"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <table width={"100%"} border={1} style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Name</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{catName}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Unit Price</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{unitPrice}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Category</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{category}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Product Code</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{productCode}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Description</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{description}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>Last Update</td>
                <td style={{ padding: '12px', color: `${theme ? 'white': 'black'}` }}>{moment(productDetails?.createdAt).format("DD-MM-YYYY")}</td>
              </tr>
            </tbody>
          </table>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseView} sx={{ color: `${theme ? 'white': 'black'}` }}>Close</Button>
      </DialogActions>
    </Dialog>
  </>
 )
}
