import axios from 'axios';
import {useState,useEffect} from 'react';

export const useFee = (props:any) => {

 const [feeCommision,setFeeCommision] = useState<any>([]);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getFeeList();
 },[props]);

 const getFeeList = async () => {
  await axios.get(`/${url}/v1/admin/feetype/type?type=${props}`)
  .then(result => {
  if(result.data.status == 201) {
    if(result.data.data.length > 0) {
      setFeeCommision(result?.data?.data?.[0]?.feedetails?.[0]);
    }
   }
  })
  .catch(error => {
    console.log("Fee Commission Hook API Error", error);
  })
 }

 return { feeCommision }

};