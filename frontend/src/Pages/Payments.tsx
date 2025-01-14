
import React from 'react';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ReportIcon from '@mui/icons-material/Report';
import Button, { ButtonProps } from '@mui/material/Button';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Collapse, Grid, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#2196f3",
   '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

export default function Payments() {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Box sx={{ marginLeft: {md:  '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '89%'}}}>
        <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '10px'}}>
          <Grid sx={{display: 'flex', flexDirection: 'row', padding: '10px 12px', borderRadius: '.5rem', background: 'white'}}>
            <Grid>
              <WarningAmberIcon sx={{ color: 'orange' , fontSize: '50px' }}/>
            </Grid>
            <Grid sx={{display: 'flex', flexDirection: 'column',  padding: '1px 30px',}}>
              <Grid sx={{color: 'black', fontWeight: '700'}}>Online payments are disabled</Grid>
              <Grid>Lorem ipsum dollar ipsum lorem dollar ipsum lorem dollar</Grid>
            </Grid>
          </Grid>
          <Grid sx={{borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
            <Grid>Dollar Account</Grid>
              <Grid>
                <Grid sx={{display: 'flex', flexDirection: 'row', padding: '10px 1px' }}>
                  <Grid sx={{fontSize: '20px'}}>$0</Grid>
                  <Grid><KeyboardArrowDownIcon sx={{fontSize: '30px'}}/></Grid>
                </Grid>
                <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                  <Grid>
                    <ColorButton variant="contained" startIcon={<VpnKeyIcon />}>
                      Payment Link
                    </ColorButton>
                  </Grid>
                  <Grid>
                    <ColorButton variant="contained" startIcon={<DescriptionIcon />}>
                      Statement
                    </ColorButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' , padding: '20px 1px'}}>
                <Grid>Payments</Grid>
                <Grid sx={{cursor: 'pointer'}}>See all</Grid>
              </Grid>
              <Grid sx={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
                No payments done yet!
              </Grid>
          </Grid>
          <Grid sx={{display: 'flex', flexDirection: 'row', padding: '10px 12px', borderRadius: '.5rem', background: 'white'}}>
            <Grid><ReportIcon sx={{ color: 'orange' , fontSize: '50px' }}/></Grid>
              <Grid sx={{display: 'flex', flexDirection: 'column',  padding: '1px 30px',}}>
                <Grid sx={{color: 'black', fontWeight: '700'}}>How do payouts work?</Grid>
                 <Grid>Lorem ipsum dollar ipsum lorem dollar ipsum lorem dollar</Grid>
                  <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                   <Grid style={{ display: `${expanded ? 'none': 'block'}` }}>Lorem ipsum dollar </Grid>
                     <Grid sx={{color: 'blue', cursor: 'pointer'}}  onClick={handleExpandClick}>
                     {expanded ? 'less details' : 'more details here' }
                     <Collapse in={expanded} timeout="auto" unmountOnExit sx={{color: 'black'}}>
                      <Typography paragraph>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
                        dummy text ever since the 1500s, when an unknown printer took a galley of type
                        and scrambled it to make a type specimen book. 
                        It has survived not only five centuries, but also the leap into electronic typesetting, 
                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
                        including versions of Lorem Ipsum
                      </Typography>
                     </Collapse>
                   </Grid>
                 </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
