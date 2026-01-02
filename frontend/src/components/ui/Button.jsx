import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/50 hover:shadow-lg',
    secondary: 'bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 focus:ring-gray-500/50 hover:shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500/50 hover:shadow-lg',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-500/50 hover:shadow-lg',
    ghost: 'text-gray-800 hover:bg-gray-100 focus:ring-gray-500/50 hover:shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const loadingClasses = loading 
    ? 'opacity-75 cursor-not-allowed' 
    : '';

  const widthClasses = fullWidth 
    ? 'w-full' 
    : '';

  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${loadingClasses} ${widthClasses} ${className}`;

  return (
    <button className={classes} disabled={loading || disabled} {...props}>
      {loading && (
        <div className={`animate-spin rounded-full border-2 border-white/30 border-t-white mr-2 ${iconSize}`} />
      )}
      {leftIcon && !loading && (
        <span className={`mr-2 ${iconSize}`}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {rightIcon && !loading && (
        <span className={`ml-2 ${iconSize}`}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
