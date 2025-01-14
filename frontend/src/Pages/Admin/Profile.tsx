import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import Dialog from '@mui/material/Dialog';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import { useOutletContext } from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import React , { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DialogContentText from '@mui/material/DialogContentText';
import { Colorbtn,Closebtn } from '../../Component/Button/ColorButton';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Avatar, Box, Card, CardHeader, FormControl, Grid, OutlinedInput, Typography } from '@mui/material';

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

export default function Profile() {

  const [otp, setOtp] = useState('');
  const [theme]:any = useOutletContext();
  const [open, setOpen] = React.useState(false);
  const [showotp,setShowOTP] = useState<Boolean>(false);
  const [imageFront1, setImageFront1] = useState({ preview: "", raw: "" });
  const [PasswordShowForEdit,setPasswordShowForEdit] = useState<boolean>(false);
  const [removeProfileImage,setRemoveProfileImage] = React.useState<boolean>(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [fname,setFname] = useState<any>('');
  const [lname,setLname] = useState<any>('');
  const [email,setEmail] = useState<any>('');
  const [mobile,setMobile] = useState<any>('');
  const [password,setPassword] = useState<any>('');
  const [twofa,setTwofa] = useState<boolean>(false);
  const [profileAvatar,setProfileAvatar] = useState<any>('');
 
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
   setOpen(true);
  };

  const handleChangeImageFront1 = (e:any) => {
   if (e.target.files.length) {
    setProfileAvatar('');
    setRemoveProfileImage(true);
    setImageFront1({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    });
   }
  };

  const HandlePasswordChange = () => {
    setPasswordShowForEdit(true);
  }

  const HandleSendOtp = async () => {
    await axios.post(`/${url}/v1/admin/sendotp`,{
      name: fname,
      email: email
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify("OTP has been sent on registered email id","success");
        setShowOTP(true);
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  const verifyOtp = async () => {
    await axios.post(`/${url}/v1/admin/verifyotp`,{
      otp: otp,
      email: email
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify("Two Factor authentication is enabled now","success");
        setOtp('');
        setShowOTP(false);
        setOpen(false);
        getProfileDetails();
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
    }) 
  }

  useEffect(() => {
    getProfileDetails();
  },[]);
   
   const getProfileDetails = async() => {
     await axios.get(`/${url}/v1/admin/auth`,{
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }})
     .then(result => {
       if(result.data.status == 201) {
        setFname(result.data.data.fname);
        setLname(result.data.data.lname);
        setEmail(result.data.data.email);
        setMobile(result.data.data.mobile);          
        setProfileAvatar(result.data.data.profileAvatar);
        setTwofa(result.data.data.twofa);
        if(result.data.data.profileAvatar) {
          setRemoveProfileImage(true);
        }
       }
     })
    .catch(error => {
      console.log("error", error);
     }) 
   }

  const profileUpdate = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.patch(`/${url}/v1/admin/update-profile`,{
      fname,
      lname,
      email,
      password,
      user_id: accountId?.data?.id,
      profileAvatar: imageFront1?.raw
    },
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
      'Content-Type':  'multipart/form-data'
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        alertnotify(result.data.message,"success");
      }
    })
   .catch(error => {
     console.log("error", error);
     alertnotify(error.response.data.message,"error");
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

  const HandleRemoveprofileImage = async () => {
    await axios.patch(`/${url}/v1/admin/removeprofileImage`,{},
    {
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        setProfileAvatar('');
        setRemoveProfileImage(false);
        setImageFront1({
          preview: '',
          raw: ''
        });
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
    <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '91%'}}}>
      <Grid className={theme ? 'profiledarkbg' : 'profileLightbg'} sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',padding: '10px 12px'}}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ m: 1, color: 'black' }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>First Name</label>
              <TextField
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='First Name'
                sx={{width: '97%',border: '1px solid silver'}}
                fullWidth
                value={fname}
                className='inputClss'
                onChange={(e) => setFname(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Last Name</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='Last Name'
                sx={{width: '97%',border: '1px solid silver'}}
                fullWidth
                value={lname}
                onChange={(e) => setLname(e.target.value)}
               />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Email</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='Email'
                sx={{width: '97%',border: '1px solid silver'}}
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Mobile</label>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                placeholder='Mobile'
                sx={{width: '97%',border: '1px solid silver'}}
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
               />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
              <label className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Password</label>
              {
                PasswordShowForEdit ?
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Password'
                  sx={{width: '97%',border: '1px solid silver'}}
                  type='password'
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                :
                <OutlinedInput
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder='Password'
                  sx={{width: '97%',border: '1px solid silver'}}
                  type='password'
                  value="shgdjsghdhsgdj"
                  readOnly
                  fullWidth
               />
              }
              {!PasswordShowForEdit && <a href='#' onClick={HandlePasswordChange} style={{position: 'absolute', color: `${theme ? 'white': 'black'}`, textDecoration: 'none', marginTop: '40px', marginLeft: '80%'}}>Change</a>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ marginBottom: '10px' }}>
              <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
                <Grid>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">GN</Avatar>}
                    title="Profile"
                    className={`${theme ? 'avatarDark' : 'avatarLight'}`}
                  />
                </Grid>
              </Grid>
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
                  onChange={handleChangeImageFront1}
                />
                { 
                  profileAvatar ?
                  <>
                    <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                      <Grid>
                        <img 
                          crossOrigin="anonymous" 
                          src={`${import.meta.env.VITE_PUBLIC_URL}/${profileAvatar}`} 
                          alt="profileImageOfUser" 
                          width="200px" 
                          height="200px" 
                          style={{
                            borderRadius: '50%'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                  :                           
                  imageFront1.preview ? (
                   <img src={imageFront1.preview} alt="dummy" width="100%" height="100%" />
                  ) :
                  (<div className="Neon-input-dragDrop">
                      Click here to Upload Image
                    <div className="Neon-input-inner">
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
                {
                  removeProfileImage && 
                  <>
                    <Grid sx={{display: 'flex', flexDirection: 'row' , cursor: 'pointer', color: `${theme ? 'white': 'black'}`, justifyContent: 'flex-end'}}>
                     <Grid><DeleteForeverRoundedIcon onClick={() => HandleRemoveprofileImage()} /></Grid>
                     <Grid onClick={() => HandleRemoveprofileImage()}>Remove Image</Grid>
                    </Grid>
                  </>
                }
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Colorbtn sx={{marginLeft: '12px'}} onClick={() => profileUpdate()}>Update</Colorbtn>
          </Grid>
        </Grid>
      </Grid>

      <Grid className={theme ? 'profiledarkbg' : 'profileLightbg'} sx={{display: 'none', border: '1px solid white', marginTop: '10px',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',padding: '10px 12px'}}>
        <Typography className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Security Details</Typography>
        <Grid sx={{display:'flex', justifyContent: 'space-between'}}>
          <Grid><Typography className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Two-Factor Authentication ({twofa ? 'Enable' : 'Disable'})</Typography></Grid>
          {!twofa && <Grid><Colorbtn onClick={handleClickOpen}>Enable</Colorbtn></Grid>}
        </Grid>
      </Grid>
    </Box>

    <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
       <DialogTitle>Setup Two Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entering OTP will confirm your email for further verifications.
          </DialogContentText>
          {
            showotp ?
            <>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputStyle={{width: '60px', height: '50px', borderRadius: '12px', marginTop: '10px', marginBottom: '10px'}}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
              <Colorbtn onClick={() => verifyOtp()}>Verify OTP</Colorbtn>
            </>
            :
            <>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={email}
              />
              <Colorbtn onClick={HandleSendOtp}>Send OTP</Colorbtn>
            </>
          }
        </DialogContent>
        
        <DialogActions>
          <Closebtn onClick={handleClose}>Cancel</Closebtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
