import axios from 'axios';
import {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {

 const navigate = useNavigate(); 
 const [userList,setUserList] = useState<any>([]);
 const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api'; 

 useEffect(() => {
  getList();
 },[]);

 const getList = async () => {
  if(localStorage.getItem('admintoken')) {
    await axios.get(`/${url}/v1/admin/userslist`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
    if(result.data.status == 201) {
      setUserList(result?.data?.data);
     }
    })
    .catch(error => {
      console.log("Account List Hook API Error", error);
    })
  } else {
    navigate('/admin');
  }
 }

 return { userList }

};