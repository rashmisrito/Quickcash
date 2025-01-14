import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useDemoData } from '@mui/x-data-grid-generator';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Button, { ButtonProps } from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#2196f3",
   '&:hover': {
    backgroundColor: "#2196f3",
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
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'ip',   label: 'IP Address', minWidth: 100 },
  { id: 'source', label: 'Browser Type / Source', minWidth: 100 },
  { id: 'country', label: 'Country', minWidth: 100 },
  { id: 'region', label: 'Region', minWidth: 100 },
];

function createData(id:any,date:any, ip:String , source:String , country:any , region:any) {
  return { id,date,ip,source,country,region };
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

export default function MemberDetails() {

  const navigate = useNavigate();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [tid,setTid] = React.useState<any>();
  const [theme]:any = useOutletContext();

  const handleClickOpen = (value: any) => {
    setOpen(true);
    setTid(value);
    getListById(value);
  };

  const [viewList,setViewList] = React.useState([]);  

  const [list,setList] = React.useState<any>();
  const [listOne,setListOne] = React.useState<any>();

  useEffect(() => {
    getDetails(params.id);
  },[params.id]);

  const getDetails = async(id:any) => {
    await axios.get(`/${url}/v1/member/view/${id}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setViewList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }  

  const getListById = async (id:any) => {
    await axios.get(`/${url}/v1/transaction/${id}`, {
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
      createData(item._id,item.createdAt, item.info, item.trans_type, item.currency, item.amount)
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

  return (
    <>
     <Box sx={{ marginLeft: {md:  '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '70%'}}}>
      <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
      <Typography><KeyboardBackspaceIcon sx={{ cursor: 'pointer' }} onClick={() => navigate('/members')} /></Typography>
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
              {row?.ip}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.source}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th" scope="row">
              {row?.country}
             </TableCell>
             <TableCell style={{ width: 160 }} component="th"  scope="row">
              {row?.region}
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
        {"Transaction Details"}
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <TableContainer component={Paper}>
            <Table sx={{ height: 200 }} aria-label="simple table">
              <TableBody sx={{height: '200px'}}>
                <TableRow>
                  <TableCell>TRANSACTION ID</TableCell>
                  <TableCell>{listOne?.[0]._id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRANSACTION DATE</TableCell>
                  <TableCell>{moment(listOne?.[0].createdAt).format("MMMM Do YYYY, h:mm:ss A")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>USER NAME</TableCell>
                  <TableCell>{listOne?.[0].userDetails?.[0].name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>{listOne?.[0].userDetails?.[0].email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MOBILE</TableCell>
                  <TableCell>{listOne?.[0].userDetails?.[0].mobile}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ADDRESS</TableCell>
                  <TableCell>{listOne?.[0].userDetails?.[0].address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CURRENCY</TableCell>
                  <TableCell>{listOne?.[0].currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>COUNTRY</TableCell>
                  <TableCell>{listOne?.[0].country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>{listOne?.[0].amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INFO</TableCell>
                  <TableCell>{listOne?.[0].info}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRANSACTION TYPE</TableCell>
                  <TableCell>{listOne?.[0].trans_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>STATUS</TableCell>
                  <TableCell>{listOne?.[0].status}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ColorButton onClick={handleClose} variant='contained'>Close</ColorButton>
      </DialogActions>
     </Dialog>
    </>
  )
}
