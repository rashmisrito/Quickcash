import { Grid } from '@mui/material';

export default function CryptoAddv() {
  return (
    <Grid sx={{display: 'flex', marginTop: '6%', justifyContent: 'center'}}>
      <Grid container sx={{ background: '#2C3489', width: '90%',height: '50vh', borderRadius: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} sm={12} md={4} sx={{ textAlign: 'center', fontWeight: '700', fontSize: {xs:'1.2rem',lg:'2.4rem'}, color: 'white', padding: '50px' }}>Make Every Crypto Count</Grid>
        <Grid item xs={12} sm={12} md={8} sx={{ marginTop: '-16%', overflow: 'hidden' ,display: {xs: 'none', lg: 'flex'} }}>
          <img src={`${import.meta.env.VITE_LIVE_BASE_URL}/cryptoadd.png`} />
        </Grid>
      </Grid>  
    </Grid>
  )
}
