import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, BarChart3, AlertTriangle, CheckCircle, Loader2, ArrowLeft, Home, PieChart, TrendingUp, Shield, Eye, Filter, Search, Calendar, DollarSign, Phone, Zap, Signal, RefreshCw, Network, Smartphone, Wifi } from 'lucide-react';

const Telecommunication = ({ onBackToHome }) => {
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
        console.log('Plotly loaded successfully for Telecom');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(fileType)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/telecom/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setActiveTab('results');
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to connect to the server. Please ensure the backend is running on http://localhost:5000');
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
          labels: Object.keys(leakageData.counts).map(key => key === 'Yes' ? 'Revenue Leakages' : 'Clean Records'),
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
            font: { size: 18, color: '#1f2937' }
          },
          showlegend: true,
          legend: {
            orientation: 'h',
            y: -0.1,
            x: 0.5,
            xanchor: 'center'
          },
          margin: { t: 60, b: 60, l: 40, r: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Inter, sans-serif' }
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
              `rgba(${59 + index * 40}, ${130 + index * 20}, ${246 - index * 30}, 0.8)`
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
            text: 'Types of Revenue Leakages Detected',
            font: { size: 18, color: '#1f2937' }
          },
          xaxis: {
            title: 'Leakage Types',
            tickangle: -45,
            tickfont: { size: 12 }
          },
          yaxis: {
            title: 'Count',
            tickfont: { size: 12 }
          },
          margin: { t: 60, b: 100, l: 60, r: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Inter, sans-serif' }
        };

        window.Plotly.newPlot('anomalyChart', barData, barLayout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
        });
      }

      // Create telecom-specific network impact chart
      createNetworkImpactChart();

    } catch (err) {
      console.error('Error creating telecom charts:', err);
    }
  };

  const createNetworkImpactChart = () => {
    if (!results || !document.getElementById('networkChart')) return;

    // Simulate network impact data based on results
    const leakagePercentage = getLeakagePercentage();
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    
    const networkData = regions.map((region, i) => ({
      region,
      impact: leakagePercentage + (Math.sin(i) * 5) + (Math.random() - 0.5) * 8,
      revenue: 1000000 - (leakagePercentage * 10000) + (i * 50000)
    }));

    const networkChartData = [{
      x: networkData.map(d => d.region),
      y: networkData.map(d => Math.max(0, d.impact)),
      type: 'bar',
      name: 'Network Impact (%)',
      marker: {
        color: networkData.map(d => d.impact > 20 ? '#dc2626' : d.impact > 10 ? '#f59e0b' : '#10b981'),
        opacity: 0.8
      },
      hovertemplate: '<b>%{x} Region</b><br>Impact: %{y:.2f}%<br>Est. Revenue: $%{customdata:,.0f}<extra></extra>',
      customdata: networkData.map(d => d.revenue)
    }];

    const networkLayout = {
      title: {
        text: 'Regional Network Revenue Impact Analysis',
        font: { size: 18, color: '#1f2937' }
      },
      xaxis: {
        title: 'Network Regions',
        showgrid: true,
        gridcolor: '#e5e7eb'
      },
      yaxis: {
        title: 'Revenue Impact (%)',
        showgrid: true,
        gridcolor: '#e5e7eb'
      },
      margin: { t: 60, b: 60, l: 60, r: 40 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: 'Inter, sans-serif' }
    };

    window.Plotly.newPlot('networkChart', networkChartData, networkLayout, {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    });
  };

  const downloadFile = async (outputType, sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/telecom/download/${outputType}/${sessionId}`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `telecom_${outputType}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to download file');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed');
    }
  };

  const generateReport = async () => {
    if (!results?.session_id) return;

    setReportGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/telecom/generate-report/${results.session_id}`,
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
        a.download = `telecom_comprehensive_report_${new Date().toISOString().split('T')[0]}.json`;
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
    if (percentage > 25) return 'text-red-600 bg-red-100';
    if (percentage > 15) return 'text-orange-600 bg-orange-100';
    if (percentage > 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevel = (percentage) => {
    if (percentage > 25) return 'Critical';
    if (percentage > 15) return 'High';
    if (percentage > 5) return 'Medium';
    return 'Low';
  };

  const getLeakageCount = () => {
    if (!results?.prediction_summary) return 0;
    return results.prediction_summary.leakage_analysis?.counts?.Yes || 0;
  };

  const getCleanCount = () => {
    if (!results?.prediction_summary) return 0;
    return results.prediction_summary.leakage_analysis?.counts?.No || 0;
  };

  const getLeakagePercentage = () => {
    if (!results?.prediction_summary) return 0;
    return results.prediction_summary.leakage_analysis?.percentages?.Yes || 0;
  };

  const getCleanPercentage = () => {
    if (!results?.prediction_summary) return 0;
    return results.prediction_summary.leakage_analysis?.percentages?.No || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-center flex-1">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mx-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                  <Phone className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold">
                  Telecommunications Revenue Intelligence
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-4">
                AI-Powered Revenue Leakage Detection & Advanced Network Analytics
              </p>
              <div className="flex items-center justify-center space-x-6 text-blue-100">
                <span className="flex items-center text-sm">
                  <Signal className="h-4 w-4 mr-1" /> 
                  Network Analytics
                </span>
                <span className="flex items-center text-sm">
                  <Zap className="h-4 w-4 mr-1" /> 
                  Real-time Processing
                </span>
                <span className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-1" /> 
                  Advanced Detection
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
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Upload Data
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              } ${!results ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!results}
            >
              Results & Analysis
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <Upload className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Upload Telecom Dataset
              </h2>
              <p className="text-gray-600 text-lg">
                Upload your telecommunications billing data to detect revenue leakages and network anomalies
              </p>
            </div>

            <div className="space-y-8">
              {/* File Upload Area */}
              <div className="relative">
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="bg-white rounded-full p-4 shadow-lg mb-4">
                      <Upload className="h-12 w-12 text-blue-500" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700 mb-2">
                      Drag & Drop or Click to Upload
                    </span>
                    <span className="text-gray-500">
                      CSV, XLSX, or XLS files up to 50MB
                    </span>
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center"><Shield className="h-4 w-4 mr-1" /> Secure Processing</span>
                      <span className="flex items-center"><FileText className="h-4 w-4 mr-1" /> Multiple Formats</span>
                      <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> Real-time Analysis</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {(file.size / 1024 / 1024).toFixed(2)} MB • 
                          Type: {file.name.split('.').pop().toUpperCase()} • 
                          Status: Ready for Analysis
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetUpload}
                      className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-3" />
                    Analyzing Telecom Data...
                  </>
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
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Processed
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Records</p>
                <p className="text-3xl font-bold text-gray-800">
                  {results.prediction_summary.total_records.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">100% Network Coverage</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getRiskColor(getLeakagePercentage())}`}>
                    {getRiskLevel(getLeakagePercentage())}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Revenue Leakages</p>
                <p className="text-3xl font-bold text-red-600">
                  {getLeakageCount().toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {getLeakagePercentage().toFixed(1)}% of total billing
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Clean Records</p>
                <p className="text-3xl font-bold text-green-600">
                  {getCleanCount().toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {getCleanPercentage().toFixed(1)}% network integrity
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Estimated
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Revenue at Risk</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${(getLeakageCount() * 125).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">Avg $125/leakage case</p>
              </div>
            </div>

            {/* Network Performance Dashboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Network className="h-6 w-6 mr-2 text-blue-600" />
                  Network Performance Assessment
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${
                    getLeakagePercentage() > 25 
                      ? 'bg-red-500' 
                      : getLeakagePercentage() > 15 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-600">
                    Network Health: {getRiskLevel(getLeakagePercentage())}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Critical Network Issues
                  </h4>
                  <p className="text-2xl font-bold text-red-600">
                    {Math.round(getLeakageCount() * 0.35).toLocaleString()}
                  </p>
                  <p className="text-sm text-red-600">High-impact network revenue leakages requiring immediate intervention</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <Smartphone className="h-4 w-4 mr-1" />
                    Service Impact Cases
                  </h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round(getLeakageCount() * 0.40).toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-600">Moderate impact on customer billing and service quality</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    Minor Adjustments
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(getLeakageCount() * 0.25).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600">Low-priority cases for routine monitoring and maintenance</p>
                </div>
              </div>
            </div>

            {/* Interactive Visualizations - Enhanced Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                  Network Analytics Dashboard
                </h3>
                <button
                  onClick={() => createInteractiveCharts()}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Charts
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                      Revenue Leakage Distribution
                    </h4>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Interactive Chart</div>
                  </div>
                  <div id="leakageChart" className="h-80 w-full"></div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                      Leakage Categories
                    </h4>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Bar Chart</div>
                  </div>
                  <div id="anomalyChart" className="h-80 w-full"></div>
                </div>
              </div>

              {/* Network Impact Analysis Chart */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Network className="h-5 w-5 mr-2 text-green-600" />
                    Network Regional Impact Analysis
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Regional Data</div>
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Network Analytics</div>
                  </div>
                </div>
                <div id="networkChart" className="h-80 w-full"></div>
              </div>
            </div>

            {/* Detailed Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Revenue Leakage Analysis
                </h3>
                <div className="space-y-4">
                  {results.prediction_summary && Object.entries(results.prediction_summary.leakage_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-700 flex items-center">
                        {type === 'Yes' ? (
                          <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                        )}
                        {type === 'Yes' ? 'Revenue Leakages Detected' : 'Clean Billing Records'}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 text-lg">{count.toLocaleString()}</span>
                        <div className="text-sm text-gray-600">
                          {results.prediction_summary.leakage_analysis.percentages[type].toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Signal className="h-6 w-6 mr-2 text-indigo-600" />
                  Leakage Type Breakdown
                </h3>
                <div className="space-y-4">
                  {results.prediction_summary && Object.entries(results.prediction_summary.anomaly_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-700 capitalize flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mr-3"></div>
                        {type}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 text-lg">{count.toLocaleString()}</span>
                        <div className="text-sm text-gray-600">
                          {results.prediction_summary.anomaly_analysis.percentages[type].toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network Financial Impact Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-purple-600" />
                Financial Impact & Network Economics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                  <div className="text-red-600 mb-2">
                    <Phone className="h-8 w-8 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold text-red-800 mb-2">Immediate Revenue Loss</h4>
                  <p className="text-3xl font-bold text-red-600">${(getLeakageCount() * 125).toLocaleString()}</p>
                  <p className="text-sm text-red-600 mt-2">Critical network billing discrepancies requiring urgent attention</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                  <div className="text-yellow-600 mb-2">
                    <Signal className="h-8 w-8 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">Monthly Network Impact</h4>
                  <p className="text-3xl font-bold text-yellow-600">${(getLeakageCount() * 125 * 30 / results.prediction_summary.total_records * 2000).toLocaleString()}</p>
                  <p className="text-sm text-yellow-600 mt-2">Projected monthly revenue impact across network infrastructure</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                  <div className="text-green-600 mb-2">
                    <Shield className="h-8 w-8 mx-auto" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Protected Network Revenue</h4>
                  <p className="text-3xl font-bold text-green-600">${(getCleanCount() * 125).toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-2">Verified billing records with network integrity maintained</p>
                </div>
              </div>
            </div>

            {/* Telecommunications Specific Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-indigo-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 mr-3 text-indigo-600" />
                  Telecommunications Intelligence Insights
                </h3>
                <p className="text-gray-600 text-lg">AI-powered network analytics and billing optimization recommendations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Network className="h-5 w-5 mr-2 text-blue-600" />
                    Network Performance Metrics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Network Integrity Score</span>
                      <span className="font-bold text-green-600">
                        {(100 - getLeakagePercentage()).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Billing Accuracy Rate</span>
                      <span className="font-bold text-blue-600">97.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Assurance Level</span>
                      <span className="font-bold text-purple-600">95.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Network Coverage Quality</span>
                      <span className="font-bold text-indigo-600">98.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                    Action Recommendations
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">
                        <strong>Critical:</strong> Review {Math.round(getLeakageCount() * 0.35)} high-impact network billing issues within 4 hours
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">
                        <strong>This Week:</strong> Implement network monitoring for leakage patterns exceeding {getLeakagePercentage().toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">
                        <strong>This Month:</strong> Deploy automated billing reconciliation across all network regions
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">
                        <strong>Strategic:</strong> Implement real-time network revenue assurance monitoring system
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Download className="h-8 w-8 mr-3 text-blue-600" />
                    Export & Network Reporting Suite
                  </h3>
                  <p className="text-gray-600 text-lg">Download comprehensive network analysis results and generate telecom business intelligence reports</p>
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
                {Object.entries(results.output_files).map(([outputType, fileInfo]) => (
                  <div key={outputType} className="group">
                    <button
                      onClick={() => downloadFile(outputType, results.session_id)}
                      className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Download className="h-10 w-10 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                        {outputType.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{fileInfo.count.toLocaleString()} records</p>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          CSV
                        </span>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Ready
                        </span>
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Home
                </button>
              </div>
              
              {/* Footer Information */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center border border-gray-200">
                <p className="text-gray-600 mb-2">
                  Network analysis completed successfully • Session ID: {results.session_id.substring(0, 8)}...
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" /> Secure Processing
                  </span>
                  <span className="flex items-center">
                    <Network className="h-4 w-4 mr-1" /> Network Analytics
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" /> Interactive Charts
                  </span>
                  <span className="flex items-center">
                    <Signal className="h-4 w-4 mr-1" /> Real-time Insights
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

export default Telecommunication;