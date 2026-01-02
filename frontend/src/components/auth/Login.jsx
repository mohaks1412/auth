import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be 8+ characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const user = await authService.login(formData.email, formData.password);

      if (user) {
        console.log(user);
        
        navigate("/home", { replace: true });
      }
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      if (apiErrors) {
        setErrors({ form: apiErrors[0] });
      } else {
        setErrors({ form: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight">
            Sign In
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">Welcome back to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 backdrop-blur-xl p-9 rounded-3xl shadow-2xl border border-white/50">
          {errors.form && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl animate-pulse">
              <p className="text-sm font-medium text-red-900">{errors.form}</p>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Password123!"
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              className="text-sm text-slate-600 hover:text-slate-900 font-medium underline decoration-slate-300 underline-offset-4 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
