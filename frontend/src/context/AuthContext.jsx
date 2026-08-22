import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const savedToken = localStorage.getItem('admin_token');
    const savedAdmin = localStorage.getItem('admin_user');

    if (savedToken && savedAdmin) {
      const parsedAdmin = JSON.parse(savedAdmin);
      setToken(savedToken);
      setAdmin(parsedAdmin);
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      
      if (response.data && response.data.success) {
        const { token: jwtToken, admin: adminData } = response.data;
        
        setToken(jwtToken);
        setAdmin(adminData);
        
        localStorage.setItem('admin_token', jwtToken);
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        
        // Update axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Authentication request error:', error);
      const errMsg = error.response?.data?.message || 'Server error during login request';
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
