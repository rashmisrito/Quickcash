import axios from 'axios';
import { toast } from 'react-toastify';
import curr from 'iso-country-currency';
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import ReactFlagsSelect from "react-flags-select";
import { useOutletContext } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { Colorbtn } from '../Component/Button/ColorButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, FormControl, Grid, MenuItem, Select, Toolbar, Typography } from '@mui/material';

export default function EditReceipient() {
  
  const params = useParams();
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();

  const [userId,setUserId] = React.useState();
  const [country, setCountry] = React.useState('');
  const [name,setName] = React.useState<any>();
  const [mobile,setMobile] = React.useState<any>();
  const [email,setEmail] = React.useState<any>();
  const [iban,setIban] = React.useState<any>();
  const [biCode,setBiCode] = React.useState<any>();
  const [status,setStatus] = React.useState<any>();
  const [address,setAddress] = React.useState<any>();
  const [type,setType] = React.useState<any>('');

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    getReceipientDetails(params?.id);
  },[params.id]);

  const getReceipientDetails = async(id:any) => {
    await axios.get(`/${url}/v1/receipient/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setName(result.data.data.name);
        setMobile(result.data.data.mobile);
        setEmail(result.data.data.email);
        setIban(result.data.data.iban);
        setBiCode(result.data.data.bic_code);
        setStatus(result.data.data.status);
        setAddress(result.data.data.address);
        setCountry(result.data.data.country);
        setUserId(result.data.data._id);
        setType(result.data.data.rtype);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const alertnotify = (text:string,type:string) => {
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

  const HandleEditAccount = async (id:any) => {
    const currencyDat = curr.getAllInfoByISO(country);
    await axios.patch(`/${url}/v1/receipient/update`, {
      "name": name,
      "user_id": id,
      "iban": iban,
      "bic_code": biCode,
      "country": country,
      "currency": currencyDat?.currency,
      "status": status,
      "amount": 0,
      "mobile":mobile,
      "email": email,
      "address": address,
      "type": type
     }, {
          headers: {
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

  return (
          <>
            <Box sx={{ marginTop: '0%', borderRadius: '.5rem', marginLeft: {md: '7%'}, width: {xs: '100%', md: '87%'} }}>
              <KeyboardBackspaceIcon 
                onClick = {() => navigate('/send')} 
                className={`${theme ? 'avatarDark' : 'avatarLight'}`}
                sx={{cursor: 'pointer'}} 
              />
            </Box>
            <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {md: '7%'}, background: 'white' , width: {lg: '80%'} }}>
              <Box sx={{ marginTop: '0%', borderRadius: '.5rem', width: {xs: '100%', md: '87%'} }}>
                <Typography variant="h6" gutterBottom>
                  Edit Receipient
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                  <label>Name</label> 
                  <TextField
                    required
                    id="name"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
                  />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <label>Type</label> 
                  <Select fullWidth value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                  </Select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Mobile</label> 
                    <TextField
                      required
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      fullWidth
                      sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Email</label> 
                    <TextField
                      required
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>IBAN / Account Number</label> 
                    <TextField
                      required
                      id="outlined-required"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      fullWidth
                      sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>BIC Code / IFSC Code</label> 
                    <TextField
                      required
                      id="bic"
                      value={biCode}
                      onChange={(e) => setBiCode(e.target.value)}
                      fullWidth
                      sx={{border: '1px solid silver' , borderRadius: '.5rem'}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <ReactFlagsSelect
                        selected={country}
                        onSelect={code => setCountry(code)}
                        className='menu-flags'
                        searchable
                        showOptionLabel={true}
                        showSelectedLabel={true}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                      <label id="demo-multiple-name-label">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{cursor: 'pointer', height: '50px', border: '2px solid silver', borderRadius: '10px'}}>
                        <option value="">Select Status</option>
                        <option value="true">Active</option>
                        <option value="false">In-Active</option>
                      </select>
                  </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <label>Address</label> 
                    <TextField
                      id="address2"
                      name="address2"
                      fullWidth
                      minRows="5"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="shipping address-line2"
                      sx={{border: '1px solid silver',borderRadius: '.5rem'}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Colorbtn color="primary" onClick={() => HandleEditAccount(userId)}>
                      <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                        Update
                    </Colorbtn>
                  </Grid>
                </Grid>
              </Box>
            </Toolbar>
          </>
        )
}

