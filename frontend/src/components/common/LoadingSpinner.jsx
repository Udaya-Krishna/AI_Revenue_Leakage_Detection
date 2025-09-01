import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  message = 'Processing...', 
  submessage = '', 
  size = 'medium',
  theme = 'blue' 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const themeClasses = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <Loader2 className={`${sizeClasses[size]} ${themeClasses[theme]} animate-spin relative z-10`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {message}
      </h3>
      
      {submessage && (
        <p className="text-gray-600 max-w-md">
          {submessage}
        </p>
      )}
      
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;