import React, { useState } from 'react';
import { Upload, Download, FileText, BarChart3, AlertTriangle, CheckCircle, Loader2, ShoppingCart } from 'lucide-react';

const SuperMarket = () => {
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
      const response = await fetch('http://localhost:5000/api/supermarket/predict', {
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
        `http://localhost:5000/api/supermarket/download/${outputType}/${sessionId}`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `supermarket_${outputType}.csv`;
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
        `http://localhost:5000/api/supermarket/generate-report/${results.session_id}`,
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
        a.download = `supermarket_report_${results.session_id}.json`;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Supermarket Revenue Leakage Detection
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload your retail billing data to identify anomalies and prevent revenue loss
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Upload Data
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
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
              <Upload className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Upload Supermarket Dataset
              </h2>
              <p className="text-gray-600 mb-6">
                Choose a CSV or Excel file containing your retail billing data
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
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
                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-3" />
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
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
                  <FileText className="h-12 w-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Anomalies Detected</p>
                    <p className="text-3xl font-bold text-red-600">
                      {results.prediction_summary.leakage_analysis.counts.Anomaly || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(results.prediction_summary.leakage_analysis.percentages.Anomaly || 0).toFixed(1)}%
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
                      {results.prediction_summary.leakage_analysis.counts["No Leakage"] || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(results.prediction_summary.leakage_analysis.percentages["No Leakage"] || 0).toFixed(1)}%
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
            </div>

            {/* Risk Level Indicator */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Risk Level Assessment</h3>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`h-4 w-4 rounded-full mr-3 ${
                      results.prediction_summary.risk_assessment.high_risk_percentage > 20 
                        ? 'bg-red-500' 
                        : results.prediction_summary.risk_assessment.high_risk_percentage > 10 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}></div>
                    <span className="font-semibold text-gray-800">
                      {results.prediction_summary.risk_assessment.high_risk_percentage > 20 
                        ? 'High Risk' 
                        : results.prediction_summary.risk_assessment.high_risk_percentage > 10 
                        ? 'Medium Risk' 
                        : 'Low Risk'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        results.prediction_summary.risk_assessment.high_risk_percentage > 20 
                          ? 'bg-red-500' 
                          : results.prediction_summary.risk_assessment.high_risk_percentage > 10 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(results.prediction_summary.risk_assessment.high_risk_percentage, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-2xl font-bold text-gray-800">
                    {results.prediction_summary.risk_assessment.high_risk_percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Risk Level</p>
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Leakage Distribution
                </h3>
                <div className="h-80">
                  {results.visualizations.leakage_distribution && (
                    <div 
                      id="leakage-chart"
                      dangerouslySetInnerHTML={{
                        __html: `<div id="plotly-leakage-sm" style="height: 300px;"></div>
                        <script>
                          if (window.Plotly) {
                            Plotly.newPlot('plotly-leakage-sm', ${results.visualizations.leakage_distribution}, {}, {responsive: true});
                          }
                        </script>`
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Anomaly Types
                </h3>
                <div className="h-80">
                  {results.visualizations.anomaly_types && (
                    <div 
                      id="anomaly-chart"
                      dangerouslySetInnerHTML={{
                        __html: `<div id="plotly-anomaly-sm" style="height: 300px;"></div>
                        <script>
                          if (window.Plotly) {
                            Plotly.newPlot('plotly-anomaly-sm', ${results.visualizations.anomaly_types}, {}, {responsive: true});
                          }
                        </script>`
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Financial Impact */}
            {results.input_summary.numeric_summary && Object.keys(results.input_summary.numeric_summary).some(col => 
              col.toLowerCase().includes('amount') || col.toLowerCase().includes('cost')
            ) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Financial Impact Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(results.input_summary.numeric_summary)
                    .filter(([col]) => col.toLowerCase().includes('amount') || col.toLowerCase().includes('cost'))
                    .slice(0, 3)
                    .map(([col, stats]) => (
                      <div key={col} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2 capitalize">
                          {col.replace('_', ' ')}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span>Average:</span>
                            <span className="font-medium">${stats.mean ? stats.mean.toFixed(2) : 'N/A'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Max:</span>
                            <span className="font-medium">${stats.max ? stats.max.toFixed(2) : 'N/A'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">
                              ${(stats.mean * results.prediction_summary.total_records).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                    Leakage Status
                  </h4>
                  {Object.entries(results.prediction_summary.leakage_analysis.counts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 flex items-center">
                        {type === 'Anomaly' ? (
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {type}
                      </span>
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
                  <h4 className="font-semibold text-gray-700">Anomaly Type Breakdown</h4>
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

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Download Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.entries(results.output_files).map(([outputType, fileInfo]) => (
                  <button
                    key={outputType}
                    onClick={() => downloadFile(outputType, results.session_id)}
                    className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors group"
                  >
                    <Download className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-gray-800 capitalize">
                      {outputType.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{fileInfo.count} records</p>
                  </button>
                ))}
              </div>

              {/* Generate Report */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Comprehensive Report</h4>
                    <p className="text-gray-600">Generate detailed analysis with insights and recommendations</p>
                  </div>
                  <button
                    onClick={generateReport}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center shadow-lg hover:shadow-xl"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Data Quality Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Data Quality Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Columns</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.input_summary.column_count}
                  </p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Missing Values</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Object.values(results.input_summary.missing_values).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Numeric Columns</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.keys(results.input_summary.numeric_summary).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Processing Status</p>
                  <div className="flex items-center justify-center mt-1">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-1" />
                    <span className="font-bold text-green-600">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Upload Button */}
            <div className="text-center">
              <button
                onClick={resetUpload}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Analyze New Dataset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Plotly.js script if not already included */}
      {!document.getElementById('plotly-script') && (
        <script
          id="plotly-script"
          src="https://cdn.plot.ly/plotly-latest.min.js"
          defer
        />
      )}
    </div>
  );
};

export default SuperMarket;