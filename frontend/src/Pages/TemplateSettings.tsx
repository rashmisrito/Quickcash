
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import Rio from '../Component/InvoiceTemplates/Rio';
import { useOutletContext } from "react-router-dom";
import Tokyo from '../Component/InvoiceTemplates/Tokyo';
import Paris from '../Component/InvoiceTemplates/Paris';
import Mumbai from '../Component/InvoiceTemplates/Mumbai';
import London from '../Component/InvoiceTemplates/London';
import { Colorbtn } from '../Component/Button/ColorButton';
import Default from '../Component/InvoiceTemplates/Default';
import NewYork from '../Component/InvoiceTemplates/NewYork';
import Toronto from '../Component/InvoiceTemplates/Toronto';
import HongKong from '../Component/InvoiceTemplates/HongKong';
import Istanbul from '../Component/InvoiceTemplates/Istanbul';
import { Box,Grid,Select,MenuItem, Typography } from '@mui/material';

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

export default function HelpCenter() {

  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [color, setColor] = React.useState<any>("black");
  const [theme]:any = useOutletContext();
  const [displayColor,setdisplayColor] = React.useState<boolean>(false);
  const [invoiceOption,setInvoiceOption] = React.useState<any>('Default');

  useEffect(() => {
    if(localStorage.getItem('token')) {
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
      getInvoiceTemplateListDetails(accountId?.data?.id);
    }
  },[]);

  const getInvoiceTemplateListDetails = async (act_id:any) => {
    await axios.get(`/${url}/v1/templateSetting/list/${act_id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setColor(result.data.data[0].color);
        setInvoiceOption(result.data.data[0].invoice_country);
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

  const HandleCreateInvoiceTemplateData = async (e:any) => {
    e.preventDefault();
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/templateSetting/add`, {
      user: decoded?.data?.id,
      invoice_country: invoiceOption,
      color: color,
      templateContent: ""
    }, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
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
      <Box sx={{ marginTop: '12px' , fontSize: '15px' }}>
        <Grid sx={{display: {md: 'flex'}, flexDirection: {sx: 'column' , md: 'row'} , gap: '10px'}}>
          <Grid sx={{display: 'flex', order: '1', flexDirection: 'column' , width: {md: '30%'} , marginBottom: {xs: '10px', sm: '10px', md: '0px'} , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}`} , padding: '10px 12px'}}>
            <Grid sx={{width: '100%'}}>
              <Typography sx={{ color: `${theme ? 'white': 'black'}`, marginBottom: '10px' }}>Invoice Template</Typography>
              <Select value={invoiceOption} name="status" onChange={(e) => setInvoiceOption(e.target.value)} sx={{border: '1px solid silver', marginTop: '2%'}} fullWidth>
                <MenuItem value="Default" sx={{ color: `${theme ? 'white': 'black'}` }}>Default</MenuItem>
                <MenuItem value="New_York" sx={{ color: `${theme ? 'white': 'black'}` }}>New York</MenuItem>
                <MenuItem value="Toronto" sx={{ color: `${theme ? 'white': 'black'}` }}>Toronto</MenuItem>
                <MenuItem value="Rio" sx={{ color: `${theme ? 'white': 'black'}` }}>Rio</MenuItem>
                <MenuItem value="London" sx={{ color: `${theme ? 'white': 'black'}` }}>London</MenuItem>
                <MenuItem value="Istanbul" sx={{ color: `${theme ? 'white': 'black'}` }}>Istanbul</MenuItem>
                <MenuItem value="Mumbai" sx={{ color: `${theme ? 'white': 'black'}` }}>Mumbai</MenuItem>
                <MenuItem value="Hong_Kong" sx={{ color: `${theme ? 'white': 'black'}` }}>Hong Kong</MenuItem>
                <MenuItem value="Tokyo" sx={{ color: `${theme ? 'white': 'black'}` }}>Tokyo</MenuItem>
                <MenuItem value="Paris" sx={{ color: `${theme ? 'white': 'black'}` }}>Paris</MenuItem>
              </Select>
            </Grid>
            <Grid>
              <Typography sx={{ color: `${theme ? 'white': 'black'}` }}>Color:</Typography>
              <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Grid>
                  <div 
                    onClick={() => setdisplayColor(true)}
                    style={{background: `${color}`, height: '30px', width: '30px', cursor: 'pointer', marginTop: '1%', marginBottom: '1%'}}
                  >
                  </div>
                </Grid>
              <Grid>
              {
                displayColor &&
                <div 
                  onClick={() => setdisplayColor(false)}
                  style={{background: 'black', color: 'white', padding: '5px', borderRadius: '10px', cursor: 'pointer'}}
                >X</div>
              }
              </Grid>
            </Grid>
            {
              displayColor &&
              <HexColorPicker color={color} onChange={setColor} />
            }
            </Grid>
          <Grid>
            <Colorbtn onClick={(e) => HandleCreateInvoiceTemplateData(e)}>Save</Colorbtn>
          </Grid>
          </Grid>
          <Grid sx={{display: 'flex', order: '2', flexDirection: 'column' , width: {md:'70%'}, minHeight: { xs: '50vh', md: 'auto'}, gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: {xs: `${theme ? '#183153' : 'white'}` , sm:`${theme ? '' : 'white'}` },border: {xs: `${theme ? '1px solid white' : 'white'}`} , padding: '10px 12px'}}>
          <Typography sx={{ color: `${theme ? 'white': 'black'}` }}>Invoice Template</Typography>
          <Grid>
              <Grid>
                <Box sx={{ overflow: "auto" }}>
                  <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                    {invoiceOption == "Toronto"   &&  <Toronto />}
                    {invoiceOption == "Rio"       &&  <Rio color={color}/>}
                    {invoiceOption == "London"    &&  <London color={color}/>}
                    {invoiceOption == "Default"   &&  <Default color={color}/>}
                    {invoiceOption == "New_York"  &&  <NewYork color={color}/>}
                    {invoiceOption == "Tokyo"     &&  <Tokyo color={color} /> }
                    {invoiceOption == "Paris"     &&  <Paris color={color} /> }
                    {invoiceOption == "Istanbul"  &&  <Istanbul color={color}/>}
                    {invoiceOption == "Mumbai"    &&  <Mumbai color={color} /> }
                    {invoiceOption == "Hong_Kong" &&  <HongKong color={color} /> }
                  </Box>
                </Box>
              </Grid>
          </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
