import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import ReactFlagsSelect from "react-flags-select";
import { useOutletContext } from 'react-router-dom';
import { Colorbtn } from '../Component/Button/ColorButton';
import { FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

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

export default function AddBeneficiary() {

  const [theme]:any = useOutletContext();
  const [name,setName] = React.useState<any>('');
  const [iban,setIban] = React.useState<any>('');
  const [email,setEmail] = React.useState<any>('');
  const [mobile,setMobile] = React.useState<any>('');
  const [country,setCountry] = React.useState<any>();
  const [currency,setCurrency] = React.useState<any>();
  const [bicCode,setBicCode] = React.useState<any>('');
  const [address,setAddress] = React.useState<any>('');
  const [bankName,setBankName] = React.useState<any>('');
  const [currencyList,setCurrencyList] = React.useState<any>([]);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const HandleCountryCurrency = (code:any) => {
    setCountry(code);
  }

  useEffect(() => {
    getListCurrencyData();
  },[]);

  const getListCurrencyData = async() => {
    await axios.get(`/${url}/v1/currency/currency-list`)
    .then(result => {
      if(result.data.status == "201") {
        setCurrencyList(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
  }

  const HandleSaveIndividualData = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/receipient/add`, {
      "name": name,
      "rtype": "Individual",
      "user":  accountId?.data?.id,
      "iban": iban,
      "bic_code": bicCode,
      "country": country,
      "currency": currency,
      "amount": 0,
      "mobile": mobile,
      "email": email,
      "address": address,
      "bankName": bankName,
      "status": true
     }, 
     {
      headers: 
      {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
     if(result.data.status == "201") {
       setName('');setCountry('');
       setIban('');setCurrency('');
       setMobile('');setAddress('');
       setEmail('');setBankName(''); 
       alertnotify(result.data.message,"success");
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
      position: "top-left",
      autoClose: 7000,
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
      autoClose: 7000,
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
      <Grid sx={{marginLeft: '12px', marginBottom: '20px'}}>
        <Typography variant='h4' sx={{ color: {xs: `${theme ? '#183153' : 'white'}`, sm:`${theme ? 'white' : 'black'}`} }}>Beneficiary</Typography>
      </Grid>
      <Grid item xs={12} md={7} sx={{marginLeft: '10px', background: {xs: `${theme ? '#183153' : 'white'}`, sm:`${theme ? '' : 'white'}`}, boxShadow: '1px 1px 10px silver', borderRadius: '7px'}}>
        <Grid sx={{display: 'flex',flexDirection: 'column', justifyContent: 'normal'}}>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12} md={6}>
              <label htmlFor="Full Name">Full Name</label>
              <TextField fullWidth placeholder='Full Name' sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label htmlFor="Email">Email</label>
              <TextField fullWidth placeholder='Email Address' sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label htmlFor="Mobile">Mobile</label>
              {/* @ts-ignore */}
              <TextField type="number" pattern="[0-9]*" sx={{ border: `${theme ? '1px solid silver' : ''}` }} inputmode="numeric" fullWidth placeholder='Mobile' value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
               <label htmlFor="Bank Name">Bank Name</label>
               <TextField fullWidth placeholder='Bank Name' sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label htmlFor="IBAN / AC">IBAN / AC</label>
              <TextField fullWidth placeholder='IBAN / AC' sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={iban} onChange={(e) => setIban(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label htmlFor="Routing/IFSC/BIC/SwiftCode">Routing/IFSC/BIC/SwiftCode</label>
              <TextField fullWidth placeholder='Routing/IFSC/BIC/SwiftCode' sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={bicCode} onChange={(e) => setBicCode(e.target.value)}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Country</label>
              <FormControl sx={{ border: `${theme ? '1px solid white': ''}`,color: `${theme ? 'black': 'black'}` }} fullWidth>
                <ReactFlagsSelect
                  selected={country}
                  onSelect={(code) => HandleCountryCurrency(code)}
                  className={`${theme ? 'menu-flags t' : 'menu-flags f'}`}
                  searchable
                  showOptionLabel={true}
                  showSelectedLabel={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Currency</label>
              <Select onChange={(e) => setCurrency(e.target.value)} sx={{ color: `${theme ? 'white' : 'black'}` }} fullWidth>
                {
                  currencyList?.map((item:any,index:number) => (
                    <MenuItem value={item?.CurrencyCode} key={index} sx={{ color: `${theme ? 'white' : 'black'}` }}>{item?.CurrencyName}</MenuItem>
                  ))
                }
              </Select>
            </Grid>
            <Grid item xs={12} md={12}>
              <label htmlFor="Address Line 1">Recipient Address</label>
              <TextField fullWidth multiline={true} rows={5} sx={{ border: `${theme ? '1px solid silver' : ''}` }} value={address} placeholder='Recipient Address' onChange={(e) => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={12}>
              <Colorbtn sx={{marginBottom: '12px'}} onClick={() => HandleSaveIndividualData()}>Submit</Colorbtn>
            </Grid>
          </Grid>
         </Grid>
       </Grid>
    </>
  )
}
