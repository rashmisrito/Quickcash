import axios from 'axios';
import moment from 'moment';
import * as React from 'react';
import Step from '@mui/material/Step';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { red } from '@mui/material/colors';
import kycbg from '../../public/kycbg.png';
import Stepper from '@mui/material/Stepper';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import StepLabel from '@mui/material/StepLabel';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import useValidation from '../Hooks/useValidation';
import { StepIconProps } from '@mui/material/StepIcon';
import OutlinedInput from '@mui/material/OutlinedInput';
import SummarizeIcon from '@mui/icons-material/Summarize';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Closebtn, Colorbtn, Processingbtn } from '../Component/Button/ColorButton';
import { Avatar, Box,Card,CardHeader,Container,Grid, Stack, TextField, FormHelperText, FormControl, Chip, Tooltip } from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { EditSharp } from '@mui/icons-material';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// Definition:
// forwardRef: Let component receive a ref and forward it to a child component.

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <ContactPhoneIcon />,
    2: <SummarizeIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Contact Details', 'Document Details', 'Residential Address'];

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

export default function Kyc() {

  const [theme]:any = useOutletContext();
  const { errors, validate } = useValidation();
  const verifyDigit = Math.floor(Math.random() * 10000);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  const [CreatedAtDate,setCreatedAtDate]         =  React.useState('');
  const [contactBox,setContactBox]               =  React.useState<boolean>(true);
  const [documentBox,setDocumentBox]             =  React.useState<boolean>(false);
  const [residentialBox,setResidentialBox]       =  React.useState<boolean>(false);
  const [CompletedKyc,setCompletedKyc]           =  React.useState<boolean>(false);

  const [updateID,setUpdateID]                   =  React.useState();
  const [phone1,setPhone1]                       =  React.useState('');
  const [phone2,setPhone2]                       =  React.useState('');
  const [phone1ValidateData,setphone1ValidateData]   =  React.useState({});
  const [phone2ValidateData,setphone2ValidateData]   =  React.useState({});
  const [typeOfDoc,setTypeofDoc]                 =  React.useState<any>('');
  const [email, setEmail]                        =  React.useState<string>('');
  const [activeDoc,setActiveDoc]                 =  React.useState<number>(-1);
  const [residentailDoc,setResidentialDoc]       =  React.useState<any>('');
  const [selectedDocNumber,setSelectedDocNumber] =  React.useState('');

  const [Image1,setImage1]                       =  React.useState<any>('');
  const [Image2,setImage2]                       =  React.useState<any>('');
  const [Image3,setImage3]                       =  React.useState<any>('');

  const [verifiedEmail,setVerifiedEmail]   = React.useState<boolean>(false);
  const [verifiedPhone1,setVerifiedPhone1] = React.useState<boolean>(false);
  const [verifiedPhone2,setVerifiedPhone2] = React.useState<boolean>(false);
  
  React.useEffect(() => {
   getKycData();
  },[]);

  const [open, setOpen] = React.useState(false);
  const [flagValue,setFlagValue] = React.useState<any>('');

  const handleClickOpen = (value:any) => {
    setOpen(true);
    setFlagValue(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [kycStatus,setKycStatus] = React.useState<any>('');

  const getKycData = async () => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/kyc/getData/${decoded?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setKycStatus(result?.data?.data[0]?.status);
        setEmail(result?.data?.data[0]?.email);
        setUpdateID(result?.data?.data[0]?._id);
        setPhone1("+"+result?.data?.data[0]?.primaryPhoneNumber);
        setPhone2("+"+result?.data?.data[0]?.secondaryPhoneNumber);
        if(result?.data?.data[0]?.primaryPhoneNumber) {
          setphone1ValidateData("+"+result?.data?.data[0]?.primaryPhoneNumber);
        }
        if(result?.data?.data[0]?.secondaryPhoneNumber) {
          setphone2ValidateData("+"+result?.data?.data[0]?.secondaryPhoneNumber);
        }
        setSelectedDocNumber(result?.data?.data[0]?.documentNumber);
        setTypeofDoc(result?.data?.data[0]?.documentType);
        setResidentialDoc(result?.data?.data[0]?.addressDocumentType);
        setImage1(result?.data?.data[0]?.documentPhotoFront == '' ? undefined : result?.data?.data[0]?.documentPhotoFront);
        setImage2(result?.data?.data[0]?.documentPhotoBack == '' ? undefined : result?.data?.data[0]?.documentPhotoBack);
        setImage3(result?.data?.data[0]?.addressProofPhoto == '' ? undefined : result?.data?.data[0]?.addressProofPhoto);
        setCreatedAtDate(result?.data?.data[0]?.createdAt);
        setVerifiedEmail(result?.data?.data[0]?.emailVerified);
        setVerifiedPhone1(result?.data?.data[0]?.phonePVerified);
        setVerifiedPhone2(result?.data?.data[0]?.phoneSVerified);
        if((result?.data?.data[0]?.status == "Pending" || result?.data?.data[0]?.status == "completed") && result?.data?.data[0]?.documentPhotoFront != "") {
          navigate("/home");
        }
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  function validationContactPart() {
    if(email == "" || phone1 == "") {
      return true;
    } else {
      return false;
    }
  }

  const alertnotify = (text:any) => {
    toast.error(text, {
      position: "top-left",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }
  )}

  const HandleChangeBox = (type: string) => {
    if(type == "contact") {
      if(verifiedEmail && verifiedPhone1 && verifiedPhone2 && !validationContactPart() && !validate('email',email) && !validate('phone',phone1ValidateData) && !validate('phone2',phone2ValidateData)) {
        setContactBox(false);
        setDocumentBox(true);
        setResidentialBox(false);
        setActiveDoc(1);
      } else {
        if(validationContactPart()){
         alertnotify("Please do not leave any field blank.");
        }
        if(validate('email', email)){
          const result = validate('email', email);
        }
        if(validate('phone', phone1ValidateData)){
          const result = validate('phone', phone1ValidateData);
        }
        if(validate('phone2', phone2ValidateData)){
          const result = validate('phone', phone2ValidateData);
        }
        if(!verifiedEmail) {
          alertnotify2("Email should ve verified","error");
        }
        if(!verifiedPhone1) {
          alertnotify2("Primary Phone Number should ve verified","error");
        }
        if(!verifiedPhone2) {
          alertnotify2("Secondary Phone Number should ve verified","error");
        }
      }
    } else if(type == "document") {
      if(!validate('DocumentType',typeOfDoc) && !validate('DocumentNumber',selectedDocNumber) && (Image1 != undefined) && (Image2 != undefined)) {
        setContactBox(false);
        setDocumentBox(false);
        setResidentialBox(true);
        setActiveDoc(2);
      } else {
        if(validate('DocumentType',typeOfDoc)){
          const result = validate('DocumentType',typeOfDoc);
        }
        if(validate('DocumentNumber',selectedDocNumber)){
          const result = validate('DocumentNumber',selectedDocNumber);
        }
        if(validate('files[]',imageFront?.raw)){
          const result = validate('files[]',imageFront?.raw);
        }
        if(validate('files[]',imageBack.raw)){
          const result = validate('files[]',imageBack?.raw);
        }
      }
    } else if(type == "residential") {
      const flag = false;
      if(!validate("DocumentType", residentailDoc) && (Image3 != undefined)) {
        setContactBox(false);
        setDocumentBox(false);
        setResidentialBox(false);
        setCompletedKyc(true);
        setActiveDoc(3);
        HandleAddKycData();
      } else {
        if(validate('DocumentType',residentailDoc)){
          const result = validate('DocumentType',residentailDoc);
        }
        if(validate('files[]',imageResi.raw)){
          const result = validate('files[]',imageResi.raw);
        }
      }
    } else if(type == "update") {
      if(!validate("DocumentType", residentailDoc) && (Image3 != undefined)) {
        setContactBox(false);
        setDocumentBox(false);
        setResidentialBox(false);
        setCompletedKyc(true);
        setActiveDoc(3);
        HandleUpdateKycData();
      } else {
        if(validate('DocumentType',residentailDoc)){
          const result = validate('DocumentType',residentailDoc);
        }
        if(validate('files[]',imageResi.raw)){
          const result = validate('files[]',imageResi.raw);
        }
      }
    }
  }

  const [imageBack, setImageBack] = React.useState({ preview: "", raw: "" });
  const [imageResi, setImageResi] = React.useState({ preview: "", raw: "" });
  const [imageFront, setImageFront] = React.useState({ preview: "", raw: "" });

  const handleChangeImageFront = (e:any) => {
   if(!validate('files[]',e.target.files[0])) {
    if(e.target.files.length) {
      setImage1('');
      setImageFront({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      handleImageChange(e);
    }
   }
  };

  const handleChangeImageBack = (e:any) => {
    if(!validate('files[]',e.target.files[0])) {
      if(e.target.files.length) {
        setImage2('');
        setImageBack({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
        handleImageChange(e);
      }
    }
  };

  const handleChangeImageResi = (e:any) => {
    if(!validate('files[]',e.target.files[0])) {
      if(e.target.files.length) {
        setImage3('');
        setImageResi({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
        handleImageChange(e);
      }
    }
  };

  const alertnotify2 = (text:any,type:any) => {
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

  const HandleAddKycData = async () => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/kyc/add`, {
      email: email,
      documentType:typeOfDoc,
      user: decoded?.data?.id,
      primaryPhoneNumber:phone1,
      secondaryPhoneNumber:phone2,
      addressProofPhoto:imageResi?.raw,
      documentNumber:selectedDocNumber,
      documentPhotoFront:imageBack?.raw,
      documentPhotoBack:imageFront?.raw,
      addressDocumentType:residentailDoc,
      status: "Pending"
     }, 
     {
      headers: {
       'Content-Type':  'multipart/form-data',
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        alertnotify2(result.data.message,"success");
      }
     })
     .catch(error => {
      console.log("error", error);
      alertnotify2(error.response.data.message,"error");
     })
   }

   const HandleUpdateKycData = async () => {
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/kyc/update/${updateID}`, {
      user: decoded?.data?.id,
      email: email,
      documentType:typeOfDoc,
      primaryPhoneNumber:phone1,
      secondaryPhoneNumber:phone2,
      addressProofPhoto:imageResi?.raw,
      documentNumber:selectedDocNumber,
      documentPhotoFront:imageFront?.raw,
      documentPhotoBack:imageBack?.raw,
      addressDocumentType:residentailDoc,
      status: "Pending"
    }, 
    {
      headers: {
       'Content-Type':  'multipart/form-data',
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify2(result.data.message,"success");
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify2(error.response.data.message,"error");
    })
   }

  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  const handleImageChange = (e:any)=>{
    const {name, files} = e.target;
    const returnValue = validate(name, files[0]);
  }
  
  const handlePhone1Change = (value:any, country:any, e:any, formattedValue:any) => {
    const {name} = e.target;
    setPhone1(value);
    const data = {valueLength:formattedValue.length, countryLength:country.format.length};
    /** @ts-ignore **/
    setphone1ValidateData(data);
  };
  
  const handlePhone2Change = (value:any, country:any, e:any, formattedValue:any) => {
    const {name} = e.target;
    setPhone2(value);
    const data = {valueLength:formattedValue.length, countryLength:country.format.length};
    /** @ts-ignore **/
    setphone2ValidateData(data);
  };
  
  const handlePhone1Blur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, phone1ValidateData);
    console.log(returnValue);
  };
  
  const handlePhone2Blur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, phone2ValidateData);
    console.log(returnValue);
  };

  const HandleVerifySection: React.FormEventHandler<HTMLFormElement>= async (event:any) => {
    event.preventDefault();
    const { otp } = event.target.elements;

    if(flagValue == "phone1") {
      if(phone1.length < 11) {
        alertnotify2("Please enter valid number","error");
        return false;
      }
    }

    if(flagValue == "phone2") {
      if(phone2.length < 11) {
        alertnotify2("Please enter valid number","error");
        return false;
      }
    }

    if(otp?.value == verifyDigit) {
      const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      await axios.patch(`/${url}/v1/kyc/verify/${updateID}`, {
        user: decoded?.data?.id,
        email: email,
        type: flagValue,
        primaryPhoneNumber:phone1,
        secondaryPhoneNumber:phone2,
        emailVerified: flagValue == "email" ? true : verifiedEmail,
        phonePVerified: flagValue == "phone1" ? true : verifiedPhone1,
        phoneSVerified: flagValue == "phone2" ? true : verifiedPhone2
      }, 
      {
        headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(result => {
        if(result.data.status == "201") {
          setOpen(false);
          if(flagValue == "email") {
            setVerifiedEmail(true);
          } else if(flagValue == "phone1") {
            setVerifiedPhone1(true);
          } else if(flagValue == "phone2") {
            setVerifiedPhone2(true);
          }
          alertnotify2(result.data.message,"success");
        }
      })
      .catch(error => {
        console.log("error", error);
        alertnotify2(error.response.data.message,"error");
      })
     }
   }

  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '83%'}}}>
        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
         <Paper
            component={Stack}
            spacing={3}
            sx={{
              position: "relative",
              overflow: "hidden",
              backgroundImage: `url(${kycbg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              objectFit: "fill",
              borderRadius: 4,
              background: `${theme ? '#183153' : ''}`,
              border: `${theme ? '1px solid white' : ''}`,
              p: 4
            }}
            alignItems="start"
          >
          <Box sx={{ p: { md: 2 } }} />
            <Container maxWidth="sm" component={Stack} spacing={2}>
              <Typography variant="h4" sx={{ color: `${theme ? 'white' : '#000'}` }}>
              {
                kycStatus == "completed" ?
                "KYC Completed Successfully"
                :
                null
              }
              </Typography>
              <Typography variant="body1" sx={{ color: `${theme ? 'white' : '#000'}` }}>
              {
                kycStatus != "completed" ?
                "To full activate your account and access all features, please complete the KYC (Know your Customer) process. It's quick and essential for your security and complaince. Don't miss out. finish your KYC today!"
                :
                null
              } 
              </Typography>
            </Container>
        </Paper>       

        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
          <Stepper alternativeLabel activeStep={activeDoc} connector={<ColorlibConnector />} sx={{ color: 'black' }}>
            {steps.map((label) => (
              <Step key={label}>
                {/* <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel> */}
                <Tooltip title={label} placement="top" arrow>
                  <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
                </Tooltip>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid sx={{display: 'flex', flexDirection: 'column',gap: '20px',borderRadius: '.5rem', color: `${theme ? 'white': 'black'}`, fontWeight: '700', background: `${theme ? '#183153' : 'white'}`, border: `${theme ? '1px solid white' : ''}`, padding: '10px 12px'}}>
        {
          contactBox && 
          <>
            <Grid>
              <div>Contact Details</div>
                <hr style={{marginBottom: '20px'}} />
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <Grid>
                      <label>Email</label>
                      <TextField
                        name="email"
                        id="outlined-number"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{marginBottom: '10px',border: `${theme ? '1px solid white': ''}`}}
                      />
                    </Grid>
                   <Grid>  
                   {
                    !verifiedEmail ?
                      <Processingbtn sx={{marginBottom: '12px'}} onClick={() => handleClickOpen("email")}>Verify</Processingbtn>
                    :
                    <Chip
                      color='success'
                      label="Verified"
                      sx={{marginBottom: '12px'}}
                        deleteIcon={<DoneIcon />}
                    />
                   }
                  </Grid>
                </Grid>
                      
                  {/* Tech Wizard */}
                  <Grid item xs={6}>
                    <Grid>
                      <div>
                        <FormControl error={Boolean(errors.phone)} fullWidth>
                          <label>Primary phone number</label>
                          <Box
                            sx={{
                              position: 'relative',
                              border: `1px solid ${errors.phone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'}`,
                              borderRadius: '4px',
                              mb: 1,
                              '&:hover': {
                                borderColor: `${errors.phone ? '#d32f2f' : '#183153'}`, // Change border color on hover
                                color: 'black',
                              },
                              '&:focus-within': {
                                border: `2px solid ${errors.phone ? '#d32f2f' : '#183153'}`,
                                boxShadow: 'none',
                              },
                              transition: 'border-color 0.3s ease' // Smooth transition for border color
                            }}
                          >
                            <PhoneInput
                              inputProps={{
                                name: 'phone',
                                error:true
                              }}
                              country={'us'}
                              value={phone1}
                              onChange={handlePhone1Change}
                              onBlur={handlePhone1Blur}
                              inputStyle={{ width:"100%", color: `${theme ? 'white' : 'black'}`, border: `${theme ? '1px solid white' : ''}`,boxShadow: 'none', background: `${theme ? '#183153' : 'white'}` }}
                            />
                          </Box>
                          {
                           errors.phone &&
                            (<FormHelperText error>
                              {errors.phone}
                            </FormHelperText>
                            )
                          }
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid>
                    {
                      !verifiedPhone1 ?
                      <Processingbtn sx={{marginBottom: '12px'}} onClick={() => handleClickOpen("phone1")}>Verify</Processingbtn>
                      :
                      <Chip
                        color='success'
                        label="Verified"
                        sx={{marginBottom: '12px'}}
                        deleteIcon={<DoneIcon />}
                      />
                    }
                    </Grid>
                  </Grid>
                      
                  <Grid item xs={6}>
                    <Grid>
                      <div>
                        <FormControl error={Boolean(errors.phone2)} fullWidth>
                          <label>Additional phone number</label>
                          <Box
                            sx={{
                              position: 'relative',
                              border: `1px solid ${errors.phone2 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'}`,
                              borderRadius: '4px',
                              mb: 1,
                              '&:hover': {
                                borderColor: `${errors.phone2 ? '#d32f2f' : '#183153'}`, // Change border color on hover
                                color: 'black',
                              },
                              '&:focus-within': {
                                border: `2px solid ${errors.phone2 ? '#d32f2f' : '#183153'}`,
                                boxShadow: 'none',
                              },
                              transition: 'border-color 0.3s ease', // Smooth transition for border color
                            }}
                          >
                          <PhoneInput
                            inputProps={{
                              name: 'phone2',
                              error:true
                            }}
                            country={'us'}
                            value={phone2}
                            onChange={handlePhone2Change}
                            onBlur={handlePhone2Blur}
                            inputStyle={{ width:"100%", color: `${theme ? 'white' : 'black'}`, border: `${theme ? '1px solid white' : ''}`,boxShadow: 'none', background: `${theme ? '#183153' : 'white'}` }}
                          />
                          </Box>
                          {errors.phone2 &&
                          (<FormHelperText error>
                            {errors.phone2}
                          </FormHelperText>
                          )}
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid>
                    {
                      !verifiedPhone2 ?
                      <Processingbtn sx={{marginBottom: '12px'}} onClick={() => handleClickOpen("phone2")}>Verify</Processingbtn>
                       :
                      <Chip
                        color='success'
                        label="Verified"
                        sx={{marginBottom: '12px'}}
                        deleteIcon={<DoneIcon />}
                      />
                    }
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
                    <Colorbtn onClick={() => HandleChangeBox('contact')}>Next</Colorbtn>
                  </Grid>
                </Grid>
               </Grid>
              </>
            }
            
            {
              documentBox && 
              <>
                <Grid>
                  <div>Document Details</div>
                  <hr />
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                      <label>Type of document</label>
                      <FormControl fullWidth error={!!errors.DocumentType}>
                      <Select
                        name='DocumentType'
                        value={typeOfDoc}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTypeofDoc(value);
                        }}
                        sx={{ border: `${theme ? '1px solid white': ''}` }}
                        onBlur={handleBlur}
                        error={!!errors.DocumentType}
                        input={<OutlinedInput label="Name" />}
                        fullWidth
                      >
                        <MenuItem value="passport" key="1">Passport</MenuItem>
                        <MenuItem value="driving_license" key="2">Driving License</MenuItem>
                      </Select>
                      {errors.DocumentType && <FormHelperText>{errors.DocumentType}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <label>Selected Document Number</label>
                      <TextField
                        name='DocumentNumber'
                        id="outlined-number"
                        type="text"
                        fullWidth
                        InputLabelProps={{
                         shrink: true,
                        }}
                        sx={{ border: `${theme ? '1px solid white': ''}` }}
                        value={selectedDocNumber}
                        onChange={(e) => setSelectedDocNumber(e.target.value)}
                        onBlur={handleBlur}
                        error={!!errors.DocumentNumber}
                        helperText={errors.DocumentNumber}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ marginBottom: '10px'}}>
                        <div className="Neon Neon-theme-dragdropbox">
                        <FormControl fullWidth error={!!errors['files[]']}>
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
                            marginLeft: 'auto'
                          }} 
                            name="files[]" 
                            id="filer_input2" 
                            type="file" 
                            onChange={handleChangeImageFront}
                          />
                          { 
                            Image1 ?
                            !Image1.includes("pdf") ?
                            <>
                              <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image1}`} alt="Upload document (FRONT)" width="100%" height="220px" />
                              <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                                <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Upload Document (Front)</Grid>
                                <Grid sx={{cursor: 'pointer'}}>
                                  <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                    <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Change</Grid>
                                    <Grid><EditSharp sx={{ color: `${theme ? 'white' : 'black'}` }} /></Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                            :
                            <>
                              <img crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt="Upload document (FRONT)" style={{marginBottom: '12px'}} width="120px" height="120px" />
                              <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                              <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Upload Document (Front)</Grid>
                               <Grid sx={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                  <Grid>Change</Grid>
                                  <Grid><EditSharp /></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            </>
                            :                           
                            imageFront?.preview ? (
                              <img 
                                src={imageFront.preview} 
                                alt="dummy" 
                                width="300px" 
                                height="200px"
                                style={{marginBottom: "12px"}}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src=`${import.meta.env.VITE_APP_URL}/pdf.png`;
                                }}
                              />
                            ) :
                            (<div className="Neon-input-dragDrop">
                              <div className="Neon-input-inner">
                                 <div className="Neon-input-icon" style={{display: 'flex', justifyContent: 'center'}}>
                                   <i className="fa fa-file-image-o"></i>
                                  </div>
                                  <div className="Neon-input-text"></div>
                                  <a className="Neon-input-choose-btn blue" style={{cursor: 'pointer'}}>
                                   <CloudUploadIcon style={{cursor: 'pointer', backdropFilter:  'blur(10px)' }} /> 
                                   <Typography>Upload Document (Front)</Typography>
                                  </a>
                                </div>
                             </div>
                            )}
                            {errors['files[]'] && <FormHelperText>{errors['files[]']}</FormHelperText>}
                            </FormControl>
                            {
                              Image1?.includes("pdf") ?
                              <>
                                <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                                  <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image1}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                                </Colorbtn>
                              </>
                              :
                              null
                            } 
                        </div>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ marginBottom: '10px', width: '100%' }}>
                        <div className="Neon Neon-theme-dragdropbox">
                        <FormControl fullWidth error={!!errors['files[]']}>
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
                            marginLeft: 'auto'
                          }} 
                            name="files[]" 
                            id="filer_input2" 
                            type="file" 
                            onChange={handleChangeImageBack}
                          />
                          { Image2 ?
                            !Image2.includes("pdf") ?
                            <>
                              <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image2}`} alt="Upload document (Back)" width="100%" height="220px" />
                              <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                                <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Upload Document (Back)</Grid>
                                <Grid sx={{cursor: 'pointer'}}>
                                  <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                    <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Change</Grid>
                                    <Grid><EditSharp sx={{ color: `${theme ? 'white' : 'black'}` }} /></Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>  
                            :
                            <>
                              <img crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt="Upload document (FRONT)" style={{marginBottom: '12px'}} width="120px" height="120px"/>
                              <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                                <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Upload Document (Back)</Grid>
                                <Grid sx={{cursor: 'pointer'}}>
                                  <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                    <Grid sx={{ color: `${theme ? 'white' : 'black'}` }}>Change</Grid>
                                    <Grid><EditSharp sx={{ color: `${theme ? 'white' : 'black'}` }} /></Grid>
                                  </Grid>
                                </Grid>
                              </Grid> 
                            </>
                            :                           
                            imageBack.preview ? (
                              <img
                                src={imageBack.preview} 
                                alt="dummy" 
                                width="300px" 
                                height="200px"
                                style={{marginBottom: "12px"}}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src=`${import.meta.env.VITE_APP_URL}/pdf.png`;
                                }}
                              />
                            ) :
                            (<div className="Neon-input-dragDrop">
                              <div className="Neon-input-inner">
                                <div className="Neon-input-icon" style={{display: 'flex'}}>
                                  <i className="fa fa-file-image-o"></i>
                                </div>
                                <div className="Neon-input-text"></div>
                                <a className="Neon-input-choose-btn blue">
                                 <CloudUploadIcon style={{cursor: 'pointer', backdropFilter:  'blur(10px)' }} /> 
                                 <Typography sx={{ color: `${theme ? 'white' : 'black'}` }}>Upload Document (Back)</Typography>
                                </a>
                                </div>
                              </div>
                            )}
                            {errors['files[]'] && <FormHelperText>{errors['files[]']}</FormHelperText>}
                            {
                              Image2?.includes("pdf") ?
                              <>
                                <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                                  <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image2}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                                </Colorbtn>
                              </>
                              :
                              null
                            }
                            </FormControl>
                        </div>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid>Notes:</Grid>
                      <Grid>
                        Upload the selected document in .jpg, .jpeg or .pdf format, as described above. 
                        The maximum file size should be less than of 5mb. Before submitting, 
                        double-check that the document includes the correct information.
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
                      <Colorbtn onClick={() => HandleChangeBox('document')}>Next</Colorbtn>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            }

            {
              residentialBox && 
              <>
                <Grid>
                  <div>Residential Address</div>
                  <hr />
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6.1}>
                      <label>Type of document</label>
                      <FormControl fullWidth error={!!errors.DocumentType}>
                    <Select
                      name='DocumentType'
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={residentailDoc}
                      onChange={(e) => setResidentialDoc(e.target.value)}
                      onBlur={handleBlur}
                      error={!!errors.DocumentType}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                      sx={{ border: `${theme ? '1px solid white': ''}`, marginTop: '12px' }}
                      fullWidth
                    >
                      <MenuItem value="bank_statement" key="1">Bank Statement</MenuItem>
                      <MenuItem value="cc_statement" key="2">Credit Card Statement</MenuItem>
                      <MenuItem value="utility_bill" key="3">Utility Bill</MenuItem>
                    </Select>
                    {errors.DocumentType && <FormHelperText>{errors.DocumentType}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6.1}>
                    <Card sx={{ marginBottom: '10px', width: '100%' }}>
                      <div className="Neon Neon-theme-dragdropbox">
                      <FormControl fullWidth error={!!errors['files[]']}>
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
                          marginLeft: 'auto'
                        }} 
                          name="files[]" 
                          id="filer_input2" 
                          type="file" 
                          onChange={handleChangeImageResi}
                        />
                        { 
                          Image3 ?
                          !Image3.includes("pdf") ?
                          <>
                           <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image3}`} alt="Upload document" width="100%" height="220px" />
                          
                            <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                              <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>Upload Document</Grid>
                               <Grid sx={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                  <Grid sx={{ color: `${theme ? 'white': 'black'}` }}>Change</Grid>
                                  <Grid><EditSharp sx={{ color: `${theme ? 'white': 'black'}` }} /></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          :
                          <>
                            <img crossOrigin="anonymous" src={`${import.meta.env.VITE_APP_URL}/pdf.png`} alt="Upload document (FRONT)" style={{marginBottom: '12px'}} width="120px" height="120px"/>
                            <Grid sx={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px'}}>
                              <Grid>Upload Document</Grid>
                               <Grid sx={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: 'mornal',gap: '3px'}}>
                                  <Grid>Change</Grid>
                                  <Grid><EditSharp /></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          :                           
                          imageResi.preview ? (
                            <img 
                              src={imageResi.preview} 
                              alt="dummy" 
                              width="300px" 
                              height="200px"
                              style={{marginBottom: "12px"}}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src=`${import.meta.env.VITE_APP_URL}/pdf.png`;
                              }}
                            />
                          ) :
                            (
                             <div className="Neon-input-dragDrop">
                              <div className="Neon-input-inner">
                                <div className="Neon-input-icon" style={{display: 'flex'}}>
                                <i className="fa fa-file-image-o"></i>
                                </div>
                                <div className="Neon-input-text"></div>
                                <a className="Neon-input-choose-btn blue">
                                <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                                <Typography>Upload Document</Typography>
                                </a>
                              </div>
                             </div>
                            )}
                            {errors['files[]'] && <FormHelperText>{errors['files[]']}</FormHelperText>}
                            {
                              Image3?.includes("pdf") ?
                              <>
                                <Colorbtn sx={{cursor: 'pointer'}} fullWidth>
                                  <a href={`${import.meta.env.VITE_PUBLIC_URL}/kyc/${Image3}`} target='_blank' style={{textDecoration: 'none', color: 'white'}} download>View Document</a>
                                </Colorbtn>
                              </>
                              :
                              null
                            } 
                            </FormControl>
                        </div>
                      </Card>

                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
                    {
                      updateID
                      ?
                      <Colorbtn onClick={() => HandleChangeBox("update")}>Update</Colorbtn>
                      :
                      <Colorbtn onClick={() => HandleChangeBox("residential")}>Complete</Colorbtn>
                    }
                    </Grid>
                  </Grid>
                  </Grid>
                </>
              }

              {
                CompletedKyc &&
                <>
                  <Grid sx={{display: 'flex', gap: '20px', padding: '50px', flexDirection: 'column', justifyContent: 'center'}}>
                    <Grid>
                      KYC form is Submitted Successfully!
                    </Grid>
                    <Grid>
                      Thank you for submitting your KYC form. Your submission is now under review by our administration team.  
                      Please allow some time for the approval process.
                    </Grid>
                  </Grid>
                </>
              }
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Grid>{"Verify Section"}</Grid>
            <Grid><Closebtn onClick={handleClose}>X</Closebtn></Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid sx={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
              <Chip sx={{ fontSize: '30px', padding: '12px 12px' }} color='success' label={`${verifyDigit}`} />
            </Grid>
            <form onSubmit={HandleVerifySection}>
              <input 
                type="number" 
                style={{
                  padding: '12px', 
                  width: '100%',
                  border: '1px solid silver'
                }} 
                /**@ts-ignore**/
                onInput={(e) => e.target.value = e.target.value.slice(0, 4)}
                placeholder='Enter above number to verify' 
                name="otp" 
                id="otp" 
              />
              <button 
                type="submit" 
                style={{ 
                  padding: '12px', 
                  marginTop: '12px', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  background: '#2E3192',
                  color: 'white',
                  fontWeight: '700'
                }}
              >
                Proceed
              </button>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}
