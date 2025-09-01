import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Download, FileText, AlertTriangle, CheckCircle, Eye, TrendingUp, DollarSign, Home } from 'lucide-react';
import { useGlobalTheme } from '../HomePage/GlobalThemeContext';
import { getResults, downloadFile, handleApiError } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../common/StatsCard';

const ResultsPage = ({ sessionData, onBackToHome, onVisualization }) => {
  const { isDark } = useGlobalTheme();
  const [results, setResults] = useState(sessionData);
  const [loading, setLoading] = useState(!sessionData);
  const [error, setError] = useState('');
  const [chartsReady, setChartsReady] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);

  // Load Plotly for charts
  useEffect(() => {
    if (!window.Plotly) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js';
      script.onload = () => {
        setChartsReady(true);
        if (results) createCharts();
      };
      document.head.appendChild(script);
    } else {
      setChartsReady(true);
      if (results) createCharts();
    }
  }, [results]);

  // If no session data provided, try to get from URL or latest session
  useEffect(() => {
    if (!sessionData) {
      // In a real app, you might get session ID from URL params
      setError('No session data available. Please upload and process data first.');
      setLoading(false);
    }
  }, [sessionData]);

  const createCharts = () => {
    if (!window.Plotly || !results || !results.visualizations) return;

    try {
      // Create leakage distribution chart
      if (results.visualizations.leakage_chart && document.getElementById('leakageChart')) {
        const leakageData = JSON.parse(results.visualizations.leakage_chart);
        window.Plotly.newPlot('leakageChart', leakageData.data, {
          ...leakageData.layout,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { 
            family: 'Inter, sans-serif',
            color: isDark ? '#ffffff' : '#1f2937'
          }
        }, { responsive: true });
      }

      // Create anomaly types chart
      if (results.visualizations.anomaly_chart && document.getElementById('anomalyChart')) {
        const anomalyData = JSON.parse(results.visualizations.anomaly_chart);
        window.Plotly.newPlot('anomalyChart', anomalyData.data, {
          ...anomalyData.layout,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { 
            family: 'Inter, sans-serif',
            color: isDark ? '#ffffff' : '#1f2937'
          }
        }, { responsive: true });
      }
    } catch (err) {
      console.error('Error creating charts:', err);
    }
  };

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const generateReport = async (detailed = false) => {
    if (!results || reportGenerating) return;
    
    setReportGenerating(true);
    setError('');
    
    try {
      const domain = results.domain || 'supermarket';
      let endpoint;
      
      if (detailed) {
        endpoint = `/api/generate-detailed-report/${results.session_id || 'latest'}`;
      } else {
        endpoint = domain === 'telecom' 
          ? `/api/telecom/generate-report/${results.session_id || 'latest'}`
          : `/api/supermarket/generate-report/${results.session_id || 'latest'}`;
      }
      
      const response = await fetch(`http://localhost:5000${endpoint}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: results.session_id })
      });
      
      if (response.ok) {
        // Check if response is a file download
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          // It's a Word document, download it directly
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Get filename from response headers or create one
          const contentDisposition = response.headers.get('content-disposition');
          let filename = `${domain}_comprehensive_report_${new Date().toISOString().split('T')[0]}.docx`;
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }
          
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          // Fallback to JSON response handling
          const reportData = await response.json();
          if (reportData.success) {
            // Create a downloadable report file (fallback to text)
            const reportContent = reportData.report.content;
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${domain}_comprehensive_report_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            setError(reportData.error || 'Failed to generate report');
          }
        }
      } else {
        // Handle error response
        try {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to generate report');
        } catch {
          setError(`Failed to generate report: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error('Report generation error:', err);
      setError('Report generation failed. Please ensure the backend is running and analysis has been completed.');
    } finally {
      setReportGenerating(false);
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
          message="Loading Results" 
          submessage="Retrieving your analysis data..."
          size="large"
        />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className={`min-h-screen ${themeClasses.mainBg} flex items-center justify-center p-8`}>
        <div className="max-w-md w-full">
          <ErrorMessage 
            message={error || 'No results available'}
            onDismiss={onBackToHome}
          />
        </div>
      </div>
    );
  }

  const isDomainTelecom = results.domain === 'telecom';

  return (
    <div className={`min-h-screen ${themeClasses.mainBg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-lg p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.primaryText} mb-2`}>
                Analysis Results
              </h1>
              <p className={`${themeClasses.secondaryText}`}>
                Revenue leakage detection completed successfully
              </p>
            </div>
            
            <button
              onClick={onBackToHome}
              className={`flex items-center px-4 py-2 ${themeClasses.button} border rounded-lg transition-all`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Upload New File
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Records Processed"
            value={results.summary.total_records}
            subtitle="100% Analyzed"
            icon={FileText}
            color={isDomainTelecom ? 'blue' : 'emerald'}
          />
          
          <StatsCard
            title="Revenue Leakages Detected"
            value={results.summary.anomaly_count || results.summary.leakage_count}
            subtitle={`${results.summary.anomaly_percentage || results.summary.leakage_percentage}% leakage rate`}
            icon={AlertTriangle}
            color="red"
            highlight={true}
          />
          
          <StatsCard
            title="Clean Records"
            value={results.summary.no_leakage_count}
            subtitle="Verified integrity"
            icon={CheckCircle}
            color="green"
          />
          
          <StatsCard
            title="Leakage Rate"
            value={`${results.summary.anomaly_percentage || results.summary.leakage_percentage}%`}
            subtitle="Overall assessment"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Visualizations */}
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${themeClasses.primaryText} flex items-center`}>
              <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
              Data Visualization
            </h2>
            <p className={`${themeClasses.secondaryText}`}>
              Interactive charts showing your revenue leakage analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${themeClasses.primaryText} mb-4`}>
                Revenue Leakage Distribution
              </h3>
              <div id="leakageChart" className="h-80 w-full"></div>
            </div>

            <div className={`${isDark ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-800/30' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${themeClasses.primaryText} mb-4`}>
                Anomaly Types Distribution
              </h3>
              <div id="anomalyChart" className="h-80 w-full"></div>
            </div>
          </div>
        </div>

        {/* Report Generation */}
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-xl p-6 mb-8`}>
          <h2 className={`text-2xl font-bold ${themeClasses.primaryText} mb-6 flex items-center`}>
            <FileText className="h-8 w-8 mr-3 text-purple-600" />
            Generate Reports
          </h2>
          
          <p className={`${themeClasses.secondaryText} mb-6`}>
            Generate comprehensive reports of your analysis results
          </p>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <button
              onClick={() => generateReport(false)}
              disabled={reportGenerating}
              className={`${themeClasses.button} border px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${reportGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              <FileText className="h-5 w-5 mr-2" />
              {reportGenerating ? 'Generating...' : 'Generate Standard Report'}
            </button>
            
            <button
              onClick={() => generateReport(true)}
              disabled={reportGenerating}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5 mr-2" />
              {reportGenerating ? 'Generating...' : 'Generate Detailed Report'}
            </button>

            <button
              onClick={onVisualization}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Interactive Visualizations
            </button>
          </div>
        </div>
        
        {/* Download Results */}
        <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} rounded-xl p-6 mb-8`}>
          <h2 className={`text-2xl font-bold ${themeClasses.primaryText} mb-6 flex items-center`}>
            <Download className="h-8 w-8 mr-3 text-blue-600" />
            Download Results
          </h2>
          
          <p className={`${themeClasses.secondaryText} mb-6`}>
            Download your analysis results in different formats
          </p>
          {results.download_links && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(results.download_links).map(([type, filename]) => {
                const typeConfig = {
                  all_results: { 
                    title: 'Complete Analysis', 
                    icon: '📊', 
                    color: 'bg-blue-100 text-blue-600' 
                  },
                  anomalies_only: { 
                    title: 'Revenue Leakages', 
                    icon: '⚠️', 
                    color: 'bg-red-100 text-red-600' 
                  },
                  no_leakage_only: { 
                    title: 'Clean Records', 
                    icon: '✅', 
                    color: 'bg-green-100 text-green-600' 
                  }
                };

                const config = typeConfig[type] || typeConfig.all_results;

                return (
                  <button
                    key={type}
                    onClick={() => handleDownload(filename)}
                    className={`${themeClasses.cardBg} border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="text-4xl mb-3">{config.icon}</div>
                    <h3 className={`font-semibold ${themeClasses.primaryText} mb-2`}>
                      {config.title}
                    </h3>
                    <div className="flex items-center justify-center">
                      <span className={`text-xs ${config.color} px-3 py-1 rounded-full font-medium`}>
                        Download CSV
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Session Info */}
        <div className={`${isDark ? 'bg-gray-800/60 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-xl p-4 text-center`}>
          <p className={`${themeClasses.secondaryText} mb-2`}>
            Analysis completed successfully • Session ID: {results.session_id?.substring(0, 8)}...
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
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
  );
};

export default ResultsPage;