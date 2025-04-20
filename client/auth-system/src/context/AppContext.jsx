import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // Suppress toast during initial load
      if (!isInitialLoad) {
        toast.error(
          error.response?.data?.message || "Failed to check auth state"
        );
      }
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false); // Mark initial load as complete
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        // Suppress toast during initial load
        if (!isInitialLoad) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // Suppress toast during initial load
      if (!isInitialLoad) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data"
        );
      }
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {isLoading ? null : props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
