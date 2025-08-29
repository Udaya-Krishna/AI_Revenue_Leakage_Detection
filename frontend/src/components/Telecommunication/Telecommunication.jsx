import React, { useState } from 'react';
import { Upload, Download, FileText, BarChart3, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const Telecommunication = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

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
        a.download = `telecom_${outputType}.csv`;
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

    try {
      const response = await fetch(
        `http://localhost:5000/api/telecom/generate-report/${results.session_id}`,
        { method: 'POST' }
      );
      
      const reportData = await response.json();
      
      if (reportData.success) {
        // Create and download report as JSON
        const blob = new Blob([JSON.stringify(reportData.report, null, 2)], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `telecom_report_${results.session_id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to generate report');
      }
    } catch (err) {
      setError('Report generation failed');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setError('');
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Telecommunications Revenue Leakage Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload your telecom billing data to detect potential revenue leakages using AI
          </p>
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
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <Upload className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Upload Telecom Dataset
              </h2>
              <p className="text-gray-600 mb-6">
                Choose a CSV or Excel file containing your telecom billing data
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-lg font-medium text-gray-700">
                    Click to select file
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    CSV, XLSX, or XLS files up to 50MB
                  </span>
                </label>
              </div>

              {file && (
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-800">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analyze for Revenue Leakage
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Records</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {results.prediction_summary.total_records.toLocaleString()}
                    </p>
                  </div>
                  <FileText className="h-12 w-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Revenue Leakages</p>
                    <p className="text-3xl font-bold text-red-600">
                      {results.prediction_summary.leakage_analysis.counts.Yes || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(results.prediction_summary.leakage_analysis.percentages.Yes || 0).toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Clean Records</p>
                    <p className="text-3xl font-bold text-green-600">
                      {results.prediction_summary.leakage_analysis.counts.No || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(results.prediction_summary.leakage_analysis.percentages.No || 0).toFixed(1)}%
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Leakage Distribution</h3>
                <div 
                  id="leakage-chart"
                  dangerouslySetInnerHTML={{
                    __html: `<div id="plotly-leakage"></div>
                    <script>
                      if (window.Plotly) {
                        Plotly.newPlot('plotly-leakage', ${results.visualizations.leakage_distribution});
                      }
                    </script>`
                  }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Anomaly Types</h3>
                <div 
                  id="anomaly-chart"
                  dangerouslySetInnerHTML={{
                    __html: `<div id="plotly-anomaly"></div>
                    <script>
                      if (window.Plotly) {
                        Plotly.newPlot('plotly-anomaly', ${results.visualizations.anomaly_types});
                      }
                    </script>`
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Download Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(results.output_files).map(([outputType, fileInfo]) => (
                  <button
                    key={outputType}
                    onClick={() => downloadFile(outputType, results.session_id)}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                  >
                    <Download className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-800 capitalize">
                      {outputType.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{fileInfo.count} records</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Report */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Detailed Analysis Report</h3>
                  <p className="text-gray-600">Generate comprehensive report with insights and recommendations</p>
                </div>
                <button
                  onClick={generateReport}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Leakage Analysis</h4>
                  {Object.entries(results.prediction_summary.leakage_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{type}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{count}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({results.prediction_summary.leakage_analysis.percentages[type].toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Anomaly Breakdown</h4>
                  {Object.entries(results.prediction_summary.anomaly_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{type}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{count}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({results.prediction_summary.anomaly_analysis.percentages[type].toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Upload Button */}
            <div className="text-center">
              <button
                onClick={resetUpload}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Analyze New Dataset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Telecommunication;