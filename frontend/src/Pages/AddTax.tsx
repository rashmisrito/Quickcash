
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Colorbtn } from '../Component/Button/ColorButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material';
import useValidation from '../Hooks/useValidation';

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

export default function AddTax() {
  const { errors, validate } = useValidation();
  const [theme]:any = useOutletContext();
  const navigate = useNavigate();
  const [name,setName] = React.useState<any>('');
  const [taxValue,setTaxValue] = React.useState<any>('');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [value, setValue] = React.useState('yes');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
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

  const HandleCreateTax = async (e:any) => {
    e.preventDefault();
    if(!validate('name',name && !validate('value',taxValue ))){
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/tax/add`, {
      user: decoded?.data?.id,
      name: name,
      value: taxValue,
      isDefault: value
     }, 
     {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/settings');
      }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error.response.data.message,"error");
     })
    }else{
      if(validate('name',name)){
        const result = validate('name',name);
      }
      if(validate('value', taxValue)){
        const result = validate('value',taxValue);
      }
    }
  }
  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , marginTop: '10px', borderRadius: '.5rem', p: '10px', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}` , sm:`${theme ? '1px solid white' : 'white'}` } , width: {xs: '100%', lg: '80%'} }}> 
         <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography><KeyboardBackspaceIcon sx={{cursor: 'pointer', color: `${theme ? 'white' : 'black'}`, marginBottom: '10px'}} onClick={() => navigate('/settings')} /></Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <label>Name</label>
              <TextField
                required
                id="name"
                name="name"
                fullWidth
                sx={{ border: `${theme ? '1px solid white' : '1px solid black'}` }}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <label>Tax Rate</label>
              <TextField
                required
                id="value"
                name="value"
                type="number"
                fullWidth
                sx={{ border: `${theme ? '1px solid white' : '1px solid black'}` }}
                onChange={(e) => setTaxValue(e.target.value)}
                onBlur={handleBlur}
                error={!!errors.value}
                helperText={errors.value}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} sx={{ marginLeft: '24px', marginTop: '12px',background: `${theme ? 'white': ''}`, color: 'black' }}>
              <label>Default:</label>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
               >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no"  control={<Radio />} label="No" />
               </RadioGroup>
               </Grid>             
               <Grid item xs={12}>
                <Colorbtn color="primary" onClick={(e) => HandleCreateTax(e)}>
                  <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                   Submit
                </Colorbtn>
               </Grid>
           </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
