import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await axiosInstance.post("/api/auth/resetOTP", { email });
      setMessage("OTP sent successfully. Redirecting...");

      // Redirect to Reset Password page with email as state
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ maxWidth: 400, padding: "2rem" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSendOTP}>
            Send OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordRequest;