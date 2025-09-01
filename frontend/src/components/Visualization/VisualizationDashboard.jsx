import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BarChart3, RefreshCw, Download, TrendingUp, AlertTriangle, CheckCircle, Phone, ShoppingCart, PieChart } from 'lucide-react';
import { useGlobalTheme } from '../HomePage/GlobalThemeContext';
import { getResults, downloadFile, getSessionVisualization } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../common/StatsCard';

const VisualizationDashboard = ({ sessionData, onBackToHome, onBackToIndex }) => {
  const { isDark } = useGlobalTheme();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartsReady, setChartsReady] = useState(false);
  const chartsInitialized = useRef(false);

  // Load Chart.js dynamically
  useEffect(() => {
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        setChartsReady(true);
      };
      document.head.appendChild(script);
    } else {
      setChartsReady(true);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (sessionData?.session_id) {
      loadVisualizationData(sessionData.session_id);
    } else {
      // Load latest processed data
      loadLatestData();
    }
  }, [sessionData]);

  // Create charts when data and Chart.js are ready
  useEffect(() => {
    if (chartData && chartsReady && !chartsInitialized.current) {
      setTimeout(() => {
        createCharts();
        chartsInitialized.current = true;
      }, 100);
    }
  }, [chartData, chartsReady]);

  const loadVisualizationData = async (sessionId) => {
    try {
      setLoading(true);
      const data = await getSessionVisualization(sessionId);
      if (data && data.charts) {
        setChartData(data);
      } else {
        setError('Failed to load visualization data');
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestData = async () => {
    // For demo purposes, we'll show a message about no data
    setLoading(false);
    setError('No processed data available. Please upload and process data first.');
  };

  const createCharts = () => {
    if (!window.Chart || !chartData) return;

    try {
      // Create charts based on the chartData
      chartData.charts.forEach((chartInfo, index) => {
        if (chartInfo.error) return;
        
        const canvasId = `chart-${index}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Create chart based on type
        switch (chartInfo.type) {
          case 'pie':
            new window.Chart(ctx, {
              type: 'pie',
              data: {
                labels: Object.keys(chartInfo.data),
                datasets: [{
                  data: Object.values(chartInfo.data),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                  ],
                  borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)'
                  ],
                  borderWidth: 2
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: chartInfo.title,
                    font: { size: 16, weight: 'bold' },
                    color: isDark ? '#ffffff' : '#1f2937'
                  },
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      color: isDark ? '#ffffff' : '#1f2937'
                    }
                  }
                }
              }
            });
            break;
            
          case 'bar':
            new window.Chart(ctx, {
              type: 'bar',
              data: {
                labels: Object.keys(chartInfo.data),
                datasets: [{
                  label: 'Count',
                  data: Object.values(chartInfo.data),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 2,
                  borderRadius: 8
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: chartInfo.title,
                    font: { size: 16, weight: 'bold' },
                    color: isDark ? '#ffffff' : '#1f2937'
                  },
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                      color: isDark ? '#ffffff' : '#1f2937'
                    },
                    grid: {
                      color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }
                  },
                  x: {
                    ticks: {
                      color: isDark ? '#ffffff' : '#1f2937',
                      maxRotation: 45
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }
            });
            break;
            
          // Add more chart types as needed
          default:
            console.log(`Unsupported chart type: ${chartInfo.type}`);
        }
      });

    } catch (err) {
      console.error('Error creating charts:', err);
    }
  };

  const refreshCharts = () => {
    chartsInitialized.current = false;
    if (chartData && chartsReady) {
      createCharts();
      chartsInitialized.current = true;
    }
  };

  const themeClasses = {
    mainBg: isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    cardBg: isDark ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white',
    cardBorder: isDark ? 'border border-gray-700' : 'border border-gray-200 shadow-lg',
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    button: isDark ? 'bg-gray-800 text-cyan-400 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.mainBg} flex items-center justify-center`}>
        <LoadingSpinner 
          message="Loading Analytics Dashboard" 
          submessage="Preparing your data visualizations..."
          size="large"
          theme={isDark ? 'blue' : 'blue'}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${themeClasses.mainBg} flex items-center justify-center p-8`}>
        <div className="max-w-md w-full">
          <ErrorMessage 
            message={error}
            onRetry={() => {
              if (sessionData?.session_id) {
                loadVisualizationData(sessionData.session_id);
              } else {
                loadLatestData();
              }
            }}
            onDismiss={onBackToHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.mainBg} p-4 md:p-8`}>
      {/* Header */}
      <header className="mb-8">
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-lg p-6 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 mr-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.primaryText}`}>
                  Analytics Dashboard
                </h1>
                <p className={`${themeClasses.secondaryText}`}>
                  Interactive data analysis and insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshCharts}
                className={`flex items-center px-4 py-2 ${themeClasses.button} border rounded-lg transition-all`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              
              <button 
                onClick={onBackToIndex}
                className={`flex items-center px-4 py-2 ${themeClasses.button} border rounded-lg transition-all`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Selection
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Dashboard */}
      {chartData?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Records"
            value={chartData.stats.total_records || 0}
            subtitle="100% Analyzed"
            icon={BarChart3}
            color="blue"
          />
          
          <StatsCard
            title="Anomalies Found"
            value={chartData.stats.anomaly_count || chartData.stats.leakage_count || 0}
            subtitle={`${chartData.stats.anomaly_percentage || chartData.stats.leakage_percentage || 0}% of records`}
            icon={AlertTriangle}
            color="red"
            highlight={true}
          />
          
          <StatsCard
            title="Clean Records"
            value={chartData.stats.no_anomaly_count || chartData.stats.no_leakage_count || 0}
            subtitle="Verified integrity"
            icon={CheckCircle}
            color="green"
          />
          
          <StatsCard
            title="Data Columns"
            value={chartData.stats.data_columns || 0}
            subtitle="Features analyzed"
            icon={TrendingUp}
            color="purple"
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {chartData?.charts.map((chartInfo, index) => (
          <div key={index} className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-xl p-6 transition-all hover:shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${themeClasses.primaryText}`}>
                {chartInfo.title}
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                {chartInfo.type}
              </span>
            </div>
            <div className="h-80 w-full">
              <canvas id={`chart-${index}`}></canvas>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <button
          onClick={onBackToHome}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default VisualizationDashboard;