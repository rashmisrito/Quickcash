import axios from 'axios';
import {useState,useEffect} from 'react';

export const useKyc = (props:any) => {

 const [kcyDetails,setKycDetails] = useState<any>([]);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getList();
 },[props]);

 const getList = async () => {
  await axios.get(`/${url}/v1/kyc/getData/${props}`,
  {
    headers: 
    {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
  if(result.data.status == 201) {
    setKycDetails(result?.data?.data);
   }
  })
  .catch(error => {
    console.log("Kyc Data Hook API Error", error);
  })
 }

 return { kcyDetails }

};