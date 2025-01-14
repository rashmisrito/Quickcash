import {useEffect, useState} from 'react';
import { Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export default function AdminHeader(props:any) {

  const {pathname} = useLocation();
  const theme = localStorage?.getItem('themeColor') == "dark" ? true : false;
  const [pathNameUrl,setPathNameUrl] = useState('');

  useEffect(() => {
   setPathNameUrl(pathname.split('/')[2].toLocaleUpperCase());
  },[pathname]);

  const handleDrawerToggle = () => {
    if(!props.isClosing) {
      props.setMobileOpen(!props.mobileOpen);
    }
  };
  
  return (
    <Toolbar sx={{ display: 'flex' , marginLeft: {md: '80px'} }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: 'none' } }}
      >
      <MenuIcon />
      </IconButton>
      {
        pathNameUrl == "SEND" ?
        ""
        :
        pathNameUrl == "USERS" ? 
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}>USER MANAGEMENT</Typography>
        :
        pathNameUrl == "USERLIST" ? 
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` },  marginTop: {md: '50px'} }}>USER LIST</Typography>
        :
        pathNameUrl == "KYC-DETAILS" ? 
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` },  marginTop: {md: '50px'} }}></Typography>
        :
        pathNameUrl == "PAYMENT" ? 
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}>PAYMENT GATEWAY</Typography>
        :
        pathNameUrl == "NOTIFICATIONALL" ? 
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}></Typography>
        :
        pathNameUrl == "ECOMMERCE" ?
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} ,color: { xs: 'white', md: `${theme ? 'white': 'black'}` },  marginTop: {md: '50px'} }}></Typography>
        :
        pathNameUrl == "USER" ?
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}></Typography>
        :
        pathNameUrl == "TOTAL-TRANSACTIONS" ?
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}></Typography>
        :
        pathNameUrl == "DASHBOARD" ?
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '28px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}></Typography>
        :
        <Typography sx={{ fontWeight: '700' , fontSize: {md: '24px'} , color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} }}>{pathNameUrl}</Typography>
     
     }
    </Toolbar>
  )
}
