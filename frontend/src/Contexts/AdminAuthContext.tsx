import React , { ReactNode } from "react";

type Props = {
  children?: ReactNode
}

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void
}

const initialValue = {
  authenticated: localStorage.getItem('admin') ? true : false,
  setAuthenticated: () => {}
}

const AdminAuthContext = React.createContext<IAuthContext>(initialValue);

const AdminAuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = React.useState(initialValue.authenticated);
  return (
    <AdminAuthContext.Provider value={{authenticated, setAuthenticated}}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export {AdminAuthContext, AdminAuthProvider}
