import axios from 'axios';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useCurrency } from '../../../Hooks/useCurrency';
import useValidation from '../../../Hooks/useValidation';
import Button, { ButtonProps } from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate , useOutletContext } from 'react-router-dom';
import { Box, FormControl, FormControlLabel, FormHelperText, Grid, ListItemText, MenuItem, Radio, RadioGroup, TextField, Toolbar, Typography } from '@mui/material';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
 color: theme.palette.getContrastText(purple[500]),
 backgroundColor: "#2196f3",
  '&:hover': {
    backgroundColor: "#2196f3",
  },
}));

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

export default function AddQuotes() {
  
  const navigate = useNavigate();
  const [theme]:any = useOutletContext();
  const { errors, validate } = useValidation();
  const [note,setNote] = React.useState<any>('');
  const [taxList,setTaxList] = React.useState([]);
  const [terms,setTerms] = React.useState<any>('');
  const [UsersList,setUserslist] = React.useState<any>([]);
  const [noteandTerms,setnoteandTerms] = React.useState<boolean>(false);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';

  useEffect(() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    getTaxList(accountId?.data?.id);
    getInvNumber();
    getUsersList();
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

  const getUsersList = async() => {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.get(`/${url}/v1/client/list/${accountId?.data?.id}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setUserslist(result?.data?.data);
      }
    })
    .catch(error => {
      console.log("error", error);
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

  const [invoiceProductsData,setInvProductsData] = React.useState<any>([]);

  const getInvNumber = async () => {
    await axios.get(`/${url}/v1/invoice/generate/inv`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
      if(result.data.status == "201") {
        setInvProductsData(result?.data?.productData);
      }
    })
    .catch(error => {
      console.log("error", error);
    }) 
  }

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
  }

  const { currencyList } = useCurrency();
  const [inv,setInv] = React.useState<any>(`${new Date().getTime()}${Math.floor(Math.random()*999)}`);
  const currDate = new Date().toISOString().split('T')[0];
  const [invoiceOption,setInvoiceOption] = React.useState<any>("Default");
  const [inputs, setInputs] = useState([{ productName: "", productId: "", qty: "", price: "", tax: 0, taxValue: 0, amount: 0 }]);

  const handleAddInput = () => {
    setInputs([...inputs, { productName: "",productId: "", qty: "", price: "", tax: 0, taxValue: 0, amount: 0 }]);
  };

  const [otherinputs, setOtherInputs] = useState([{ email: "", name: "", address: "" }]);
  const [memberType, setMemberType] = React.useState('other');
  const [tax,setTax] = React.useState<any>(0);
  const [total,setTotal] = React.useState<any>(0);
  const [userId,setUserId] = React.useState<any>('');
  const [subTotal,setSubtotal] = React.useState<any>(0);
  const [currency,setCurrency] = React.useState<any>('');
  const [discountType,setDiscountType] = React.useState('');
  const [InvoiceDate,setInvoiceDate] = React.useState<any>(new Date().toISOString().substring(0, 10));

  const data = {
    date:InvoiceDate,
    dueDate:InvoiceDate
  }
  
  const [InvoiceDueDateData,setInvoiceDueDateData] = React.useState<any>(data);
  const [disCountGiven,setDiscountGiven] = React.useState<any>(0);
  const [overAllTax,setOverAllTax] = React.useState<string[]>([]);
  const [InvoiceDueDate,setInvoiceDueDate] = React.useState<any>(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substring(0,10));
  const [OverAllDiscount,setOverAllDiscount] = React.useState<any>(0);
  const [OverAllTaxText,setOverAllTaxText] = React.useState<any[]>([]);
  const [overAllTaxAddNormalTax,setOverAllTaxAddNormalTax] = React.useState(0);
  const [today,setToday] = React.useState(currDate);

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
  }

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

  const handleChangeOthers = (event:any) => {
    let { name, value } = event.target;
    if(name == "memberEmail") {
      let onChangeValue = [...otherinputs];
      onChangeValue[0]['email'] = value;
      setOtherInputs(onChangeValue)
    } else if(name == "memberName") {
      let onChangeValue = [...otherinputs];
      onChangeValue[0]['name'] = value;
      setOtherInputs(onChangeValue);
    } else if(name == "memberAddress") {
      let onChangeValue = [...otherinputs];
      onChangeValue[0]['address'] = value;
      setOtherInputs(onChangeValue);
    }
  };

  const HandleDiscountThings = (e:any) => {
    setDiscountType(e);
    setOverAllDiscount(0);
  }

  const handleDeleteInput = (index:any) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  };

  const handleChange3 = (event: SelectChangeEvent<typeof overAllTax>) => {
    const { target: { value } } = event;
    setOverAllTax(
      typeof value === 'string' ? value.split(',') : value,
    );
    setOverAllTaxText(typeof value === 'string' ? value.split(',') : value);
  };

  const HandleAddQuote = async () => {
    let flag = false;

    if(memberType == 'other') {
      if(validate('memberEmail',otherinputs[0].email)){
        const returnValue = validate('memberEmail',otherinputs[0].email);
         flag = true;
      }
      if(validate('memberName',otherinputs[0].name)){
        const returnValue = validate('memberName',otherinputs[0].name);
        flag = true;
      }
      if(validate('memberAddress',otherinputs[0].name)){
        const returnValue = validate('memberAddress',otherinputs[0].address);
        flag = true;
      }
      if(flag == true){
        return;
      }

    }
    
    if(!validate('date',InvoiceDate) && !validate('dueDate',InvoiceDueDateData)){
    var reference = Math.floor(Math.random() * 10000000);
    var ciphertext = CryptoJS.AES.encrypt(`${reference}`, 'ganesh').toString();

    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    await axios.post(`/${url}/v1/quote/add`, {
      "user": accountId?.data?.id,
      "reference":reference,
      "url": `${import.meta.env.VITE_APP_URL}/invoice-pay?code=${ciphertext}`,
      "userid": userId,
      "othersInfo": otherinputs,
      "quote_number":  inv,
      "invoice_country": invoiceOption,
      "invoice_date": InvoiceDate,
      "due_date": InvoiceDueDate,
      "currency": currency,
      "productsInfo": inputs,
      "discount": parseFloat(OverAllDiscount).toFixed(2),
      "discount_type": discountType,
      "tax": overAllTax,
      "subTotal": parseFloat(subTotal).toFixed(2),
      "sub_discount": parseFloat(disCountGiven).toFixed(2),
      "sub_tax": tax,
      "total": parseFloat(total).toFixed(2),
      "note": note,
      "terms": terms,
      "currency_text": getSymbolFromCurrency(currency)
    }, 
    { 
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
   })
   .then(result => {
    if(result.data.status == "201") {
      alertnotify(result.data.message,"success");
      navigate('/invoices/quotes/list');
    }
   })
   .catch(error => {
      console.log("error", error);
      alertnotify(error.response.data.message,"error");
   })
  } else {
    if(validate('date',InvoiceDate)){
      const result = validate('date',InvoiceDate);
    }
    if(validate('dueDate',InvoiceDueDateData)){
      const result = validate('dueDate',InvoiceDueDateData);
    }
  }
  }

  const HandleCancelInvoice = () => {
    var r = confirm("Are you sure?");
    if(r == true){
      navigate('/invoices/quotes/list');
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

  const handleChangemember = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemberType((event.target as HTMLInputElement).value);
  };

  const handleBlur = (e:any) => {
    const { name, value } = e.target;
    if(name == 'dueDate'){
      const validateDueData = {
        date:InvoiceDate,
        dueDate:value
      }
      setInvoiceDueDateData(validateDueData);
      const returnValue = validate(name, validateDueData);
    } else {
      const returnValue = validate(name, value);
    }
  };

  return (
    <>
      <Toolbar sx={{ display: 'flex',flexDirection: 'column',padding: '12px',borderRadius:'.5rem',p:'2px',marginTop:'10px',background:{xs: `${theme ? '#183153' : ''}`,md: `${theme ? '#183153' : 'white'}`},border: {xs: `${theme ? '1px solid white' : ''}`,md: `${theme ? '1px solid white' : 'white'}`} }}> 
         <Box sx={{ marginTop: '0%', borderRadius: '.5rem' }}>
          <Typography>
            <ColorButton sx={{cursor: 'pointer', float: 'right', marginTop: '10px'}} onClick={() => navigate('/invoices/quotes/list')}>Back</ColorButton>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <label>Quote #</label>
              <TextField
                required
                id="quote"
                name="quote"
                value={`${inv}`}
                fullWidth
                sx={{border:'1px solid silver', borderRadius:'7px'}}
                inputProps={{
                 shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Select Type</label>
              <RadioGroup
                row
                sx={{ padding: '2px', marginTop: '12px',background: `${theme ? 'white': ''}`, color: 'black' }}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={memberType}
                onChange={handleChangemember}
              >
                <FormControlLabel value="member" control={<Radio />} label="Member" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Grid>
            {
              memberType == "member" ?
              <Grid item xs={12} sm={6}>
                <label>Select Member</label>
                <span style={{color: 'red', fontWeight: 700}}>*</span>
                <Select fullWidth onChange={(e) => setUserId(e.target.value)} sx={{ border: `${theme ? '1px solid silver': 'black'}` }}>
                {
                  UsersList?.map((item:any,index:number) => (
                    <MenuItem value={item?._id} key={index}>{item?.firstName}{" "}{item?.lastName}</MenuItem>
                  ))
                }
                </Select>
              </Grid>
              :
              <>
                <Grid item xs={12} sm={6}>
                 <label>Receiver Email</label>
                 <span style={{color: 'red', fontWeight: 700}}>*</span>
                 <TextField type="email" 
                    onChange={(e) => handleChangeOthers(e)} 
                    onBlur={handleBlur}
                    name="memberEmail" 
                    id="memberEmail" 
                    error={!!errors.memberEmail}
                    helperText={errors.memberEmail}
                    sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
                    fullWidth />
                </Grid>

                <Grid item xs={12} sm={6}>
                 <label>Receiver Name</label>
                 <span style={{color: 'red', fontWeight: 700}}>*</span>
                 <TextField type="text" 
                    onChange={(e) => handleChangeOthers(e)}
                    onBlur={handleBlur}
                    error={!!errors.memberName}
                    helperText={errors.memberName}
                    name="memberName" 
                    id="memberName" 
                    sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                 <label>Receiver Address</label>
                 <span style={{color: 'red', fontWeight: 700}}>*</span>
                 <TextField 
                    multiline={true} 
                    onChange={(e) => handleChangeOthers(e)} 
                    onBlur={handleBlur}
                    error={!!errors.memberAddress} 
                    helperText={errors.memberAddress}
                    type="text" 
                    name="memberAddress" 
                    id="memberAddress" 
                    sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
                    fullWidth 
                  />
                </Grid>
              </>
            }
            <Grid item xs={12} sm={6}>
              <label>Quote Date</label>
              <span style={{color: 'red', fontWeight: 700}}>*</span>
              <TextField
                required
                id="value"
                name="date"
                type="date"
                fullWidth
                defaultValue={InvoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                onBlur={handleBlur}
                error={!!errors.date}
                helperText={errors.date}
                inputProps={{
                 shrink: true,
                 min: today, // Restriction selection Past date
                }}
                sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Due Date</label>
              <span style={{color: 'red', fontWeight: 700}}>*</span>
              <TextField
                required
                id="value"
                name="dueDate"
                type="date"
                fullWidth
                defaultValue={InvoiceDueDate}
                onChange={(e) => setInvoiceDueDate(e.target.value)}
                onBlur={handleBlur}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
                inputProps={{
                 shrink: true,
                 min: today, // Restriction selection Past date
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Invoice Template:</label>
              <span style={{color: 'red', fontWeight: 700}}>*</span>
              <Select fullWidth value={invoiceOption} name="status" sx={{border: '1px solid silver', borderRadius: '7px'}} onChange={(e) => setInvoiceOption(e.target.value)}>
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="New_York">New York</MenuItem>
                <MenuItem value="Toronto">Toronto</MenuItem>
                <MenuItem value="Rio">Rio</MenuItem>
                <MenuItem value="London">London</MenuItem>
                <MenuItem value="Istanbul">Istanbul</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Hong_Kong">Hong Kong</MenuItem>
                <MenuItem value="Tokyo">Tokyo</MenuItem>
                <MenuItem value="Paris">Paris</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Select Currency:</label>
              <span style={{color: 'red', fontWeight: 700}}>*</span>
              <Select fullWidth value={currency}
               name="currency"
               onBlur={handleBlur}
               error={!!errors.currency}
               sx={{ border: `${theme ? '1px solid silver': 'black'}` }}
               onChange={(e) => setCurrency(e.target.value)}>
                {
                  currencyList?.map((item:any,index:number) => (
                    <MenuItem value={item?.base_code} key={index}>
                      {getSymbolFromCurrency(item?.base_code)} {item?.base_code}
                    </MenuItem>
                  ))
                }
              </Select>
              <FormControl fullWidth error={!!errors.currency}>
                {!!errors.currency&& <FormHelperText>{errors.currency}</FormHelperText>}
              </FormControl>
            </Grid>
              <Grid item xs={12} sm={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end', marginBottom: '12px'}}>
                <ColorButton onClick={() => handleAddInput()}>Add</ColorButton>
              </Grid> 
              <Box sx={{ overflow: "auto" }}>
               <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                <Grid item xs={12} sm={12}>
                  <table className='invoicetble' width={"100%"} style={{borderCollapse: 'collapse'}}>
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
                          <Select id="productName" name="productName" onChange={(event) => handleChange2(event, index)} sx={{ border: `${theme ? '1px solid silver': 'black'}`,minWidth: '120px' }} fullWidth required>
                            {
                              invoiceProductsData?.map((item:any,index:number) => (
                                <MenuItem key={index} value={`${item?._id}-${item?.name}`} sx={{ color: `${theme ? 'white': 'black'}` }}>{item?.name}</MenuItem>
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
                            placeholder='Enter Quantity'
                            fullWidth
                            value={item?.qty}
                            sx={{border:'1px solid white', color: 'white',  borderRadius:'7px', minWidth:"200px"}}
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
                            fullWidth
                            value={item?.price}
                            sx={{ border:'1px solid white', background: 'white',  borderRadius:'7px', minWidth:"200px"}}
                            disabled
                            inputProps={{
                              shrink: true
                            }}
                          />
                        </td>
                        {/* <td align='center' style={{padding: '10px', minWidth: '100px'}}>
                          <Select fullWidth name="tax" onChange={(event) => handleChange2(event, index)} sx={{border: '1px solid silver',borderRadius: '7px', minWidth:"120px"}}>
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
                            <tr><td align='left'>Discount:</td></tr>
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
                                    sx={{border:'1px solid silver' , borderRadius: '7px', maxWidth: '90px'}}
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
                                <Select sx={{border:'1px solid silver', width: '200px', color: `${theme ? 'white': 'black'}`}} onChange={(e) => HandleDiscountThings(e.target.value)}>
                                  <MenuItem value="fixed" sx={{ color: `${theme ? 'white': 'black'}`}}>Fixed</MenuItem>
                                  <MenuItem value="percentage" sx={{ color: `${theme ? 'white': 'black'}`}}>Percentage</MenuItem>
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
                                  id="demo-multiple-checkbox"
                                  sx={{border:'1px solid silver', marginTop: '5px', borderRadius: '7px', width: '290px'}} 
                                  multiple 
                                  value={overAllTax}
                                  onChange={handleChange3}
                                  name="overAlltax"
                                  renderValue={(selected) => selected.join(', ')}
                                >
                                  {
                                    taxList?.map((items:any,indexx:any) => (
                                      <MenuItem value={`${items?.Name}-${items?.taxvalue}`} key={indexx}>
                                        <Checkbox checked={overAllTax.indexOf(`${items?.Name}-${items?.taxvalue}`) > -1} sx={{ color: `${theme ? 'white': 'black'}`}} />
                                        <ListItemText primary={items?.Name} sx={{ color: `${theme ? 'white': 'black'}`}} />
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
                      <ColorButton color="primary"  onClick={() => setnoteandTerms(!noteandTerms)}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add Note & Terms
                      </ColorButton>
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
                 {/* <Box sx={{ overflow: "auto" }}> */}
                  {/* <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}> */}
                  <Grid item xs={12} sm={12}>
                    <Grid container sx={{display: 'flex', marginLeft: '20px', flexDirection: 'row' , gap: '2px'}}>
                      <Grid item xs={10} sm={12}>
                        <Grid>Note:</Grid>
                        <Grid>
                          <ReactQuill value={note} onChange={ setNote } className={`${theme ? 'ql-strokelight' : 'ql-strokedark'}`} modules={modules} style={{ color: `${theme ? 'white' : 'black'}` }} />
                        </Grid>
                      </Grid>
                      <Grid item xs={10} sm={12}>
                        <Grid>Terms:</Grid>
                        <Grid>
                          <ReactQuill value={terms} onChange={ setTerms } modules={modules} style={{ color: 'black' }} /> 
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid> 
                 {/* </Box> */}
                {/* </Box> */}
               </>
              }                    

              <Grid item xs={12} sm={12}>
                <Grid sx={{display: 'flex', flexDirection: 'row', gap: '10px' , marginBottom: '20px', justifyContent: 'flex-end'}}>
                  <Grid><ColorButton onClick={() => HandleAddQuote()}>Save</ColorButton></Grid>
                  <Grid><ColorButton onClick={() => HandleCancelInvoice()}>Cancel</ColorButton></Grid>
                </Grid>
              </Grid>

            </Grid>
        </Box>
      </Toolbar>
    </>
  )
}
