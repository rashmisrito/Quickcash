import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { red } from '@mui/material/colors';
import { Colorbtn } from '../Component/Button/ColorButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Avatar, Box, Card, CardHeader, FormControlLabel, Grid, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material';

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

export default function EditQrCode() {

  const params = useParams();
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const [title,setTitle] = React.useState<any>('');
  const [qrCodeImage,setQrCodeImage] = React.useState<any>('');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [imageFront3, setImageFront3] = React.useState({ preview: "", raw: "" });

  useEffect(() => {
   getDetailsById(params?.id);
  },[params?.id]);

  const getDetailsById = async (val:any) => {
    await axios.get(`/${url}/v1/qrcode/${val}`, 
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setTitle(result.data.data.title);
        setValue(result.data.data.IsDefault);
        setQrCodeImage(result.data.data.image);
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

   const HandleCreatePaymentQrCode = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/qrcode/update/${params?.id}`, {
      user: decoded?.data?.id,
      title: title,
      qrCodeImage: imageFront3?.raw,
      isDefault: value
    }, 
    {
      headers: {
        'Content-Type':  'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/settings?filter=Payment_Qr_Code');
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
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` } }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
         <Typography><KeyboardBackspaceIcon sx={{cursor: 'pointer', marginBottom: '10px', color: `${theme ? 'white': 'black'}`}} onClick={() => navigate('/settings?filter=Payment_Qr_Code')} /></Typography>
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
              value={title}
              inputProps={{
               shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Card sx={{ marginBottom: '10px',maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  QR
                  </Avatar>
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
                  qrCodeImage ? 
                   <img crossOrigin="anonymous" src={`${import.meta.env.VITE_PUBLIC_URL}/qrcode/${qrCodeImage}`} alt="payment QR-Code image" width="100%" height="100%" />
                   :
                   imageFront3.preview ? (
                    <img src={imageFront3.preview} alt="dummy" width="100%" height="100%" />
                   ) 
                   :
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
                   )
                }
                </div>
              </Card>
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
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>             
          <Grid item xs={12}>
            <Colorbtn color="primary" onClick={(e) => HandleCreatePaymentQrCode(e)}>
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
