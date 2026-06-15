import { useState } from 'react';
import { Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Paper, TextField, Typography, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

const Login = ({ triggerToast }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      triggerToast('Logged in successfully', 'success');
      navigate('/feed');
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="body2" textAlign="center">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup">
              Signup
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
