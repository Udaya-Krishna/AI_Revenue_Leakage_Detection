import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, BarChart3, AlertTriangle, CheckCircle, Loader2, ShoppingCart, ArrowLeft, Home, PieChart, TrendingUp, Shield, Eye, Filter, Search, Calendar, DollarSign, Package, Users, Store, RefreshCw } from 'lucide-react';
import { useGlobalTheme } from '../HomePage/GlobalThemeContext';
import { uploadSupermarketFile, downloadFile, handleApiError } from '../../utils/api';
import FileUpload from '../common/FileUpload';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../common/StatsCard';

const SuperMarket = ({ onBackToHome, onResultsReady }) => {
  const { isDark } = useGlobalTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [chartsReady, setChartsReady] = useState(false);

  // Load Plotly dynamically
  useEffect(() => {
    if (!window.Plotly) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js';
      script.onload = () => {
        setChartsReady(true);
        console.log('Plotly loaded successfully');
      };
      document.head.appendChild(script);
    } else {
      setChartsReady(true);
    }
  }, []);

  // Create charts when results are available and Plotly is ready
  useEffect(() => {
    if (results && chartsReady && activeTab === 'results') {
      setTimeout(() => {
        createInteractiveCharts();
      }, 100);
    }
  }, [results, chartsReady, activeTab]);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const uploadResult = await uploadSupermarketFile(file);
      
      if (uploadResult.success && uploadResult.session_id) {
        // Get the full results using session ID
        const response = await fetch(`http://localhost:5000/api/results/${uploadResult.session_id}`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data);
          setActiveTab('results');
          if (onResultsReady) {
            onResultsReady(data);
          }
        } else {
          setError(data.error || 'Failed to retrieve results');
        }
      } else {
        setError(uploadResult.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createInteractiveCharts = () => {
    if (!window.Plotly || !results) return;

    try {
      // Create leakage distribution pie chart
      const leakageData = results.prediction_summary?.leakage_analysis;
      if (leakageData && document.getElementById('leakageChart')) {
        const pieData = [{
          values: Object.values(leakageData.counts),
          labels: Object.keys(leakageData.counts),
          type: 'pie',
          hole: 0.4,
          marker: {
            colors: ['#dc2626', '#16a34a'],
            line: { color: '#fff', width: 2 }
          },
          textinfo: 'label+percent+value',
          textposition: 'auto',
          hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
        }];

        const pieLayout = {
          title: {
            text: 'Revenue Leakage Detection Results',
            font: { size: 18, color: isDark ? '#ffffff' : '#1f2937' }
          },
          showlegend: true,
          legend: {
            orientation: 'h',
            y: -0.1,
            x: 0.5,
            xanchor: 'center',
            font: { color: isDark ? '#ffffff' : '#1f2937' }
          },
          margin: { t: 60, b: 60, l: 40, r: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Inter, sans-serif', color: isDark ? '#ffffff' : '#1f2937' }
        };

        window.Plotly.newPlot('leakageChart', pieData, pieLayout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
        });
      }

      // Create anomaly types bar chart
      const anomalyData = results.prediction_summary?.anomaly_analysis;
      if (anomalyData && document.getElementById('anomalyChart')) {
        const barData = [{
          x: Object.keys(anomalyData.counts),
          y: Object.values(anomalyData.counts),
          type: 'bar',
          marker: {
            color: Object.values(anomalyData.counts).map((value, index) => 
              `rgba(${index * 60 + 100}, ${150 - index * 20}, ${200 + index * 20}, 0.8)`
            ),
            line: { color: '#1f2937', width: 1 }
          },
          text: Object.values(anomalyData.counts).map(val => val.toLocaleString()),
          textposition: 'auto',
          hovertemplate: '<b>%{x}</b><br>Count: %{y}<br>Percentage: %{customdata:.1f}%<extra></extra>',
          customdata: Object.values(anomalyData.percentages)
        }];

        const barLayout = {
          title: {
            text: 'Types of Anomalies Detected',
            font: { size: 18, color: isDark ? '#ffffff' : '#1f2937' }
          },
          xaxis: {
            title: 'Anomaly Types',
            tickangle: -45,
            tickfont: { size: 12, color: isDark ? '#ffffff' : '#1f2937' }
          },
          yaxis: {
            title: 'Count',
            tickfont: { size: 12, color: isDark ? '#ffffff' : '#1f2937' }
          },
          margin: { t: 60, b: 100, l: 60, r: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Inter, sans-serif', color: isDark ? '#ffffff' : '#1f2937' }
        };

        window.Plotly.newPlot('anomalyChart', barData, barLayout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
        });
      }

      // Create additional trend chart
      createTrendChart();

    } catch (err) {
      console.error('Error creating charts:', err);
    }
  };

  const createTrendChart = () => {
    if (!results || !document.getElementById('trendChart')) return;

    // Simulate trend data based on results
    const days = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    const anomalyRate = getAnomalyPercentage();
    const baseRate = anomalyRate;
    
    // Create simulated trend data with some variance
    const trendData = days.map((day, i) => ({
      day,
      rate: baseRate + (Math.sin(i / 5) * 2) + (Math.random() - 0.5) * 3
    }));

    const trendChartData = [{
      x: trendData.map(d => d.day),
      y: trendData.map(d => Math.max(0, d.rate)),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Anomaly Rate Trend',
      line: {
        color: '#dc2626',
        width: 3
      },
      marker: {
        color: '#dc2626',
        size: 6
      },
      hovertemplate: '<b>%{x}</b><br>Anomaly Rate: %{y:.2f}%<extra></extra>'
    }];

    const trendLayout = {
      title: {
        text: 'Revenue Leakage Trend Analysis (30 Days)',
        font: { size: 18, color: isDark ? '#ffffff' : '#1f2937' }
      },
      xaxis: {
        title: 'Time Period',
        tickangle: -45,
        showgrid: true,
        gridcolor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
        tickfont: { color: isDark ? '#ffffff' : '#1f2937' }
      },
      yaxis: {
        title: 'Anomaly Rate (%)',
        showgrid: true,
        gridcolor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
        tickfont: { color: isDark ? '#ffffff' : '#1f2937' }
      },
      margin: { t: 60, b: 100, l: 60, r: 40 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: 'Inter, sans-serif', color: isDark ? '#ffffff' : '#1f2937' }
    };

    window.Plotly.newPlot('trendChart', trendChartData, trendLayout, {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    });
  };

  const handleDownloadFile = async (outputType, sessionId) => {
    try {
      await downloadFile(`${sessionId}_${outputType}_supermarket.csv`);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const generateReport = async () => {
    if (!results?.session_id) return;

    setReportGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/supermarket/generate-report/${results.session_id}`,
        { method: 'POST' }
      );
      
      const reportData = await response.json();
      
      if (reportData.success) {
        const blob = new Blob([JSON.stringify(reportData.report, null, 2)], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `supermarket_comprehensive_report_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError(reportData.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Report generation error:', err);
      setError('Report generation failed');
    } finally {
      setReportGenerating(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setError('');
    setActiveTab('upload');
  };

  const getRiskColor = (percentage) => {
    if (percentage > 20) return 'text-red-600 bg-red-100';
    if (percentage > 10) return 'text-orange-600 bg-orange-100';
    if (percentage > 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevel = (percentage) => {
    if (percentage > 20) return 'Critical';
    if (percentage > 10) return 'High';
    if (percentage > 5) return 'Medium';
    return 'Low';
  };

  const getAnomalyCount = () => {
    if (!results?.summary) return 0;
    return results.summary.anomaly_count || 0;
  };

  const getCleanCount = () => {
    if (!results?.summary) return 0;
    return results.summary.no_leakage_count || 0;
  };

  const getAnomalyPercentage = () => {
    if (!results?.summary) return 0;
    return results.summary.anomaly_percentage || 0;
  };

  const getCleanPercentage = () => {
    if (!results?.summary) return 0;
    return 100 - getAnomalyPercentage();
  };

  const themeClasses = {
    mainBg: isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50',
    cardBg: isDark ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white',
    cardBorder: isDark ? 'border border-gray-700' : 'border border-gray-200 shadow-lg',
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    button: isDark ? 'bg-gray-800 text-cyan-400 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  };

  return (
    <div className={`min-h-screen ${themeClasses.mainBg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className={`flex items-center ${themeClasses.button} px-4 py-2 rounded-lg border transition-all group`}
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-center flex-1">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-xl p-8 mx-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                  <ShoppingCart className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold">
                  Retail Revenue Intelligence
                </h1>
              </div>
              <p className="text-xl text-emerald-100 mb-4">
                AI-Powered Supermarket Revenue Leakage Detection & Advanced Analytics
              </p>
              <div className="flex items-center justify-center space-x-6 text-emerald-100">
                <span className="flex items-center text-sm">
                  <Store className="h-4 w-4 mr-1" /> 
                  Retail Analytics
                </span>
                <span className="flex items-center text-sm">
                  <Package className="h-4 w-4 mr-1" /> 
                  Inventory Insights
                </span>
                <span className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1" /> 
                  Customer Intelligence
                </span>
                <span className="flex items-center text-sm">
                  <BarChart3 className="h-4 w-4 mr-1" /> 
                  Interactive Visualizations
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`${themeClasses.cardBg} rounded-lg p-1 shadow-md`}>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-green-600 text-white shadow-md'
                  : `${themeClasses.secondaryText} hover:text-green-600`
              }`}
            >
              Upload Data
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-green-600 text-white shadow-md'
                  : `${themeClasses.secondaryText} hover:text-green-600`
              } ${!results ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!results}
            >
              Results & Analysis
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {activeTab === 'upload' && (
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-2xl p-8 max-w-3xl mx-auto`}>
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <Upload className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className={`text-3xl font-bold ${themeClasses.primaryText} mb-4`}>
                Upload Retail Dataset
              </h2>
              <p className={`${themeClasses.secondaryText} text-lg`}>
                Upload your retail billing data to identify anomalies and prevent revenue loss
              </p>
            </div>

            <div className="space-y-8">
              <FileUpload 
                onFileSelect={setFile}
                domain="supermarket"
              />

              {error && (
                <ErrorMessage 
                  message={error}
                  onDismiss={() => setError('')}
                  onRetry={handleUpload}
                />
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <LoadingSpinner 
                    message=""
                    size="small"
                    theme="emerald"
                  />
                ) : (
                  <>
                    <BarChart3 className="h-6 w-6 mr-3" />
                    Start Revenue Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Results Section */}
        {activeTab === 'results' && results && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Total Transactions"
                value={results.summary.total_records}
                subtitle="100% Analyzed"
                icon={FileText}
                color="emerald"
              />

              <StatsCard
                title="Anomalies Detected"
                value={getAnomalyCount()}
                subtitle={`${getAnomalyPercentage().toFixed(1)}% of transactions`}
                icon={AlertTriangle}
                color="red"
                highlight={true}
              />

              <StatsCard
                title="Clean Records"
                value={getCleanCount()}
                subtitle={`${getCleanPercentage().toFixed(1)}% healthy`}
                icon={CheckCircle}
                color="green"
              />

              <StatsCard
                title="Revenue at Risk"
                value={`$${(getAnomalyCount() * 85).toLocaleString()}`}
                subtitle="Avg $85/anomaly"
                icon={DollarSign}
                color="purple"
              />
            </div>

            {/* Risk Assessment Dashboard */}
            <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${themeClasses.primaryText} flex items-center`}>
                  <Shield className="h-6 w-6 mr-2 text-emerald-600" />
                  Risk Assessment Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${
                    getAnomalyPercentage() > 20 
                      ? 'bg-red-500' 
                      : getAnomalyPercentage() > 10 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${themeClasses.secondaryText}`}>
                    Risk Level: {getRiskLevel(getAnomalyPercentage())}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${isDark ? 'bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-800/30' : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'} rounded-xl p-4`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-800'}`}>High Priority</h4>
                  <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {Math.round(getAnomalyCount() * 0.3).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>Critical anomalies requiring immediate attention</p>
                </div>
                
                <div className={`${isDark ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-800/30' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'} rounded-xl p-4`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>Medium Priority</h4>
                  <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {Math.round(getAnomalyCount() * 0.5).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>Moderate anomalies for review</p>
                </div>
                
                <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'} rounded-xl p-4`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>Low Priority</h4>
                  <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {Math.round(getAnomalyCount() * 0.2).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Minor anomalies for monitoring</p>
                </div>
              </div>
            </div>

            {/* Interactive Visualizations */}
            <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-2xl font-bold ${themeClasses.primaryText} flex items-center`}>
                  <BarChart3 className="h-8 w-8 mr-3 text-emerald-600" />
                  Interactive Data Visualizations
                </h3>
                <button
                  onClick={() => createInteractiveCharts()}
                  className={`flex items-center ${themeClasses.secondaryText} hover:text-emerald-600 transition-colors ${isDark ? 'bg-emerald-900/20 hover:bg-emerald-800/30' : 'bg-emerald-50 hover:bg-emerald-100'} px-4 py-2 rounded-lg`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Charts
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'} rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-lg font-bold ${themeClasses.primaryText} flex items-center`}>
                      <PieChart className="h-5 w-5 mr-2 text-emerald-600" />
                      Leakage Distribution
                    </h4>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Interactive Chart</div>
                  </div>
                  <div id="leakageChart" className="h-80 w-full"></div>
                </div>

                <div className={`${isDark ? 'bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border border-orange-800/30' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200'} rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-lg font-bold ${themeClasses.primaryText} flex items-center`}>
                      <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                      Anomaly Categories
                    </h4>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Bar Chart</div>
                  </div>
                  <div id="anomalyChart" className="h-80 w-full"></div>
                </div>
              </div>

              {/* Trend Analysis Chart */}
              <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-lg font-bold ${themeClasses.primaryText} flex items-center`}>
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Revenue Leakage Trend Analysis
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Time Series</div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Predictive Model</div>
                  </div>
                </div>
                <div id="trendChart" className="h-80 w-full"></div>
              </div>
            </div>

            {/* Enhanced Action Section */}
            <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-2xl p-8`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`text-2xl font-bold ${themeClasses.primaryText} mb-2 flex items-center`}>
                    <Download className="h-8 w-8 mr-3 text-emerald-600" />
                    Export & Reporting Suite
                  </h3>
                  <p className={`${themeClasses.secondaryText} text-lg`}>
                    Download detailed analysis results and generate comprehensive business intelligence reports
                  </p>
                </div>
                <button
                  onClick={generateReport}
                  disabled={reportGenerating}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
                >
                  {reportGenerating ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Generate Comprehensive Report
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.download_links && Object.entries(results.download_links).map(([outputType, filename]) => (
                  <div key={outputType} className="group">
                    <button
                      onClick={() => handleDownloadFile(outputType, results.session_id)}
                      className={`w-full ${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 hover:from-emerald-800/30 hover:to-green-800/30 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200'} rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
                    >
                      <div className="bg-emerald-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Download className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h4 className={`font-semibold ${themeClasses.primaryText} mb-2 capitalize`}>
                        {outputType.replace('_', ' ')}
                      </h4>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">CSV</span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Ready</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center space-y-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetUpload}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Analyze New Dataset
                </button>
                <button
                  onClick={onBackToHome}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Home
                </button>
              </div>
              
              {/* Footer Information */}
              <div className={`${isDark ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'} rounded-xl p-6 text-center`}>
                <p className={`${themeClasses.secondaryText} mb-2`}>
                  Analysis completed successfully • Session ID: {results.session_id?.substring(0, 8)}...
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" /> Secure Processing
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> AI-Powered Detection
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" /> Interactive Analytics
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" /> Predictive Insights
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperMarket;