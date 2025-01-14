import axios from 'axios';
import {useState,useEffect} from 'react';

export const useExchange = (props:any) => {

 const [Rate,setRate] = useState<any>(0);
 const [ExchangeError,setExchangeError] = useState<any>('');
 const [convertedValue,setConvertedValue] = useState<any>(0);

 useEffect(() => {
  const controller = new AbortController();
  calCulateExChangeCurrencyValue();
 },[props]);

 const calCulateExChangeCurrencyValue = async () => {
  if(props?.sendCurrency && props?.receiveCurrency && props?.fromAmount) {
    const options = {
      method: 'GET',
      url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
      params: {
        from: props?.sendCurrency,
        to: props?.receiveCurrency,
        amount: props?.fromAmount
      },
      headers: {
       'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
       'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
      }
    };
     
    try {
      const response = await axios.request(options);
      if(response.data.success) {
        setConvertedValue(response.data.result.convertedAmount*props?.fromAmount);
        setRate(parseFloat(response.data.result.convertedAmount).toFixed(2));
      } else {
        setExchangeError(response.data.validationMessage[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }
 } 

 return { Rate, ExchangeError, convertedValue }

};