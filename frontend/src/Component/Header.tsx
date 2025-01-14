import {useEffect, useState} from 'react';
import { Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Link, useLocation } from 'react-router-dom';

export default function Header(props:any) {

  const {pathname} = useLocation();
  const [pathNameUrl,setPathNameUrl] = useState('');
  const [pathNameUrl1,setPathNameUrl2] = useState('');
  const theme = localStorage.getItem('themeColor') == "dark" ? true : false;

  useEffect(() => {
   setPathNameUrl(pathname.split('/')[1].toLocaleUpperCase());
   setPathNameUrl2(pathname.split('/').length == 4 ? pathname.split('/')[2].toLocaleUpperCase() : '');
  },[pathname]);
  
  const handleDrawerToggle = () => {
    if (!props.isClosing) {
      props.setMobileOpen(!props.mobileOpen);
    }
  };
  
  return (
    <Toolbar sx={{ display: 'flex' }}>
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
        pathNameUrl == "EDIT-RECEIPIENT" || pathNameUrl == "BENEFICIARY" || pathNameUrl == "TRANSACTIONS" || pathNameUrl == "STATEMENTS" || pathNameUrl == "ADD-MEMBER" || pathNameUrl == "RESPONSE" || pathNameUrl == "ECOMMERCE" || pathNameUrl == "SPOT" || pathNameUrl == "SEND" || pathNameUrl == "ACCOUNTS" || pathNameUrl == "ADD-ACCOUNT" || pathNameUrl == "EDIT-ACCOUNT" || pathNameUrl == "USER-PROFILE" ?
        "" :
        pathNameUrl == "HOME" ?
        <>
         <Typography sx={{ fontWeight: '700' ,fontSize: {md: '28px'} , marginTop: {md: '50px'} }}>
          {/* <Link to="/home" style={{textDecoration: 'none', color: '#2196f3'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>FIAT</Link> / <Link to="/crypto-dashboard" style={{textDecoration: 'none'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>CRYPTO</Link>
           */}
          <Link to="/home" style={{textDecoration: 'none'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>Dashboard</Link>
         </Typography>
        </>
        :
        pathNameUrl == "SETTINGS" ?
        <>
         <Typography sx={{ fontWeight: '700' ,fontSize: {md: '28px'} , marginTop: {md: '50px'} }}>
          
         </Typography>
        </>
        :
        pathNameUrl == "NOTIFICATIONALL" ?
        <>
         <Typography sx={{ fontWeight: '700' ,fontSize: {md: '28px'} , marginTop: {md: '50px'} }}>
          
         </Typography>
        </>
        :
        pathNameUrl == "CRYPTO-DASHBOARD" ?
        <>
         {/* 
          <Typography sx={{ fontWeight: '700' ,  fontSize: {md: '28px'} ,color: { xs: 'white', md: `${theme ? 'white': 'black'}` }, marginTop: {md: '50px'} , marginBottom: '2px' , marginLeft: '-80px' }}>
            <Link to="/home" style={{textDecoration: 'none',marginLeft: '70px'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>FIAT</Link> / <Link to="/crypto-dashboard" style={{textDecoration: 'none', color: '#2196f3'}} className={`${theme ? 'avatarDark' : 'avatarLight'}`}>CRYPTO</Link>
          </Typography> 
         */}
        </>
        :
        pathNameUrl1 == "COMPLETE" ?
        <></>
        :
        <Typography className={`${theme ? 'avatarDark' : 'avatarLight'}`} sx={{ fontWeight: '700' ,fontSize: {md: '28px'} , marginTop: {md: '50px'}, color: { xs: `${theme ? 'white': 'black'}` }, textTransform: 'capitalize' }}>{pathname.replace('/','')}</Typography>
      }
    </Toolbar>
  )
}
