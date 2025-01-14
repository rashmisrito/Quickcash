import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import copy from "copy-to-clipboard";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import TabList from '@mui/lab/TabList';
import Slide from '@mui/material/Slide';
import React, { useEffect } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import PhoneInput from 'react-phone-input-2';
import TabContext from '@mui/lab/TabContext';
import 'react-phone-input-2/lib/material.css';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import ReactCountryFlag from "react-country-flag";
import IconButton from '@mui/material/IconButton';
import useValidation from '../Hooks/useValidation';
import DialogTitle from '@mui/material/DialogTitle';
import { useOutletContext } from 'react-router-dom';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MobileStepper from '@mui/material/MobileStepper';
import getSymbolFromCurrency from 'currency-symbol-map';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Country, State, City }  from 'country-state-city';
import { TransitionProps } from '@mui/material/transitions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModeEditOutline from '@mui/icons-material/ModeEditOutline';
import { Closebtn, Colorbtn } from '../Component/Button/ColorButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Alert, Card, Divider, Grid, MenuItem, Select, Skeleton, Snackbar, TextField, Toolbar } from '@mui/material';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, FormHelperText, FormControl } from '@mui/material';

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

export default function UserProfile() {

  const { errors, validate } = useValidation();
  const [openPhoto, setOpenPhoto] = React.useState(false);

  const handleClickOpenPhoto = () => {
    setOpenPhoto(true);
  };

  const handleClosePhoto = () => {
    setOpenPhoto(false);
  };

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const [name,setName] = React.useState<any>();
  const [taxid,setTaxID] = React.useState<any>();
  const [email,setEmail] = React.useState<any>();
  const [mobile,setMobile] = React.useState<any>();
  const [address,setAddress] = React.useState<any>();
  const [ownertitle,setOwnerTitle] = React.useState('');
  const [postalCode,setPostalCode] = React.useState<any>();
  const [idofindividual,setIDOfIndividual] = React.useState('');
  const [userDetails,setUserDetails] = React.useState<any>([]);

  const [country,setCountry] = React.useState<any>('');
  const [state,setState] = React.useState<any>('');
  const [city,setCity] = React.useState<any>('');

  const [Countries,setCountries] = React.useState<any[]>([]);
  const [States,setStates] = React.useState<any[]>([]);
  const [Cities,setCities] = React.useState<any[]>([]);

  const HandleGetStateOfCountry = (val:any) => {
    setCountry(val);
    // setStates(State.getStatesOfCountry(val));
    getStateList(val);
  }

  const HandleGetCityOfState = (val:any) => {
    setState(val);
    //setCities(City.getCitiesOfState(country,val));
    getCityList(val);
  }

  useEffect(() => {
    getUserDetails();
    getCountryList();
    getBeneficiaryDetails();
  },[]);

  //const theme = useTheme();
  const [theme]:any = useOutletContext();
  const [phone1ValidateData,setphone1ValidateData]   =  React.useState({});
  const [value, setValue] = React.useState('1');
  const [value2, setValue2] = React.useState('1');
  const [activeStep, setActiveStep] = React.useState(0);
  const [ownerbrd,setOwnerbrd] = React.useState<any>();
  const [ownerProfile,setOwnerProfile] = React.useState<any>('');
  const [imageFront1, setImageFront1] = React.useState({ preview: "", raw: "" });
  const [imageProfile, setImageProfile] = React.useState({ preview: "", raw: "" });
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  const [sessionlist,setSessionList] = React.useState<any>();

  const handleChangeImageFront1 = (e:any) => {
    if (e.target.files.length) {
      setOwnerbrd('');
      setImageFront1({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      handleImageChange(e);
    }
  };

  const handleChangeImageProfile = (e:any) => {
    if (e.target.files.length) {
      setOwnerProfile('');
      setImageProfile({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      handleImageChange(e);
    }
  };

  const getUserSessionHistory = async() => {
    await axios.get(`/${url}/v1/session/getusersession/${accountId?.data?.id}`)
    .then(result => {
      if(result.data.status == "201") {
       setSessionList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const getCountryList = async() => {
    await axios.get(`/${url}/v1/user/getCountryList`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setCountries(result.data.data?.country);
       setStates(result.data.data?.states);
      }
    })
    .catch(error => {
      console.log("error", error);
    });
  }

  const getStateList = async(id:any) => {
    await axios.get(`/${url}/v1/user/getStateList/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setStates(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    });
  }

  const getCityList = async(id:any) => {
    await axios.get(`/${url}/v1/user/getCityList/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
       setCities(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    });
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

  const [valOtp,setValOtp] = React.useState<any>('');
  const [verifyOtp,setVerifyOtp] = React.useState<any>('');
  const [new_passsword,setNewPassword] = React.useState<any>('');
  const [otpStatus,setOtpStatus] = React.useState<boolean>(false);
  const [confirm_password,setConfirmPassword] = React.useState<any>('');

  const sendOTP = () => {
    if(new_passsword == "" || confirm_password == "") {
      alertnotify("Make Sure you have enter password / confirm password", "error");
    } else if(!validate("password", new_passsword) && !validate("cpassword",confirm_password, new_passsword)) {
      setOtpStatus(true);
      sendEmail(email);
    } else {
      if(validate("password", new_passsword)){
        const result =  validate("password",new_passsword);
      }
      if(validate("cpassword",confirm_password, new_passsword)){
        const result = validate("cpassword",confirm_password);
      }
    }
  }

  const sendEmail = async (valEmail:any) => {
    await axios.post(`/${url}/v1/user/send-email`, {
      email:valEmail,
      name:name
    },
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setVerifyOtp(result.data.data);
        alertnotify(result.data.message,"Success");
      }
    })
    .catch(error => {
      console.log(error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const ChangePassword = async () => {
    if(!validate("password", new_passsword) && !validate("cpassword",confirm_password, new_passsword)){
    if(verifyOtp == valOtp) {
      await axios.patch(`/${url}/v1/user/change-password`, {
        new_passsword,
        confirm_password
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == 201) {
          setOtpStatus(false);
          setNewPassword('');
          setConfirmPassword('');
          alertnotify(result.data.message,"Success");
        }
      })
      .catch(error => {
        console.log(error);
        alertnotify(error.response.data.message, "error");
      })
    } else {
      alertnotify("Invalid OTP", "error");
    }
  }else{
    if(validate("password", new_passsword)){
      alertnotify(errors.password,"error");
    }
    if(validate("cpassword",confirm_password, new_passsword)){
      alertnotify(errors.cpassword,"error");
    }
  }
  }

  const [loader,setLoader] = React.useState<boolean>(true);
  const decodedUni = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
  // @ts-ignore
  const [currentId,setcurrentId] = React.useState<any>(decodedUni?.data?.id); 

  const getUserDetails = async () => {
    await axios.post(`/${url}/v1/user/auth`, {}, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setLoader(false);
        setUserDetails(result.data.data);
        setName(result.data.data.name);
        setMobile("+"+result.data.data.mobile);
        setEmail(result.data.data.email);
        setAddress(result.data.data.address);
        setCity(result.data.data.city);
        setState(result.data.data.state);
        setPostalCode(result.data.data.postalcode);
        if(result?.data?.data?.country) {
          getCityList(result?.data?.data?.state);
        }
        setCountry(result.data.data.country);
        setOwnerTitle(result.data.data.ownerTitle);
        setTaxID(result.data.data.ownertaxid);
        setIDOfIndividual(result.data.data.owneridofindividual);
        setOwnerbrd(result.data.data.ownerbrd);
        setOwnerProfile(result.data.data.ownerProfile);
        HandleStateCity(result.data.data.country,result.data.data.state);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  const [BeneficaryDetails,setBeneficaryDetails] = React.useState<any[]>([]);

  const getBeneficiaryDetails = async () => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/receipient/list/${decoded?.data?.id}`,{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == 201) {
        setBeneficaryDetails(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  var steps:any[] = [];

  if(userDetails?.accountDetails) {
    userDetails?.accountDetails?.map((item:any) => {
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

  const HandleStateCity = (a:any,b:any) => {
    if(a && b) {
      setStates(State.getStatesOfCountry(a));
      setCities(City.getCitiesOfState(a,b));
    } else if(b) {
      setStates(State.getStatesOfCountry(a));
    }
  }

  const SaveUserProfile = async () => {
    if(!validate('name',name) && !validate('phone',mobile) && !validate('email',email) && !validate('address',address) && !validate('city', city) && !validate('state', state) && !validate('title', ownertitle) && !validate('pincode',postalCode)){
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/user/update-profile`, {
      user_id: decoded?.data?.id,
      name:name,
      mobile:mobile,
      email:email,
      address,
      city,
      state,
      country,
      ownerTitle:ownertitle,
      postalcode:postalCode
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

  } else {
    if(validate('name',name)){
      const result = validate('name',name);
    }
    if(validate('email',email)){
      const result = validate('email',email);
    }
    if(validate('phone',phone1ValidateData)){
      const result = validate('phone',phone1ValidateData);
    }
    if(validate('address',address)){
      const result = validate('address',address);
    }
    if(validate('country',country)){
      const result = validate('country',country);
    }
    if(validate('state',state)){
      const result = validate('state',state);
    }
    if(validate('city',city)){
      const result = validate('city',city);
    }
    if(validate('pincode',postalCode)){
      const result = validate('pincode',postalCode);
    }
    if(validate('title',ownertitle)){
      const result = validate('title',ownertitle);
    }
   }
  }

   const SaveUserDocuments = async () => {
    if(!validate('taxid',taxid) && !validate('DocumentType',idofindividual) && !validate('files[]',imageFront1.raw)){
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/user/update-profile`, {
      user_id: decoded?.data?.id,
      ownerTitle:ownertitle,
      ownertaxid:taxid,
      owneridofindividual:idofindividual,
      ownerbrd: imageFront1?.raw,
     }, 
     {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type' : 'multipart/form-data'
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
    }else{
      if(validate('taxid',taxid)){
        const result = validate('taxid',taxid);
      }
      if(validate('DocumentType',idofindividual)){
        const result = validate('DocumentType',idofindividual);
      }
      if(validate('files[]',imageFront1.raw)){
        const result = validate('files[]',imageFront1.raw);
      }
    }
   }

   const SaveUserProfilePic = async () => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    if(imageProfile?.raw && !validate('file', imageProfile.raw)) {
      await axios.patch(`/${url}/v1/user/update-profile`, {
        user_id: decoded?.data?.id,
        ownerProfile:imageProfile?.raw
      }, 
      {
        headers: 
        {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type' : 'multipart/form-data'
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          setOpenPhoto(false);
          getUserDetails();
          alertnotify("Profile photo has been updated Successfully","success");
          window.location.href="/user-profile";
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify(error.response.data.message,"error");
      })
    } else {
      if(imageProfile?.raw && validate('file',imageProfile.raw)){
        const result = validate('files[]',imageProfile.raw);
      } else {
       alertnotify("Please select Image", "error");
      }
    }
   }

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
        autoClose: 6000,
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
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
  }

  const handleImageChange = (e:any)=>{
    const {name, files} = e.target;
    const returnValue = validate(name, files[0]);
    console.log(returnValue);
  }

  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  const handlePhone1Change = (value:any, country:any, e:any, formattedValue:any) => {
    const {name} = e.target;
    setMobile(value);
    const data = {valueLength:formattedValue.length, countryLength:country.format.length};
    setphone1ValidateData(data);
  };

  const handlePhone1Blur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, phone1ValidateData);
    console.log(returnValue);
  };

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
      <Toolbar sx={{ display: 'flex',flexDirection: 'column',borderRadius: '.5rem', p: '10px', border: `${theme ? '1px solid white' : '1px solid silver'}`, background: `${theme ? '' : 'white'}` }}> 
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
                <Tab label="Security" value="3" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="Update Details" value="4" sx={{ background: `${theme ? 'white': ''}` }} />
                <Tab label="Documents" value="5" sx={{ background: `${theme ? 'white': ''}` }} />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={12}>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Grid sx={{display: 'flex', flexDirection: 'row'}}>
                  {
                   loader ? 
                   <>
                    <Skeleton variant="rectangular" width="100%" height={210} />
                   </>
                   :
                   <>
                    <Grid>
                    {                    
                      ownerProfile ?
                      <>
                        {/* @ts-ignore */} 
                        <img 
                          src={`${import.meta.env.VITE_PUBLIC_URL}/storage/${currentId}/${ownerProfile}`}
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
                    <Grid sx={{marginLeft: '-20px', marginTop: '-2px'}}>
                      <ModeEditOutline onClick={handleClickOpenPhoto} sx={{cursor: 'pointer', background: 'white', borderRadius: '12px', color:'blue'}} />
                    </Grid>
                   </>
                  }
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={8}>
                  <Grid sx={{display: 'flex', flexDirection: 'column', gap: '9px', color: `${theme ? '': 'black'}`}}>
                    <Grid>Name: {name}</Grid>
                    <Grid>Email: {email}</Grid>
                    <Grid>Mobile: {mobile}</Grid>
                    <Grid>Country: {country}</Grid>
                    <Grid>Total Accounts: {userDetails?.accountDetails?.length}</Grid>
                    <Grid>Default Currency: {userDetails?.defaultCurrency}</Grid>
                    <Grid>Address: {address}</Grid>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <label htmlFor="password" style={{fontWeight: '700'}}>Generate Password</label>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <label htmlFor="Password">Password</label>
                  <TextField type="password" 
                    name="password"
                    onBlur={handleBlur}
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth 
                    sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <label htmlFor="Confirm Password">Confirm Password</label>
                  <TextField type="password"
                    name="cpassword" 
                    onBlur={handleBlur}
                    error={!!errors.cpassword}
                    helperText={errors.cpassword}
                    sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                    onChange={(e) => setConfirmPassword(e.target.value)} fullWidth 
                  />
                </Grid>
                {
                  otpStatus &&
                  <>
                    <Grid item xs={12}>
                      <label htmlFor="OTP">OTP</label>
                      <TextField type="text" onChange={(e) => setValOtp(e.target.value)} fullWidth sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }} />
                    </Grid>
                  </>
                }
                {
                  otpStatus ?
                  <Grid item xs={12}>
                    <Colorbtn onClick={() => ChangePassword()}>Update</Colorbtn>
                  </Grid>
                  :
                  <Grid item xs={12}>
                    <Colorbtn onClick={() => sendOTP()}>Submit</Colorbtn>
                  </Grid>
                }
              </Grid>
            </TabPanel>
            <TabPanel value="4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Name">Name</label>
                  <TextField 
                    name="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    onBlur={handleBlur} 
                    error={!!errors.name}
                    helperText={errors.name} 
                    sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Email">Email</label>
                  <TextField name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    onBlur={handleBlur}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                    fullWidth 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Mobile">Mobile</label>
                  <div>
                    <FormControl error={Boolean(errors.phone)} fullWidth>
                      <Box
                       sx={{
                        position: 'relative',
                        border: `1px solid ${errors.phone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'}`,
                        borderRadius: '4px',
                        mb: 1,
                        '&:hover': {
                        borderColor: `${errors.phone ? '#d32f2f' : '#183153'}`, // Change border color on hover
                        color: `${theme ? '#183153': 'white'}`
                        },
                        '&:focus-within': {
                          border: `2px solid ${errors.phone ? '#d32f2f' : '#183153'}`,
                          boxShadow: 'none',
                        },
                        transition: 'border-color 0.3s ease', // Smooth transition for border color
                      }}
                    >
                      <PhoneInput
                        inputProps={{
                          name: 'phone',
                          error:true
                        }}
                        country={'us'}
                        value={mobile}
                        onChange={handlePhone1Change} 
                        onBlur={handlePhone1Blur}
                        inputStyle={{ width:"100%", color: `${theme ? 'white' : 'black'}`, border: `${theme ? '1px solid white' : ''}`,boxShadow: 'none', background: `${theme ? '#183153' : 'white'}` }}
                      />
                    </Box>
                    {errors.phone &&
                    (<FormHelperText error>
                     {errors.phone}
                      </FormHelperText>
                     )
                    }  
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Address">Address</label>
                  <TextField name='address' value={address} onChange={(e) => setAddress(e.target.value)} 
                   onBlur={handleBlur}
                   error={!!errors.address}
                   helperText={errors.address}
                   sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                   fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Country">Country</label>
                  <FormControl fullWidth error={!!errors.country}>
                  <Select value={country}
                    name='country'
                    onBlur={handleBlur}
                    error={!!errors.country}
                    onChange={(e) => HandleGetStateOfCountry(e.target.value)} 
                    fullWidth sx={{border:'1px solid silver', borderRadius:'9px'}}>
                    {
                      Countries?.map((item,index) => (
                       <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                      ))
                    }
                  </Select>
                  {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="State">State</label>
                  <FormControl fullWidth error={!!errors.state}>
                  <Select value={state} 
                    name='state'
                    onBlur={handleBlur}
                    onChange={(e) => HandleGetCityOfState(e.target.value)} 
                    fullWidth sx={{border:'1px solid silver', borderRadius:'9px'}}
                  >
                    {
                      States?.map((item,index) => (
                       <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                      ))
                    }
                  </Select>
                  {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
                  </FormControl>
                </Grid>
                {
                  Cities?.length > 0 &&
                  <Grid item xs={12} sm={6}>
                  <label htmlFor="City">City</label>
                  <FormControl fullWidth error={!!errors.city}>
                  <Select value={city} 
                    name='city'
                    onBlur={handleBlur}
                    onChange={(e) => setCity(e.target.value)} 
                    fullWidth sx={{border:'1px solid silver', borderRadius:'9px'}}
                  >
                    {
                      Cities?.map((item,index) => (
                       <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                      ))
                    }
                  </Select>
                  {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                  </FormControl>
                </Grid>
                }
                
                <Grid item xs={12} sm={6}>
                  <label htmlFor="Postal Code">Postal Code</label>
                  <TextField value={postalCode} 
                    name='pincode'
                    onBlur={handleBlur}
                    error={!!errors.pincode}
                    helperText={errors.pincode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                    fullWidth 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label>Title</label>
                  <FormControl fullWidth error={!!errors.title}>
                  <Select value={ownertitle} 
                    name='title'
                    onBlur={handleBlur}
                    onChange={(e) => setOwnerTitle(e.target.value)} 
                    fullWidth sx={{border:'1px solid silver', borderRadius:'9px'}}
                  >
                    <MenuItem key={"CEO"} value="CEO">CEO</MenuItem> 
                    <MenuItem key={"CFO"} value="CFO">CFO</MenuItem> 
                    <MenuItem key={"PRESIDENT"} value="PRESIDENT">PRESIDENT</MenuItem>
                    <MenuItem key={"MANAGER"} value="MANAGER">MANAGER</MenuItem>
                    <MenuItem key={"OTHERS"} value="OTHERS">OTHERS</MenuItem> 
                  </Select>
                  {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                 <Colorbtn onClick={() => SaveUserProfile()}>Update</Colorbtn>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="5">
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <label>DOCUMENT ID NO</label>
                <TextField
                  required
                  id="taxid"
                  name="taxid"
                  value={taxid}
                  onChange={(e) => setTaxID(e.target.value)}
                  onBlur={handleBlur}
                  fullWidth
                  sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                  inputProps={{
                   shrink: true
                  }}
                  error={!!errors.taxid}
                  helperText={errors.taxid}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <label>ID OF INDIVIDUAL</label>
                <FormControl fullWidth error={!!errors.DocumentType}>
                <Select value={idofindividual} 
                  name='DocumentType'
                  onBlur={handleBlur}
                  error={!!errors.DocumentType}
                  onChange={(e) => setIDOfIndividual(e.target.value)} 
                  sx={{ border: `${theme ? '1px solid silver': '1px solid transparent'}`,borderRadius: '5px' }}
                  fullWidth 
                >
                  <MenuItem value="passport">Passport</MenuItem> 
                  <MenuItem value="driving_license">Driving License</MenuItem> 
                </Select>
                 {errors.DocumentType && <FormHelperText>{errors.DocumentType}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                  <label>Please upload document</label>
                  <div className="Neon Neon-theme-dragdropbox">
                    <input 
                      style={{
                       zIndex: '999', 
                       opacity: '0', 
                       width: '100%',
                       height: '100%',
                       background: 'silver',
                       position: 'absolute', 
                       right: '0px; left: 0px', 
                       marginRight: 'auto', 
                       marginLeft: 'auto',
                       cursor: 'pointer'
                      }} 
                      name="files[]" 
                      id="filer_input2" 
                      type="file" 
                      onChange={handleChangeImageFront1}
                    />
                   <FormControl fullWidth error={!!errors['files[]']}>
                  {errors['files[]'] && <FormHelperText>{errors['files[]']}</FormHelperText>}
                  </FormControl>
                    { 
                      ownerbrd ?
                      !ownerbrd.includes("pdf") ?
                      <>
                        <img 
                          crossOrigin="anonymous" 
                          src={`${import.meta.env.VITE_PUBLIC_URL}/storage/profile/${accountId?.data?.id}/${ownerbrd}`} 
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src=`${import.meta.env.VITE_APP_URL}/dummy-image.jpg`
                          }}
                          alt="proofoftrading" width="100%" height="100%" 
                        />
                        <div style={{ marginTop: '-100px', left: 0 , right:0,  padding: "12px", zIndex: '2', position: 'absolute', backdropFilter: 'blur(90px)' }}>Click here to upload new document</div>
                      </>
                        :
                      <>
                        <img crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt="Upload document (FRONT)" style={{marginBottom: '12px'}} width="120px" height="120px"/>
                      </>
                      :                           
                      imageFront1.preview ? (
                      <img src={imageFront1.preview} alt="dummy" width="100%" height="100%" />
                      ) 
                      :
                      (
                       <div className="Neon-input-dragDrop">
                        <div className="Neon-input-inner" style={{ marginTop: '-210px' }}>
                          <div className="Neon-input-icon">
                            <i className="fa fa-file-image-o"></i>
                          </div>
                          <div className="Neon-input-text"></div>
                           <a className="Neon-input-choose-btn blue">
                            <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                           </a>
                          </div>
                        </div>
                      )
                    } 
                    </div>
                    {
                      ownerbrd?.includes("pdf") ?
                      <>
                        <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                          <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${ownerbrd}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                        </Colorbtn>
                      </>
                      :
                      null
                    }
                  </Card>
                  {
                    ownerbrd 
                     ?
                     <Grid>
                        Note: Click over the Image in order to change the existing Document
                     </Grid>
                      :
                     null
                  }
              </Grid>
              <Grid item xs={12} sm={6}>
                <Colorbtn onClick={() => SaveUserDocuments()}>Update</Colorbtn>
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
            <Box sx={{ overflow: "auto" }}>
              <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                <table width="100%" style={{borderCollapse: 'collapse'}}>
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
                      <Grid sx={{display: 'flex',flexDirection: 'row', flexWrap: 'wrap', gap: '12px'}}>
                      {
                        userDetails?.referalDetails?.length > 0 ?
                        <>
                          <Grid>{`${import.meta.env.VITE_APP_URL}/register?code=${userDetails?.referalDetails?.[0]?.referral_code}`}</Grid>
                          <Grid><ContentCopyOutlinedIcon sx={{cursor: 'pointer'}} onClick={() => contentCopy(`${import.meta.env.VITE_APP_URL}/register?code=${userDetails?.referalDetails?.[0]?.referral_code}`)}/></Grid>
                        </>
                        :
                        null
                      }
                      </Grid>
                    </td>
                  </tr>
                </tbody>
                </table>
              </Box>  
            </Box>  
            </TabPanel>
            <TabPanel value="2">
            <Box sx={{ overflow: "auto" }}>
              <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              {
                userDetails?.accountDetails && 
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
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>Currency: {steps[activeStep].currency}</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>IBAN / Routing / Account Number</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{steps[activeStep].iban}</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>BIC / IFSC</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{steps[activeStep].bic}</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>Balance</Grid>
                    <Grid sx={{borderBottom: `${theme ? '1px solid white' : '1px solid black'}`}}>{getSymbolFromCurrency(steps[activeStep].currency)}{steps[activeStep].balance}</Grid>
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
                    <Button 
                      sx={{ color: `${theme ? 'white' : 'black'}` }}
                      size="small" 
                      onClick={handleBack} 
                      disabled={activeStep === 0}>
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
              </Box>              
            </TabPanel>
            <TabPanel value="3">
            <Grid container spacing={2}>
            {
              BeneficaryDetails?.map((item,index) => (
              <Grid item xs={12} sm={3} md={6} lg={3} key={index}>
                <Box sx={{borderRadius: '12px', border: `${theme ? '2px solid white' : '2px solid #33469b'}`, color: '#33469b', cursor: 'pointer'}}>
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
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>Currency: {item?.currency}</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>IBAN / Routing / Account Number</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>{item?.iban}</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>BIC / IFSC</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>{item?.bic_code}</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>Balance</Grid>
                    <Grid sx={{fontWeight: '600', color: `${theme ? 'white': ''}`}}>{getSymbolFromCurrency(item?.currency)}{item?.amount}</Grid>
                  </Grid>
                </Box>
              </Grid>
              ))
            }
            <Grid item xs={12} style={{height: '100%'}}>
              <Grid sx={{display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                {BeneficaryDetails?.length == 0 && <CustomNoRowsOverlay />}
              </Grid>
            </Grid>
          </Grid>
          </TabPanel>
        </TabContext>
        </Box>
      </Toolbar>

      <Dialog
        fullWidth
        open={openPhoto}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosePhoto}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ color: `${theme ? '': 'black'}` }}>{"Upload Profile Photo"}</DialogTitle>
        <DialogContent>
          <Grid sx={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <Grid>
            <FormControl fullWidth error={!!errors.file}>
              <input name="file" type="file" accept="image/*" onChange={handleChangeImageProfile} />
              {errors.file && <FormHelperText>{errors.file}</FormHelperText>}
            </FormControl>
            </Grid>
            <Grid sx={{ color: `${theme ? '': 'black'}` }}>
              <label htmlFor="Preview">Profile Photo</label>
              <br />
              { 
                ownerProfile ?
                <img 
                  crossOrigin="anonymous" 
                  src={`${import.meta.env.VITE_PUBLIC_URL}/${ownerProfile}`} 
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src=`${import.meta.env.VITE_APP_URL}/dummy-image.jpg`;
                  }}
                  width="100%" height="300px" alt="User Profile" />
                :                           
                imageProfile.preview ? (
                <img src={imageProfile.preview} alt="dummy" width="100%" height="300px" />
                ) 
                :
                (
                 <div className="Neon-input-dragDrop">
                  <div className="Neon-input-inner">
                    <div className="Neon-input-icon">
                      <i className="fa fa-file-image-o"></i>
                    </div>
                      <div className="Neon-input-text"></div>
                  </div>
                </div>
               )
              }
            </Grid>
            <Grid>
              <Colorbtn onClick={SaveUserProfilePic}>Upload</Colorbtn>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Closebtn onClick={handleClosePhoto}>Close</Closebtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
