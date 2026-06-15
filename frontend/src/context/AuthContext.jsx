import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('socialfeed_user')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('socialfeed_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('socialfeed_user');
      localStorage.removeItem('socialfeed_token');
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('socialfeed_token', data.token);
    const currentUser = { _id: data._id, name: data.name, email: data.email };
    setUser(currentUser);
    return currentUser;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/api/auth/signup', { name, email, password });
    localStorage.setItem('socialfeed_token', data.token);
    const currentUser = { _id: data._id, name: data.name, email: data.email };
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
