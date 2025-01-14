import { Grid } from '@mui/material'
import QrCodeImage from '../../../public/qrcode.jpg'
import InvoiceLogo from '../../../public/invoicelogo.png'
import { useOutletContext } from 'react-router-dom';

export default function Mumbai({color}:any) {
  const [theme]:any = useOutletContext();
  return (
    <div>
      <Grid sx={{ background: `${color}` , height: '14px' , marginBottom: '20px' }}></Grid>
      <Grid sx={{fontSize: '30px',color: `${theme ? 'white' : 'black'}`}}>INVOICE</Grid>
      <Grid sx={{marginTop: '10px'}}><img src={InvoiceLogo} width="100px" /></Grid>

      <Grid>
        <Grid sx={{marginTop: '30px', color: `${theme ? 'white' : 'black'}`}}>From</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>ITIO Invoice</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Rajkot</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>MO: 7405868976</Grid>
      </Grid>

      <table width={"100%"} style={{marginTop: '20px'}}>
        <tbody>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>TO</td>
            <td colSpan={3} align='right' style={{ color: `${theme ? 'white' : 'black'}` }}>Payment QR Code</td>
          </tr>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Name)</td>
            <td colSpan={3} rowSpan={3} align='right'><img src={QrCodeImage} width="100px" /></td>
          </tr>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Email)</td>
          </tr>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Address)</td>
          </tr>
        </tbody>
      </table>

      <hr style={{border: `1px solid ${color}`}}/>
      <table width={"100%"} style={{marginTop: '20px' , marginBottom: '10px'}}>
        <tbody>
          <tr>
            <td style={{fontSize: '14px',color: `${theme ? 'white' : 'black'}`}}>Invoice ID:</td>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>#45C2R1</td>
          </tr>
          <tr>
            <td style={{fontSize: '14px',color: `${theme ? 'white' : 'black'}`}}>Invoice Date:</td>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>25th Nov, 2020 8:03 AM</td>
          </tr>
          <tr>
            <td style={{fontSize: '14px',color: `${theme ? 'white' : 'black'}`}}>Due Date:</td>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>26 Nov 2020</td>
          </tr>
        </tbody>
      </table>

      <table width={"100%"} style={{display: 'table', borderCollapse: 'collapse', color: `${theme ? 'white' : 'black'}`}}>
        <thead style={{borderBottom: `3px solid ${color}`}}>
          <tr style={{color: 'black'}}>
            <th style={{minWidth: '50px'}}>#</th>
            <th align='center' style={{minWidth: '200px'}}>Item</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align='center' style={{padding: '10px'}}>1</td>
            <td align='center' style={{minWidth: '200px'}}>Item 1</td>
            <td align='center'>1</td>
            <td align='center'> ₹100.00</td>
          </tr>
          <tr>
            <td align='center' style={{padding: '10px'}}>2</td>
            <td align='center' style={{minWidth: '200px'}}>Item 2</td>
            <td align='center'>1</td>
            <td align='center'> ₹100.00</td>
          </tr>
          <tr style={{borderBottom: `3px solid ${color}`}}>
            <td align='center' style={{padding: '10px'}}>3</td>
            <td align='center' style={{minWidth: '200px'}}>Item 3</td>
            <td align='center'>1</td>
            <td align='center'> ₹100.00</td>
          </tr>
        </tbody>
      </table>

      <table width={"100%"} border={0} style={{ color: `${theme ? 'white' : 'black'}` }}>
        <tr>
          <td align='right' style={{padding: '5px'}}>Amount: ₹300.00</td>
        </tr>
        <tr>
          <td style={{padding: '5px'}}></td>
        </tr>
        <tr>
          <td align='right' style={{padding: '5px'}}>Discount: ₹50.00</td>
        </tr>
        <tr>
          <td style={{padding: '5px'}}></td>
        </tr>
        <tr>
          <td align='right' style={{padding: '5px'}}>Tax: 0%</td>
        </tr>
        <tr>
          <td style={{padding: '5px'}}></td>
        </tr>
        <tr>
          <td align='right' style={{padding: '5px'}}>Total: ₹250.00</td>
        </tr>
      </table>

      <Grid sx={{marginBottom: '10px',color: `${theme ? 'white' : 'black'}`}}>Notes:</Grid>

      <Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Paypal , Stripe & manual payment method accept.</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Net 10 – Payment due in 10 days from invoice date.</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Net 30 – Payment due in 30 days from invoice date.</Grid>
      </Grid>

      <Grid sx={{marginTop: '20px', color: `${theme ? 'white' : 'black'}`}}>Terms:</Grid>

      <Grid sx={{marginBottom: '10px'}}>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>
          Invoice payment terms ; 1% 10 Net 30, 1% discount if payment received within ten days
          otherwise payment 30 days after invoice date.
        </Grid>
      </Grid>

      <Grid sx={{marginTop: '30px'}}>
        <Grid sx={{color: color, fontSize: '14px' , marginBottom: '20px'}}>Regards:</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>ITIO Invoice</Grid>
      </Grid>
    </div>
  )
}
