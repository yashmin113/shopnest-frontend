/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from "react";

export const AutheContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user info");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read stored user:", error);
    return null;
  }
};

export const AutheProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user info", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user info");
  }, []);

  const value = useMemo(
    () => ({ login, logout, user }),
    [login, logout, user]
  );

  return (
    <AutheContext.Provider value={value}>
      {children}
      </AutheContext.Provider>
  );
};
