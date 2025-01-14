import axios from 'axios';
import {useState,useEffect} from 'react';

export const useAuth = () => {

 const [authenticate,setAuthenticate] = useState<any>(undefined);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getAuth();
 },[]);

 const getAuth = async () => {
  await axios.post(`/${url}/v1/user/auth`, {} , {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(result => {
    console.log(result.data.status);
    if(result.data.status == 201) {
      console.log("Authenticate");
      setAuthenticate(true);
    }
  })
  .catch(error => {
    console.log("Auth Hook API Error", error);
    setAuthenticate(false);
  })
 }

 if (authenticate === undefined) {
  return null;
 }

 return { authenticate }

};