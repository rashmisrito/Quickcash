import { Divider, Grid, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function NewContentThird() {
  return (
    <section>
     <Grid container spacing={2} sx={{ marginTop: {xs:'10px',md:'-50px'}, display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
       <Grid item xs={12} sm={6} md={6} sx={{ order: {xs:2,md:1} }}>
         <Grid className='animLeft1' sx={{ display: 'flex', flexDirection: 'column', gap: '54px', justifyContent: 'center' }}>
           <Grid>
             <Typography sx={{ fontSize: {xs:'3.6vh',md:'4.6vh'} , marginTop: {xs:'10px', md:'0px'}, lineHeight: '2.1rem', textAlign: 'center', color: '#2C3489', fontWeight: '700'}}>Features</Typography>
           </Grid>
           <Grid>
            <Typography sx={{ textAlign: 'center', marginTop: {xs:'-50px', md:'0px'}, padding: {xs: '20px', md: '30px'} }}>
              By integrating Ivorypay's crypto payment solution, you and your customers can enjoy the peace of mind that comes
              with a secure and fraud-resistant payment method. With our platform, the risk of chargeback
              fraud is virtually eliminated, providing a hassle-free experience for both you and your customers.
            </Typography>
           </Grid>
         </Grid>
       </Grid>
       <Grid className='animRight1' item xs={12} sm={6} md={6} sx={{ order: {xs:1,md:2},padding: {xs: '0px', md: '120px'} , marginTop: { xs: '0px', md: '120px' } }}>
        <img src={`${import.meta.env.VITE_LIVE_BASE_URL}/landingcontentside3.png`} style={{ maxHeight: '410px', width: '100%' }} />
       </Grid>
     </Grid>
    </section>
  )
}
