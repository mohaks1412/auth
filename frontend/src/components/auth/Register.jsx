import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be 8+ characters';
    }
    
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const TogglePassword = ({ isVisible, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
    >
      {isVisible ? 'Hide' : 'Show'}
    </button>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      const user = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      await authService.login(formData.email, formData.password);
      navigate("/home", { replace: true });
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        setErrors({ form: apiErrors[0] });
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-rose-700 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Join Us
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">Create your free account today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 backdrop-blur-xl p-9 rounded-3xl shadow-2xl border border-white/50">
          {errors.form && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl animate-pulse">
              <p className="text-sm font-medium text-red-900">{errors.form}</p>
            </div>
          )}

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
            disabled={loading}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
            disabled={loading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Password123!"
              disabled={loading}
            />
            <TogglePassword
              isVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Password123!"
              disabled={loading}
            />
            <TogglePassword
              isVisible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
          >
            Create Account
          </Button>

          <div className="text-xs text-center text-slate-500 space-y-2 pt-4">
            <label className="flex items-center justify-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
              <span>I agree to Terms & Privacy Policy</span>
            </label>
          </div>
        </form>

        <div className="text-center mt-10 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
