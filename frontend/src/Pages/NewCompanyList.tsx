import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { countries } from 'countries-list';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { Box, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Typography } from '@mui/material';

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

export default function NewCompanyList() {

  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [imageFront1, setImageFront1] = React.useState({ preview: "", raw: "" });
  const [imageFront2, setImageFront2] = React.useState({ preview: "", raw: "" });
  const [imageFront3, setImageFront3] = React.useState({ preview: "", raw: "" });

  const [country,setCountry] = React.useState<any>();
  const [businessType,setBusinessType] = React.useState<any>();
  const [taxIdentificationNumber, setTaxIndentificationNumber] = React.useState<any>();
  const [businessRegistrationNumber,setBusinessRegistrationNumber] = React.useState<any>(); 

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

   const HandleCreateMemberAccount = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/company/add`, {
      user: decoded?.data?.id,
      taxID:imageFront3?.raw,
      businessRegistrationDocument:imageFront1?.raw,
      proofoftradingAddress:imageFront2?.raw,
      country,
      businessType,
      tradingAddress:value,
      taxIdentificationNumber,
      businessRegistrationNumber,
    }, 
    {
      headers: {
        'Content-Type':  'multipart/form-data'
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        alertnotify(result.data.message,"success");
        navigate('/Company-Details');
      }
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
    })
   }

  const handleChangeImageFront1 = (e:any) => {
    if (e.target.files.length) {
      setImageFront1({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const handleChangeImageFront2 = (e:any) => {
    if (e.target.files.length) {
      setImageFront2({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const handleChangeImageFront3 = (e:any) => {
    if (e.target.files.length) {
      setImageFront3({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const [value, setValue] = React.useState('trading');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '10px', marginLeft: {xs: '0%',md: '7%'}, background: 'white' , width: {xs: '100%', lg: '80%'} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography><KeyboardBackspaceIcon sx={{cursor: 'pointer'}} onClick={() => navigate('/Company-Details')} /></Typography>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center'}}>
           New Company List
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <label>Business Type</label>
              <Select fullWidth sx={{background: 'white', border:'1px solid silver'}} onChange={(e) => setBusinessType(e.target.value)}>
                <MenuItem key={0} sx={{background: 'white'}} className='business__type__hover' value={"company"} >Company</MenuItem>
                <MenuItem key={1} sx={{background: 'white'}} className='business__type__hover' value={"sale_properitor"}>Sale Properitor</MenuItem>
                <MenuItem key={2} sx={{background: 'white'}} className='business__type__hover' value={"individual"}>Individual</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={12}>
              <label>Business Registration Number</label>
              <TextField
                required
                id="business_registration_number"
                name="business_registration_number"
                fullWidth
                onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                sx={{border:'1px solid silver'}}
                inputProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <label>Tax Identification Number</label>
              <TextField
                required
                id="tax_identification_number"
                name="tax_identification_number"
                fullWidth
                onChange={(e) => setTaxIndentificationNumber(e.target.value)}
                sx={{border:'1px solid silver'}}
                inputProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                <FormControlLabel value="trading" control={<Radio />} label="Same as Trading Address" />
                <FormControlLabel value="country" control={<Radio />} label="Country" />
                </RadioGroup>
              </FormControl>
            </Grid>             

            {
              value == "country" ?
              (
                <Grid item xs={12} sm={12}>
                  <label>Country</label>
                  <Select fullWidth onChange={(e) => setCountry(e.target.value)}>
                  {
                    Object.entries(countries).map((key) => (
                      <MenuItem sx={{background: 'white'}} className='business__type__hover' key={key[0]} value={key[0]}>{key[1]?.name}</MenuItem> 
                    ))
                  }
                  </Select>
                </Grid>
              )
              :
              null 
            }

            <Grid item xs={12} sm={12} sx={{ width: '100%', display: "flex", flexDirection: "column", justifyContent: "center", gap: "15px", marginLeft: '0rem' }}>
              <Grid item xs={5} sm={5}>
                <div className="Neon Neon-theme-dragdropbox">
                  Business Registration Document
                  <input 
                    style={{
                    zIndex: '999', 
                    opacity: '0', 
                    background: 'silver',
                    width: '36vh', 
                    height: '30vh', 
                    position: 'absolute', 
                    right: '0px; left: 0px', 
                    marginRight: 'auto', 
                    marginLeft: 'auto'}} 
                    name="files[]" 
                    id="filer_input2" 
                    type="file" 
                    onChange={handleChangeImageFront1}
                  />
                  {imageFront1.preview ? (
                    <img src={imageFront1.preview} alt="dummy" width="100%" height="100%" />
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
              </Grid>
              <Grid item xs={5} sm={5}>
                <div className="Neon Neon-theme-dragdropbox">
                  Proof of Trading Address
                  <input 
                    style={{
                    zIndex: '999', 
                    opacity: '0', 
                    background: 'silver',
                    width: '36vh', 
                    height: '30vh', 
                    position: 'absolute', 
                    right: '0px; left: 0px', 
                    marginRight: 'auto', 
                    marginLeft: 'auto'}} 
                    name="files[]" 
                    id="filer_input2" 
                    type="file" 
                    onChange={handleChangeImageFront2}
                  />
                    {imageFront2.preview ? (
                      <img src={imageFront2.preview} alt="dummy" width="100%" height="100%" />
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
              </Grid>
              <Grid item xs={5} sm={5}>
                <div className="Neon Neon-theme-dragdropbox">
                  Tax ID/TIN
                  <input 
                    style={{
                    zIndex: '999', 
                    opacity: '0', 
                    background: 'silver',
                    width: '36vh', 
                    height: '30vh', 
                    position: 'absolute', 
                    right: '0px; left: 0px', 
                    marginRight: 'auto', 
                    marginLeft: 'auto'}} 
                    name="files[]" 
                    id="filer_input2" 
                    type="file" 
                    onChange={handleChangeImageFront3}
                  />
                    {imageFront3.preview ? (
                      <img src={imageFront3.preview} alt="dummy" width="100%" height="100%" />
                    ) :
                    (<div className="Neon-input-dragDrop">
                       <div className="Neon-input-inner">
                        <div className="Neon-input-icon">
                          <i className="fa fa-file-image-o"></i>
                        </div>
                        <div className="Neon-input-text">
                        </div>
                        <a className="Neon-input-choose-btn blue">
                          <CloudUploadIcon style={{cursor: 'pointer'}} /> 
                        </a>
                        </div>
                      </div>
                    )}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ColorButton color="primary" onClick={(e) => HandleCreateMemberAccount(e)}>
                <DoneOutlineOutlinedIcon sx={{ mr: 1 }} /> Submit
              </ColorButton>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
