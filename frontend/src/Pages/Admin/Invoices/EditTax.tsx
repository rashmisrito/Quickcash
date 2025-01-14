import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material';

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

export default function EditTax() {

  const params = useParams();
  const navigate = useNavigate();
  const [name,setName] = React.useState<any>('');
  const [taxValue,setTaxValue] = React.useState<any>('');
  const [value,setValue] = React.useState('yes');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
   getDetailsById(params?.id);
  },[params?.id]);

  const getDetailsById = async (val:any) => {
    await axios.get(`/${url}/v1/admin/tax/${val}`, 
     {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setName(result.data.data[0].Name);
        setValue(result.data.data[0].IsDefault);
        setTaxValue(result.data.data[0].taxvalue);
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

   const HandleCreateTax = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.patch(`/${url}/v1/admin/tax/update/${params?.id}`, {
      user: decoded?.data?.id,
      name: name,
      value: taxValue,
      isDefault: value
     }, 
     {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
     })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/admin/invoices/taxes');
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
   }

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%',md: '7%'}, background: 'white' , width: {xs: '100%', lg: '80%'} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
         <Typography><KeyboardBackspaceIcon sx={{cursor: 'pointer', marginBottom: '10px'}} onClick={() => navigate('/admin/invoices/taxes')} /></Typography>
           <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <label>Name</label>
                <TextField
                  required
                  id="name"
                  name="name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{border:'1px solid silver'}}
                  inputProps={{
                   shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <label>Tax Value</label>
                <TextField
                  required
                  id="value"
                  name="value"
                  type="number"
                  fullWidth
                  value={taxValue}
                  onChange={(e) => setTaxValue(e.target.value)}
                  sx={{border:'1px solid silver'}}
                  inputProps={{
                   shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
               <label>Default:</label>
               <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
               >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
               </RadioGroup>
               </Grid>             
               <Grid item xs={12}>
                <ColorButton color="primary" onClick={(e) => HandleCreateTax(e)}>
                  <DoneOutlineOutlinedIcon sx={{ mr: 1 }} />
                  Submit
                </ColorButton>
               </Grid>
           </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
