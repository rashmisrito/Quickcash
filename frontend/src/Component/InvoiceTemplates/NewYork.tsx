import { Grid } from '@mui/material'
import QrCodeImage from '../../../public/qrcode.jpg'
import InvoiceLogo from '../../../public/invoicelogo.png'
import { useOutletContext } from 'react-router-dom';

export default function NewYork({color}:any) {

  const [theme]:any = useOutletContext();

  return (
    <>
      <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Grid><img src={InvoiceLogo} width="100px" /></Grid>
        <Grid sx={{fontSize: '46px', color: `${theme ? 'white' : 'black'}`}}>INVOICE</Grid>
      </Grid>

      <table width="100%" style={{color: `${theme ? 'white' : 'black'}`}}>
        <tbody>
          <tr>
            <td>ITIO Invoice</td>
            <td align='right'>Invoice ID:	</td>
            <td align='right'>#9B5QX7</td>
          </tr>
          <tr>
            <td>Rajkot</td>
            <td align='right'>Invoice Date:	</td>
            <td align='right'>25th Nov, 2020 8:03 AM</td>
          </tr>
          <tr>
            <td>Mo: 7405868976</td>
            <td align='right'>Due Date:	</td>
            <td align='right'>25 Nov 2020</td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{marginTop: '20px',color: `${theme ? 'white' : 'black'}`}}>
        <tr>
          <td>To</td>
          <td>Payment QR</td>
        </tr>
        <tr>
          <td>(Client Name)</td>
          <td>Code:</td>
        </tr>
        <tr>
          <td style={{alignContent: 'flex-start', height: '10px'}}>(Client Email)</td>
          <td rowSpan={2}><img src={QrCodeImage} width="140px" /></td>
        </tr>
        <tr>
          <td style={{alignContent: 'flex-start'}}>(Client Address)</td>
        </tr>
      </table>

      <table width={"100%"} border={1} style={{display: 'table', borderCollapse: 'collapse',color: `${theme ? 'white' : 'black'}`}}>
        <thead>
          <tr style={{background: `${color}`, color: 'white'}}>
            <th style={{minWidth: '50px'}}>#</th>
            <th align='center' style={{minWidth: '200px'}}>ITEM</th>
            <th>QTY</th>
            <th>AMOUNT</th>
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
          <tr>
            <td align='center' style={{padding: '10px'}}>3</td>
            <td align='center' style={{minWidth: '200px'}}>Item 3</td>
            <td align='center'>1</td>
            <td align='center'> ₹100.00</td>
          </tr>
        </tbody>
      </table>

      <table width={"100%"} border={0} style={{ color: `${theme ? 'white' : 'black'}` }}>
        <tr><td align='right' style={{padding: '5px'}}>AMOUNT: ₹300.00</td></tr>
        <tr><td style={{padding: '5px'}}></td></tr>
        <tr><td align='right' style={{padding: '5px'}}>DISCOUNT: ₹50.00</td></tr>
        <tr><td style={{padding: '5px'}}></td></tr>
        <tr><td align='right' style={{padding: '5px'}}>TAX: 0%</td></tr>
        <tr><td style={{padding: '5px'}}></td></tr>
        <tr><td align='right' style={{padding: '5px'}}>TOTAL: ₹250.00</td></tr>
      </table>

      <Grid sx={{marginBottom: '10px',color: `${theme ? 'white' : 'black'}`}}>Notes:</Grid>

      <Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Paypal , Stripe & manual payment method accept.</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Net 10 – Payment due in 10 days from invoice date.</Grid>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Net 30 – Payment due in 30 days from invoice date.</Grid>
      </Grid>

      <Grid sx={{marginTop: '20px', color: `${theme ? 'white': 'black'}`}}>Terms:</Grid>

      <Grid sx={{marginBottom: '10px'}}>
        <Grid sx={{color: `${theme ? 'white' : '#7a7a7a'}`, fontSize: '14px'}}>Invoice payment terms ; 1% 10 Net 30, 1% discount if payment received within ten days
          otherwise payment 30 days after invoice date.</Grid>
      </Grid>

      <Grid sx={{marginTop: '20px',color: `${theme ? 'white' : '#7a7a7a'}`}}>Regards:</Grid>
      <Grid sx={{marginTop: '20px',color: `${theme ? 'white' : '#7a7a7a'}`}}>ITIO Invoice</Grid>
    </>
  )
}
