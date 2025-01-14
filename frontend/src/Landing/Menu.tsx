import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <div>
      <Grid sx={{ display: 'flex', flexDirection: 'row', color: '#483594', justifyContent: 'center', textAlign: 'center', gap: '36px', marginTop: '12px' }}>
        <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Why Quick Cash</Grid>
        <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Pricing</Grid>
        <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}><Link to="/privacy-policy" style={{ textDecoration: 'none' }}>Privacy Policy</Link></Grid>
        <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Blog</Grid>
        <Grid sx={{ cursor: 'pointer', fontSize: '16px' }}>Contact Us</Grid>
      </Grid>
    </div>
  )
}
