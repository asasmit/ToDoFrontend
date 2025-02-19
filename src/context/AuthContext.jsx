import { createContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ message: "", severity: "info", open: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const showAlert = (message, severity = "info") => {
    setAlert({ message, severity, open: true });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // OTP Verification function
  const verify = async (email, otp, navigate) => {
    try {
      const response = await axiosInstance.post("/api/auth/verifyOTP", { email, otp });
      const { userDetails } = response.data;
      const { user, token } = userDetails;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      showAlert("OTP Verified Successfully!", "success");
      navigate("/dashboard");

    } catch (error) {
      showAlert(error.response?.data?.message || "Verification failed", "error");
      throw new Error(error.response?.data?.message || "Verification failed");
    }
  };

  // Register function
  const register = async (name, email, username, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/signup", { name, email, username, password });

      if (response.data.success) {
        showAlert("OTP sent to your email.", "info");
      } else {
        showAlert(response.data.message, "warning");
      }
    } catch (error) {
      showAlert(error.response?.data?.message || "Registration failed", "error");
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  // Login function
  const login = async (username, password, navigate) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", { username, password });

      const { userDetails } = response.data;
      const { user, token } = userDetails;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      showAlert("Login successful!", "success");
      navigate("/dashboard");

    } catch (error) {
      showAlert(error.response?.data?.message || "Login failed", "error");
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = (navigate) => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    showAlert("Logged out successfully!", "info");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, verify, register, login, logout }}>
      {children}

      {/* ✅ Global MUI Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export default AuthContext;