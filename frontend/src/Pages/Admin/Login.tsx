import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useContext, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdminAuthContext } from '../../Contexts/AdminAuthContext';

function Copyright(props:any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to="/admin" style={{textDecoration: 'none'}}>
        Quick Cash
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  const navigate = useNavigate();
  const [email,setEmail] = React.useState<string>('');
  const [password,setPassword] = React.useState<string>('');
  const {authenticated,setAuthenticated} = useContext(AdminAuthContext);

  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
      vaildateUser();
    }
  },[]);

  const vaildateUser = async () => {
    await axios.get(`/${url}/v1/admin/auth`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == 201) {
        setAuthenticated(true);
        navigate('/admin/dashboard');
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message, "error");
    })
  }

  const HandleLogin = async () => {
    await axios.post(`/${url}/v1/admin/login`, {email,password})
    .then((result => {
      if(result.status == 200) {
        setAuthenticated(true);
        localStorage.setItem('admin', 'loggedin');
        localStorage.setItem('admintoken', result.data.token);
        alertnotify(`${result.data.data.fname} is Logged In Successfully!!!`, "success");
        navigate('/admin/dashboard');
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${import.meta.env.VITE_APP_URL}/forgotbg.png)`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: {md: '80%', sm: '100%'},
            backgroundPosition: {xs: 'center', sm: 'cover'},
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="button"
                onClick={() => HandleLogin()}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password" style={{textDecoration: 'none'}}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                <Link to="/" style={{textDecoration: 'none'}}>
                  {"Return to User Login"}
                </Link>
              </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}