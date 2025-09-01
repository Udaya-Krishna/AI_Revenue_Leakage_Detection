import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, X } from 'lucide-react';
import { FILE_TYPES } from '../../utils/constants';

const FileUpload = ({ onFileSelect, domain = 'general', className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file) return false;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!FILE_TYPES.ALLOWED.includes(fileExtension)) {
      setError('Please select a CSV or Excel file');
      return false;
    }
    
    if (file.size > FILE_TYPES.MAX_SIZE) {
      setError('File size must be less than 16MB');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    onFileSelect(null);
  };

  const domainColors = {
    supermarket: {
      border: 'border-emerald-300 hover:border-emerald-400',
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      icon: 'text-emerald-500',
      accent: 'bg-emerald-100 text-emerald-600'
    },
    telecom: {
      border: 'border-blue-300 hover:border-blue-400', 
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      icon: 'text-blue-500',
      accent: 'bg-blue-100 text-blue-600'
    },
    general: {
      border: 'border-gray-300 hover:border-gray-400',
      bg: 'bg-gradient-to-br from-gray-50 to-slate-50', 
      icon: 'text-gray-500',
      accent: 'bg-gray-100 text-gray-600'
    }
  };

  const colors = domainColors[domain] || domainColors.general;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
          dragActive ? 'border-blue-400 bg-blue-50' : colors.border
        } ${colors.bg}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <input
          type="file"
          id="file-upload"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="bg-white rounded-full p-4 shadow-lg mb-4 w-20 h-20 mx-auto flex items-center justify-center">
          <Upload className={`h-12 w-12 ${colors.icon}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Drag & Drop or Click to Upload
        </h3>
        <p className="text-gray-500 mb-4">
          CSV, XLSX, or XLS files up to 16MB
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FileText className="h-4 w-4 mr-1" /> Multiple Formats
          </span>
          <span className={`px-2 py-1 rounded-full ${colors.accent}`}>
            Secure Processing
          </span>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className={`${colors.bg} rounded-xl p-6 border ${colors.border.replace('hover:', '')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`${colors.accent.replace('text', 'bg').replace('bg-', 'bg-').split(' ')[0]} rounded-lg p-3 mr-4`}>
                <FileText className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • 
                  Type: {selectedFile.name.split('.').pop().toUpperCase()} • 
                  Status: Ready for Analysis
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;