import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { purple, red } from '@mui/material/colors';
import Button, { ButtonProps } from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Avatar, Box, Card, CardHeader, FormControlLabel, Grid, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material';

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

export default function AddQrCode() {

  const navigate = useNavigate();
  const [title,setTitle] = React.useState<any>('');
  const [imageFront3, setImageFront3] = React.useState({ preview: "", raw: "" });
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
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

   const HandleCreatePaymentQrCode = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.post(`/${url}/v1/admin/qrcode/add`, {
      user: decoded?.data?.id,
      title: title,
      qrCodeImage: imageFront3?.raw,
      isDefault: value
     }, 
     {
      headers: {
        'Content-Type':  'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
     })
     .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/admin/invoices/payment-qr-codes');
      }
     })
     .catch(error => {
       console.log("error", error);
       alertnotify(error.response.data.message,"error");
     })
   }

    const [value, setValue] = React.useState('yes');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue((event.target as HTMLInputElement).value);
    };

    const handleChangeImageFront3 = (e:any) => {
      if (e.target.files.length) {
        setImageFront3({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
      }
    };

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%',md: '7%'}, background: 'white' , width: {xs: '100%', lg: '80%'} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography><KeyboardBackspaceIcon sx={{cursor: 'pointer', marginBottom: '10px'}} onClick={() => navigate('/admin/invoices/payment-qr-codes')} /></Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <label>Title</label>
              <TextField
                required
                id="name"
                name="name"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                sx={{border:'1px solid silver'}}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">QR</Avatar>
                  }
                  title="Upload Payment QR-Code"
                />
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
                    onChange={handleChangeImageFront3}
                  />
                  { 
                    imageFront3.preview ? (
                     <img src={imageFront3.preview} alt="dummy" width="100%" height="100%" />
                    ) :
                    (<div className="Neon-input-dragDrop">
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
              </Card>
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
                <FormControlLabel value="no"  control={<Radio />} label="No" />
               </RadioGroup>
            </Grid>             
            <Grid item xs={12}>
              <ColorButton color="primary" onClick={(e) => HandleCreatePaymentQrCode(e)}>
                <DoneOutlineOutlinedIcon sx={{ mr: 1 }} /> Submit
              </ColorButton>
            </Grid>
           </Grid>
         </Box>
      </Toolbar>
    </>
  )
}
