import React, { useState } from 'react';
import { GlobalThemeProvider } from './components/HomePage/GlobalThemeContext';
import HomePage from './components/HomePage/HomePage';
import Telecommunication from './components/Telecommunication/Telecommunication';
import SuperMarket from './components/Super_market/Super_market';
import VisualizationIndex from './components/Visualization/VisualizationIndex';
import VisualizationDashboard from './components/Visualization/VisualizationDashboard';
import ResultsPage from './components/Results/ResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sessionData, setSessionData] = useState(null);

  const handleDomainSelect = (domain) => {
    setCurrentPage(domain);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSessionData(null);
  };

  const handleResultsNavigation = (results) => {
    setSessionData(results);
    setCurrentPage('results');
  };

  const handleVisualizationNavigation = (type, data = null) => {
    setSessionData(data);
    if (type === 'index') {
      setCurrentPage('visualization-index');
    } else if (type === 'dashboard') {
      setCurrentPage('visualization-dashboard');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'telecom':
        return (
          <Telecommunication 
            onBackToHome={handleBackToHome}
            onResultsReady={handleResultsNavigation}
          />
        );
      case 'supermarket':
        return (
          <SuperMarket 
            onBackToHome={handleBackToHome}
            onResultsReady={handleResultsNavigation}
          />
        );
      case 'results':
        return (
          <ResultsPage 
            sessionData={sessionData}
            onBackToHome={handleBackToHome}
            onVisualization={() => handleVisualizationNavigation('dashboard', sessionData)}
          />
        );
      case 'visualization-index':
        return (
          <VisualizationIndex 
            onBackToHome={handleBackToHome}
            onDashboard={(data) => handleVisualizationNavigation('dashboard', data)}
          />
        );
      case 'visualization-dashboard':
        return (
          <VisualizationDashboard 
            sessionData={sessionData}
            onBackToHome={handleBackToHome}
            onBackToIndex={() => handleVisualizationNavigation('index')}
          />
        );
      case 'home':
      default:
        return (
          <HomePage 
            onDomainSelect={handleDomainSelect}
            onVisualization={() => handleVisualizationNavigation('index')}
          />
        );
    }
  };

  return (
    <GlobalThemeProvider>
      <div className="min-h-screen">
        {renderCurrentPage()}
      </div>
    </GlobalThemeProvider>
  );
}

export default App;