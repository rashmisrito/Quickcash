
import axios from 'axios';
import * as React from 'react';
import Card from '@mui/material/Card';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ReactFlagsSelect from "react-flags-select";
import { purple, red } from '@mui/material/colors';
import { useOutletContext } from "react-router-dom";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Button, { ButtonProps } from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar, Box, CardHeader, FormControl, Grid } from '@mui/material';

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

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#2196f3",
   '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

export default function Settings() {

  const [theme]:any = useOutletContext();
  const [city,setCity] = React.useState<any>(); 
  const [state,setState] = React.useState<any>();
  const [mobile,setMobile] = React.useState<any>();
  const [prefix,setPrefix] = React.useState<any>();
  const [zipcode,setZipCode] = React.useState<any>(); 
  const [address,setAddress] = React.useState<any>(); 
  const [logoImg,setLogoImg] = React.useState<any>();
  const [userID,setUserID] = React.useState<any>('');
  const [country,setCountry] =  React.useState<any>('');
  const [regardsText,setRegardsText] = React.useState<any>(); 
  const [company_name,setCompanyName] = React.useState<any>(); 
  const [invoicesetting_id,setInvoiceSettingID] = React.useState<any>('');
  const [imageFront2, setImageFront2] = React.useState({ preview: "", raw: "" });
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  React.useEffect(() => {
   const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
   setUserID(accountId?.data?.id);
   getInvoiceDetails(accountId?.data?.id);
  },[]);

  const getInvoiceDetails = async (val:any) => {
    await axios.get(`/${url}/v1/admin/invoicesetting/list/${val}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setCompanyName(result.data.data[0].company_name);
        setMobile(result.data.data[0].mobile);
        setCountry(result.data.data[0].invoice_country);
        setState(result.data.data[0].state);
        setLogoImg(result.data.data[0].logo);
        setCity(result.data.data[0].city);
        setZipCode(result.data.data[0].zipcode);
        setAddress(result.data.data[0].address);
        setPrefix(result.data.data[0].prefix);
        setInvoiceSettingID(result.data.data[0]._id);
        setRegardsText(result.data.data[0].regardstext);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
  }

  const handleChangeImageFront2 = (e:any) => {
    if (e.target.files.length) {
      setLogoImg('');
      setImageFront2({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const HandleCountryCurrency = (code:any) => {
    setCountry(code);
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

  const HandleUpdateInvoiceSettings = async (e:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    e.preventDefault();
    await axios.post(`/${url}/v1/admin/invoicesetting/add`, {
      "user": accountId?.data?.id,
      "invoice_country": country,
      "company_name": company_name,
      "mobile": mobile,
      "state": state,
      "city": city,
      "zipcode": zipcode,
      "address": address,
      "logo": imageFront2?.raw,
      "prefix": prefix,
      "regardstext": regardsText
     }, 
     {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
        'Content-Type':  'multipart/form-data'
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

  const HandleUpdateSaveInvoiceSettings = async (val:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.patch(`/${url}/v1/admin/invoicesetting/update/${val}`, {
      "user": accountId?.data?.id,
      "invoice_country": country,
      "company_name": company_name,
      "mobile": mobile,
      "state": state,
      "city": city,
      "zipcode": zipcode,
      "address": address,
      "logo": imageFront2?.raw,
      "prefix": prefix,
      "regardstext": regardsText
     }, 
     {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
       'Content-Type':  'multipart/form-data'
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
  
  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '90%'}}}>
        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
          <Grid className={theme ? 'profiledarkbg' : 'profileLightbg'} sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
            <Box sx={{ overflow: "auto" }}>
             <Box sx={{ display: 'flex', margin: '20px' }}> 
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} sx={{marginTop: '12px' , marginBottom: '12px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  General Settings
                  <hr />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Company Name</label>
                  <TextField
                    required
                    id="outlined-required"
                    sx={{width: '95%'}}
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Phone / Mobile</label>
                  <TextField
                    required
                    id="outlined-required"
                    value={mobile}
                    sx={{width: '95%',marginTop: '10px'}}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                <FormControl style={{width: '95%',marginTop: '10px'}}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Country</label>
                  <ReactFlagsSelect
                    selected={country}
                    onSelect={(code) => HandleCountryCurrency(code)}
                    className='menu-flags'
                    searchable
                    showOptionLabel={true}
                    showSelectedLabel={true}
                  />
                </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>State</label>
                  <TextField
                    required
                    id="outlined-required"
                    value={state}
                    sx={{width: '95%',marginTop: '10px'}}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>City</label>
                  <TextField
                    required
                    id="outlined-required"
                    value={city}
                    sx={{width: '95%',marginTop: '10px'}}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Zip Code</label>
                  <TextField
                    required
                    id="outlined-required"
                    value={zipcode}
                    sx={{width: '95%',marginTop: '10px'}}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6} sx={{marginTop: '10px'}}>
                  <label htmlFor="companyAddress" className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Company Address:</label>
                  <textarea
                    required
                    id="appname"
                    name="appname"
                    cols={30}
                    rows={18}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{border:'1px solid silver', borderRadius: '9px' , marginTop: '10px', width: '100%'}}
                  />
                </Grid>
                <Grid xs={12} sm={6} sx={{marginTop: '10px'}}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Company Logo:</label>
                  <Card sx={{ marginBottom: '10px',maxWidth: 345, marginLeft: '10px' , background: 'white' }}>
                    <CardHeader avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">CL</Avatar>} title="Company Logo" />
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
                      logoImg ?
                      <>
                       <img crossOrigin="anonymous" className='image' src={`${import.meta.env.VITE_PUBLIC_URL}/setting/${userID}/${logoImg}`} alt="proofoftrading" width="100%" height="100%" />
                       <div className="overlay">
                        <div className="text">Click here to change logo</div>
                       </div>
                      </>
                      :        
                      imageFront2.preview ? (
                       <img src={imageFront2.preview} alt="dummy" width="100%" height="100%" />
                      ) :
                        (<div className="Neon-input-dragDrop" style={{marginLeft: '10px'}}>
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
                <Grid xs={12} sm={12} sx={{marginTop: '12px' , marginBottom: '12px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>
                  Invoice Settings
                  <hr />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Invoice No Prefix</label>
                  <TextField
                    required
                    id="outlined-required"
                    sx={{width: '95%'}}
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Regards Text</label>
                  <TextField
                    required
                    id="outlined-required"
                    sx={{width: '95%'}}
                    value={regardsText}
                    onChange={(e) => setRegardsText(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={12} sx={{marginTop: '10px'}}>
                {
                  invoicesetting_id ?
                  <ColorButton onClick={() => HandleUpdateSaveInvoiceSettings(invoicesetting_id)}>Update</ColorButton>
                  :
                  <ColorButton onClick={(e) => HandleUpdateInvoiceSettings(e)}>Save</ColorButton>
                }                  
                </Grid>
               </Grid>
             </Box>
            </Box>
           </Grid>
         </Grid>
      </Box>
    </>
  )
}
