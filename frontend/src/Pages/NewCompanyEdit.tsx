
import axios from 'axios';
import moment from 'moment';
import Card from '@mui/material/Card';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { countries } from 'countries-list';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { useNavigate, useParams } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Typography } from '@mui/material';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
 backgroundColor: "#2196f3",
  '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

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

export default function NewCompanyEdit() {

  const navigate = useNavigate();
  const params = useParams();
  const [imageFront1, setImageFront1] = React.useState({ preview: "", raw: "" });
  const [imageFront2, setImageFront2] = React.useState({ preview: "", raw: "" });
  const [imageFront3, setImageFront3] = React.useState({ preview: "", raw: "" });
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [country,setCountry] = React.useState<any>();
  const [businessType,setBusinessType] = React.useState('');
  const [tradingAddress,setTradingAddress] = React.useState<any>();
  const [TaxIDDocument,setTaxIDDocument] = React.useState('');
  const [proofoftradingAddress,setProofoftradingAddress] = React.useState<any>();
  const [taxIdentificationNumber, setTaxIndentificationNumber] = React.useState<any>();
  const [businessRegistrationNumber,setBusinessRegistrationNumber] = React.useState<any>(); 
  const [businessRegistrationDcoument,setBusinessRegistrationDcoument] = React.useState('');
  const [CreatedAtDate,setCreatedAtDate] = React.useState('');

  useEffect(() => {
    if(localStorage.getItem('token')) {
      getCompanyDetails();
    }
  },[params?.id]);

  const getCompanyDetails = async () => {
    await axios.get(`/${url}/v1/company/${params?.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        setBusinessType(result.data.data.businessType);
        setBusinessRegistrationNumber(result.data.data.businessRegistrationNumber);
        setTaxIndentificationNumber(result.data.data.taxIdentificationNumber);
        setProofoftradingAddress(result.data.data.proofoftradingAddress);
        setBusinessRegistrationDcoument(result.data.data.businessRegistrationDocument);
        setTaxIDDocument(result.data.data.taxID);
        setTradingAddress(result.data.data.tradingAddress);
        setValue(result.data.data.tradingAddress);
        setCountry(result.data.data.country);
        setCreatedAtDate(result.data.data.createdAt);
      }
     })
     .catch(error => {
       console.log("error", error);
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

   const HandleCreateMemberAccount = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    console.log(businessType);
    await axios.patch(`/${url}/v1/company/update/${params?.id}`, {
      user: decoded?.data?.id,
      taxID:imageFront3?.raw,
      businessRegistrationDocument:imageFront1?.raw,
      proofoftradingAddress:imageFront2?.raw,
      country,
      businessType,
      tradingAddress:value,
      taxIdentificationNumber,
      businessRegistrationNumber,
     }, {
        headers: {
         'Content-Type':  'multipart/form-data',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
     })
     .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/Company-Details');
      }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error.response.data.message,"error");
     })
  }

  const handleChangeImageFront1 = (e:any) => {
    if (e.target.files.length) {
      setBusinessRegistrationDcoument('');
      setImageFront1({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const handleChangeImageFront2 = (e:any) => {
    if (e.target.files.length) {
      setProofoftradingAddress('');
      setImageFront2({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const handleChangeImageFront3 = (e:any) => {
    if (e.target.files.length) {
      setTaxIDDocument('');
      setImageFront3({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const [value, setValue] = React.useState('trading');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%', sm: '0%',md: '7%'}, background: 'white' , width: {xs: '100%', lg: '80%'} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'left'}}>
            <KeyboardBackspaceIcon onClick = {() => navigate('/Company-Details')} sx={{cursor: 'pointer'}}/>
          </Typography>
          <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <label>Business Type</label>
                <Select fullWidth sx={{background: 'white', border:'1px solid silver'}} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  <MenuItem key={0} sx={{background: 'white'}} className='business__type__hover' value={"company"} >Company</MenuItem>
                  <MenuItem key={1} sx={{background: 'white'}} className='business__type__hover' value={"sale_properitor"}>Sale Properitor</MenuItem>
                  <MenuItem key={2} sx={{background: 'white'}} className='business__type__hover' value={"individual"}>Individual</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={12}>
                <label>Business Registration Number</label>
                <TextField
                  required
                  id="business_registration_number"
                  name="business_registration_number"
                  fullWidth
                  value={businessRegistrationNumber}
                  onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                  sx={{border:'1px solid silver'}}
                  inputProps={{
                   shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <label>Tax Identification Number</label>
                <TextField
                  required
                  id="tax_identification_number"
                  name="tax_identification_number"
                  fullWidth
                  value={taxIdentificationNumber}
                  onChange={(e) => setTaxIndentificationNumber(e.target.value)}
                  sx={{border:'1px solid silver'}}
                  inputProps={{
                   shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                  <FormControlLabel value="trading" control={<Radio />} label="Same as Trading Address" />
                  <FormControlLabel value="country" control={<Radio />} label="Country" />
                  </RadioGroup>
                  </FormControl>
                </Grid>             

                {
                  value == "country" ?
                  (
                   <Grid item xs={12} sm={12}>
                    <label>Country</label>
                    <Select fullWidth onChange={(e) => setCountry(e.target.value)} value={country}>
                    {
                      Object.entries(countries).map((key) => (
                       <MenuItem sx={{background: 'white'}} className='business__type__hover' key={key[0]} value={key[0]}>{key[1]?.name}</MenuItem> 
                      ))
                    }
                    </Select>
                   </Grid>
                 )
                :
                 null 
                }

                <Grid item xs={12}>
                  <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          BD
                        </Avatar>
                      }
                      title="Business Registration Document"
                      subheader={`${moment(CreatedAtDate).format("MMMM Do YYYY, h:mm:ss A")}`}
                    />
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
                        marginLeft: 'auto'
                      }} 
                        name="files[]" 
                        id="filer_input2" 
                        type="file" 
                        onChange={handleChangeImageFront1}
                      />
                      { 
                        businessRegistrationDcoument ?
                        <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${businessRegistrationDcoument}`} alt="proofoftrading" width="100%" height="100%" />
                      :                           
                      imageFront1.preview ? (
                        <img src={imageFront1.preview} alt="dummy" width="100%" height="100%" />
                      ) :
                        (<div className="Neon-input-dragDrop">
                          <div className="Neon-input-inner">
                            <div className="Neon-input-icon">
                            <i className="fa fa-file-image-o"></i>
                            </div>
                            <div className="Neon-input-text"></div>
                            <a className="Neon-input-choose-btn blue">
                            <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                            </a>
                            </div>
                          </div>
                        )}
                    </div>
                  </Card>
                  <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          PA
                        </Avatar>
                      }
                      title="Proof of Trading Address"
                      subheader={`${moment(CreatedAtDate).format("MMMM Do YYYY, h:mm:ss A")}`}
                    />
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
                        marginLeft: 'auto'
                      }} 
                        name="files[]" 
                        id="filer_input2" 
                        type="file" 
                        onChange={handleChangeImageFront2}
                      />
                      { 
                        proofoftradingAddress ?
                        <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${proofoftradingAddress}`} alt="proofoftrading" width="100%" height="100%" />
                      :                           
                      imageFront2.preview ? (
                        <img src={imageFront2.preview} alt="dummy" width="100%" height="100%" />
                      ) :
                        (<div className="Neon-input-dragDrop">
                          <div className="Neon-input-inner">
                            <div className="Neon-input-icon">
                            <i className="fa fa-file-image-o"></i>
                            </div>
                            <div className="Neon-input-text"></div>
                            <a className="Neon-input-choose-btn blue">
                            <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                            </a>
                            </div>
                          </div>
                        )}
                    </div>
                  </Card>
                  <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          TD
                        </Avatar>
                      }
                      title="Tax ID/TIN"
                      subheader={`${moment(CreatedAtDate).format("MMMM Do YYYY, h:mm:ss A")}`}
                    />
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
                        marginLeft: 'auto'
                      }} 
                        name="files[]" 
                        id="filer_input2" 
                        type="file" 
                        onChange={handleChangeImageFront3}
                      />
                      { 
                        TaxIDDocument ?
                        <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${TaxIDDocument}`} alt="proofoftrading" width="100%" height="100%" />
                      :                           
                      imageFront3.preview ? (
                        <img src={imageFront3.preview} alt="dummy" width="100%" height="100%" />
                      ) :
                        (<div className="Neon-input-dragDrop">
                          <div className="Neon-input-inner">
                            <div className="Neon-input-icon">
                            <i className="fa fa-file-image-o"></i>
                            </div>
                            <div className="Neon-input-text"></div>
                            <a className="Neon-input-choose-btn blue">
                            <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                            </a>
                            </div>
                          </div>
                        )}
                    </div>
                  </Card>
                </Grid>

              {/* <Grid item xs={12} sm={12} sx={{marginLeft: '0rem' }}>
               <Grid item xs={12} sm={5}>
                  <div className="Neon Neon-theme-dragdropbox">
                    Business Registration Document
                    <input 
                      style={{
                      zIndex: '999', 
                      opacity: '0', 
                      background: 'silver',
                     }} 
                      name="files[]" 
                      id="filer_input2" 
                      type="file" 
                      onChange={handleChangeImageFront1}
                    />
                    { 
                      businessRegistrationDcoument ?
                      <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${businessRegistrationDcoument}`} alt="proofoftrading" width="100%" height="100%" />
                    :                           
                    imageFront1.preview ? (
                      <img src={imageFront1.preview} alt="dummy" width="100%" height="100%" />
                    ) :
                    (<div className="Neon-input-dragDrop">
                       <div className="Neon-input-inner">
                        <div className="Neon-input-icon">
                         <i className="fa fa-file-image-o"></i>
                        </div>
                        <div className="Neon-input-text"></div>
                        <a className="Neon-input-choose-btn blue">
                         <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                        </a>
                        </div>
                      </div>
                    )}
                  </div>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className="Neon Neon-theme-dragdropbox">
                  Proof of Trading Address
                  <input 
                    style={{
                    zIndex: '999', 
                    opacity: '0', 
                    background: 'silver',
                    
                    height: '30vh', 
                    position: 'absolute', 
                    right: '0px; left: 0px', 
                    marginRight: 'auto', 
                    marginLeft: 'auto'}} 
                    name="files[]" 
                    id="filer_input2" 
                    type="file" 
                    onChange={handleChangeImageFront2}
                  />

                    { 
                      proofoftradingAddress ?
                      <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${proofoftradingAddress}`} alt="proofoftrading" width="100%" height="100%" />
                    :       
                   
                    imageFront2.preview ? (
                      <img src={imageFront2.preview} alt="dummy" width="100%" height="100%" />
                    ) :
                    (
                      <div className="Neon-input-dragDrop">
                       <div className="Neon-input-inner">
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
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className="Neon Neon-theme-dragdropbox">
                  Tax ID/TIN
                  <input 
                    style={{
                    zIndex: '999', 
                    opacity: '0', 
                    background: 'silver',
                   
                    height: '30vh', 
                    position: 'absolute', 
                    right: '0px; left: 0px', 
                    marginRight: 'auto', 
                    marginLeft: 'auto'}} 
                    name="files[]" 
                    id="filer_input2" 
                    type="file" 
                    onChange={handleChangeImageFront3}
                  />
                    { 
                      TaxIDDocument ?
                      <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/company/${TaxIDDocument}`} alt="TaxIDDocument" width="100%" height="100%" />
                    :       
                    imageFront3.preview ? (
                      <img src={imageFront3.preview} alt="dummy" width="100%" height="100%" />
                    ) :
                    (<div className="Neon-input-dragDrop">
                       <div className="Neon-input-inner">
                        <div className="Neon-input-icon">
                          <i className="fa fa-file-image-o"></i>
                        </div>
                        <div className="Neon-input-text">
                        </div>
                        <a className="Neon-input-choose-btn blue">
                          <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                        </a>
                        </div>
                      </div>
                    )}
                 </div>
              </Grid>
              </Grid> */}
               <Grid item xs={12}>
                <ColorButton color="primary" onClick={(e) => HandleCreateMemberAccount(e)}>
                  <DoneOutlineOutlinedIcon sx={{ mr: 1 , marginTop: '10px' }} />
                   UPDATE
                </ColorButton>
               </Grid>
           </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
