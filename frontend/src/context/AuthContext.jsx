// src/context/AuthContext.jsx
import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access_token')
  );
  const [error, setError] = useState(null);

  async function login(username, password) {
    setError(null);
    try {
      const { data } = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch {
      setError('Invalid username or password');
      return false;
    }
  }

  async function register(username, password, email, password2) {
    setError(null);
    try {
      await api.post('/register/', { username, password, email, password2 });
      return true;
    } catch (err) {
      const data = err.response?.data;
      setError(
        data ? Object.values(data).flat().join(' ') : 'Registration failed'
      );
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
