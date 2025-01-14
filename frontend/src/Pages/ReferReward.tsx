import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import copy from "copy-to-clipboard";
import { usePDF } from 'react-to-pdf';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useOutletContext } from "react-router-dom";
import * as Constants from "../../src/constants/works";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ReferRewardbg from '../../public/referrewardbg.png';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Table,Box,Container,Grid, IconButton, Paper, Stack, Step, StepContent, StepLabel, Stepper, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';

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
  
  const columns = [
   { id: 'date', label: 'Registered At', minWidth: 170 },
   { id: 'name', label: 'Name', minWidth: 100 },
   { id: 'email', label: 'Email', minWidth: 100 },
   { id: 'mobile', label: 'Contact No.', minWidth: 100 },
  ];
  
  function createData(date:any, name:String , email:String ,  mobile:any) {
    return { date, name , email , mobile };
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

export default function ReferReward() {

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const { toPDF, targetRef } = usePDF({filename: 'referUsersList.pdf'});
  const [theme]:any = useOutletContext();

  const contentCopy = (wid: string) => {
    setOpen(true);
    copy(wid);
  };
  
  const [list,setList] = React.useState<any>();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(event);
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  let rows = [];
  rows = [
    list?.map((item:any) => (
     createData(item.createdAt,item.name, item.email, item.mobile)
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

  const [referalCode,setReferalCode] = React.useState<any>("");

  const GenerateCode = async () => {
    const val = makeid(10);
    setReferalCode(val);
    HandleCreateAccount(val);
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

  useEffect(() => {
    getReferalLink();
    getReferedUsersList();
  },[]);

  const getReferedUsersList = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/referal/referuserslist/${accountId?.data?.id}`, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result.data.data[0].referDetails)
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }
  
  const getReferalLink = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/referal/codeExists/${accountId?.data?.id}`, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
      setReferalCode(result.data.data[0].referral_code)
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const exportExcellist = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/referal/export/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status =="success")
      alertnotify("Excel Report has been generated Successfully", "Success")
      window.open(`${import.meta.env.VITE_PUBLIC_URL}/referall.xlsx`);
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const HandleCreateAccount = async (val:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/referal/add`, {
      "type": "",
      "user":  accountId?.data?.id,
      "referral_code": val,
      "status": "active"
     }, 
     {
      headers: 
      {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  function makeid(length:any)   {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ horizontal:'center', vertical:'top' }}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
      <Box display="flex" sx={{ flexGrow: 1, marginTop: '12px' , fontSize: '15px' }}>
        <Grid sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <Grid sx={{
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            borderRadius: '.5rem', 
            color: 'black', 
            fontWeight: '700', 
            padding: '10px 1px'
          }}>
          <Paper
            component={Stack}
            spacing={3}
            sx={{
              height: { sm: 350 , lg: 390 },
              position: "relative",
              overflow: "hidden",
              backgroundImage: `url('${ReferRewardbg}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "right",
              objectFit: "fill",
              borderRadius: 4,
              marginTop: {xs: "-20px",sm: '0px'},
              p: 4,
            }}
            title="Refer & Reward"
            alignItems="start"
          >
            <Box sx={{ p: { md: 2 } }} />
            <Container maxWidth="sm" component={Stack} spacing={2}>
              <Typography variant="h6" color="white">
                Refer Your Friends And Get Rewards
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" , fontSize: {xs: '10px', sm: '15px', md:  '17px'} , width: '100%' }}>
                Tell your friends about Quick Cash. Copy and paste the referral URL provided
                below to as many people as possible. Receive interesting incentives
                and deals as a reward for your recommendation!
              </Typography>
              <Stack direction="row" spacing={1}>
              {
                !referalCode
                ?
                <Button style={{background: 'white'}} onClick={() => GenerateCode()}>Generate Referal Link</Button>
                :
                <>
                  <TextField
                    id="referralLink"
                    variant="outlined"
                    size="small"
                    value={`${import.meta.env.VITE_BASE_URL}/register?code=${referalCode}`}
                    sx={{
                      borderRadius: 1,
                      bgcolor: "skyblue",
                        "& fieldset": {
                       borderWidth: 0,
                      },
                      "& input": {
                       color: "#fff",
                      },
                    }}
                    contentEditable={false}
                    fullWidth
                  />
                    <IconButton
                      id="copyReferralLink"
                      sx={{
                      bgcolor: "#fff",
                        "&:hover": {
                          bgcolor: "#fff",
                        },
                          borderRadius: 2,
                      }}
                      onClick={() =>
                      contentCopy(
                        `${import.meta.env.VITE_BASE_URL}/register?code=${referalCode}`
                      )
                      }
                    >
                    <ContentCopyIcon color="primary" />
                    </IconButton>
                  </>
               }
              </Stack>
            </Container>
          </Paper>
          </Grid>

          <Grid sx={{display: 'flex', flexDirection: 'column' ,borderRadius: '.5rem', color: 'black', fontWeight: '700', border: `${theme ? '2px solid lightblue': '1px solid transparent'}` , background: `${theme ? 'transparent': 'white'}`,  padding: '10px 12px' }}>
            <Container>
              <Typography variant="h5" sx={{ color: {xs: `${theme ? 'white': 'black'}`, sm:  `${theme ? 'white': 'black'}`} }}>How Does it Work?</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1,color: {xs: `${theme ? 'white': 'black'}`, sm:  `${theme ? 'white': 'black'}`} }} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                All you have to do is develop campaigns, distribute them, and you'll be
                able to profit from our lucrative trading platform in no time. Discover
                how to:
              </Typography>
              <Box sx={{ p: 4, mt: 1 }}>
               <Stepper orientation="vertical" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                {Constants.Works.map((label, index) => (
                 <Step key={index} active={true}>
                  <StepLabel>
                   <Typography sx={{ color: {xs: `${theme ? 'white': 'black'}`, sm:  `${theme ? 'white': 'black'}`} }} variant="h5">
                    {label.label}
                   </Typography>
                  </StepLabel>
                  <StepContent key={index}>
                   <Typography variant="subtitle2" sx={{ color: {xs: `${theme ? 'white': 'black'}`, sm:  `${theme ? 'white': 'black'}`} }}>
                     {label.description}
                   </Typography>
                   </StepContent>
                  </Step>
                ))}
               </Stepper>
              </Box>
            </Container>
          </Grid>

          <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', border: `${theme ? '2px solid lightblue': '2px solid transparent'}`, background: `${theme ? 'transparent' : 'white'}` , padding: '10px 12px'}}>
            <Container>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: "30px" }}
              >
               <Typography variant="h5" sx={{ color: {xs: `${theme ? 'white': 'black'}`, sm:  `${theme ? 'white': 'black'}`} }}>Referred Users</Typography>
              </Stack>
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' , gap: '10px' }}>
              {
                rowsNew?.length > 0 &&
                <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , gap: '10px' }}>
                  <Grid onClick={exportExcellist} sx={{ cursor: 'pointer' }}>
                    <Tooltip title="Download Excel" sx={{ cursor: 'pointer' }} placement="top-start">
                      <img src={`${import.meta.env.VITE_APP_URL}/icons/excel.png`} width={45} />
                    </Tooltip>
                  </Grid>
                  <Grid onClick={() => toPDF()} sx={{ cursor: 'pointer' }}>
                  <Tooltip title="Download Pdf" sx={{ cursor: 'pointer' }} placement="top-start">
                    <img src={`${import.meta.env.VITE_APP_URL}/icons/pdf.png`} width={41} />
                  </Tooltip>     
                  </Grid>
                </Grid>
              }  
              
              </Grid>
              <Box sx={{ overflow: "auto" }}>
              <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                <TableContainer component={Paper}ref={targetRef}>
                  {/* @ts-ignore */}
                  <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead sx={{ background: '#673ab7', color: 'white' }}>
                      <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            width="220"
                            style={{ padding: '12px', background: '#8657E5', color: 'white' }}
                          >
                          {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? rowsNew.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rowsNew
                      ).map((row:any  ) => (
                        <TableRow key={row.date}>
                          <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                            {moment(row.date).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                            {row.email}
                          </TableCell>
                          <TableCell style={{ padding: '12px', fontSize: '14px', fontWeight: '400' }} scope="row">
                            {row.mobile}
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
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
