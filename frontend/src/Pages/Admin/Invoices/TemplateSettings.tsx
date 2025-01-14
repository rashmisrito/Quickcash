
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { HexColorPicker } from "react-colorful";
import { ButtonProps } from '@mui/material/Button';
import { useOutletContext } from "react-router-dom";
import Rio from '../../../Component/InvoiceTemplates/Rio';
import Tokyo from '../../../Component/InvoiceTemplates/Tokyo';
import Paris from '../../../Component/InvoiceTemplates/Paris';
import Mumbai from '../../../Component/InvoiceTemplates/Mumbai';
import London from '../../../Component/InvoiceTemplates/London';
import { Box,Grid,Button,Select,MenuItem } from '@mui/material';
import Default from '../../../Component/InvoiceTemplates/Default';
import NewYork from '../../../Component/InvoiceTemplates/NewYork';
import Toronto from '../../../Component/InvoiceTemplates/Toronto';
import HongKong from '../../../Component/InvoiceTemplates/HongKong';
import Istanbul from '../../../Component/InvoiceTemplates/Istanbul';

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

export default function HelpCenter() {

  const [color, setColor] = React.useState<any>("black");
  const [theme]:any = useOutletContext();
  const [List,setList] = React.useState([]);
  const [displayColor,setdisplayColor] = React.useState<boolean>(false);
  const [invoiceOption,setInvoiceOption] = React.useState<any>('Default');
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
      const accountId = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
      getInvoiceTemplateListDetails(accountId?.data?.id);
    }
  },[]);

  const getInvoiceTemplateListDetails = async (act_id:any) => {
    await axios.get(`/${url}/v1/admin/templateSetting/list/${act_id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setList(result.data.data);
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
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem('admintoken') as string);
    await axios.post(`/${url}/v1/admin/templateSetting/add`, {
      user: decoded?.data?.id,
      invoice_country: invoiceOption,
      color: color,
      templateContent: ""
     }, 
     {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
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
      <Box sx={{ marginLeft: {md:  '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '83%'}}}>
        <Grid sx={{display: {md: 'flex'}, flexDirection: {sx: 'column' , md: 'row'} , gap: '10px'}}>
          <Grid sx={{display: 'flex', order: '1', flexDirection: 'column' , width: {md: '30%' , marginBottom: '10px'}, gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
            <Grid sx={{width: '100%'}}>
              <div>Invoice Template</div>
              <Select value={invoiceOption} name="status" onChange={(e) => setInvoiceOption(e.target.value)} sx={{border: '1px solid silver'}} fullWidth>
                <MenuItem value="Default"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Default</span></MenuItem>
                <MenuItem value="New_York"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>New York</span></MenuItem>
                <MenuItem value="Toronto"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Toronto</span></MenuItem>
                <MenuItem value="Rio"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Rio</span></MenuItem>
                <MenuItem value="London"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>London</span></MenuItem>
                <MenuItem value="Istanbul"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Istanbul</span></MenuItem>
                <MenuItem value="Mumbai"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Mumbai</span></MenuItem>
                <MenuItem value="Hong_Kong"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Hong Kong</span></MenuItem>
                <MenuItem value="Tokyo"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Tokyo</span></MenuItem>
                <MenuItem value="Paris"><span className={`${theme ? 'avatarDarkSecondary' : 'avatarLight'}`}>Paris</span></MenuItem>
              </Select>
            </Grid>
            <Grid>
              <label>Color: </label>
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
            <ColorButton onClick={(e) => HandleCreateInvoiceTemplateData(e)}>Save</ColorButton>
          </Grid>
        </Grid>
        <Grid sx={{display: 'flex', order: '2', flexDirection: 'column' , width: {md:'70%'}, minHeight: { xs: '50vh', md: 'auto'}, gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
          <div>Invoice Template</div>
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
