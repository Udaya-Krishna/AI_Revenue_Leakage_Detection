import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 5 minutes for large file processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// File upload API calls
export const uploadSupermarketFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/supermarket', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadTelecomFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/telecom', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Results API calls
export const getResults = async (sessionId) => {
  const response = await api.get(`/api/results/${sessionId}`);
  return response.data;
};

// Visualization API calls
export const getTelecomVisualization = async () => {
  const response = await api.get('/api/visualize/telecom');
  return response.data;
};

export const getSupermarketVisualization = async () => {
  const response = await api.get('/api/visualize/supermarket');
  return response.data;
};

export const getSessionVisualization = async (sessionId) => {
  const response = await api.get(`/api/visualize/session/${sessionId}`);
  return response.data;
};

// Download API calls
export const downloadFile = async (filename) => {
  const response = await api.get(`/download/${filename}`, {
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Error handler for API calls
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.error || 'Server error occurred';
  } else if (error.request) {
    return 'Failed to connect to server. Please ensure the backend is running.';
  } else {
    return 'An unexpected error occurred';
  }
};