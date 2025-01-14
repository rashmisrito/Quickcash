import { Grid, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useEffect } from 'react';

export default function NewContentSecond() {
  
  return (
    <section>
     <Grid container spacing={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>

       <Grid item xs={8} md={4} sx={{ marginTop: {xs: '20px', sm: '30px', md: '0px'} }}>
        <img src={`${import.meta.env.VITE_LIVE_BASE_URL}/landingcontentside2.png`} style={{ width: '100%' }} />
       </Grid>

       <Grid item xs={12} md={6} className='animRight1'>
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '23px' , textAlign: { xs: 'center', md: 'start' }, marginTop: {xs:'-50px',md:'-20px'} }}>
          <Grid sx={{ fontSize: {xs:'2.6vh',md:'4.3vh'}, lineHeight: {xs:'1.1rem',md:'2.1rem'}, color: '#2C3489', fontWeight: '700' }}>
            Whitelabel NEO Banking Platform <br /> Development Process
          </Grid>
          <Grid sx={{color: '#484D7D', fontSize: '2.3vh', padding: {xs:'12px', md:'0px'}}}>
            We use an agile development approach to create custom NEO banking apps that meet every client's needs. 
            Our customer-centric process ensures exceptional results.  
          </Grid>

          <Grid sx={{color: '#484D7D', fontSize: '2.3vh', padding: {xs:'12px', md:'0px'}}}>
            We follow this six-step framework to deliver reliable and secure FinTech solutions
          </Grid>
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: {xs:  'center', md: 'start'}, gap: '6px', cursor: 'pointer' }}>
            <Grid sx={{ color: '#CC9A35', fontSize: '2.5vh' }}>Start with Quick Cash </Grid>
            <Grid sx={{ color: '#CC9A35', fontSize: '2.5vh' }}><ArrowRightAltIcon /></Grid>  
          </Grid>
          </Grid>
        </Grid>
       
     </Grid>
    </section>
  )
}
