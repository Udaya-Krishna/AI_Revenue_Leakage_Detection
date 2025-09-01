import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  highlight = false,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      icon: 'bg-blue-100 text-blue-600',
      highlight: 'bg-blue-600 text-white',
      normal: 'bg-white text-gray-800'
    },
    emerald: {
      icon: 'bg-emerald-100 text-emerald-600',
      highlight: 'bg-emerald-600 text-white', 
      normal: 'bg-white text-gray-800'
    },
    red: {
      icon: 'bg-red-100 text-red-600',
      highlight: 'bg-red-600 text-white',
      normal: 'bg-white text-gray-800'
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      highlight: 'bg-purple-600 text-white',
      normal: 'bg-white text-gray-800'
    },
    yellow: {
      icon: 'bg-yellow-100 text-yellow-600',
      highlight: 'bg-yellow-600 text-white',
      normal: 'bg-white text-gray-800'
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      highlight: 'bg-green-600 text-white',
      normal: 'bg-white text-gray-800'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;
  const cardClass = highlight ? colors.highlight : colors.normal;

  return (
    <div className={`${cardClass} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.icon} rounded-full p-3 ${highlight ? 'bg-white bg-opacity-20' : ''}`}>
          <Icon className="h-8 w-8" />
        </div>
        {highlight && (
          <span className="text-sm font-medium bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
            Priority
          </span>
        )}
      </div>
      
      <p className={`text-sm font-medium mb-1 ${highlight ? 'text-white opacity-90' : 'text-gray-600'}`}>
        {title}
      </p>
      
      <p className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      
      {subtitle && (
        <p className={`text-sm mt-2 ${highlight ? 'text-white opacity-75' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;