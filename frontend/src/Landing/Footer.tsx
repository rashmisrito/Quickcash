import { Grid, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <Grid sx={{  zIndex: '9999', marginTop: {xs:'-16px',md:'2%'},background: '#02084B' }}>
      {/* <Grid container sx={{ display: 'flex', flexDirection: 'row', gap: '60px', justifyContent: 'space-between', padding: {xs: '10px', sm: '60px',  md: '100px'} }}>
        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Why Quick Cash</Typography>
          </Grid>
          <Grid>
           <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
            <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
            <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
            <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
            <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
            <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid>
           </Grid>  
          </Grid>  
        </Grid>

        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Product</Typography>
          </Grid>
           <Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid>
            </Grid>  
           </Grid>  
        </Grid>

        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Company</Typography>
          </Grid>
          <Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid> 
            </Grid>  
          </Grid>  
        </Grid>
        
        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Pricing</Typography>
          </Grid>
          <Grid>
           <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
             <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
             <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
             <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
             <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
             <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid> 
           </Grid>  
          </Grid>  
        </Grid>

        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Learn</Typography>
          </Grid>
          <Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid> 
            </Grid>  
          </Grid>  
        </Grid>
        
        <Grid>
          <Grid>
            <Typography sx={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>Developers</Typography>
          </Grid>
          <Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'space-between', marginTop: '60px' }}>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Why Choose Quick Cash</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Checkout</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>About Us</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Lorem Ipsum</Typography></Grid>
              <Grid><Typography sx={{ color: 'white', fontSize: '0.80rem' }}>Help Center</Typography></Grid> 
            </Grid>  
          </Grid>  
        </Grid>
        
      </Grid>   */}

      <Grid>
        <Typography sx={{ color: 'white', fontWeight: '700', fontSize: { xs:'12px', md: '2.1rem' }, padding: {xs: '5px 10px',md: '5px 90px'} }}>Quick Cash</Typography>  
      </Grid> 

      <Grid>
        <hr style={{ width: '88%' }} />
      </Grid>

      <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Grid>
          <Typography sx={{ padding: {xs: '10px', sm: '60px',  md: '35px 90px'}, color: 'white', fontSize: '1.01rem' }}>Copyright © 2024 Quick Cash. All rights reserved</Typography>
        </Grid>
        {/* <Grid sx={{ display: 'flex', textAlign: 'center', padding: {xs: '10px', sm: '60px', md: '35px 90px'}, flexDirection: 'row', gap: '10px' }}>
          <Grid><TwitterIcon style={{ color: '#55ACEE', cursor: 'pointer' , borderRadius: '50%' }} /></Grid>
          <Grid><YouTubeIcon style={{ color: '#FF0000', cursor: 'pointer', borderRadius: '50%' }} /></Grid>
          <Grid><LinkedInIcon style={{ color: '#0A66C2', cursor: 'pointer' }} /></Grid>
          <Grid><TelegramIcon style={{ color: '#1D8DE1', cursor: 'pointer' }} /></Grid>
          <Grid><InstagramIcon style={{ color: '#FA8120', cursor: 'pointer' }} /></Grid>
        </Grid> */}
        <Grid sx={{ display: 'flex', color: 'white', padding: {xs: '10px', sm: '60px', md: '35px 90px'}, flexDirection: 'row', justifyContent: 'space-between', gap: '20px' }}>
          <Grid><Link to="/myapp/web"  style={{ textDecoration: 'none', color: 'white' }} target='_blank'>Login</Link></Grid>
          <Grid><Link to="/myapp/admin"  style={{ textDecoration: 'none', color: 'white' }} target='_blank'>Get Started</Link></Grid>
          <Grid><Link to="/privacy-policy" style={{ textDecoration: 'none', color: 'white' }} >Privacy Policy</Link></Grid>
          <Grid></Grid>
          <Grid></Grid>
        </Grid>
      </Grid>

    </Grid>
  )
}
