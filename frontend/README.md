# RepoMix Frontend

A React-based web application for AI-powered data analysis and anomaly detection, supporting both Supermarket and Telecom business domains.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive data visualizations
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library

## 🏗️ Project Structure

```
src/
├── components/
│   ├── HomePage/              # Landing page & navigation
│   │   ├── HomePage.jsx       # Main landing component
│   │   ├── ChatBot/          # Interactive assistant
│   │   └── Developers/       # Team information
│   ├── Super_market/         # Supermarket domain
│   │   └── Super_market.jsx  # Upload interface
│   ├── Telecommunication/    # Telecom domain
│   │   └── Telecommunication.jsx # Upload interface
│   ├── Results/              # Analysis results
│   │   └── ResultsPage.jsx   # Results dashboard
│   ├── Visualization/        # Interactive charts
│   │   └── VisualizationDashboard.jsx
│   └── common/               # Reusable components
│       ├── FileUpload.jsx    # Drag-drop file upload
│       ├── LoadingSpinner.jsx # Loading states
│       ├── ErrorMessage.jsx  # Error handling
│       └── StatsCard.jsx     # Metric display cards
├── utils/
│   ├── api.js               # Centralized API calls
│   ├── chartUtils.js        # Chart configurations
│   └── constants.js         # App constants
└── App.jsx                  # Main routing component
```

## 🔄 User Flow

### 1. Domain Selection
- **Landing Page**: Choose between Supermarket or Telecom analysis
- **Navigation**: React Router handles seamless page transitions
- **Theme**: Global theme context for consistent UI

### 2. File Upload
- **Drag & Drop**: Modern file upload with validation
- **Formats**: CSV files up to 16MB
- **Validation**: Client-side format and size checks

### 3. Analysis Processing
- **Loading States**: Visual feedback during processing
- **Session Management**: UUID-based session tracking
- **Error Handling**: Comprehensive error messaging

### 4. Results Dashboard
- **Metrics Overview**: Key statistics and anomaly counts
- **Interactive Tables**: Sortable anomaly listings
- **Download Options**: Summary and detailed reports

### 5. Visualizations
- **Interactive Charts**: Pie charts, bar charts, trend analysis
- **Real-time Updates**: Dynamic data rendering
- **Responsive Design**: Mobile-friendly visualizations

## 🛠️ Key Components

### FileUpload Component
```jsx
// Handles file upload with validation
const FileUpload = ({ onFileUpload, domain, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleFileSelect = (file) => {
    const validationErrors = validateFile(file);
    if (validationErrors.length === 0) {
      onFileUpload(file);
    } else {
      setErrors(validationErrors);
    }
  };
  // ... drag/drop handlers
};
```

### API Integration
```jsx
// Centralized API calls with error handling
export const uploadFile = async (file, domain) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('domain', domain);
  
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getResults = async (sessionId) => {
  const response = await api.get(`/results/${sessionId}`);
  return response.data;
};
```

### Chart Configuration
```jsx
// Chart.js setup for anomaly visualization
export const createAnomalyChart = (data) => ({
  type: 'pie',
  data: {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  }
});
```

## 🎨 Styling & UI

### Tailwind Configuration
- **Design System**: Consistent spacing, colors, typography
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Theme switching capability
- **Animations**: Smooth transitions and hover effects

### Component Patterns
- **Card Layouts**: Consistent card-based information display
- **Form Controls**: Standardized input and button styles
- **Loading States**: Unified loading spinner and skeleton screens
- **Error States**: Consistent error message formatting

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Full feature set on desktop
- **Touch Friendly**: Large touch targets and gestures

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=RepoMix
VITE_VERSION=1.0.0
```

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Server
- **Hot Reload**: Instant updates during development
- **Proxy Setup**: API calls proxied to backend
- **Error Overlay**: Development error reporting

## 📊 State Management

### Component State
- **Local State**: useState for form inputs and UI state
- **Session Data**: URL parameters for session tracking
- **API State**: Custom hooks for loading and error states

### Data Flow
```
User Action → Component State → API Call → Backend → 
Response → State Update → UI Re-render
```

## 🔍 Key Features

### File Upload System
- Drag-and-drop interface with visual feedback
- Client-side validation (format, size)
- Progress tracking and error handling
- Session-based file management

### Results Dashboard
- Real-time analysis results display
- Interactive anomaly exploration
- Downloadable reports (Summary & Detailed)
- Metric cards with key statistics

### Visualization System
- Chart.js powered interactive charts
- Multiple chart types (pie, bar, line)
- Responsive and mobile-friendly
- Export capabilities for charts

### ChatBot Integration
- Interactive help system
- Domain-specific guidance
- Real-time assistance during analysis

## 🚦 Error Handling

### Client-side Validation
- File format validation (CSV only)
- File size limits (16MB max)
- Network error recovery
- User-friendly error messages

### API Error Handling
```jsx
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  const result = await uploadFile(file, domain);
  navigate(`/results/${result.session_id}`);
} catch (err) {
  setError(err.response?.data?.error || 'Upload failed');
} finally {
  setLoading(false);
}
```

## 🔗 API Integration

### Base URL Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### Request/Response Patterns
- **Upload**: POST /api/upload (multipart/form-data)
- **Results**: GET /api/results/{sessionId} (JSON)
- **Downloads**: GET /api/download_{type}/{sessionId} (file stream)

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy-loaded route components
- **Memoization**: React.memo for expensive renders
- **Debounced Inputs**: Reduced API calls on user input
- **Image Optimization**: Compressed chart exports
- **Bundle Splitting**: Separate vendor and app bundles

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0",
  "chart.js": "^4.2.0",
  "react-chartjs-2": "^5.2.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^3.1.0",
  "vite": "^4.1.0",
  "tailwindcss": "^3.2.0",
  "autoprefixer": "^10.4.0"
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
# Creates optimized build in dist/ folder
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Container**: Docker with nginx
- **Traditional**: Apache/nginx static file serving