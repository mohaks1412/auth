import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  multiline = false, 
  error = false, 
  variant = 'outlined', 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variantClasses = variant === 'filled' ? 'bg-gray-100 border-gray-300' : 'border-gray-300 bg-white';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400';
  const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : '';

  const sharedClasses = `${baseClasses} ${variantClasses} ${errorClasses} ${disabledClasses} ${className}`;

  const inputElement = multiline ? (
    <textarea
      ref={ref}
      className={`min-h-[80px] resize-vertical ${sharedClasses}`}
      {...props}
    />
  ) : (
    <input
      ref={ref}
      className={sharedClasses}
      {...props}
    />
  );

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {inputElement}
      {typeof error === 'string' && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
