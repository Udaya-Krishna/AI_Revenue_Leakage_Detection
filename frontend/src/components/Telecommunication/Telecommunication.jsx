import React, { useState } from 'react';
import { Upload, Download, FileText, BarChart3, AlertTriangle, CheckCircle, Loader2, ArrowLeft, Home, PieChart, TrendingUp, Shield, Eye, Filter, Search, Calendar, DollarSign } from 'lucide-react';

const Telecommunication = ({ onBackToHome }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportGenerating, setReportGenerating] = useState(false);

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
      setError('Failed to connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
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
        setError('Failed to download file');
      }
    } catch (err) {
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
        setError('Failed to generate report');
      }
    } catch (err) {
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
    setSearchTerm('');
    setSelectedTimeframe('all');
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
              <h1 className="text-4xl font-bold mb-3">
                Telecommunications Revenue Intelligence
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                AI-Powered Revenue Leakage Detection & Analytics Platform
              </p>
              <div className="flex items-center justify-center space-x-6 text-blue-100">
                <span className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-1" /> 
                  Secure Analysis
                </span>
                <span className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" /> 
                  Real-time Insights
                </span>
                <span className="flex items-center text-sm">
                  <Eye className="h-4 w-4 mr-1" /> 
                  Advanced Detection
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

        {/* Enhanced Upload Section */}
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
                Upload your billing data to detect revenue leakages and anomalies
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
                          Type: {file.name.split('.').pop().toUpperCase()}
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
                    Analyzing Dataset...
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
            {/* Enhanced Summary Cards */}
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
                <p className="text-sm text-gray-500 mt-2">100% Coverage</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getRiskColor((results.prediction_summary.leakage_analysis.percentages.Yes || 0))}`}>
                    {getRiskLevel((results.prediction_summary.leakage_analysis.percentages.Yes || 0))}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Revenue Leakages</p>
                <p className="text-3xl font-bold text-red-600">
                  {results.prediction_summary.leakage_analysis.counts.Yes || 0}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {(results.prediction_summary.leakage_analysis.percentages.Yes || 0).toFixed(1)}% of total
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Clean
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Verified Records</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.prediction_summary.leakage_analysis.counts.No || 0}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {(results.prediction_summary.leakage_analysis.percentages.No || 0).toFixed(1)}% healthy
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
                <p className="text-gray-600 text-sm font-medium mb-1">Potential Loss</p>
                <p className="text-3xl font-bold text-purple-600">
                  $
                  {((results.prediction_summary.leakage_analysis.counts.Yes || 0) * 125).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">Average $125/case</p>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-600" />
                  Analysis Controls
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Records</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="last180">Last 180 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <PieChart className="h-6 w-6 mr-2 text-blue-600" />
                    Leakage Distribution
                  </h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Leakages</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Clean</span>
                    </div>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 font-medium">Interactive Pie Chart</p>
                    <p className="text-sm text-gray-500">Visualization ready for backend integration</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-orange-600" />
                    Anomaly Types
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {Object.keys(results.prediction_summary.anomaly_analysis.counts).length} Types
                  </span>
                </div>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 font-medium">Anomaly Distribution Chart</p>
                    <p className="text-sm text-gray-500">Real-time anomaly categorization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
                  Revenue Leakage Trends
                </h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last 6 Months</span>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                  <p className="text-gray-600 font-medium">Time Series Analysis</p>
                  <p className="text-sm text-gray-500">Track revenue leakage patterns over time</p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Leakage Analysis
                </h3>
                <div className="space-y-4">
                  {Object.entries(results.prediction_summary.leakage_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-700 flex items-center">
                        {type === 'Yes' ? (
                          <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                        )}
                        {type === 'Yes' ? 'Revenue Leakages' : 'Clean Records'}
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
                <h3 className="text-xl font-bold text-gray-800 mb-6">Anomaly Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(results.prediction_summary.anomaly_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-700 capitalize">{type}</span>
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

            {/* Enhanced Action Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Export & Reporting</h3>
                  <p className="text-gray-600">Download analysis results and generate comprehensive reports</p>
                </div>
                <button
                  onClick={generateReport}
                  disabled={reportGenerating}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
                >
                  {reportGenerating ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Generate Comprehensive Report
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        CSV Format
                      </span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Telecommunication;