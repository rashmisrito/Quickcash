import axios from 'axios';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useValidation from '../Hooks/useValidation';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { useNavigate , Link } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import { IconButton, InputAdornment } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

export default function SignIn() {
  
  const navigate = useNavigate();
  const { errors, validate } = useValidation();
  const [email,setEmail] = React.useState<string>('');
  const [password,setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const {authenticated,setAuthenticated} = useContext(AuthContext);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
 
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    if(localStorage.getItem('token')) {
      vaildateUser();
    }
  },[]);

  const vaildateUser = async () => {
    await axios.post(`/${url}/v1/user/auth`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setAuthenticated(true);
        navigate('/home');
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const HandleLogin = async () => {
    if(!validate("email", email) && !validate("password", password)){ // returns error if not valid.
      await axios.post(`/${url}/v1/user/login`, {email,password})
    .then((result => {
      if(result.status == 200) {
        addLoginSession(result.data.data._id);
        setAuthenticated(true);
        console.log(authenticated);
        localStorage.setItem('user', 'loggedin');
        localStorage.setItem('token', result.data.token);
        alertnotify(`${result.data.data.name} is Logged In Successfully!!!`, "success");
        navigate('/home?currency=all');
    }
    }))
    .catch(error => {
      alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
    })
    } else {
      if(validate("email", email)){
        alertnotify(errors.email, "error");
      }
      if(validate("password", password)){
        alertnotify(errors.password, "error");
      }
    }
  }

  const addLoginSession = async (val:any) => {
    await axios.post(`/${url}/v1/session/add`, {
      user:val ,
      device:navigator?.userAgentData?.brands?.[0]?.brand,
      OS:navigator?.userAgentData?.platform,
      status: 1,
      isActiveNow:1
    })
    .then((result => {
      if(result.data.status == 201) {
        localStorage.setItem('usersessionid',result.data.data._id);
      }
    }))
      .catch(error => {
      alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
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
  
  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    const returnValue = validate(name, value);
    console.log(returnValue);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container sx={{alignItems: '',height: '100vh' }}>
        <Grid item sm={7} md={8} sx={{display: { xs: 'none', sm: 'block' }}}>
          <img src={`${import.meta.env.VITE_APP_URL}/loginbg.png`} width="90%" height="690px" style={{overflow: 'hidden'}} />
        </Grid>
        <Grid item xs={12} sm={5} md={4} className='background-imagedd' sx={{ padding: '12px', backgroundImage: {xs: 'none', sm: `url(${import.meta.env.VITE_APP_URL}/kl.png)`} , backgroundRepeat: 'no-repeat', height: '100vh',backgroundSize: 'cover'}} component={Paper} elevation={3} square>
          <Grid sx={{display: 'flex', flexDirection: 'column', padding: '12px',backdropFilter: 'blur(3px)', marginTop: {md: '120px'}}}>
            <Grid sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {/* <Grid sx={{display: {xs:'flex', sm: 'none'}, justifyContent: 'center'}}><img src={`${import.meta.env.VITE_APP_URL}/bank.png`} width="120px" /></Grid> */}
              <Grid sx={{ fontWeight: '700' , fontSize: {xs: '30px',sm: '36px' }}}>Welcome to <span className="float" style={{  color: '#1976D2'}}>Quick Cash</span></Grid>
              <Grid sx={{ fontSize: '16px' }}>Please sign-in to your account and start the journey</Grid>
            </Grid>
            <Grid sx={{padding: '12px 2px'}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid sx={{padding: '12px 2px'}}>
              <OutlinedInput
                required
                fullWidth
                name="password"
                label="Password"
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                sx={{background: 'white'}}
                onBlur={handleBlur}
                error={!!errors.password }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
            {
              errors?.password ?
              <>
               <Grid style={{color: 'red', display: 'flex', padding: '12px'}}>
                {errors.password}
               </Grid>
              </>
              :
              null
            }
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', padding: '12px 2px'}}>
              <Grid>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Grid>
                <Link to="/forgot-password" style={{textDecoration: 'none', color: '#696CFF'}}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Grid>
              <Button
                type="button"
                onClick={() => HandleLogin()}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Grid>
                <Link to="/register" style={{textDecoration: 'none'}}>
                  {"New on our platform?"}
                </Link>
              </Grid>
              <Grid>
                <Link to="/register" style={{textDecoration: 'none', color: '#696CFF', marginLeft: '6px'}}>
                  {"Create an account"}
                </Link>
              </Grid>
            </Grid>
            <Grid>
              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}