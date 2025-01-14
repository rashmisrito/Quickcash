import axios from 'axios';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import curr from 'iso-country-currency';
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ReactFlagsSelect from "react-flags-select";
import useValidation from '../Hooks/useValidation';
import FormControl from '@mui/material/FormControl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props:any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to="/" style={{textDecoration: 'none'}}>
        Quick Cash
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {

  const query = useLocation();
  const { errors, validate } = useValidation();
  const [country, setCountry] = React.useState('');
  const [ipAddress,setIPAddress] = React.useState<any>('');

  const HandleCountryCurrency = (code:any) => {
    setCountry(code);
  }
  
  const getIpAddress = async() => {
    await axios.get(`https://api.ipify.org/?format=json`).then(res => setIPAddress(res?.data?.ip));
  }

  useEffect(() => {
    getIpAddress();
  },[]);

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

  const navigate = useNavigate();
  const [name,setName] = React.useState<any>();
  const [email,setEmail] = React.useState<any>();
  const [password,setPassword] = React.useState<any>();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const HandleCreateAccount = async (e:any) => {
    // if (validateEmail(email) && validatePassword(password).isValid) {
    if(!validate("email", email) && !validate("password", password)){ // returns error if not valid.
    const currencyDat = curr.getAllInfoByISO(country);
    e.preventDefault();
    await axios.post(`/${url}/v1/user/register`, {
      "name": name,
      "email":  email,
      "password": password,
      "country": country,
      "currency": currencyDat?.currency,
      "referalCode": query?.search ? query?.search.replace("?code=","") : ""
     }, 
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
     })
     .then(result => {
        if(result.data.status == "201") {
          addLoginSession(result.data.data._id);
          setTimeout(() => {
            alertnotify(result.data.message,"success");
            localStorage.setItem("token",result.data.token);
            navigate('/home');
          },100);
        }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error.response.data.message,"error");
     })
    } else {
      if(validate("email", email)){
        //alertnotify(errors.email, "error");
      }
      if(validate("password", password)){
        //alertnotify(errors.password, "error");
      }
    }
  }

  const addLoginSession = async (val:any) => {
    await axios.post(`/${url}/v1/session/add`, {
      user:val ,
      device:navigator?.userAgentData?.brands?.[0]?.brand,
      OS:navigator?.userAgentData?.platform,
      ipAddress: ipAddress,
      status: 1,
      isActiveNow:1
    })
    .then((result => {
      if(result.data.status == 201) {
        localStorage.setItem('usersessionid',result.data.data._id);
      }
    }))
      .catch(error => {
      //alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
    })
  }
  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container sx={{alignItems: '',height: '100vh' }}>
      <Grid item sm={7} md={8} sx={{display: { xs: 'none', sm: 'block' }}}>
        <img src={`${import.meta.env.VITE_APP_URL}/registerbg.png`} width="90%" height="690px" style={{overflow: 'hidden'}} />
      </Grid>
      <Grid item xs={12} sm={5} md={4}  className='background-imagedd' sx={{padding: '12px', backgroundImage: {xs: `url(${import.meta.env.VITE_APP_URL}/registerbg.png)`, sm: `url(${import.meta.env.VITE_APP_URL}/kl.png)`} , backgroundRepeat: 'no-repeat', height: '100vh',backgroundSize: 'cover'}} component={Paper} elevation={3} square>
        <Grid sx={{display: 'flex', flexDirection: 'column', padding: '12px',backdropFilter: 'blur(3px)', marginTop: {md: '120px'}}}>
          <Grid sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {/* <Grid sx={{display: {xs:'flex', sm: 'none'}, justifyContent: 'center'}}><img src={`${import.meta.env.VITE_APP_URL}/bank.png`} width="120px" /></Grid> */}
            <Grid sx={{ fontWeight: '700' , fontSize: {xs: '30px',sm: '36px' }}}>Welcome to <span className="float" style={{  color: '#1976D2'}}>Quick Cash</span></Grid>
            <Grid sx={{ fontSize: '16px', marginBottom: '12px' }}>Register your account</Grid>
          </Grid>
          <Grid sx={{padding: '12px 2px'}}>
           <TextField
              autoComplete="given-name"
              name="name"
              required
              fullWidth
              id="name"
              label="Full Name"
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid sx={{padding: '12px 2px'}}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
            />
          </Grid>
          <Grid sx={{padding: '12px 2px'}}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="new-password"
            />
          </Grid>
          <Grid>
            <FormControl fullWidth>
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

          <Grid>
            <Button
              type="button"
              onClick={(e) => HandleCreateAccount(e)}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Grid>
          <Grid sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Grid>
              <Link to="/myapp/web" style={{textDecoration: 'none'}}>
                {"Already have an account?"}
              </Link>
            </Grid>
            <Grid>
              <Link to="/myapp/web" style={{textDecoration: 'none', color: '#696CFF', marginLeft: '6px'}}>
                {"Sign in instead"}
              </Link>
            </Grid>
          </Grid>
          <Grid>
            <Copyright sx={{ mt: 2, mb: 2 }} />
          </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}