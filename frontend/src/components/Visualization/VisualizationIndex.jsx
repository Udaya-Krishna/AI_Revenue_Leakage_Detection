import React from 'react';
import { ArrowLeft, BarChart3, Phone, ShoppingCart } from 'lucide-react';
import { useGlobalTheme } from '../HomePage/GlobalThemeContext';

const VisualizationIndex = ({ onBackToHome, onDashboard }) => {
  const { isDark } = useGlobalTheme();

  const handleDatasetSelect = async (datasetType) => {
    try {
      // For now, we'll navigate to the dashboard with the selected type
      // In a full implementation, you might fetch the latest data here
      onDashboard({ type: datasetType });
    } catch (error) {
      console.error('Error selecting dataset:', error);
    }
  };

  const themeClasses = {
    mainBg: isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    cardBg: isDark ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white',
    cardBorder: isDark ? 'border border-gray-700 hover:border-gray-600' : 'border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl',
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    button: isDark ? 'bg-gray-800 text-cyan-400 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  };

  return (
    <div className={`min-h-screen ${themeClasses.mainBg} p-4 md:p-8`}>
      {/* Header */}
      <header className="text-center mb-8">
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-lg p-6 mb-4 transition-all`}>
          <h1 className={`text-4xl font-bold ${themeClasses.primaryText} mb-2`}>
            Revenue Leakage Analysis
          </h1>
          <p className={`text-lg ${themeClasses.secondaryText}`}>
            Please select a dataset to process and visualize.
          </p>
        </div>
        
        <button 
          onClick={onBackToHome}
          className={`inline-flex items-center px-4 py-2 ${themeClasses.button} border rounded-lg transition-all duration-300`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dataset Selection
        </button>
      </header>

      {/* Dataset Selection Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Telecom Card */}
          <button
            onClick={() => handleDatasetSelect('telecom')}
            className={`group block p-8 ${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-lg transition-all duration-300 transform hover:scale-105 text-left`}
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 mr-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold tracking-tight text-indigo-600 mb-1`}>
                  Telecom Dataset
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Network Analytics
                </div>
              </div>
            </div>
            
            <p className={`${themeClasses.secondaryText} mb-6 leading-relaxed`}>
              Analyze anomalies based on plan category, zone, payment status, billing patterns, and network performance metrics.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-lg text-center`}>
                <div className={`text-lg font-bold ${themeClasses.primaryText}`}>Network Impact</div>
                <div className="text-xs text-gray-500">Regional Analysis</div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-lg text-center`}>
                <div className={`text-lg font-bold ${themeClasses.primaryText}`}>Billing Accuracy</div>
                <div className="text-xs text-gray-500">Revenue Assurance</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${themeClasses.secondaryText}`}>
                View Telecom Analytics
              </span>
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <ArrowLeft className="w-4 h-4 text-indigo-600 rotate-180" />
              </div>
            </div>
          </button>

          {/* Supermarket Card */}
          <button
            onClick={() => handleDatasetSelect('supermarket')}
            className={`group block p-8 ${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-lg transition-all duration-300 transform hover:scale-105 text-left`}
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 mr-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold tracking-tight text-emerald-600 mb-1`}>
                  Supermarket Dataset
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Retail Analytics
                </div>
              </div>
            </div>
            
            <p className={`${themeClasses.secondaryText} mb-6 leading-relaxed`}>
              Analyze anomalies based on customer type, order channel, product category, pricing patterns, and transaction integrity.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-lg text-center`}>
                <div className={`text-lg font-bold ${themeClasses.primaryText}`}>Revenue Impact</div>
                <div className="text-xs text-gray-500">Transaction Analysis</div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50'} rounded-lg text-center`}>
                <div className={`text-lg font-bold ${themeClasses.primaryText}`}>Data Quality</div>
                <div className="text-xs text-gray-500">Integrity Score</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${themeClasses.secondaryText}`}>
                View Retail Analytics
              </span>
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <ArrowLeft className="w-4 h-4 text-emerald-600 rotate-180" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizationIndex;