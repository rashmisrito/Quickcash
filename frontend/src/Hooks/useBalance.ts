import axios from 'axios';
import {useState,useEffect} from 'react';

export const useBalance = (props:any) => {

 const [accountDetail,setAccountDetail] = useState<any>([]);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getList();
 },[props]);

 const getList = async () => {
  if(props) {
    await axios.get(`/${url}/v1/account/accountbyid/${props}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(result => {
    if(result.data.status == 201) {
      setAccountDetail(result?.data?.data);
     }
    })
    .catch(error => {
      console.log("Account Details Hook API Error", error);
    })
  }
 }

 return { accountDetail }

};