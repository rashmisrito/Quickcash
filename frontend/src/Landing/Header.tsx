import React from 'react';
import Menu from './Menu';
import { Link } from 'react-router-dom';
import { Grid, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Colorbtn, LandingLoginbtn } from '../Component/Button/ColorButton';

export default function Header() {

  const [displayMenu,setDisplayMenu] = React.useState<boolean>(false);

  return (
    <Grid sx={{background: '#F2F3FF'}}>
      <Grid container spacing={2} sx={{ padding: '23px 50px', border: '2px solid #2C348930' }}>

        <Grid item xs={5} md={3} sx={{color: '#483594', fontWeight: '600', fontSize: {xs:'15px',md:'30px'} }}>
          <Link to="/" style={{ textDecoration: 'none' }}>Quick Cash</Link>
        </Grid>

        <Grid item xs={6} md={6} sx={{ display: {xs: 'none', md: 'block'}}}>
          <Menu />
        </Grid>

        <Grid item xs={3} md={3} sx={{ display: {xs: 'none', md: 'block'}}}>
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
            <Grid sx={{marginTop: '9px', cursor: 'pointer'}}><Link to="/myapp/web" target='_blank' style={{ textDecoration: 'none' }}>Login</Link></Grid>
            <Grid><LandingLoginbtn sx={{ padding: '12px 14px' }}><Link to="/register" target='_blank' style={{ textDecoration: 'none', color : 'white' }}>Create Free Account</Link></LandingLoginbtn></Grid>  
          </Grid>      
        </Grid> 

        <Grid item xs={7} md={9} sx={{ display: {xs: 'flex', md: 'none', justifyContent: 'flex-end'}}}>
        {
          !displayMenu ?
          <Colorbtn onClick={ () => setDisplayMenu(!displayMenu)}><MenuIcon /></Colorbtn>
          :
          <Colorbtn onClick={ () => setDisplayMenu(!displayMenu)}><CloseIcon /></Colorbtn>
        }
        </Grid>

        {
          <Slide direction="right" in={displayMenu} mountOnEnter unmountOnExit>
            <Grid item xs={12} sx={{ display: 'flex',flexDirection: 'column',background: '#473593', color: 'white', justifyContent: 'center', textAlign: 'center', gap: '36px', marginTop: '12px' }}>
              <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Why Quick Cash</Grid>
              <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Pricing</Grid>
              <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}><Link to="/privacy-policy">Privacy Policy</Link></Grid>
              <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Blog</Grid>
              <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Contact Us</Grid>
              <Grid sx={{marginTop: '9px', cursor: 'pointer'}}>Login</Grid>
              <Grid><LandingLoginbtn sx={{padding: '12px 14px', border: '1px solid white', marginBottom: '12px'}}>Create Free Account</LandingLoginbtn></Grid>
            </Grid>
          </Slide>  
        }
       
      </Grid>
    </Grid>
  )
}
