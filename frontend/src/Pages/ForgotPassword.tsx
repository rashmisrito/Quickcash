import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useValidation from '../Hooks/useValidation';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate , Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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

export default function ForgotPassword() {
  
  const { errors, validate } = useValidation();  
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const navigate = useNavigate();
  const HandleLogin = async () => {
    navigate('/home');
  }

  const [email,setEmail] = useState<any>("");

  const HandleForgotPassword = async () => {
    if(!validate("email", email)){
    await axios.post(`/${url}/v1/user/forget-password`, {
      "email": email
   }, 
   {
    headers: {
     'Content-Type': `application/json`
    }
   })
   .then(result => {
   if(result.data.status == "201") {
     alertnotify("Check your Registered mail, we have sent a reset password link","success");
     navigate('/');
   }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  } else {
    alertnotify(errors.email, "error");
  }
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
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '12px 12px 50px lightblue',
            border: '16px solid silver',
            borderLeftColor: '#1976D2',
            borderRightColor: "#1976D2",
            padding: '12px 15px',
            paddingLeft: '30px',
            paddingRight: '30px',
            borderRadius: '12px',
            paddingBottom: '64px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{color: '#1976D2'}}>
            Forgot password
          </Typography>
          <Box component="form" onSubmit={HandleLogin} noValidate sx={{ mt: 1 , paddingTop: '32px' }}>
            <span style={{color: '#1976D2'}}>
              Lost your password? <br /> 
            </span>
            <span style={{color: '#1976D2'}}>
              Please enter your email address. 
              You will receive a link to create a new password via email.
            </span>
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
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={() => HandleForgotPassword()}
              sx={{ mt: 3, mb: 2 }}
            >
              Reset password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/myapp/web" style={{textDecoration: 'none',color: '#1976D2'}}>
                  Remember your password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}