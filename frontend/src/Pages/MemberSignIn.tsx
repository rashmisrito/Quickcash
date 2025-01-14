import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate , Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useValidation from '../Hooks/useValidation';

function Copyright(props:any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to="/" style={{textDecoration: 'none'}}>
        Neo Connect
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function MemberSignIn() {
  const { errors, validate } = useValidation();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [otp,setOtp] = React.useState<string>('');
  const [email,setEmail] = React.useState<string>('');
  const [username,setUsername] = React.useState<string>('');
  const {authenticated,setAuthenticated} = useContext(AuthContext);
  const [otpSection,setOptionSection] = React.useState<boolean>(false);

  const HandleValidateMember = async () => {
    if(!validate("email", email) ){ // returns error if not valid.
    await axios.post(`/${url}/v1/member/validate`, {email,username})
    .then((result => {
      if(result.status == 200) {
        setOptionSection(true);
      }
    }))
    .catch(error => {
      alertnotify(error.response.data.message, "error");
      console.log("Login api error", error);
    })
  }else{
    if(validate("email", email)){
      alertnotify(errors.email, "error");
    }
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

 const HandleLogin = async () => {
  if(!validate("email", email) ){ // returns error if not valid.
  await axios.post(`/${url}/v1/member/login`, {email,otp})
  .then((result => {
    if(result.status == 200) {
      setOptionSection(false);
      localStorage.setItem("token",result.data.token);
      setAuthenticated(true);
      alertnotify(result.data.message, "success");
      navigate('/home');
    }
  }))
  .catch(error => {
    alertnotify(error.response.data.message, "error");
    console.log("Member Login api error", error);
  })
}else{
  if(validate("email", email)){
    alertnotify(errors.email, "error");
  }
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Member Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            {
              otpSection ?
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                type="text"
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
              />
              :
              null
            }
            
            {
              otpSection ?
              <Button
              type="button"
              onClick={() => HandleLogin()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Proceed
            </Button>
            :
            <Button
              type="button"
              onClick={() => HandleValidateMember()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            }
            <Grid container>
              <Grid item xs>
                <Link to="/" style={{textDecoration: 'none'}}>
                  Switch to user login?
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