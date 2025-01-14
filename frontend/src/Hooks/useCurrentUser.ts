import { jwtDecode } from 'jwt-decode';
import { useState,useEffect } from 'react';

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

export const useCurrentUser = () => {

 const [currentUserId,setCurrentUserId] = useState<any>(null);

 useEffect(() => {
  if(localStorage.getItem('token')) {
    const accountId = jwtDecode<JwtPayload>(localStorage.getItem('token') as string);
    setCurrentUserId(accountId?.data?.id);
  } else {
    setCurrentUserId('');
  }
 },[]);

 return { currentUserId }

};