import React , { ReactNode } from "react";

type Props = {
  children?: ReactNode
}

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void
}

const initialValue = {
  authenticated: localStorage.getItem('user') ? true : false,
  setAuthenticated: () => {}
}

const AuthContext = React.createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = React.useState(initialValue.authenticated);
  return (
    <AuthContext.Provider value={{authenticated, setAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider}
