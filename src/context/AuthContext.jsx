import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(newToken);
  }, []);

  const persistUser = useCallback((newUser) => {
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(newUser);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const currentUser = await authService.getMe();
      persistUser(currentUser);
    } catch {
      persistToken(null);
      persistUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, persistToken, persistUser]);

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      persistToken(data.token);
      persistUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistToken, persistUser]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(payload);
      persistToken(data.token);
      persistUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistToken, persistUser]);

  const guestRegister = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.guestRegister(payload);
      persistToken(data.token);
      persistUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistToken, persistUser]);

  const logout = useCallback(() => {
    persistToken(null);
    persistUser(null);
    setError(null);
  }, [persistToken, persistUser]);

  const forgotPassword = useCallback(async (payload) => {
    return authService.forgotPassword(payload);
  }, []);

  const resetPassword = useCallback(async (payload) => {
    return authService.resetPassword(payload);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    persistUser(updatedUser);
  }, [persistUser]);

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === 'admin';

  const value = {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    guestRegister,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
