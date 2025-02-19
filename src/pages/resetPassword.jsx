import React, { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

  useEffect(() => {
    if (!email) {
      navigate("/reset-request");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError("Password must have at least one uppercase letter, one lowercase letter, one digit, one special symbol, and be more than 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/api/auth/verifyResetOTP", {
        email,
        otp,
        newPassword,
      });

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. Try again.");
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");

    try {
      await axiosInstance.post("/api/auth/resetOTP", { email });
      setMessage("OTP resent successfully.");
      setIsResendDisabled(true);
      setTimer(120);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ maxWidth: 400, padding: "2rem" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Reset Password</Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleVerifyOTP}>
            <TextField label="Email" type="email" fullWidth margin="normal" value={email} disabled />
            <TextField
              label="OTP"
              type="text"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </form>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleResendOTP}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;