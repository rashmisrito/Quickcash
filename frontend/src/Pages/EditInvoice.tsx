import axios from 'axios';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-quill/dist/quill.snow.css';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useCurrency } from '../Hooks/useCurrency';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Colorbtn } from '../Component/Button/ColorButton';
import Button, { ButtonProps } from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate, useParams , useOutletContext } from 'react-router-dom';
import { Box, Grid, ListItemText, MenuItem,TextField, Toolbar, Typography } from '@mui/material';

const ColorRedButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "red",
   '&:hover': {
     backgroundColor: "red",
   },
 }));

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  data: {
    defaultcurr: string;
    email: string;
    id: string;
    name: string;
    type: string;
  };
}

export default function EditInvoice() {

  const params = useParams();
  const navigate = useNavigate();
  const { currencyList } = useCurrency();
  const [theme]:any = useOutletContext();
  const [tax,setTax] = React.useState<any>(0);
  const [inv,setInv] = React.useState<any>("");
  const [userid,setUserId] = React.useState<any>('');
  const [note,setNote] = React.useState<any>('');
  const [value, setValue] = React.useState('yes');
  const [taxList,setTaxList] = React.useState([]);
  const [total,setTotal] = React.useState<any>(0);
  const [terms,setTerms] = React.useState<any>('');
  const [urlinvoice,seturlinvoice] = React.useState<any>('');
  const [subTotal,setSubtotal] = React.useState<any>(0);
  const [QRCodeList,setQRCodeList] = React.useState([]);
  const [currency,setCurrency] = React.useState<any>('');
  const [status,setStatus] = React.useState<any>("unpaid");
  const [discountType,setDiscountType] = React.useState('');
  const [InvoiceDate,setInvoiceDate] = React.useState<any>('');
  const [disCountGiven,setDiscountGiven] = React.useState<any>(0);
  const [overAllTax,setOverAllTax] = React.useState<string[]>([]);
  const [payment_qr_code,setPaymentQRCode] = React.useState<any>('');
  const [InvoiceDueDate,setInvoiceDueDate] = React.useState<any>('');
  const [recurringCycle,setRecurringCycle] = React.useState<any>('');
  const [OverAllDiscount,setOverAllDiscount] = React.useState<any>(0);
  const [noteandTerms,setnoteandTerms] = React.useState<boolean>(false);
  const [invoiceOption,setInvoiceOption] = React.useState<any>("Default");
  const [overAllTaxAddNormalTax,setOverAllTaxAddNormalTax] = React.useState(0);
  const [othersInfo,setothersInfo] = React.useState<any>('');
  const [inputs, setInputs] = useState([{ productName: "", productId: "", qty: "", price: "", tax: 0, taxValue: 0, amount: 0 }]);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  
  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getTaxList(accountId?.data?.id);
    getPaymentQRCodeList(accountId?.data?.id);
    getInvNumber();
    getProductsData();
  },[]);

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      // ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }], 
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
    ],
  };

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
  };

  const getInvNumber = async () => {
    await axios.get(`/${url}/v1/invoice/${params?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setInv(result.data.data[0].invoice_number);
        seturlinvoice(result?.data?.data[0]?.url);
        setUserId(result?.data?.data[0]?.userid);
        setothersInfo(result?.data?.data[0]?.othersInfo);
        setInv(result.data.data[0].invoice_number);
        setInvoiceDate(result.data.data[0].invoice_date);
        setInvoiceDueDate(result.data.data[0].due_date);
        setStatus(result.data.data[0].status);
        setInvoiceOption(result.data.data[0].invoice_country);
        setPaymentQRCode(result.data.data[0].payment_qr_code);
        setCurrency(result.data.data[0].currency);
        setRecurringCycle(result.data.data[0].recurring_cycle);
        setValue(result.data.data[0].recurring);
        setSubtotal(result.data.data[0].subTotal);
        setDiscountGiven(result.data.data[0].sub_discount);
        setTax(result.data.data[0].sub_tax);
        setTotal(result.data.data[0].total);
        setInputs(result.data.data[0].productsInfo);
        setDiscountType(result.data.data[0].discount_type);
        setOverAllDiscount(result.data.data[0].discount);
        setOverAllTax(result.data.data[0].tax);
        setNote(result.data.data[0].note);
        setTerms(result.data.data[0].terms);
        if(result.data.data[0].note || result.data.data[0].terms) {
          setnoteandTerms(true);
        }
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  };

  const getTaxList = async(id:any) => {
    await axios.get(`/${url}/v1/tax/list/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setTaxList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  };

  const getPaymentQRCodeList = async(id:any) => {
    await axios.get(`/${url}/v1/qrcode/list/${id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setQRCodeList(result.data.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  };

  const handleAddInput = () => {
    setInputs([...inputs, { productName: "", productId: "", qty: "", price: "", tax: 0, taxValue: 0, amount: 0 }]);
  };

  useEffect(() => {
    getCalculateValues();
  },[inputs,discountType,OverAllDiscount,overAllTax]);

  const getCalculateValues = () => {
    var subTotal = 0;
    var taxVal = 0;
    inputs?.map((itm) => {
      if(itm.qty != "" && itm.price != "") {
        subTotal = subTotal + (parseFloat(itm.qty) * parseFloat(itm.price))
      }
      if(itm.tax > 0) {
        taxVal = taxVal + itm.taxValue
      }
    });

    if(taxVal > 0) {
      var subt = subTotal + taxVal;
      setTax(taxVal);
      setTotal(subt);
      setSubtotal(subTotal);
    } else {
      setTax(taxVal);
      setTotal(subTotal);
      setSubtotal(subTotal);
    }

    if(discountType != "") {
      if(discountType == "fixed") {
        var valH = (subTotal * taxVal)/100;
        if(overAllTaxAddNormalTax > 0) {
          var subt = (subTotal + overAllTaxAddNormalTax) - OverAllDiscount;
        } else {
          var subt = (subTotal + valH) - OverAllDiscount;
        }
        setTax(valH);
        setTotal(subt);
        setSubtotal(subTotal);
        setDiscountGiven(OverAllDiscount);
      } else if(discountType == "percentage") {
          var valH = (subTotal * taxVal)/100;
          if(overAllTaxAddNormalTax > 0) {
            var subt = (subTotal + overAllTaxAddNormalTax) - (subTotal + overAllTaxAddNormalTax) * (OverAllDiscount/100);
            setDiscountGiven((subTotal + overAllTaxAddNormalTax) * OverAllDiscount/100);
          } else {
            var subt = (subTotal + valH) - (subTotal + valH) * OverAllDiscount/100;
            setDiscountGiven(((subTotal + valH) * OverAllDiscount/100));
          }
          setTax(valH);
          setTotal(subt);
          setSubtotal(subTotal);
      }
    }

    var otax = 0;
    if(overAllTax.length > 0) {
      taxList?.map((itm2:any) => {
        if(overAllTax.includes(`${itm2.Name}-${itm2.taxvalue}`)) {
          otax = otax + itm2.taxvalue;
        } 
      });
    }

    if(otax > 0) {
      var subt = subTotal + taxVal;
      var valH1 = (subt * otax)/100;
      var newTotal = subt+valH1;
      setOverAllTaxAddNormalTax(taxVal+valH1);
      setTax(taxVal+valH1);
      setTotal(newTotal);
      if(discountType != '') {
        console.log("newTotal", newTotal,discountType,OverAllDiscount);
        if(discountType == "fixed" && OverAllDiscount > 0) {
          setTotal(newTotal-parseFloat(OverAllDiscount));
          setDiscountGiven(OverAllDiscount);
        } else if(discountType == "percentage") {
          setTotal((newTotal) - (newTotal)*parseFloat(OverAllDiscount)/100);
          setDiscountGiven(newTotal * parseFloat(OverAllDiscount)/100);
        }
      }
    } else {
      setOverAllTaxAddNormalTax(taxVal);
      setTax(taxVal);
    } 
  };

  async function getProductUnitPrice(val:any) {
    const idValue = val.split('-');
    const result = await axios.get(`/${url}/v1/product/${idValue[0]}`, 
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    .then(result => {
    if(result.data.status == 201) {
      console.log("Price",result?.data?.data?.unitPrice);
      return result?.data?.data?.unitPrice
     }
    })
    .catch(error => {
      console.log("Invoice Product API Error", error);
    });

    return result;
  }

  const handleChange2 = async (event:any, index:number) => {
    let { name, value } = event.target;
    if(name == "qty") {
      let onChangeValue = [...inputs];
      onChangeValue[index]['qty'] = value;
      setInputs(onChangeValue);
      inputs?.map((itm,ind) => {
        if(ind == index) {
          if(itm.qty != "" && itm.price != "") {
            onChangeValue[index]['amount'] = parseFloat(itm.qty) * parseFloat(itm.price);
            onChangeValue[index]['taxValue'] = itm?.amount * itm.tax / 100;
          }
        }
      })
    } else if(name == "price") {
      let onChangeValue = [...inputs];
      onChangeValue[index]['price'] = value;
      setInputs(onChangeValue);
      inputs?.map((itm,ind) => {
        if(ind == index) {
          if(itm.qty != "" && itm.price != "") {
            onChangeValue[index]['amount'] = parseFloat(itm.qty) * parseFloat(itm.price);
            onChangeValue[index]['taxValue'] = itm?.amount * itm.tax / 100;
          }
        }
      })
    } else if(name == "productName") {
      const pprice = await getProductUnitPrice(value);
      let onChangeValue = [...inputs];
      const idValue = value.split('-');
      onChangeValue[index]['productName'] = idValue[1];
      onChangeValue[index]['productId'] = idValue[0];
      onChangeValue[index]['price'] = pprice;
      onChangeValue[index]['qty'] = '1';
      inputs?.map((itm,ind) => {
        if(ind == index) {
          if(itm.qty != "" && itm.price != "") {
            onChangeValue[index]['amount'] = parseFloat(itm.qty) * parseFloat(itm.price);
            onChangeValue[index]['taxValue'] = itm?.amount * itm.tax / 100;
          }
        }
      })
      setInputs(onChangeValue);
    } else if(name == "amount") {
      let onChangeValue = [...inputs];
      onChangeValue[index]['amount'] = value;
      setInputs(onChangeValue);
    } else if(name == "tax") {
      let onChangeValue = [...inputs];
      console.log("taxvalue",value);
      onChangeValue[index]['tax'] = value;
      setInputs(onChangeValue);
      inputs?.map((itm,ind) => {
        if(ind == index) {
          if(itm.qty != "" && itm.price != "") {
            onChangeValue[index]['taxValue'] = itm?.amount * itm.tax / 100;
          }
        }
      })
    }
  };

  const HandleDiscountThings = (e:any) => {
    setDiscountType(e);
    setOverAllDiscount(0);
  };

  const handleDeleteInput = (index:any) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  };

  const handleChange3 = (event: SelectChangeEvent<typeof overAllTax>) => {
    const {
      target: { value },
    } = event;
    setOverAllTax(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [invoiceProductsData,setInvProductsData] = React.useState<any>([]);

  const getProductsData = async () => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/product/list/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result?.data?.status == "201") {
        setInvProductsData(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

  const HandleUpdateInvoice = async (val:any) => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.patch(`/${url}/v1/invoice/update/${params?.id}`, {
      "user": accountId?.data?.id,
      "url": urlinvoice,
      "userid": userid,
      "othersInfo": othersInfo,
      "invoice_number":  inv,
      "invoice_country": invoiceOption,
      "invoice_date": InvoiceDate,
      "due_date": InvoiceDueDate,
      "payment_qr_code": payment_qr_code,
      "currency": currency,
      "recurring": value,
      "recurring_cycle": recurringCycle,
      "productsInfo": inputs,
      "discount": OverAllDiscount,
      "discount_type": discountType,
      "tax": overAllTax,
      "subTotal": subTotal,
      "sub_discount": disCountGiven,
      "sub_tax": tax,
      "total": total,
      "status": status,
      "note": note,
      "terms": terms,
      "noteandterms": noteandTerms,
      "currency_text": getSymbolFromCurrency(currency),
      "type": val
   }, 
   { 
    headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify(result.data.message,"success");
      navigate('/invoice-section');
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  };

  const HandleCancelInvoice = () => {
    var r = confirm("Are you sure?");
    if(r == true){
      navigate('/invoice-section');
    } else {
      return false;
    }
  }

  const HandleDiscountOverall = (val:any) => {
    if(val > subTotal) {
      alertnotify("Discount should be less than or equal to subtotal amount", "error");
      setOverAllDiscount(0);
    } else {
      setOverAllDiscount(val);
    }
  }

  return (
    <>
      <Toolbar sx={{ display: 'flex' , flexDirection: 'column' , borderRadius: '.5rem', p: '2px', marginTop:'10px', background:{xs: `${theme ? '#183153' : ''}`,md: `${theme ? '#183153' : 'white'}`},border: {xs: `${theme ? '1px solid white' : ''}`,md: `${theme ? '1px solid white' : 'white'}`} }}> 
        <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography>
            <Colorbtn sx={{cursor: 'pointer', float: 'right', marginTop: '10px'}} onClick={() => navigate('/invoice-section')}>Back</Colorbtn>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <label>Invoice #</label>
              <TextField
                required
                id="invoice"
                name="invoice"
                value={inv}
                fullWidth
                sx={{border:'1px solid silver', borderRadius:'7px'}}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Invoice Date</label>
              <TextField
                required
                id="value"
                name="value"
                type="date"
                value={InvoiceDate}
                fullWidth
                onChange={(e) => setInvoiceDate(e.target.value)}
                sx={{border:'1px solid silver', borderRadius:'7px'}}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Due Date</label>
              <TextField
                required
                id="value"
                name="value"
                type="date"
                fullWidth
                value={InvoiceDueDate}
                onChange={(e) => setInvoiceDueDate(e.target.value)}
                sx={{border:'1px solid silver', borderRadius:'7px'}}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Status</label>
              <Select fullWidth value={status} sx={{ border:  `${theme ? '1px solid white': ''}` }} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="paid" sx={{ color: `${theme ? 'white': 'black'}` }}>Paid</MenuItem>
                <MenuItem value="unpaid" sx={{ color: `${theme ? 'white': 'black'}` }}>Unpaid</MenuItem>
                <MenuItem value="partial" sx={{ color: `${theme ? 'white': 'black'}` }}>Partially Paid</MenuItem>
                <MenuItem value="overdue" sx={{ color: `${theme ? 'white': 'black'}` }}>Overdue</MenuItem>
                <MenuItem value="processing" sx={{ color: `${theme ? 'white': 'black'}` }}>Processing</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Invoice Template:</label>
              <Select fullWidth value={invoiceOption} name="status" sx={{border: '1px solid silver', borderRadius: '7px'}} onChange={(e) => setInvoiceOption(e.target.value)}>
                <MenuItem value="Default" sx={{ color: `${theme ? 'white': 'black'}` }}>Default</MenuItem>
                <MenuItem value="New_York" sx={{ color: `${theme ? 'white': 'black'}` }}>New York</MenuItem>
                <MenuItem value="Toronto" sx={{ color: `${theme ? 'white': 'black'}` }}>Toronto</MenuItem>
                <MenuItem value="Rio" sx={{ color: `${theme ? 'white': 'black'}` }}>Rio</MenuItem>
                <MenuItem value="London" sx={{ color: `${theme ? 'white': 'black'}` }}>London</MenuItem>
                <MenuItem value="Istanbul" sx={{ color: `${theme ? 'white': 'black'}` }}>Istanbul</MenuItem>
                <MenuItem value="Mumbai" sx={{ color: `${theme ? 'white': 'black'}` }}>Mumbai</MenuItem>
                <MenuItem value="Hong_Kong" sx={{ color: `${theme ? 'white': 'black'}` }}>Hong Kong</MenuItem>
                <MenuItem value="Tokyo" sx={{ color: `${theme ? 'white': 'black'}` }}>Tokyo</MenuItem>
                <MenuItem value="Paris" sx={{ color: `${theme ? 'white': 'black'}` }}>Paris</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Payment QR Code:</label>
              <Select value={payment_qr_code} name="payment_qr_code" onChange={(e) => setPaymentQRCode(e.target.value)} sx={{border: '1px solid silver', borderRadius: '7px'}} fullWidth>
              {
                QRCodeList?.map((item:any,index:number) => (
                  <MenuItem value={item?._id} key={index} sx={{ color: `${theme ? 'white': 'black'}` }}>{item?.title}</MenuItem>                
                ))
              }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Select Currency:</label>
              <Select fullWidth value={currency} name="currency" onChange={(e) => setCurrency(e.target.value)} sx={{border: '1px solid silver', borderRadius: '7px'}}>
              {
                currencyList?.map((item:any,index:number) => (
                  <MenuItem value={item?.base_code} key={index} sx={{ color: `${theme ? 'white': 'black'}` }}>
                    {getSymbolFromCurrency(item?.base_code)} {item?.base_code}
                  </MenuItem>
                ))
              }
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end' , marginBottom: '12px'}}>
              <Colorbtn onClick={() => handleAddInput()}>Add</Colorbtn>
            </Grid> 
            <Box sx={{ overflow: "auto" }}>
             <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <Grid item xs={12} sm={12}>
                <table width={"100%"} style={{borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: '#c0c0c01f'}}>
                      <th style={{padding: '10px'}}>#</th>
                      <th style={{padding: '10px'}}>PRODUCT</th>
                      <th style={{padding: '10px'}}>QTY</th>
                      <th style={{padding: '10px'}}>UNIT PRICE</th>
                      {/* <th style={{padding: '10px'}}>TAX</th> */}
                      <th style={{padding: '10px'}}>AMOUNT</th>
                      <th style={{minWidth: '100px'}}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                  {inputs.map((item, index) => (
                    <tr>
                      <td align='center' style={{padding: '10px'}}>{index+1}</td>
                      <td align='center' style={{padding: '10px'}}>
                        {/* <TextField
                          required
                          id="productName"
                          name="productName"
                          type="text"
                          value={item?.productName}
                          placeholder='Enter Product Name'
                          fullWidth
                          sx={{border:'1px solid silver', borderRadius:'7px', minWidth:"200px"}}
                          onChange={(event) => handleChange2(event, index)}
                          inputProps={{
                           shrink: true
                          }}
                        /> */}
                         <Select id="productName" value={`${item?.productId}-${item?.productName}`} name="productName" onChange={(event) => handleChange2(event, index)} sx={{ border: `${theme ? '1px solid silver': 'black'}`,minWidth: '120px' }} fullWidth required>
                          {
                            invoiceProductsData?.map((item:any,index:number) => (
                              <MenuItem key={index} value={`${item?._id}-${item?.name}`}>{item?.name}</MenuItem>
                            ))
                          }
                         </Select>
                      </td>
                      <td align='center' style={{padding: '10px'}}>
                        <TextField
                          required
                          id="qty"
                          name="qty"
                          type="number"
                          value={item?.qty}
                          placeholder='Enter Quantity'
                          fullWidth
                          sx={{ border:'1px solid white',borderRadius:'7px', minWidth:"200px"}}
                          onChange={(event) => handleChange2(event, index)}
                          inputProps={{
                          shrink: true
                          }}
                        />
                      </td>
                       <td align='center' style={{padding: '10px'}}>
                          <TextField
                            required
                            id="price"
                            name="price"
                            type="number"
                            value={item?.price}
                            placeholder='Enter Price'
                            fullWidth
                            sx={{ border:'1px solid white', background: 'white',  borderRadius:'7px', minWidth:"200px"}}
                            onChange={(event) => handleChange2(event, index)}
                            inputProps={{
                            shrink: true
                            }}
                            disabled
                          />
                        </td>
                        {/* <td align='center' style={{padding: '10px', minWidth: '100px'}}>
                          <Select fullWidth name="tax" value={item?.tax} onChange={(event) => handleChange2(event, index)} sx={{border: '1px solid silver',borderRadius: '7px', minWidth:"120px"}}>
                            <MenuItem value="">Select tax</MenuItem>
                            {
                              taxList?.map((items:any,indexx:any) => (
                              <MenuItem value={items?.taxvalue} key={indexx}>{items?.Name}</MenuItem>
                              ))
                            }
                          </Select>
                        </td>   */}
                        <td align='center' style={{padding: '10px'}}>{getSymbolFromCurrency(currency)}{item?.amount}</td>
                        <td align='center' style={{padding: '10px'}}>
                          {inputs.length > 1 && (
                            <DeleteIcon onClick={() => handleDeleteInput(index)} style={{color:'red', cursor: 'pointer'}}/>
                          )}
                          {
                            inputs.length == 1 && (
                              <DeleteIcon style={{color:'red', cursor: 'pointer'}}/>
                            )
                          }
                        </td>                
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} align="right">
                        <tr>
                          <td>
                            <tr>
                              <td align='left'>Discount:</td>
                            </tr>
                            <tr>
                              <td>
                              {
                                discountType ?
                                  <TextField
                                    required
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    value={OverAllDiscount}
                                    onChange={(e) => HandleDiscountOverall(e.target.value || 0)}
                                    sx={{border:'1px solid silver',borderRadius: '7px',maxWidth: '90px'}}
                                    InputProps={{ inputProps: { min: 0, max:100 } }}
                                  />
                                :
                                  <TextField
                                    required
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    value={OverAllDiscount}
                                    onChange={(e) => HandleDiscountOverall(e.target.value || 0)}
                                    sx={{border:'1px solid silver' , borderRadius: '7px', maxWidth: '90px' , background: '#e9ecef'}}
                                    InputProps={{ inputProps: { min: 0, max:100 } }}
                                    disabled
                                  />
                                }
                              </td>
                              <td>
                                <Select sx={{border:'1px solid silver', width: '200px'}} value={discountType} onChange={(e) => HandleDiscountThings(e.target.value)}>
                                  <MenuItem value="fixed" sx={{ color: `${theme ? 'white': 'black'}` }}>Fixed</MenuItem>
                                  <MenuItem value="percentage" sx={{ color: `${theme ? 'white': 'black'}` }}>Percentage</MenuItem>
                                </Select>
                              </td>
                            </tr>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <tr>
                              <td align='left'>Tax:</td>
                            </tr>
                            <tr>
                              <td>
                                <Select 
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  sx={{border:'1px solid silver', borderRadius: '7px', width: '290px'}} 
                                  multiple 
                                  value={overAllTax}
                                  onChange={handleChange3}
                                  name="oberAlltax"
                                  renderValue={(selected) => selected.join(', ')}
                                >
                                  {
                                    taxList?.map((items:any,indexx:any) => (
                                      <MenuItem value={`${items?.Name}-${items?.taxvalue}`} key={indexx} sx={{ color: `${theme ? 'white': 'black'}` }}>
                                        <Checkbox checked={overAllTax.indexOf(`${items?.Name}-${items?.taxvalue}`) > -1} sx={{ color: `${theme ? 'white': 'black'}` }} />
                                        <ListItemText primary={items?.Name} sx={{ color: `${theme ? 'white': 'black'}` }} />
                                      </MenuItem>
                                    ))
                                  }
                                </Select>
                              </td>
                            </tr>
                          </td>
                        </tr>
                      </td>

                      <td colSpan={4} align="right">
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td align='right'>Sub Total:</td>
                              <td align='right'>{getSymbolFromCurrency(currency)}{parseFloat(subTotal).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td align='right'>Discount:</td>
                              <td align='right'>{getSymbolFromCurrency(currency)}{parseFloat(disCountGiven).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td align='right'>Tax:</td>
                              <td align='right'>{getSymbolFromCurrency(currency)}{parseFloat(tax).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td align='right'>Total:</td>
                              <td align='right'>{getSymbolFromCurrency(currency)}{parseFloat(total).toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                   </tbody>
                </table>
              </Grid>   
             </Box>
            </Box>  
            <Grid item xs={12}>
            {
              !noteandTerms &&
              <>
                <Colorbtn color="primary"  onClick={() => setnoteandTerms(!noteandTerms)}>
                  <AddIcon sx={{ mr: 1 }} />
                  Add Note & Terms
                </Colorbtn>
              </>
            }
            {
              noteandTerms &&
              <>
                <ColorRedButton color="primary"  onClick={() => setnoteandTerms(!noteandTerms)}>
                  <RemoveIcon sx={{ mr: 1 }} />
                  Remove Note & Terms
                </ColorRedButton>
              </>
           }      
            </Grid>
            {
              noteandTerms &&
              <>
                <Grid item xs={12} sm={12}>
                  <Grid container sx={{display: 'flex',marginTop: '20px', marginLeft: '20px', flexDirection: 'row' , gap: '10px' }}>
                    <Grid item xs={12} md={12}>
                      <Grid>Note:</Grid>
                      <Grid>
                        <ReactQuill value={note} onChange={ setNote } modules={modules} style={{ color: 'black' }} />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Grid>Terms:</Grid>
                      <Grid>
                        <ReactQuill value={terms} onChange={ setTerms } modules={modules} style={{ color: 'black' }} />
                      </Grid>
                    </Grid>
                  </Grid>
                 </Grid> 
              </>
            }                    

            <Grid item xs={12} sm={12}>
              <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px' ,marginBottom: '20px', justifyContent: 'flex-end'}}>
                <Grid><Colorbtn onClick={() => HandleUpdateInvoice("draft")}>Save</Colorbtn></Grid>
                <Grid><Colorbtn onClick={() => HandleUpdateInvoice("send")}>Save & Send</Colorbtn></Grid>
                <Grid><Colorbtn onClick={() => HandleCancelInvoice()}>Cancel</Colorbtn></Grid>
              </Grid>
            </Grid>

            </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
