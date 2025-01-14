import axios from 'axios';
import {useState,useEffect} from 'react';

export const useInvoiceSettings = () => {

 const [invSetting,setInvSetting] = useState<any>([]);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getList();
 },[]);

 const getList = async () => {
  await axios.get(`/${url}/v1/invoice/settings-inv/sjskahdsjkd`, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
  .then(result => {
  if(result.data.status == 201) {
    setInvSetting(result?.data?.data);
   }
  })
  .catch(error => {
    console.log("Invoice Setting Hook API Error", error);
  })
 }

 return { invSetting }

};