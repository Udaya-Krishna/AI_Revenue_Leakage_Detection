// Application constants and configuration

export const API_BASE_URL = 'http://localhost:5000';

export const DOMAIN_TYPES = {
  SUPERMARKET: 'supermarket',
  TELECOM: 'telecom'
};

export const FILE_TYPES = {
  ALLOWED: ['csv', 'xlsx', 'xls'],
  MAX_SIZE: 16 * 1024 * 1024, // 16MB
};

export const CHART_TYPES = {
  PIE: 'pie',
  BAR: 'bar',
  DOUGHNUT: 'doughnut',
  LINE: 'line',
  HORIZONTAL_BAR: 'horizontalBar',
  POLAR_AREA: 'polarArea'
};

export const RISK_LEVELS = {
  CRITICAL: { threshold: 25, color: 'red', label: 'Critical' },
  HIGH: { threshold: 15, color: 'orange', label: 'High' },
  MEDIUM: { threshold: 5, color: 'yellow', label: 'Medium' },
  LOW: { threshold: 0, color: 'green', label: 'Low' }
};

export const SUPERMARKET_FEATURES = [
  'Invoice number analysis',
  'Duplicate transaction detection', 
  'Product category insights',
  'Customer behavior patterns',
  'Sales amount validation'
];

export const TELECOM_FEATURES = [
  'Billing amount validation',
  'Plan category analysis',
  'Zone area insights', 
  'Payment status tracking',
  'Service usage patterns'
];

export const NAVIGATION_PAGES = {
  HOME: 'home',
  TELECOM: 'telecom',
  SUPERMARKET: 'supermarket',
  RESULTS: 'results',
  VISUALIZATION_INDEX: 'visualization-index',
  VISUALIZATION_DASHBOARD: 'visualization-dashboard'
};