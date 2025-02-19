import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from '../context/AuthContext.jsx';

const OtpVerification = () => {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { verify } = useContext(AuthContext);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear previous messages
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP!");
      setLoading(false);
      return;
    }

    try {
      await verify(email, otp, navigate);
      setSuccess("OTP Verified Successfully! ✅");

      setTimeout(() => {
        navigate("/dashboard"); // Change this to your actual dashboard route
      }, 4000);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Verification failed! Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Verify OTP
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter OTP"
            fullWidth
            margin="normal"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default OtpVerification;