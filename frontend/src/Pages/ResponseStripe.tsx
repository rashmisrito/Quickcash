import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import getSymbolFromCurrency from 'currency-symbol-map';

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

export default function ResponseStripe() {

  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const search = useLocation().search;
  const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);

  useEffect(() => {
    const id = new URLSearchParams(search).get("payment_intent");
    const OrderStatus = new URLSearchParams(search).get("redirect_status");
    if(id && OrderStatus) {
      getData(id,OrderStatus);
    }
  },[]);

  const alertnotify = (text:any,type:any) => {
    if(type == "error") {
     toast.error(text, {
      position: "top-left",
      autoClose: 7000,
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
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
     })
    }    
  }

  const getData = async (val:any,stats: any) => {
    await axios.post(`/${url}/v1/stripe/fetch`, {
      "transaction_id": new URLSearchParams(search).get("payment_intent")
    })
    .then(async result => { 
      if(result.data.status == 201) {
        await axios.post(`/${url}/v1/stripe/complete-addmoney`, {
          "user": accountId?.data?.id,
          "status": stats,
          "orderDetails": val,
          "userData": accountId?.data?.name,
          "account": result?.data?.data?.metadata?.account,
          "amount": parseFloat(result?.data?.data?.metadata?.amount),
          "fee": parseFloat(result?.data?.data?.metadata?.fee),
          "amountText": result?.data?.data?.metadata?.amount ? `${getSymbolFromCurrency(result?.data?.data?.metadata?.from_currency)}${result?.data?.data?.metadata?.amount}` : '',
          "from_currency": result?.data?.data?.metadata?.from_currency,
          "to_currency": result?.data?.data?.metadata?.to_currency,
          "convertedAmount": parseFloat(result?.data?.data?.metadata?.convertedAmount),
          "conversionAmountText": result?.data?.data?.metadata?.convertedAmount ? `${getSymbolFromCurrency(result?.data?.data?.metadata?.to_currency)}${result?.data?.data?.metadata?.convertedAmount}` : ''
        })
        .then(result => { 
          if(result.data.status == 201) {
            alertnotify("Payment has been done Successfully", "Success");
            setTimeout(() => {
              navigate('/home');
            },100);
          }
         })
        .catch(error => {
          console.log(error);
        })
      }
     })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <div className='yo'>
      <div className="card">
        Stripe Payment is processing , please wait ...
      </div>
    </div>
  )
}
