import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { Snackbar, Alert } from '@mui/material';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Navbar from './components/Navbar.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const triggerToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <BrowserRouter>
      <Navbar triggerToast={triggerToast} />
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<Login triggerToast={triggerToast} />} />
        <Route path="/signup" element={<Signup triggerToast={triggerToast} />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed triggerToast={triggerToast} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={handleClose} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  );
}

export default App;
