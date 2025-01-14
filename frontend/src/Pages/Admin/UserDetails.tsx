import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import copy from "copy-to-clipboard";
import { jwtDecode } from 'jwt-decode';
import TabList from '@mui/lab/TabList';
import { toast } from 'react-toastify';
import Slide from '@mui/material/Slide';
import TabPanel from '@mui/lab/TabPanel';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import TabContext from '@mui/lab/TabContext';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import ReactCountryFlag from "react-country-flag";
import IconButton from '@mui/material/IconButton';
import MobileStepper from '@mui/material/MobileStepper';
import getSymbolFromCurrency from 'currency-symbol-map';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { TransitionProps } from '@mui/material/transitions';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import { Alert, Avatar, Card, CardHeader, Grid, Snackbar,Toolbar, Typography } from '@mui/material';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  { id: 'date', label: 'Date', minWidth: 120 },
  { id: 'device', label: 'Device', minWidth: 100 },
  { id: 'OS', label: 'OS', minWidth: 100 },
  { id: 'IPaddress', label: 'Ip Address', minWidth: 100 }
];

function createData(id:any,date:any,device:any,os:String,ipaddress:String) {
  return { id,date,device,os,ipaddress };
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

export default function UserDetails() {

  const params = useParams();
  const [name,setName] = React.useState<any>();
  const [taxid,setTaxID] = React.useState<any>();
  const [email,setEmail] = React.useState<any>();
  const [city,setCity] = React.useState<any>('');
  const [mobile,setMobile] = React.useState<any>();
  const [state,setState] = React.useState<any>('');
  const [address,setAddress] = React.useState<any>();
  const [country,setCountry] = React.useState<any>('');
  const [ownertitle,setOwnerTitle] = React.useState('');
  const [postalCode,setPostalCode] = React.useState<any>();
  const [userDetails,setUserDetails] = React.useState<any>([]);
  const [idofindividual,setIDOfIndividual] = React.useState('');
 
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';


  useEffect(() => {
    getUserDetails();
  },[]);

  // const theme = useTheme();
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const [value, setValue] = React.useState('1');
  const [value2, setValue2] = React.useState('1');
  const [activeStep, setActiveStep] = React.useState(0);
  const [ownerbrd,setOwnerbrd] = React.useState<any>();
  const [ownerProfile,setOwnerProfile] = React.useState<any>('');
  const [sessionlist,setSessionList] = React.useState<any>();

  const getUserSessionHistory = async() => {
    await axios.get(`/${url}/v1/session/getusersession/${params?.id}`)
    .then(result => {
      if(result.data.status == "201") {
       setSessionList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    setValue(newValue);
    if(newValue == '2') {
      getUserSessionHistory();
    }
  };

  const handleChange2 = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    setValue2(newValue);
  };

  let rows:any = [];
  rows = [
    sessionlist?.map((item:any) => (
      createData(item._id,item?.createdAt,item.device, item.OS, item.ipAddress)
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

  const getUserDetails = async () => {
    await axios.get(`/${url}/v1/admin/usergetbyId/${params?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setUserDetails(result.data.data);
        setName(result.data.data?.[0]?.name);
        setMobile(result.data.data?.[0]?.mobile);
        setEmail(result.data.data?.[0]?.email);
        setAddress(result.data.data?.[0]?.address);
        setCity(result.data.data?.[0]?.city);
        setState(result.data.data?.[0]?.state);
        setPostalCode(result.data.data?.[0]?.postalcode);
        setCountry(result.data.data?.[0]?.country);
        setOwnerTitle(result.data.data?.[0]?.ownerTitle);
        setTaxID(result.data.data?.[0]?.ownertaxid);
        setIDOfIndividual(result.data.data?.[0]?.owneridofindividual);
        setOwnerbrd(result.data.data?.[0]?.ownerbrd);
        setOwnerProfile(result.data.data?.[0]?.ownerProfile);
        setState(result.data.data?.[0]?.state);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  var steps:any[] = [];

  if(userDetails?.[0]?.accountDetails) {
    userDetails?.[0]?.accountDetails?.map((item:any) => {
      steps.push({
        currency: item?.currency,
        code: item?.country,
        balance:item?.amount,
        iban:item?.iban,
        bic:item?.bic_code
      })
    })
  }

  const maxSteps = steps.length;

  const [openAlert, setOpenAlert] = React.useState(false);
  const contentCopy = (wid: string) => {
    copy(wid);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    },900);
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

  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={6000} anchorOrigin={{ horizontal:'center', vertical:'top' }}>
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
      <Box sx={{marginLeft: {xs: '0%',md: '7%'}}}>
        <Typography>
          <KeyboardBackspaceSharpIcon onClick={() => navigate(`/admin/userlist`)} sx={{ cursor: 'pointer', color: `${theme ? 'white': ''}` }} />
        </Typography>
      </Box>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%',md: '7%'}, background: `${theme ? '': 'white'}`, border: `${theme ? '1px solid white': ''}`, width: {xs: '100%', lg: '89%'} }}> 
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList 
                onChange={handleChange} 
                aria-label="visible arrows tabs example"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    flexWrap: 'wrap',
                  },
                }}
              >
                <Tab label="User Information" value="1" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="Login History" value="2" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="KYC Documents" value="3" sx={{ background: `${theme ? 'white': ''}` }} />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={12}>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Grid sx={{display: 'flex', flexDirection: 'row'}}>
                    <Grid>
                      {
                        ownerProfile ?
                        <>
                          {/* @ts-ignore */} 
                          <img 
                          src={`${import.meta.env.VITE_PUBLIC_URL}/storage/${params?.id}/${ownerProfile}`}
                          width="100%" 
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src=`${import.meta.env.VITE_APP_URL}/dummy-image.jpg`;
                          }}
                          style={{padding: '10px', border: '1px solid silver', borderRadius: '12px'}} height="230px"/>
                        </> 
                        :
                        <img src={`${import.meta.env.VITE_APP_URL}/dummy-image.jpg`} width="100%" style={{padding: '10px', border: '1px solid silver', borderRadius: '12px'}} height="230px"/>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={8}>
                  <Grid sx={{display: 'flex', flexDirection: 'column', gap: '9px',color: `${theme ? 'white': 'black'}`}}>
                    <Grid>Name: {name}</Grid>
                    <Grid>Email: {email}</Grid>
                    <Grid>Mobile: {mobile}</Grid>
                    <Grid>Country: {country}</Grid>
                    <Grid>Total Accounts: {userDetails?.[0]?.accountDetails?.length}</Grid>
                    <Grid>Default Currency: {userDetails?.[0]?.defaultCurrency}</Grid>
                    <Grid>Address: {address}</Grid>
                    <Grid></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
             <Grid container>
              <Box sx={{ overflow: "auto" }}>
                <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                      <TableHead>
                        <TableRow className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                        {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ width: '300px' }}
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
                        {row?.device}
                      </TableCell>
                      <TableCell style={{ width: 160 }} component="th" scope="row">
                        {row?.os}
                      </TableCell>
                      <TableCell style={{ width: 160 }} component="th" scope="row">
                        {row?.ipaddress}
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
                  <TableFooter sx={{ background: 'white' }}>
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
            </TabPanel>
            <TabPanel value="3">
              <Grid container spacing={2} sx={{height: '100%', color: `${theme ? 'white': 'black'}`}}>
              <Grid item xs={12} sm={12}>
                <label>DOCUMENT ID NO : </label>
                <label>{idofindividual}</label>
              </Grid>
              <hr style={{width: '100%'}} />
              <Grid item xs={12} sm={12}>
                <label>ID OF INDIVIDUAL : </label>
                <label>{taxid}</label>
              </Grid>
              <hr style={{width: '100%'}} />
              <Grid item xs={12} sm={12}>
                <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                  <CardHeader
                   sx={{color: `${theme ? 'white' : 'black'}`}}
                    avatar={
                      <Avatar sx={{ bgcolor: red[500], color: `${theme ? 'white' : 'black'}` }} aria-label="recipe"></Avatar>
                    }
                    title="Uploaded Document"
                  />
                  <div className="Neon Neon-theme-dragdropbox">
                    { 
                      ownerbrd &&
                      <img 
                        crossOrigin="anonymous" 
                        src={`${import.meta.env.VITE_PUBLIC_URL}/${ownerbrd}`} 
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src=`${import.meta.env.VITE_APP_URL}/dummy-image.jpg`;
                        }}
                        alt="proof_of_document" width="100%" height="100%" 
                      />
                    }
                    </div>
                  </Card>
              </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
        <hr style={{border: '1px solid silver', width: '100%'}} />
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '32px' }}>
          <TabContext value={value2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList 
                onChange={handleChange2} 
                aria-label="lab API tabs example"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    flexWrap: 'wrap',
                  },
                }}
              >
                <Tab label="Additional Information" value="1" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="Accounts List" value="2" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="Beneficiary Account List" value="3" sx={{ background: `${theme ? 'white': ''}` }} />
              </TabList>
            </Box>
            <TabPanel value="1">
              <table width="100%" style={{borderCollapse: 'collapse', color: `${theme ? 'white': 'black'}`}}>
                <tbody>
                  <tr>
                    <td style={{padding: '12px'}}>City</td>
                    <td style={{padding: '12px'}}>{city}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>State</td>
                    <td style={{padding: '12px'}}>{state}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>Zip Code</td>
                    <td style={{padding: '12px'}}>{postalCode}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>Document Submitted</td>
                    <td style={{padding: '12px'}}>{idofindividual}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>Document Number</td>
                    <td style={{padding: '12px'}}>{taxid}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>Referal Link</td>
                    <td style={{padding: '12px'}}>
                      <Grid sx={{display: 'flex',flexDirection: 'row', gap: '12px'}}>
                        {
                          userDetails?.[0]?.referalDetails.length > 0 ?
                          <>
                            <Grid>{`${import.meta.env.VITE_APP_URL}/register?code=${userDetails?.[0]?.referalDetails?.[0]?.referral_code}`}</Grid>
                            <Grid><ContentCopyOutlinedIcon sx={{cursor: 'pointer'}} onClick={() => contentCopy(`${import.meta.env.VITE_APP_URL}/register?code=${userDetails?.[0]?.referalDetails?.[0]?.referral_code}`)}/></Grid>
                          </>
                          :
                          null
                        }
                        </Grid>
                    </td>
                  </tr>
                </tbody>
              </table>
            </TabPanel>
            <TabPanel value="2">
              <Box sx={{ flexGrow: 1 }}>
              {
                userDetails?.[0]?.accountDetails && 
                <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Grid>
                    <ReactCountryFlag
                      countryCode={steps[activeStep].code}
                      svg
                      style={{
                        marginTop: '12%',
                        width: '12em',
                        height: '12em',
                        borderRadius: '100%'
                      }}
                      cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                      cdnSuffix="svg"
                      title={steps[activeStep].currency}
                    />
                  </Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px'}}>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>Currency: {steps[activeStep].currency}</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>IBAN / Routing / Account Number</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{steps[activeStep].iban}</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>BIC / IFSC</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{steps[activeStep].bic}</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>Balance</Grid>
                    <Grid sx={{color: `${theme ? 'white': 'black'}`,borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{getSymbolFromCurrency(steps[activeStep].currency)}{steps[activeStep].balance}</Grid>
                  </Grid>
                </Grid> 
              }
                   
                <MobileStepper
                  variant="text"
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      sx={{ color: `${theme ? 'white' : 'black'}` }}
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                    >
                      Next
                      {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button sx={{ color: `${theme ? 'white' : 'black'}` }} size="small" onClick={handleBack} disabled={activeStep === 0}>
                      {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                      Back
                    </Button>
                  }
                />
              </Box>              
            </TabPanel>
            <TabPanel value="3">
            <Grid container spacing={2}>
            {
              userDetails?.[0]?.beneDetails?.map((item:any,index:any) => (
              <Grid item xs={12} sm={3} md={6} lg={3} key={index}>
                <Box sx={{borderRadius: '12px', border: '2px solid #33469b', color: '#33469b', cursor: 'pointer'}}>
                  <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems: 'center', padding: '6px'}}>
                    <Grid>
                      <ReactCountryFlag
                        countryCode={item?.country}
                        svg
                        style={{
                          width: '5em',
                          height: '5em',
                          borderRadius: '50%'
                        }}
                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                        cdnSuffix="svg"
                        title={item?.country}
                      />
                    </Grid> 
                  </Grid>
                  <Grid sx={{display: 'flex', fontSize: '12px', flexDirection: 'column', gap: '6px', padding: '12px'}}>
                    <Grid sx={{fontWeight: '600'}}>Currency: {item?.currency}</Grid>
                    <Grid sx={{fontWeight: '600'}}>IBAN / Routing / Account Number</Grid>
                    <Grid sx={{fontWeight: '600'}}>{item?.iban}</Grid>
                    <Grid sx={{fontWeight: '600'}}>BIC / IFSC</Grid>
                    <Grid sx={{fontWeight: '600'}}>{item?.bic_code}</Grid>
                    <Grid sx={{fontWeight: '600'}}>Balance</Grid>
                    <Grid sx={{fontWeight: '600'}}>{getSymbolFromCurrency(item?.currency)}{item?.amount}</Grid>
                  </Grid>
                </Box>
              </Grid>
              ))
            }
            <Grid item xs={12} style={{height: '100%'}}>
              <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                {userDetails?.[0]?.beneDetails?.length == 0 && <CustomNoRowsOverlay />}
              </Grid>
            </Grid>
          </Grid>
          </TabPanel>
        </TabContext>
        </Box>
      </Toolbar>
    </>
  )
}
