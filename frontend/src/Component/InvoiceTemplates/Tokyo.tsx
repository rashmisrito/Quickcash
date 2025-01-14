import { Grid } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import QrCodeImage from '../../../public/qrcode.jpg'
import InvoiceLogo from '../../../public/invoicelogo.png'

export default function Tokyo({color}:any) {
  const [theme]:any = useOutletContext();
  return (
    <div>
      <Grid sx={{ background: `${color}` , height: '14px' , marginBottom: '20px' }}></Grid>
      <Grid sx={{marginTop: '10px'}}><img src={InvoiceLogo} width="100px" /></Grid>

      <Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>ITIO Invoice</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Rajkot</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>MO: 7405868976</Grid>
      </Grid>

      <Grid sx={{fontSize: '30px', marginTop: '30px',color: `${theme ? 'white' : 'black'}`}}>INVOICE</Grid>

      <table width={"100%"} style={{marginTop: '20px'}}>
        <tbody>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>TO</td>
          </tr>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Name)</td>
          </tr>
          <tr>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Email)</td>
            <td></td>
            <td align='right' style={{ color: `${theme ? 'white' : 'black'}` }}>Payment QR Code</td>
          </tr>
          <tr style={{border: '1px solid black'}}>
            <td style={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>(Client Address)</td>
            <td></td>
            <td colSpan={3} rowSpan={10} align='right'><img src={QrCodeImage} width="140px" /></td>
          </tr>
          <tr style={{ color: `${theme ? 'white' : 'black'}` }}>
            <td>Invoice Id:</td>
            <td>#24GD74</td>
          </tr>
          <tr style={{ color: `${theme ? 'white' : 'black'}` }}>
            <td>Invoice Date:</td>
            <td>25 Nov 2020 8:03 AM</td>
          </tr>
          <tr style={{ color: `${theme ? 'white' : 'black'}` }}>
            <td>Due Date:</td>
            <td>26 Nov 2020</td>
          </tr>
        </tbody>
      </table>

      <Grid sx={{background: color, height: '14px', marginBottom:'20px'}}></Grid>

      <table width={"100%"} style={{display: 'table', borderCollapse: 'collapse',color: `${theme ? 'white' : 'black'}`}}>
        <thead style={{borderBottom: `1px solid ${color}`,borderTop: `1px solid ${color}`}}>
          <tr>
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

      <Grid sx={{marginTop: '20px',color: `${theme ? 'white' : 'black'}`}}>Terms:</Grid>

      <Grid sx={{marginBottom: '10px'}}>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>
          Invoice payment terms ; 1% 10 Net 30, 1% discount if payment received within ten days
          otherwise payment 30 days after invoice date.
        </Grid>
      </Grid>

      <Grid sx={{marginTop: '30px'}}>
        <Grid sx={{fontSize: '14px' , marginBottom: '20px', color: `${theme ? 'white' : 'black'}`}}>Regards:</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>ITIO Invoice</Grid>
      </Grid>
    </div>
  )
}
