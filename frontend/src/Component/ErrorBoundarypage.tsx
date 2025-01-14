import { Box, Grid } from '@mui/material'
import React from 'react'

export default function ErrorBoundarypage({...props}:any) {
  console.log("props",props);
  return (
    <>
      <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '90%'}}}>
        <Grid sx={{display: 'flex',flexDirection: 'column',gap: '20px',borderRadius: '.5rem',color: 'black',fontWeight: '700',background: 'white',padding: '3px 3px'}}>
          Something went wrong
        </Grid>
      </Box> 
    </>
  )
}
