import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, required, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputClasses = `
      w-full px-4 py-3 text-base border rounded-lg transition-colors
      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
      disabled:bg-gray-50 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 hover:border-gray-400'
      }
      ${className}
    `.trim();

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        {error && (
          <p 
            id={`${inputId}-error`} 
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p 
            id={`${inputId}-help`} 
            className="text-sm text-gray-600"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 