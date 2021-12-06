import React, { useState } from "react";
import App from "./App";
import { signOut, getAuth } from "firebase/auth";

export const GlobalContext = React.createContext({
  value: "",
  setValue: () => {},
});

const GlobalContextProvider = (props) => {
  const [value, setValue] = useState('');
  const auth = getAuth();
  const signUserOut = () => {
    auth.signOut();
  }

  return (
    <GlobalContext.Provider
      value={{
        value,
        setValue,
        signUserOut
      }}
    >
      <App />
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
