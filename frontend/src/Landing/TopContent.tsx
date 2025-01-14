import Footer from './Footer';
import NewContent from './NewContent';
import CryptoAddv from './CryptoAddv';
import FooterAbove from './FooterAbove';
import { Link } from 'react-router-dom';
import MarqueeContent from './MarqueeContent';
import NewContentThird from './NewContentThird';
import { Grid, Typography } from '@mui/material';
import NewContentSecond from './NewContentSecond';
import { SpeaktoSalesbtn, LandingLoginbtn } from '../Component/Button/ColorButton';
import Features from './Features';

export default function TopContent() {

  return (
    <Grid sx={{ 
      backgroundImage: {md:"url(" + "https://quickcash.oyefin.com/BGBODY.svg" + ")"}, 
      backgroundRepeat: 'no-repeat',
      height: '700px'
     }}
    >
      <Grid sx={{ padding: {xs:'30px',md:'70px'}, display: 'flex', flexDirection: 'column', gap: '26px'}}>
        <Grid>
          <Typography sx={{textAlign: 'center', fontSize: {xs: '1.4rem', sm:'2.9rem', md: '3.7rem'}, lineHeight: {xs:'5vh',sm: '10vh',md:'10vh'}, color: '#2C3489',fontWeight: '700'}}>
           Seamlessly Bridge Your  <br /><span style={{color: '#CC9933'}}>Financial </span> World
          </Typography>
        </Grid>
        <Grid>
          <Typography sx={{textAlign: 'center', fontSize: {xs: '.9rem', sm:'1.4rem', md: '1.2em'}, color: '#2C3489'}}>
            Manage Crypto and Fiat with One Unified Platform.
          </Typography>
        </Grid>
        <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px'}}>
          <Grid><LandingLoginbtn sx={{ padding: "12px 32px" }}><Link to="/register" target='_blank' style={{ textDecoration: 'none', color: 'white' }}>create a free account</Link></LandingLoginbtn></Grid>
          <Grid><SpeaktoSalesbtn sx={{ padding: "12px 32px" }}>Speak to Sales</SpeaktoSalesbtn></Grid>
        </Grid>
        <Grid sx={{display: {xs: 'flex', sm: 'none'}, flexDirection: 'row', justifyContent: 'center', gap: '20px', marginTop: '23px'}}>
          <img 
            src={`${import.meta.env.VITE_APP_URL}/userdashboard2.png`} 
            style={{ 
              inset: '0px',
              padding: '0px',
              margin: 'auto',
              display: 'block',
              borderRadius: '12px',
              boxShadow: '1px 6px 19px 9px #DCDDEC',
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }} 
          />
        </Grid>
        <Grid sx={{display: {xs: 'none', sm: 'flex'}, flexDirection: 'row', justifyContent: 'center', gap: '20px', marginTop: '23px'}}>
          <img 
            src={`${import.meta.env.VITE_LIVE_BASE_URL}/userdashboard2.png`} 
            style={{ 
              inset: '0px',
              padding: '0px',
              display: 'block',
              margin:'auto',
              borderRadius: '12px',
              boxShadow: '1px 6px 19px 9px #DCDDEC',
              height: '620px', 
              objectFit: 'cover'
            }} 
          />
        </Grid>
      </Grid>  
      <Grid><MarqueeContent /></Grid>
      <Grid><NewContent /></Grid>
      <Grid><Features /></Grid>
      <Grid><NewContentSecond /></Grid>
      <Grid><CryptoAddv /></Grid>
      <Grid><FooterAbove /></Grid>
      <Grid><Footer /></Grid>
    </Grid>
  )
}
