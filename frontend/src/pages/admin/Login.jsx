import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Toast from '../../components/Toast';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToastType('warning');
      setToastMessage('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        setToastType('success');
        setToastMessage('Welcome back, administrator!');
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setToastType('error');
        setToastMessage(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setToastType('error');
      setToastMessage('Unable to authenticate at this moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4 sm:px-0 font-sans">
      <div className="bg-white border border-festival-creamDark rounded-3xl p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl">🕉️</span>
          <h1 className="text-2xl font-serif font-black text-festival-maroon">Admin Login</h1>
          <p className="text-xs text-festival-darkLight/60">
            Sign in to manage Ganesha catalogs and business parameters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-festival-darkLight/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ganeshabooking.com"
                className="w-full pl-11 pr-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-festival-darkLight/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-festival-darkLight/40 hover:text-festival-maroon"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-2xl text-sm transition-all duration-300 shadow-sm disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default Login;
