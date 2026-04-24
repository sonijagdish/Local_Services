import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const login = async (email, password) => {
    try {
      const { data } = await API.post("/users/login", { email, password });
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post("/users", userData);
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  // Fetch fresh user data from backend (e.g. updated wallet balance)
  const refreshUser = async () => {
    try {
      const { data } = await API.get("/users/profile");
      // Merge with existing user to keep token
      const freshUser = { ...user, ...data };
      setUser(freshUser);
      localStorage.setItem("currentUser", JSON.stringify(freshUser));
      return freshUser;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      return user;
    }
  };

  const forgotPasswordFlow = async (email) => {
    try {
      const { data } = await API.post("/users/forgot-password", { email });
      return { success: true, ...data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to send OTP" 
      };
    }
  };

  const resetPasswordFlow = async (email, otp, newPassword) => {
    try {
      const { data } = await API.post("/users/reset-password", { email, otp, newPassword });
      return { success: true, ...data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to reset password" 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?._id,
        userRole: user?.role,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        forgotPasswordFlow,
        resetPasswordFlow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
