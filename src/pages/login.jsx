import React, { useState, useContext } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert, Link } from "@mui/material";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await login(username, password, navigate);
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ maxWidth: 400, padding: "2rem" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              <Link href="/reset-request" underline="hover">
                Forgot password?
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;