import { Button, Grid } from '@mui/material'
import React from 'react'
import { LandingLoginbtn } from '../Component/Button/ColorButton'
import { Link } from 'react-router-dom'

export default function FooterAbove() {
  return (
    <Grid sx={{ position: 'relative', zIndex: '999', marginBottom: '10px', marginTop: {xs:'20px',md:'60px'}, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <Grid sx={{ borderRadius: '6px',  background: '#FFF0E1', width: '90%'}}>
        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Grid><img src={`${import.meta.env.VITE_LIVE_BASE_URL}/first.svg`} width={"100%"} /></Grid>
          <Grid sx={{ display: 'flex', justifyContent:'center',  alignItems: 'center' }}>
            <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <Grid sx={{ textAlign: 'center', fontSize: '3.3vh', color: '#2C3489' }}>Get Started with Quick Cash now</Grid>
              <Grid sx={{ textAlign: 'center', fontSize: {xs:'2.3vh',md:'5.3vh'}, color: '#2C3489', fontWeight: '700' }}>Start accepting crypto payments in just 15 mins</Grid>
              <Grid sx={{ textAlign: 'center',  color: '#2C3489', fontWeight: '700' }}>
                <LandingLoginbtn sx={{ background: '#3B338D', padding: '12px 30px' , marginBottom: '20px', color: 'white' }}><Link to="/register" style={{ textDecoration: 'none', color: 'white' }}>Get Started</Link></LandingLoginbtn>
              </Grid>
            </Grid>
          </Grid>
          <Grid><img src={`${import.meta.env.VITE_LIVE_BASE_URL}/second.svg`} width={"100%"} /></Grid>
        </Grid>
        {/* <Grid sx={{ display: 'flex', justifyContent: 'start' }}><img src="http://localhost:5173/myapp/second.svg" style={{  width: '120px', position: 'relative' }} /></Grid> */}
      </Grid>
    </Grid>
  )
}
