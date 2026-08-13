import { createContext, useState } from "react";
import { decodeJWT } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const existingToken = localStorage.getItem("token");

  const [token, setToken] = useState(
    decodeJWT(existingToken) ? existingToken : null
  );

  const login = (jwtToken) => {

    localStorage.setItem("token", jwtToken);

    setToken(jwtToken);
  };

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};