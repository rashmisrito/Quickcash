import { Grid, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Parallax } from "react-scroll-parallax";
import { useEffect } from 'react';

export default function NewContent() {
    
  const observerLeft = new IntersectionObserver(intersections => {
    intersections.forEach(({
      target,
      isIntersecting
    }) => {
      target.classList.toggle('animLeft', isIntersecting);
    });
  }, {
    threshold: 0
  });

  const observerRight = new IntersectionObserver(intersections => {
    intersections.forEach(({
      target,
      isIntersecting
    }) => {
      target.classList.toggle('animRight', isIntersecting);
    });
  }, {
    threshold: 0
  });

  useEffect(() => {
    document.querySelectorAll('.animLeft1').forEach(div => {
      observerLeft.observe(div);
    });
    document.querySelectorAll('.animRight1').forEach(div => {
      observerRight.observe(div);
    });
  },[]);
  
  return (
    <section>
      <Grid>
        <Typography sx={{textAlign: 'center', marginTop: {xs:'30px',md:'60px'}, fontSize: {xs: '1.6rem', sm:'2.9rem', md: '3.3rem'}, lineHeight: '7vh', color: '#2C3489',fontWeight: '700'}}>
          This is what a truly borderless <br />business looks like
        </Typography>
      </Grid>

     <Grid container spacing={10} sx={{ marginTop: '1px', display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
         
        <Grid item xs={8} md={4} sx={{ justifyContent: 'center', marginTop: {xs:'-50px',md:'0px'} }} className='animLeft'>
          <img src={`${import.meta.env.VITE_LIVE_BASE_URL}/landingcontentside.png`} style={{ width: '100%' }} />
        </Grid>

       <Grid item xs={12} md={7} className='animRight1'>
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <Grid sx={{ marginTop: {xs:'-40px',md:'0px'}, fontSize: {xs:'2.9vh',md:'5.6vh'}, textAlign: { xs: 'center', md: 'start' }, lineHeight: {xs:'1.6rem',md:'2.6rem'}, color: '#2C3489', fontWeight: '700' }}>Position your business to acquire customers globally</Grid>
            <Grid sx={{ marginTop: {xs:'-30px',md:'0px'},color: '#484D7D', textAlign: { xs: 'center', md: 'start' }, padding: {xs:'20px',md:'0px'}, fontSize: {xs:'2.1vh',md:'2.6vh'}}}>
             Our neobanking platform designed to manage both cryptocurrency and fiat currency offers a modern,
             integrated financial solution that combines traditional banking features with <br /> cutting-edge cryptocurrency services.
             Here’s an overview of such a platform
            </Grid>
            <Grid>
              <Grid sx={{ display: 'flex', flexDirection: 'column',gap: '30px' }}>
                <Grid>
                  <Grid sx={{ marginTop: {xs:'-20px',md:'0px'},display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', md: 'start'}, gap: {xs:'60px',md:'240px'}, color: '#2C3489', fontSize: '3vh', fontWeight: '700' }}>
                    <Grid sx={{ textAlign: 'center' }}>Fiat Transaction</Grid>
                    <Grid>Crypto Transaction</Grid>
                  </Grid>
                </Grid>
                {/* <Grid>
                  <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', md: 'start'}, gap: {xs:'60px',md:'240px'}, color: '#2C3489', fontSize: '3vh', fontWeight: '700' }}>
                    <Grid>Storefront</Grid>
                    <Grid>QR Pay</Grid>
                  </Grid>
                </Grid> */}
              </Grid> 
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'row', gap: '6px',justifyContent: {xs: 'center', md: 'start'}, cursor: 'pointer' }}>
              <Grid sx={{ color: '#CC9A35', fontSize: '2.5vh' }}>Start with Quick Cash </Grid>
              <Grid sx={{ color: '#CC9A35', fontSize: '2.5vh' }}><ArrowRightAltIcon /></Grid>  
            </Grid>
       </Grid>
       </Grid>
     </Grid>
    </section>
  )
}
