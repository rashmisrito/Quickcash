
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from 'react-credit-cards-2';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { PayPalButton } from "react-paypal-button-v2";
import RenderRazorpay from './Payment/RenderRazorpay';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckoutForm } from './Payment/Stripe/CheckoutForm';
import { Closebtn, Colorbtn } from '../Component/Button/ColorButton';
import { Backdrop, Box, Button, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FilledInput, FormControl, Grid, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'

interface invoiceDetails {
  currency:any;
  total:any;
  dueAmount: any;
}

export default function InvoicePayment() {

  const params = useParams();  
  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const [ZipCode,setZipCode] = React.useState<any>('');
  const [paypalDisplay,setpaypalDisplay] = React.useState(false);
  const [paymentType,setPaymentType] = React.useState<any>('');
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [payableAmount,setPayableAmount] = React.useState<any>(0)
  const [pendingAmount,setPendingAmount] = React.useState<any>(0)
  const [invoiceDetails,setInvoiceDetails] = React.useState<invoiceDetails>();
  const [paymentMode,setPaymentMode] = React.useState<any>('razorpay');
  const [payableCurrency,setPayableCurrency] = React.useState<string>('');
  const [notes,setNotes] = React.useState<any>('');
  const [finalAmount,setFinalAmount] = React.useState<any>(0);
  const [dialogItio,setDialogItio] = React.useState<boolean>(false);
  const [paymentBox,setPaymentBox] = React.useState<boolean>(false);
  
  const [orderDetails, setOrderDetails] = useState({
   orderId: null,
   currency: null,
   amount: null,
  });

  useEffect(() => {
   getInvoiceDetails(params?.id);
  },[params?.id]);

  const getInvoiceDetails = async (id:any) => {
    axios.get(`/${url}/v1/invoice/${id}`, {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
    })
    .then(result => {
      if(result.data.status == 201) {
        setPayableAmount(result.data.data[0].total);
        setPayableCurrency(result.data.data[0].currency);
        setInvoiceDetails(result.data.data[0]);
        setTimeout(() => {
         calCulateAmount(result.data.data[0],pendingAmount);
        },100);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  const handleCreateOrder = async () => {
    if(paymentMode == "razorpay") {
      razorPay(finalAmount,payableCurrency);
    } else if(paymentMode == "paypal") {
    }
  }

  const HandlePaymentType = (val:any) => {
    setPaymentType(val);
  }

  const HandlePendingAmount = (val:any) => {
    setPendingAmount(val);
    calCulateAmount(invoiceDetails,parseFloat(val));
  }

  const calCulateAmount = (values:any,pamt:any) => {
    setPayableCurrency(values?.currency);
    if(pamt > 0 && values?.dueAmount == 0) {
      if(pamt >= values?.total) {
        alertnotify("Partial should be less than total payable amount otherwise select full amount", "error");
      } else {
        setFinalAmount(pamt);
      }
    } else if(pamt == 0 && values?.dueAmount > 0) {
      setFinalAmount(values?.dueAmount);
    } else if(pamt == 0 && values?.dueAmount == 0) {
      setFinalAmount(values?.total);
    } else if(pamt > 0 && values?.dueAmount > 0) {
      if(pamt >= values?.dueAmount) {
        alertnotify("Partial should be less than total payable amount otherwise select full amount", "error");
      } else {
        setFinalAmount(pamt);
      }
    } else {
      if(pamt >= values?.total) {
        alertnotify("Partial should be less than total payable amount otherwise select full amount", "error");
      } else {
        setFinalAmount(pamt);
      }
    }
  }

  const [paypalLoading, setPaypalLoading] = React.useState(false);
  const [stripeLoading, setStripeLoading] = React.useState(false);
  const [displayItio,setDisplayItio]      = React.useState<boolean>(false);
  const [displayStripe,setDisplayStripe]  = React.useState<boolean>(false);
  
  const handleClose = () => {
    setPaypalLoading(false);
  };

  const ValidateMode = () => {
    if(paymentType == "partial" && pendingAmount == 0) {
      setPaymentMode(''); 
      alertnotify("Please fill partial amount", "error");
      return false;
     } else if(paymentType == "") {
      setPaymentMode('');
      alertnotify("Please select the payment type", "error");
      return false;
     } else {
      return true;
    }
  }

  const HandlePaymentMode = (val:any) => {
    setPaymentMode(val);
    if(ValidateMode()) {
      if(val == "paypal") {
        setPaypalLoading(false);
        setpaypalDisplay(true);
      } else if(val == "stripe") {
        setStripeLoading(false);
        setDisplayStripe(true);
        setPaymentBox(true);
      } else if(val == "razorpay") {
        setpaypalDisplay(false);
      } else if(val == "itiopay") {
        setDisplayItio(true); 
        setDialogItio(true);
        //InitiateItioPay();
      }
    }

  }

  const razorPay = async (amount:any,currency:any) => {
    await axios.post(`/${url}/v1/razorpay/createOrder`,
    {
     amount: amount*100, 
     currency: currency
    }
    )
    .then(result => {
      if(result?.data?.order_id) {
        setOrderDetails({
         orderId: result?.data?.order_id,
         currency: result?.data?.currency,
         amount: result?.data?.amount,
        });
        setDisplayRazorpay(true);
      };
    })
    .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data,"error")
    })
  }

  const alertnotify = (text:any,type:any) => {
    if(type == "error") {
      toast.error(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    } else {
      toast.success(text, {
        position: "top-center",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
  }

  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PRIVATE_KEY}`);
  
  const options = {
    mode: 'payment',
    amount: finalAmount*100,
    currency: payableCurrency.toString().toLowerCase(),
    appearance: {},
  };

  const handleDialogClose = () => {
    setDialogItio(false);
  }

  const InitiateItioPay = async () => {
    console.log("UserData", invoiceDetails);
    console.log("Notes", notes);
    console.log("Pending Amount", pendingAmount);
    console.log("Pay Amount", finalAmount);
    console.log("Payment Type", paymentType);
    await axios.post(`/api/v1/itiopay/pay`, {
      "userData": invoiceDetails,
      "amount": finalAmount,
      "currency": payableCurrency,
      "ZipCode": ZipCode,
      "cardDetails": state
    })
    .then(result => {
      console.log("result",result.data.data);
      window.location.href = `${result.data.data}`;
      console.log("ITIO RESPONSE Result: ",JSON.stringify(result.data.data, null ,2));
      setDialogItio(true);
      setPaymentBox(true);
      setDisplayItio(result.data.data);
    })  
    .catch(error => {
      console.log("ITIO PAY Error: ", error);
    })
    // const urlSend = `https://gtw.online-epayment.com/checkout?fullname=${invoiceDetails?.userDetails[0]?.name}&bill_address=${invoiceDetails?.userDetails[0]?.address}&bill_city=${invoiceDetails?.userDetails[0]?.city}&bill_country=${invoiceDetails?.userDetails[0]?.country}&bill_zip=&bill_state=&bill_phone=${invoiceDetails?.userDetails[0]?.mobile}&bill_email=${invoiceDetails?.userDetails[0]?.email}&bill_amt=${parseFloat(finalAmount).toFixed(2)}&bill_currency=${payableCurrency}&product_name=TEST - Test Product&retrycount=5&webhook_url=http://localhost:5000?action=webhook&return_url=http://localhost:5173/return?action=return&public_key=MTEzOTNfNjI2XzIwMjQwMTI1MTYyMjM3&terNO=626&reference=123456}`;
    // window.location.href = urlSend;

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: 'https://gtw.online-epayment.com/checkout?fullname=Ganesh&bill_address=Kaushambi&bill_city=Kaushambi&bill_country=IN&bill_zip&bill_state&bill_phone=9898989898&bill_email=ganeshs@itio.in&bill_amt=2&bill_currency=INR&product_name=Test Product&webhook_url&return_url&public_key=MTEzOTNfNjI2XzIwMjQwMTI1MTYyMjM3&terNO=626&reference=1793456',
    //   headers: { 
    //     'Origin': 'http://localhost:5173/ts', 
    //     'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS'
    //   },
    //   withCredentials: true
    // };
    
    // axios.request(config)
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  } 

  const [state, setState] = React.useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  const handleInputChange = (evt:any) => {
    const { name, value } = evt.target;
    if(name == "expiry") {
      const bvalue = formatExpirationDate(value);
      setState((prev) => ({ ...prev, [name]: bvalue }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  }

  function clearNumber(value = "") {
    return value.replace(/\D+/g, "");
  }

  function formatExpirationDate(value:any) {
    const clearValue = clearNumber(value);
  
    if (clearValue.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }
  
    return clearValue;
  }

  const handleInputFocus = (evt:any) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={paypalLoading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        !paymentBox &&
        <>
          <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '89%'}}}>
          <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <label>Payable Amount:</label>
                <FormControl fullWidth variant="filled" style={{width: '98%'}}>
                  <FilledInput
                    id="filled-adornment-amount"
                    readOnly
                    startAdornment={<InputAdornment position="start">{getSymbolFromCurrency(invoiceDetails?.currency)}{finalAmount}</InputAdornment>}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <label>Payment Type:</label>
                <Select fullWidth style={{width: '98%'}} onChange={(e) => HandlePaymentType(e.target.value)}>
                  <MenuItem value="">Select Payment Type</MenuItem>
                  <MenuItem value="full">Full Payment</MenuItem>
                  <MenuItem value="partial">Partial Payment</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} md={6}>
                <label>Payment Mode:</label>
                <Select fullWidth style={{width: '98%'}} value={paymentMode} onChange={(e) => HandlePaymentMode(e.target.value)}>
                  <MenuItem value="">Select Payment Mode</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                  <MenuItem value="paypal">Paypal</MenuItem>
                  <MenuItem value="razorpay">RazorPay</MenuItem>
                </Select>
              </Grid>
            {
              paymentMode == "manual" && 
              <>
                <Grid item xs={12} md={6}>
                  <label>Transaction Id:</label>
                  <TextField
                    required
                    id="name"
                    name="name"
                    fullWidth
                    style={{width: '98%'}}
                    sx={{border:'1px solid silver'}}
                    inputProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </>
            }

            {
              paymentType == "partial" && 
              <>
                <Grid item xs={12} md={6}>
                  <label>Amount:</label>
                  <TextField
                    required
                    id="amount"
                    name="amount"
                    fullWidth
                    style={{width: '98%'}}
                    sx={{border:'1px solid silver'}}
                    onChange={(e) => HandlePendingAmount(e.target.value)}
                    inputProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </>
            }


              <Grid item xs={12} md={12}>
                <label>Note:</label><br />
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={10}
                  variant="outlined"
                  fullWidth
                  style={{width: '99%'}}
                />
              </Grid>
              {
                paymentMode == "manual" && 
                <>
                  <Grid item xs={12} md={6}>
                    <label>Attach File:</label><br />
                    <TextField
                      id="qoutlined-multiline-static"
                      type='file'
                      fullWidth
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Grid>
                </>
              }
              <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'right', gap: '12px' , marginTop: '12px'}} xs={12} md={12}>
                <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , gap: '12px' }}>
                {
                  paypalDisplay &&
                  <>
                    <Grid sx={{ alignContent:'center', width: '10%'}}>
                      <PayPalButton
                        amount={finalAmount}
                        currency={payableCurrency}
                        shippingPreference="NO_SHIPPING"
                        onSuccess={(details:any, data:any) => {
                          console.log(data);
                          axios.post("/api/v1/paypal/capture", {
                            status: details?.status,
                            orderDetails: details,
                            userData:invoiceDetails, 
                            notes:notes,
                            pendingAmount:pendingAmount,
                            payAmount:finalAmount,
                            paymentType:paymentType
                          }).then(result => {
                            if(details?.status == "COMPLETED") {
                              alertnotify(result.data.message,"success");
                            }
                            navigate('/invoice-section');
                          })
                          .catch(error => {
                            console.log(error);
                            alertnotify(error.response.data.message, "error");
                          })
                        }}
                        onError={(err:any) => {
                          console.log(err);
                          alertnotify("Currency not supported!, please use other Payment Gateway", "error");
                        }}
                        options={{
                          clientId: `${import.meta.env.VITE_PAYPAL_CLIENT_ID}`,
                          currency: `${payableCurrency}`,
                          disableFunding: "card"
                        }}
                      />
                    </Grid>
                    <Grid>
                      <Closebtn onClick={() => navigate(`/invoice-section`)}>Cancel</Closebtn>
                    </Grid>
                  </>
                }
                </Grid>
                {
                  !paypalDisplay && 
                  <>
                    <Grid>
                      <Colorbtn onClick={() => handleCreateOrder()}>Pay</Colorbtn>
                    </Grid>
                    <Grid>
                      <Closebtn onClick={() => navigate(`/invoice-section`)}>Cancel</Closebtn>
                    </Grid>
                  </>
                }
                
              </Grid>

            </Grid>
          </Grid>
          </Box>
        </>
      }

       {
         displayRazorpay && (
          <>
            {/* @ts-ignore */} 
            <RenderRazorpay
              finalAmount={finalAmount}
              paymentType={paymentType}
              notes={notes}
              pendingAmount={pendingAmount}
              payAmount={finalAmount}
              details={invoiceDetails}
              amount={orderDetails?.amount}
              currency={orderDetails?.currency}
              orderId={orderDetails?.orderId}
              keyId={"rzp_test_TR6pZnguGgK8hQ"}
              keySecret={"vOOrz3WBt8g7053lAZWGHPnz"}
            />
          </>
        )
       }

       {
        displayStripe && (
          <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '89%'}}}>
           <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
           {/* @ts-ignore */} 
           <Elements stripe={stripePromise} options={options}>
            <CheckoutForm 
              finalAmount={finalAmount}
              paymentType={paymentType}
              notes={notes}
              pendingAmount={pendingAmount}
              payAmount={finalAmount}
              details={invoiceDetails}
              amount={finalAmount}
              currency={payableCurrency}
              orderId={""}
            />
           </Elements>
          </Grid>
         </Box> 
        )
       }

      {
        displayItio && 
        <>
          <Box sx={{ marginLeft: {md: '7%'} , marginTop: '12px' , fontSize: '15px', width: {md: '89%'}}}>
           <Grid sx={{display: 'flex', flexDirection: 'column' , gap: '20px',borderRadius: '.5rem', color: 'black', fontWeight: '700', background: 'white' , padding: '10px 12px'}}>
            <Dialog
              open={dialogItio}
              onClose={handleDialogClose}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries((formData as any).entries());
                  const email = formJson.email;
                  console.log(email);
                  handleClose();
                },
              }}
            >
              <DialogTitle>ITIO PAY</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Typography>
                    {/* @ts-ignore */} 
                    Name: {invoiceDetails?.userDetails[0]?.name} <br />
                    Amount: {getSymbolFromCurrency(payableCurrency)}{finalAmount} <br />
                    {/* @ts-ignore */} 
                    Email ID: {invoiceDetails?.userDetails[0]?.email} <br />
                    <br />
                  </Typography>
                </DialogContentText>
                <CardContent
                  component={Stack}
                  spacing={3}
                  sx={{ height: "auto", justifyContent: "center", padding: 0 }}
                >
                <Card
                  number={state.number}
                  expiry={state.expiry}
                  cvc={state.cvc}
                  name={state.name}
                />
                <TextField
                  label="Name"
                  name="name"
                  type="text"
                  inputMode="numeric"
                  size="medium"
                  InputLabelProps={{
                  shrink: true,
                  style: {
                   color: `black`
                  }
                  }}
                  value={state.name}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder='Name'
                />
              <TextField
                label="Card Number"
                name="number"
                type="number"
                size="medium"
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: `black`
                  }
                }}
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  label="CVV"
                  name="cvc"
                  type="tel"
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                     color: `black`,
                    }
                  }}
                  value={state.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  inputProps={{ maxLength: 3 }}
                />
                <TextField
                  label="Expiry Date"
                  name="expiry"
                  type="tel"
                  size="medium"
                  InputLabelProps={{
                   shrink: true,
                   style: {
                    color: `black`
                   }
                  }}
                  value={state.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  inputProps={{ maxLength: 5 , min: `${new Date().toISOString().split('T')[0]}` }}
                />
                <TextField
                  label="Zip Code"
                  name="zipcode"
                  type="tel"
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                     color: `black`
                    }
                  }}
                  onChange={(e) => setZipCode(e.target.value)}
                  inputProps={{ maxLength: 6 , min: `${new Date().toISOString().split('T')[0]}` }}
                />
              </Box>
              <Colorbtn size="large" sx={{ fontWeight: "bold" }} onClick={() => InitiateItioPay()}>
                Submit
              </Colorbtn>
                </CardContent>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
            
          </Grid>
         </Box> 
        </>
      }

    </>
  )
}
