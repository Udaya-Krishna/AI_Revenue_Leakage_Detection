import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onDismiss, 
  onRetry, 
  type = 'error',
  className = ''
}) => {
  const typeStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const styles = typeStyles[type] || typeStyles.error;

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className={`h-6 w-6 ${styles.icon} mr-3 flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1">
          <p className={`${styles.text} font-medium`}>
            {message}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`${styles.button} text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`${styles.text} hover:${styles.text.replace('text-', 'text-').split('-')[0]}-800 transition-colors`}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;