import PixIcon from '@mui/icons-material/Pix';
import { Divider, Grid, Typography } from '@mui/material';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

export default function Features() {
  return (
    <section>
     <Grid container spacing={2} sx={{ marginTop: {xs:'10px',md:'-50px'}, display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
       <Grid item xs={12} spacing={2}>
        <Typography sx={{ fontSize: {xs:'3.6vh',md:'3.6rem'} , margin: {xs:'10px', md:'5%'}, lineHeight: '2.1rem', textAlign: 'center', color: '#2C3489', fontWeight: '700'}}>Features</Typography>
       </Grid>
       <Grid item xs={12}>
         <Grid container spacing={3} sx={{ padding: '5%', marginTop: '-7%' }} className='animTop1'>
           <Grid item xs={4}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex',flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <DashboardIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Effortless Onboarding</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    With features like face recognition, fingerprints, and OTP, users can swiftly and securely create an account.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={4}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <AssuredWorkloadIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Send & Receive Money</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    Our Whitelabel NEO banking platform enables users to easily send, receive, and request money from others.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={4}>
              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <PixIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Multi-Currency Account</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    Our Whitelabel NEO banking platform offers to create international bank accounts (IBAN)
                    with comprehensive multi-currency support worldwide.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={3}>
              <Grid sx={{ display: 'flex', height: '43vh', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <CreditCardIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Virtual And Plastic Card</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    Our System easily generate the Virtual and plastic card like treditional Banking .
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={3}>
              <Grid sx={{ display: 'flex', height: '43vh', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <MoveUpIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Simple Money Transfers</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    NEO bank customers can easily transfer funds to both domestic and international bank accounts using this feature.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={3}>
              <Grid sx={{ display: 'flex', height: '43vh', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <CurrencyExchangeIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'},width: '100%',lineHeight: '2.1rem',color: '#2C3489',fontWeight: '700'}}>Currency Exchange</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '15px' }}>
                    Our Whitelabel NEO banking platform includes a built-in currency exchange feature for seamless trading between fiat and cryptocurrencies.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

           <Grid item xs={3}>
              <Grid sx={{ display: 'flex', height: '43vh', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#F2F3FF' }}>
                <Grid sx={{ display: 'flex' , flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <ReceiptIcon sx={{ fontSize: '6rem', color: '#2C3489' }} />
                </Grid>
                <Grid>
                  <Typography sx={{ fontSize: {xs:'3.6vh',md:'2.6vh'} , width: '100%', lineHeight: '2.1rem', color: '#2C3489', fontWeight: '700'}}>Invoice System</Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ padding: '10px 50px', color: '#02569C', fontSize: '14px' }}>
                    Our System levearege with complete Invoice system , so that generate and send invoice to 3rd party.
                  </Typography>
                </Grid>
              </Grid>
           </Grid>

         </Grid>
       </Grid>
     </Grid>
    </section>
  )
}
