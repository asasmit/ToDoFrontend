import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for disabling button
  const { register } = useContext(AuthContext);
  
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message
    setLoading(true); // Disable button on submit

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must have at least one uppercase letter, one lowercase letter, one digit, one special symbol, and be more than 4 characters.");
      setLoading(false);
      return;
    }

    try {
      await register(name.trim(), email.trim(), username.trim(), password);
      navigate("/verification", { state: { email } });
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false); // Re-enable button after request completes
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ maxWidth: 400, margin: '2rem auto', padding: '2rem' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Register</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Username"
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
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }} 
              disabled={loading} // Disable button when loading
            >
              {loading ? "Registering..." : "Register"} {/* Change text when loading */}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
