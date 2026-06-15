import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, TextField, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ triggerToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('feed-search', { detail: search }));
  };

  const handleLogout = () => {
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            Social Feed
          </Typography>
          {user && (
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
              />
              <Button type="submit" variant="contained" size="small">
                Search
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link component={RouterLink} to="/login" color="inherit" underline="none">
                Login
              </Link>
              <Link component={RouterLink} to="/signup" color="inherit" underline="none">
                Signup
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
