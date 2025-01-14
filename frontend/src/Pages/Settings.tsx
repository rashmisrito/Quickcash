import axios from 'axios';
import Taxes from './Taxes';
import * as React from 'react';
import Card from '@mui/material/Card';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import PaymentQrCode from './PaymentQrCode';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import 'react-phone-input-2/lib/material.css';
import { EditSharp } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import ReactFlagsSelect from "react-flags-select";
import useValidation from '../Hooks/useValidation';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Colorbtn } from '../Component/Button/ColorButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLocation, useOutletContext } from "react-router-dom";
import { Box, FormControl, Grid,FormHelperText, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

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

export default function Settings() {
  
  const params = useLocation();
  const [theme]:any = useOutletContext();
  const { errors, validate } = useValidation();
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
  const [phoneValidateData,setphoneValidateData] = React.useState({});
  const [invoicesetting_id,setInvoiceSettingID] = React.useState<any>('');
  const [imageFront2, setImageFront2] = React.useState({ preview: "", raw: "" });

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  React.useEffect(() => {
   const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
   setUserID(accountId?.data?.id);
   getInvoiceDetails(accountId?.data?.id);
  },[]);

  React.useEffect(() => {
    if(params?.search) {
      console.log("Search",params?.search.replace("?filter=",""));
      setAlignment(params?.search.replace("?filter=",""));
    }
  },[params?.search]);

  const getInvoiceDetails = async (val:any) => {
    await axios.get(`/${url}/v1/invoicesetting/list/${val}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setCompanyName(result?.data?.data[0]?.company_name);
        setMobile("+"+result?.data?.data[0]?.mobile);
        setCountry(result?.data?.data[0]?.invoice_country);
        setState(result?.data?.data[0]?.state);
        setLogoImg(result?.data?.data[0]?.logo);
        setCity(result?.data?.data[0]?.city);
        setZipCode(result?.data?.data[0]?.zipcode);
        setAddress(result?.data?.data[0]?.address);
        setPrefix(result?.data?.data[0]?.prefix);
        setInvoiceSettingID(result?.data?.data[0]?._id);
        setRegardsText(result?.data?.data[0]?.regardstext);
        setphoneValidateData("+"+result?.data?.data[0]?.mobile);
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error?.response?.data?.message,"error");
    })
  }

  const handleChangeImageFront2 = (e:any) => {
    if (e.target.files.length) {
      setLogoImg('');
      setImageFront2({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      handleImageChange(e);
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
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    e.preventDefault();
    const flag = false;
    if(!validate('country',country) && !validate('name',company_name) && !validate('state',state) && !validate('city', city) && !validate('pincode', zipcode) && logoImg != undefined && !validate('prefix',prefix) && !validate('regardsText',regardsText)&& !validate('phone',phoneValidateData) ){
    await axios.post(`/${url}/v1/invoicesetting/add`, {
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
  } else {
    if(validate('country',country)) {
      const result = validate('country',country);
    }
    if(validate('phone', phoneValidateData)) {
      const result = validate('phone', phoneValidateData);
    }
    if(validate('name',company_name)) {
      const result = validate('name',company_name);
    }
    if(validate('state',state)) {
      const result = validate('state',state);
    }
    if(validate('city',city)) {
      const result = validate('city',city);
    }
    if(validate('pincode',zipcode)) {
      const result = validate('pincode',zipcode);
    }
    if(validate('files[]',imageFront2?.raw)) {
      const result = validate('files[]',imageFront2?.raw);
    }
    if(validate('prefix',prefix)) {
      const result = validate('prefix',prefix);
    }
    if(validate('regardsText',regardsText)) {
      const result = validate('regardsText',regardsText);
    }
   }
  }

  const HandleUpdateSaveInvoiceSettings = async (val:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    if(!validate('country',country) && !validate('name',company_name) && !validate('state',state) && !validate('city', city) && !validate('pincode', zipcode) && logoImg != undefined && !validate('prefix',prefix) && !validate('regardsText',regardsText) && !validate('phone',phoneValidateData)) {
      await axios.patch(`/${url}/v1/invoicesetting/update/${val}`, {
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
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
  } else {
    if(validate('country',country)) {
      const result = validate('country',country);
    }
    if(validate('phone', phoneValidateData)) {
      const result = validate('phone', phoneValidateData);
    }
    if(validate('name',company_name)) {
      const result = validate('name',company_name);
    }
    if(validate('state',state)) {
      const result = validate('state',state);
    }
    if(validate('city',city)) {
      const result = validate('city',city);
    }
    if(validate('pincode',zipcode)) {
      const result = validate('pincode',zipcode);
    }
    if(validate('files[]',imageFront2?.raw)){
      const result = validate('files[]',imageFront2.raw);
    }
    if(validate('prefix',prefix)) {
      const result = validate('prefix',prefix);
    }
    if(validate('regardsText',regardsText)) {
      const result = validate('regardsText',regardsText);
    }
  }
}

  const handlePhoneChange = (value:any, country:any, e:any, formattedValue:any) => {
    const {name} = e.target;
    setMobile(value);
    const data = {valueLength:formattedValue.length, countryLength:country.format.length};
    setphoneValidateData(data);
  };

  const handlePhoneBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, phoneValidateData);
    console.log(returnValue);
  };

  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  const handleImageChange = (e:any) => {
    if(!validate('files[]',e.target.files[0])) {
      const {name, files} = e.target;
      const returnValue = validate(name, files[0]);
    } else {
      /**@ts-ignore**/
      setLogoImg();
    }
  }

  const [alignment, setAlignment] = React.useState('General Setting');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    /**@ts-ignore**/
    newAlignment: string,
  ) => {
    /**@ts-ignore**/
    setAlignment(event.target.value);
  };
  
  return (
    <>
      <Box sx={{ marginTop: '1px',fontSize: '15px' }}>
        {/* @ts-ignore */}
        <Typography variant='h5' sx={{ color: {xs: `${theme ? 'white' : 'black'}` , sm:`${theme ? 'white' : 'black'}` } }}>{alignment?.replaceAll("_", " ")?.toUpperCase()}</Typography>
        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
          <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}` , sm:`${theme ? '1px solid white' : 'white'}` } , padding: '10px 12px'}}>
            <Box sx={{ overflow: "auto" }}>
             <Box sx={{ display: 'flex', flexWrap:'wrap', margin: '20px' }}> 
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} sx={{ marginTop: '12px',marginBottom: '12px' }}>
                  <ToggleButtonGroup
                    color="secondary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    sx={{ color: 'white', background: `${theme ? '#2196f3' : '#2196f3'}` }}
                  >
                    <ToggleButton value="General Setting">General Setting</ToggleButton>
                    <ToggleButton value="Tax">Tax</ToggleButton>
                    <ToggleButton value="Payment_Qr_Code">Payment QR Code</ToggleButton>
                  </ToggleButtonGroup>
                  <hr />
                </Grid>
                {
                  alignment == "General Setting" ?
                  <>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                      <label>Company Name</label>
                      <TextField
                        required
                        name='name'
                        id="outlined-required"
                        sx={{width: '95%', marginBottom: '12px', border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        value={company_name}
                        onBlur={handleBlur}
                        error={!!errors.name}
                        helperText={errors.name}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                    <div>
                      <label>Phone Number</label>
                      <FormControl error={Boolean(errors.phone)} fullWidth>
                      <Box
                        sx={{
                          position: 'relative',
                          border: `1px solid ${errors.phone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'}`,
                          borderRadius: '4px',
                          mb: 1,
                          '&:hover': {
                            borderColor: `${errors.phone ? '#d32f2f' : '#183153'}`, // Change border color on hover,
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
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          inputStyle={{ width:"100%", color: `${theme ? 'white' : 'black'}`, border: `${theme ? '1px solid white' : ''}`,boxShadow: 'none', background: `${theme ? '#183153' : 'white'}` }}
                        />
                        </Box>
                        {errors.phone &&
                        (<FormHelperText error>
                          {errors.phone}
                        </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                    <FormControl style={{width: '95%',marginTop: '10px'}}>
                      <label>Country</label>
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
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                      <label>State</label>
                      <TextField
                        name='state'
                        required
                        id="outlined-required"
                        InputLabelProps={{
                         shrink: true,
                        }}
                        value={state}
                        onBlur={handleBlur}
                        error={!!errors.state}
                        helperText={errors.state}
                        sx={{width: '95%',marginTop: '10px',border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                      <label>City</label>
                      <TextField
                        required
                        name='city'
                        id="outlined-required"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={city}
                        onBlur={handleBlur}
                        error={!!errors.city}
                        helperText={errors.city}
                        sx={{width: '95%',marginTop: '10px',border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white' : 'black'}` }}>
                      <label>Zip Code</label>
                      <TextField
                        name='pincode'
                        required
                        id="outlined-required"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={zipcode}
                        onBlur={handleBlur}
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                        sx={{width: '95%',marginTop: '10px',border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{marginTop: '10px',color: `${theme ? 'white' : 'black'}`}}>
                      <label htmlFor="companyAddress">Company Address:</label>
                      <FormControl
                        style={{ width: '100%', marginTop: '10px' }}
                        error={!!errors.address}
                      >
                      <textarea
                        required
                        id="appname"
                        name="address"
                        cols={30}
                        rows={16}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={handleBlur}
                        style={{
                          border: `1px solid ${errors.address ? '#d32f2f' : 'silver'}`,
                          borderRadius: '9px',
                          marginTop: '10px',
                          width: '100%',
                          padding: '10px',
                          resize: 'vertical',
                          color: `${theme ? 'white' : 'black'}`,
                          background: `${theme ? '#183153' : 'white'}`
                        }}
                      />
                        {errors.address && (
                          <FormHelperText style={{ color: '#f44336' }}>{errors?.address}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{marginTop: '10px',color: `${theme ? 'white' : 'black'}`}}>
                      <label>Company Logo:</label>
                      <Card sx={{ marginBottom: '10px',maxWidth: 345, marginTop: '0%', marginLeft: '10px' , background: `${theme ? '' : 'white'}` }}>
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
                          <FormControl fullWidth error={!!errors['files[]']}>
                            {errors['files[]'] && <FormHelperText>{errors['files[]']}</FormHelperText>}
                          </FormControl>
                          { 
                          logoImg ?
                          <>
                            <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/setting/${userID}/${logoImg}`} alt="logo" width="100%" height="210px" />
                            <Grid sx={{display: 'flex', justifyContent: 'space-between', color: `${theme ? 'white': 'black'}`, padding: '10px 20px'}}>
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
                          imageFront2.preview ? (
                          <img src={imageFront2.preview} alt="dummy" width="100%" height="100%" />
                          ) 
                          :
                          (
                            <div className="Neon-input-dragDrop" style={{marginLeft: '10px'}}>
                              <div className="Neon-input-inner" style={{marginTop: '-200px'}}>
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
                    <Grid xs={12} sm={12} sx={{marginTop: '12px' , marginBottom: '12px', color: `${theme ? 'white': 'black'}`}}>
                      Invoice Settings
                      <hr />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white': 'black'}` }}>
                      <label>Invoice Prefix</label>
                      <TextField
                        required
                        name='prefix'
                        id="outlined-required"
                        sx={{width: '95%' , border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        onBlur={handleBlur}
                        error={!!errors.prefix}
                        helperText={errors.prefix}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ color: `${theme ? 'white': 'black'}` }}>
                      <label>Regards Text</label>
                      <TextField
                        required
                        name='regardsText'
                        id="outlined-required"
                        sx={{width: '95%' , border: `${theme ? '1px solid silver': '1px solid transparent'}`}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={regardsText}
                        onChange={(e) => setRegardsText(e.target.value)}
                        onBlur={handleBlur}
                        error={!!errors.regardsText}
                        helperText={errors.regardsText}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} sx={{marginTop: '10px'}}>
                    {
                      invoicesetting_id ?
                      <Colorbtn onClick={() => HandleUpdateSaveInvoiceSettings(invoicesetting_id)}>Update</Colorbtn>
                      :
                      <Colorbtn onClick={(e) => HandleUpdateInvoiceSettings(e)}>Save</Colorbtn>
                    }                  
                </Grid>
                  </>
                  :
                  null
                }

                {
                  alignment == "Tax" ?
                  <Taxes />
                  :
                  null
                }

                {
                  alignment == "Payment_Qr_Code" ?
                  <PaymentQrCode />
                  :
                  null
                }

              </Grid>
             </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
