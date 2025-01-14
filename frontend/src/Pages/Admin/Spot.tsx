import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useOutletContext } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Button, { ButtonProps } from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import { DeleteModal } from '../../Component/Modal/DeleteModal';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Divider, FormControl, Grid, Menu, MenuItem, OutlinedInput, Select } from '@mui/material';
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

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
   backgroundColor: "#2E3192",
    '&:hover': {
    backgroundColor: "#2E3192",
 },
}));

const CloseButton = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "silver",
  '&:hover': {
    backgroundColor: "silver",
 },
}));

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
    { id: 'basecurrency', label: 'Base Currency', minWidth: 170 },
    { id: 'quotecurrency', label: 'Quote Currency', minWidth: 100 },
    { id: 'currentprice', label: 'Current Price', minWidth: 100 },
    { id: 'buyerfee', label: 'Buyer Fee', minWidth: 100 },
    { id: 'sellerfee', label: 'Seller Fee', minWidth: 100 },
    { id: 'botstatus', label: 'Bot status', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 120}
  ];
  
  function createData(id:any,date:any,basec:String,quotec:String,cprice:any,bfee:Number,sfee:any,botstatus:any) {
    return { id,date,basec,quotec,cprice,bfee,sfee,botstatus };
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

export default function Spot() {

  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [openViewCoin, setOpenCoinView] = React.useState(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const handleOpenCoinView = () => { 
    setOpenCoinView(true); 
    getCoinList();
  }

  const [open, setOpen] = React.useState(false);
  const [theme]:any = useOutletContext();

  const handleClickOpen = (value: any) => {
    setOpen(value);
  };

  useEffect(() => {
   getDatalist();
  },[])

  const [list,setList] = React.useState<any>();

  const getDatalist = async() => {
    await axios.get(`/${url}/v1/admin/coinpair/pairlist`,
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        setList(result.data.data);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  let rows = [];
  rows = [
    list?.map((item:any) => (
      createData(item._id,item.createdAt, item.baseCurrency, item.quoteCurrency, item.buyerFee, item.buyerFee, item.sellerFee,item.botStatus)
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

  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [scrollDialogue, setScrollDialogue] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpenDialog = (scrollType: DialogProps['scroll']) => () => {
    setOpenDialogue(true);
    setScrollDialogue(scrollType);
  };

  const handleEditDetails = (val:any) => {
    getDatalistById(val);
    setTimeout(() => {
      setOpenDialogue(true);
    },100);
  }

  const handleCloseDialog = () => {
   setOpenDialogue(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const [coin,setCoin] = React.useState<any>('');
  const [coinName,setCoinName] = React.useState<any>('');
  const [network,setNetwork] = React.useState<any>('');

  const AddBaseCoin = async() => {
    await axios.post(`/${url}/v1/admin/coin/add`,{
      coin,
      name: coinName,
      network
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify(result.data.message,"success");
        setOpen2(false);
        getCoinList();
        setOpenCoinView(true);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  const [baseCurrency,setBaseCurrency] = React.useState<any>();
  const [baseCurrencyValue,setBaseCurrencyValue] = React.useState<any>();
  const [quoteCurrency,setQuoteCurrency] = React.useState<any>();
  const [quoteCurrencyValue,setQuoteCurrencyValue] = React.useState<any>();
  const [coinStatus,setCoinStatus] = React.useState<any>();
  const [p2pStatus,setP2PStatus] = React.useState<any>();
  const [commission,setCommission] = React.useState<any>();
  const [botStatus,setBotStatus] = React.useState<any>();
  const [buyerFees,setBuyerFees] = React.useState<any>();
  const [sellerFees,setSellerFees] = React.useState<any>();
  const [minPrice,setMinPrice] = React.useState<any>();
  const [maxPrice,setMaxPrice] = React.useState<any>();
  const [minQty,setMinQty] = React.useState<any>();
  const [maxQty,setMaxQty] = React.useState<any>();
  const [marketPrice,setMarketPrice] = React.useState<any>();
  const [marketUp,setMarketUp] = React.useState<any>();

  const AddCoinPair = async() => {
    await axios.post(`/${url}/v1/admin/coinpair/add`,{
      baseCurrency,
      baseCurrencyValue,
      quoteCurrency,
      quoteCurrencyValue,
      commission,
      coinStatus,
      p2p_active:p2pStatus,
      botStatus,
      buyerFee:buyerFees,
      sellerFee:sellerFees,
      minimumPrice:minPrice,
      maximumPrice:maxPrice,
      minimumQuantity:minQty,
      maximumQuantity:maxQty,
      marketPrice,
      marketUp
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        getDatalist();
        alertnotify(result.data.message,"success");
        setOpenDialogue(false);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  const UpdateCoinPair = async() => {
    await axios.patch(`/${url}/v1/admin/coinpair/update/${moreVal}`,{
      baseCurrency,
      baseCurrencyValue,
      quoteCurrency,
      quoteCurrencyValue,
      commission,
      coinStatus,
      p2p_active:p2pStatus,
      botStatus,
      buyerFee:buyerFees,
      sellerFee:sellerFees,
      minimumPrice:minPrice,
      maximumPrice:maxPrice,
      minimumQuantity:minQty,
      maximumQuantity:maxQty,
      marketPrice,
      marketUp,
      coinpair_id:moreVal
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        getDatalist();
        alertnotify(result.data.message,"success");
        setOpenDialogue(false);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreVal,setMoreVal] = React.useState<any>('');
  const [viewList,setViewList] = React.useState<any>('');
  const [coinList,setCoinList] = React.useState<[]>([]);
  const open12 = Boolean(anchorEl);

  const getDatalistById = async(id:any) => {
    await axios.get(`/${url}/v1/admin/coinpair/coin/${id}`,
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        setViewList(result.data.data);
        setBaseCurrency(result.data.data[0].baseCurrency);
        setBaseCurrencyValue(result.data.data[0].baseCurrencyValue);
        setQuoteCurrency(result.data.data[0].quoteCurrency);
        setQuoteCurrencyValue(result.data.data[0].quoteCurrencyValue);
        setCoinStatus(result.data.data[0].coinStatus);
        setP2PStatus(result.data.data[0].p2p_active);
        setCommission(result.data.data[0].commission);
        setBotStatus(result.data.data[0].botStatus);
        setBuyerFees(result.data.data[0].buyerFee);
        setSellerFees(result.data.data[0].sellerFee);
        setMinPrice(result.data.data[0].minimumPrice);
        setMaxPrice(result.data.data[0].maximumPrice);
        setMinQty(result.data.data[0].minimumQuantity);
        setMaxQty(result.data.data[0].maximumQuantity);
        setMarketPrice(result.data.data[0].marketPrice);
        setMarketUp(result.data.data[0].marketUp);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  const getCoinList = async() => {
    await axios.get(`/${url}/v1/admin/coin/list`,
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        setCoinList(result.data.data);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  const handleClick = (event: React.MouseEvent<HTMLElement> | any) => {
    var valpo = event.currentTarget.value.split('-');
    setMoreVal(valpo[0]);
    setAnchorEl(event.currentTarget);
  };

  const [viewOpen,setViewOpen] = React.useState<boolean>(false);

  const HandleMoreInfoView = (id:any) => {
    getDatalistById(id);
    setViewOpen(true);
    setAnchorEl(null);
  }

  const handleClose12 = () => {
    setAnchorEl(null);
  }

  const handleCloseview = () => {
    setViewOpen(false);
  } 

  const handleCloseviewOpen = () => {
    setOpenCoinView(false);
  }

  const [deleteBox,setDeleteBox] = React.useState<boolean>(false);
  const [deleteConfirmation,setDeleteConfirmation] = React.useState<boolean>(false);

  useEffect(() => {
    if(deleteConfirmation) {
      setDeleteBox(false);
      HandleDeleteCoinPair(deleteConfirmation);
    }
  },[deleteConfirmation]);

  const openDeleteModal = (id:any) => {
    setDeleteBox(id);
  }

  const HandleDeleteCoinPair = async (val:any) => {
    if(deleteConfirmation) {
      await axios.delete(`/${url}/v1/admin/coinpair/delete/${val}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          getDatalist();
          setAnchorEl(null);
          alertnotify("Selected Coin Pair data has been deleted", "success");
        }
      })
      .catch(error => {
        console.log(error);
        alertnotify(error.response.data.message, "error");
      })
    }    
  }

  const HandleDeleteBaseCoin = async (val:any) => {
    var r = confirm("want to delete?");
    if(r == true) {
      await axios.delete(`/${url}/v1/admin/coin/delete/${val}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          getCoinList();
          alertnotify("Selected Coin data has been deleted", "success");
        }
      })
      .catch(error => {
        console.log(error);
        alertnotify(error.response.data.message, "error");
      })
    } 
  }

  return (
   <>
      <Box sx={{ marginLeft: {md: '7%'},marginTop: '12px',fontSize: '15px',width: {md: '91%'}}}>
        <Grid sx={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px'}}>
          <Grid><ColorButton onClick={handleOpen}>Add Coin</ColorButton></Grid>
          <Grid><ColorButton onClick={handleOpenCoinView}>View Coin List</ColorButton></Grid>
          <Grid><ColorButton onClick={handleClickOpenDialog('paper')}>Add Coin Pairs</ColorButton></Grid>
        </Grid>

        <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',background: 'white',padding: '3px 3px'}}>
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
                {row?.basec}
              </TableCell>
              <TableCell style={{ width: 160 }} component="th" scope="row">
                {row?.quotec}
              </TableCell>
              <TableCell style={{ width: 160 }} component="th" scope="row">
                {row?.cprice}
              </TableCell>
              <TableCell style={{ width: 160 }} component="th"  scope="row">
                {parseFloat(row?.bfee).toFixed(2)}
              </TableCell>
              <TableCell style={{ width: 160 }} component="th" scope="row">
                {row?.sfee}
              </TableCell>
              <TableCell style={{ width: 160 }} component="th" scope="row">
                {row?.botstatus}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton
                  aria-label="more"
                  value={`${row?.id}-${row?.status}-${row?.recurring}-${row?.invoice_number}`}
                  id={`long-button${row?.id}`}
                  aria-controls={open12 ? `long-menu${row?.id}` : undefined}
                  aria-expanded={open12 ? 'true' : undefined}
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
                  open={open12}
                  onClose={handleClose12}
                >
                  <MenuItem onClick={() => HandleMoreInfoView(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>More Info</span></MenuItem>
                  <MenuItem onClick={() => handleEditDetails(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Edit Details</span></MenuItem>
                  <MenuItem onClick={() => openDeleteModal(moreVal)}><span className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Delete Coin Pair</span></MenuItem>
                </Menu>
              </TableCell>
             </TableRow>
            ))}
            {rowsNew?.length == 0 && (
              <TableRow style={{ height: 53 * rowsNew }}>
                <TableCell colSpan={8}>
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

      <Dialog
        maxWidth={'lg'}
        open={openViewCoin}
        onClose={handleCloseviewOpen}
        scroll={scrollDialogue}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Grid sx={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
          <DialogTitle id="scroll-dialog-title" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Base Coin List</DialogTitle>
          <CloseButton onClick={handleCloseviewOpen} style={{padding: '3px'}}>X</CloseButton>
        </Grid>
        <DialogContent dividers={scrollDialogue === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Divider />
          <Grid>
            <table border={1} width="600px" style={{borderCollapse: 'collapse' }}>
              <thead>
                <tr className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  <th style={{padding: '15px'}}className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Date</th>
                  <th style={{padding: '15px'}}>Coin Name</th>
                  <th style={{padding: '15px'}}>Coin Code</th>
                  <th style={{padding: '15px'}}>Network</th>
                  <th style={{padding: '15px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
              {
                coinList?.map((item:any,index:any) => (
                <>
                  <tr key={index} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                    <td style={{padding: '15px'}}>{moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                    <td style={{padding: '15px'}}>{item?.name}</td>
                    <td style={{padding: '15px'}}>{item?.coin}</td>
                    <td style={{padding: '15px'}}>{item?.network}</td>
                    <td style={{padding: '15px'}}><DeleteIcon sx={{cursor: 'pointer'}} onClick={() => HandleDeleteBaseCoin(item?._id)} /></td>
                  </tr>
                </>
                ))
              }
              </tbody>
            </table>
          </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog> 

      <Dialog
        open={open2}
        onClose={handleClose2}
        scroll={scrollDialogue}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Add Coin</DialogTitle>
        <DialogContent dividers={scrollDialogue === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Divider />
          <Grid>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Coin</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='e.g DOGE , SHIB , ADA'
                inputProps={{
                 'aria-label': 'weight',
                }}
                fullWidth
                onChange={(e) => setCoin(e.target.value)}
               />
            </FormControl>

            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Coin Name</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='Coin Name'
                inputProps={{
                 'aria-label': 'weight',
                }}
                fullWidth
                onChange={(e) => setCoinName(e.target.value)}
               />
            </FormControl>

            <FormControl sx={{ m: 1}} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Network</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='Network'
                inputProps={{
                 'aria-label': 'weight',
                }}
                fullWidth
                onChange={(e) => setNetwork(e.target.value)}
               />
            </FormControl>

            <Grid sx={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
              <ColorButton onClick={() => AddBaseCoin()}>Save</ColorButton>
              <CloseButton onClick={handleClose2}>Close</CloseButton>
            </Grid>

          </Grid>
         </DialogContentText>
        </DialogContent>
      </Dialog>  

      <Dialog
        open={openDialogue}
        onClose={handleClose}
        scroll={scrollDialogue}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>{moreVal ? 'Edit' : 'Add'} Spot Pair</DialogTitle>
        <DialogContent dividers={scrollDialogue === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Grid container>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Base Currency</label>
                <Select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} fullWidth>
                  <MenuItem value="USD" sx={{color: 'rgb(188, 170, 170)'}}>USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Base Currency Value</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Base Currency Value'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={baseCurrencyValue}
                  onChange={(e) => setBaseCurrencyValue(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Quote Currency</label>
                <Select value={quoteCurrency} onChange={(e) => setQuoteCurrency(e.target.value)} fullWidth>
                  <MenuItem value="USD" sx={{color: 'rgb(188, 170, 170)'}}>USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Quote Currency Value</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Quote Currency Value'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={quoteCurrencyValue}
                  onChange={(e) => setQuoteCurrencyValue(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Coin Status</label>
                <Select value={coinStatus} onChange={(e) => setCoinStatus(e.target.value)} fullWidth>
                  <MenuItem value="Active" sx={{color: 'rgb(188, 170, 170)'}}>Active</MenuItem>
                  <MenuItem value="Deactive" sx={{color: 'rgb(188, 170, 170)'}}>Deactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>P2P Status</label>
                <Select value={p2pStatus} onChange={(e) => setP2PStatus(e.target.value)} fullWidth>
                  <MenuItem value="Active" sx={{color: 'rgb(188, 170, 170)'}}>Active</MenuItem>
                  <MenuItem value="Deactive" sx={{color: 'rgb(188, 170, 170)'}}>Deactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Commission</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Commission'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Bot Status</label>
                <Select value={botStatus} onChange={(e) => setBotStatus(e.target.value)} fullWidth>
                  <MenuItem value="Binance" sx={{color: 'rgb(188, 170, 170)'}}>Binance</MenuItem>
                  <MenuItem value="Off" sx={{color: 'rgb(188, 170, 170)'}}>Off</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Buyer Fees</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Buyer Fees'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={buyerFees}
                  onChange={(e) => setBuyerFees(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Seller Fees</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Seller Fees'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={sellerFees}
                  onChange={(e) => setSellerFees(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Minimum Price</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Minimum Price'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Maximum Price</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Maximum Price'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Minimum Quantity</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Minimum Quantity'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={minPrice}
                  onChange={(e) => setMinQty(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Maximum Quantity</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Maximum Quantity'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Market Price</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Market Price'
                  inputProps={{
                  'aria-label': 'weight',
                  }}
                  fullWidth
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1 , width: '99%' }} variant="outlined" fullWidth>
                <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Market Up (%)</label>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Market Up (%)'
                  inputProps={{
                   'aria-label': 'weight',
                  }}
                  fullWidth
                  value={marketUp}
                  onChange={(e) => setMarketUp(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
         {moreVal ? <ColorButton onClick={() => UpdateCoinPair()}>Update</ColorButton> : <ColorButton onClick={() => AddCoinPair()}>Save</ColorButton> }
          <ColorButton onClick={handleCloseDialog}>Close</ColorButton>
        </DialogActions>
      </Dialog>  

      <Dialog
        maxWidth={'lg'}
        open={viewOpen}
        onClose={handleCloseview}
        scroll={scrollDialogue}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Grid sx={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
          <DialogTitle id="scroll-dialog-title" className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>Coin Pair Details</DialogTitle>
          <CloseButton onClick={handleCloseview} style={{padding: '3px'}}>X</CloseButton>
        </Grid>
        <DialogContent dividers={scrollDialogue === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Divider />
          <Grid>
            <table border={1} width="500px" style={{borderCollapse: 'collapse' }}>
              <tbody className={`${theme ? 'avatarDarkSecondaryExtra' : 'avatarLight'}`}>
                <tr>
                  <td style={{padding: '12px'}}>Base Currency</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.baseCurrency}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Base Currency Value</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.baseCurrencyValue}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Quote Currency</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.quoteCurrency}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Quote Currency Value</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.quoteCurrencyValue}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Coin Status</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.coinStatus}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>P2P Status</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.p2p_active}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Commission</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.commission}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Bot Status</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.botStatus}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Buyer Fees</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.buyerFee}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Seller Fees</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.sellerFee}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Minimum Price</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.minimumPrice}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Maximum Price</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.maximumPrice}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Minimum Quantity</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.minimumQuantity}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Maximum Quantity</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.maximumQuantity}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Market UP(%)</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.marketUp}</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Market Price</td>
                  <td style={{padding: '12px'}}>{viewList?.[0]?.marketPrice}</td>
                </tr>
              </tbody>
            </table>
          </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>    
      {
       deleteBox && 
       <DeleteModal val={deleteBox} setDeleteBox={setDeleteBox} setDeleteConfirmation={setDeleteConfirmation}/>
      }
   </>
  )
}
