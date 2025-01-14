import axios from 'axios';
import { useEffect, useState } from 'react';
import { Colorbtn } from '../../Component/Button/ColorButton';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

export default function Complete() {

  const params   = useParams();
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const url      = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    getDetailsOfCryptoTransaction();
  },[params?.id]);

  const [info,setInfo] = useState<any>([]);

  // This function is for getting crypto transaction details

  const getDetailsOfCryptoTransaction = async () => {
    await axios.get(`/${url}/v1/crypto/getdetails/${params.id}`,
    {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setInfo(result?.data?.data);
      }
    })
     .catch(error => {
      navigate("/crypto");
      console.log("error", error);
    });
  }

  return (
    <>
      {
        info ?
        <>
          <Grid sx={{ display: 'flex' , flexDirection: 'column' , background: `${theme ? '#183153': ''}`, borderRadius: '.5rem', p: '10px',  marginTop: { xs: '-10px', md: '20px' }, marginLeft: {xs: '0%',md: '7%'},width: {xs: '100%', lg: '89%'} }}>
            
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center',border: `${theme ? '1px solid white' : '1px solid #635BFF'}`,background: `${theme ? '' : '#635BFF'}`}}>
              <Box sx={{ border: `${theme ? '' : '1px solid #635BFF'}`, width: '50%', padding: '1.5%', background: `${theme ? '' : '#635BFF'}` }}>
                <Typography variant='h5' sx={{ textAlign: 'center', color: 'white' }}>Crypto {info?.[0]?.side.toUpperCase()}</Typography>
              </Box>           
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center',background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
            <Box sx={{ border: `${theme ? '' : '1px solid white'}`, padding: '2.5%'}}>
                <img src={`${import.meta.env.VITE_APP_URL}/icons/success2.svg`} />
              </Box> 
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white' }}>
            <Box sx={{ border: `${theme ? '' : '1px solid white'}`, padding: '1.5%'}}>
              <Typography variant='h4' sx={{ textAlign: 'center', color: `${theme ? 'white': 'black'}` }}>TRANSACTION COMPLETED</Typography>
              <Typography variant='h6' sx={{ marginTop: '12px',textAlign: 'center', color: `${theme ? 'white': 'black'}` }}>
                {info?.[0]?.side == "buy" ? "Please wait for admin approval" : '' }</Typography>
              </Box> 
            </Grid>

           {
            info?.[0]?.side == "buy" ?
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
            <Box sx={{ border: `${theme ? '' : '1px solid silver'}`, width: '80%', padding: '1.5%'}}>
              <p style={{textAlign: 'center', color: `${theme ? 'white': 'black'}`}}>
                Total <br />
                {parseFloat(info?.[0]?.amount) + parseFloat(info?.[0]?.fee)} {info?.[0]?.currencyType}
              </p>
            </Box> 
            </Grid>
            :
            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
            <Box sx={{ border: `${theme ? '' : '1px solid silver'}`, width: '80%', padding: '1.5%'}}>
              <p style={{textAlign: 'center', color: `${theme ? 'white': 'black'}`}}>
                Getting Amount <br />
                {parseFloat(info?.[0]?.amount) - parseFloat(info?.[0]?.fee)} {info?.[0]?.currencyType}
              </p>
            </Box> 
            </Grid>
           }

            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
              <Divider orientation="vertical" flexItem sx={{ height: '50px' }} />
            </Grid>

            {
              info?.[0]?.side == "buy" ?
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
                <Box sx={{ border: `${theme ? '' : '1px solid silver'}`, width: '80%', padding: '1.5%',marginBottom: '2%', }}>
                  <p style={{textAlign: 'center', color: `${theme ? 'white': 'black'}`}}>
                    Getting Coin <br />
                    {info?.[0]?.noOfCoins} <span style={{ color: '#FFAF30', fontWeight: '700' }}>{info?.[0]?.coin.replace('_TEST','')}</span>
                  </p>
                </Box> 
              </Grid>
              :
              <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderLeft: '1px solid white', borderRight: '1px solid white'}}>
                <Box sx={{ border: `${theme ? '' : '1px solid silver'}`, width: '80%', padding: '1.5%',marginBottom: '2%', }}>
                  <p style={{textAlign: 'center', color: `${theme ? 'white': 'black'}`}}>
                    Total Coin Sell <br />
                    {info?.[0]?.noOfCoins} <span style={{ color: '#FFAF30', fontWeight: '700' }}>{info?.[0]?.coin.replace('_TEST','')}</span>
                  </p>
                </Box> 
              </Grid>
            }

            <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', background: `${theme ? '' : 'white'}`, borderBottom: '1px solid white', borderLeft: '1px solid white', borderRight: '1px solid white'}}>
            <Box sx={{ padding: '0.5%', width: {xs: '90%',sm:'50%'},marginBottom: '5%' }}>
              <Colorbtn sx={{ padding: '20px', background: `${theme ? '#183153': '#FFAF30'}`, border: `${theme ? '1px solid white': ''}`, fontWeight: '700' }} onClick={() => navigate('/crypto')} fullWidth>Back to Crypto</Colorbtn>
            </Box> 
            </Grid>

          </Grid>
        </>
        :
        null
      }
    </>
  )
}
