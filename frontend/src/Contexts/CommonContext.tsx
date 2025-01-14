import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext , useContext, useState, useEffect ,ReactNode } from "react";

interface CommonContextType {
  nofusers: number,
  noofEnquiries: number
}

interface CommonProviderProps {
  children: ReactNode;
}

const CommonContext = createContext<CommonContextType | undefined>(
  undefined
);

export function CommonProvider({children} : CommonProviderProps) {
  const navigate = useNavigate();
  const [noUsers,setNoOfUsers] = useState<number>(0);
  const [noEnquiries,setNoEnquiries] = useState<number>(0);

  useEffect(() => {
    if(localStorage.getItem('admintoken')) {
      getNoOfUsersList();
      getNoOfEnquiries();
    }
  },[children]);
  const url = import.meta.env.VITE_NODE_ENV == "production" ? 'api' : 'api';
  const getNoOfUsersList = async() => {
   await axios.get(`/${url}/v1/admin/userslist`, 
   {
     headers: {
     'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
     }
   })
   .then(result => {
    if(result.data.status == "201") {
      setNoOfUsers(result.data.data.length);
    }
   })
   .catch(error => {
    console.log("error", error);
    if(error.response.data.status == 401) {
      localStorage.clear();
      navigate('/admin');
    }
   })
  };

  const getNoOfEnquiries = async() => {
    await axios.get(`/${url}/v1/admin/ticketslist`, 
    {
      headers: {
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}`
      }
    })
    .then(result => {
     if(result.data.status == "201") {
      setNoEnquiries(result.data.data.length);
     }
    })
    .catch(error => {
     console.log("error", error);
    })
  };

  const contextValue: CommonContextType = {
    nofusers:noUsers,
    noofEnquiries:noEnquiries
  }

  return(
   <CommonContext.Provider value={contextValue}>
    {children}
   </CommonContext.Provider>
  )
}

export function useCommonContext() {
 const context = useContext(CommonContext);
 if (!context) {
  throw new Error(
   "useCommonContext must be used within a CommonProvider"
  );
 }
 return context;
}
  