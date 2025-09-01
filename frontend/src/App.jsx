import React, { useState } from 'react';
import { GlobalThemeProvider } from './components/HomePage/GlobalThemeContext';
import HomePage from './components/HomePage/HomePage';
import Telecommunication from './components/Telecommunication/Telecommunication';
import SuperMarket from './components/Super_market/Super_market';
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

  const handleVisualizationNavigation = (data = null) => {
    setSessionData(data);
    setCurrentPage('visualization-dashboard');
  };

  const handleBackToResults = () => {
    setCurrentPage('results');
  };

  const handleAnalyzeNewDataset = () => {
    // Determine which domain page to go to based on sessionData
    if (sessionData?.domain === 'telecom') {
      setCurrentPage('telecom');
    } else if (sessionData?.domain === 'supermarket') {
      setCurrentPage('supermarket');
    } else {
      // Default to home if domain is unknown
      setCurrentPage('home');
    }
    setSessionData(null); // Clear session data for new analysis
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
            onVisualization={() => handleVisualizationNavigation(sessionData)}
            onAnalyzeNewDataset={handleAnalyzeNewDataset}
          />
        );
      case 'visualization-dashboard':
        return (
          <VisualizationDashboard 
            sessionData={sessionData}
            onBackToHome={handleBackToHome}
            onBackToResults={handleBackToResults}
            onAnalyzeNewDataset={handleAnalyzeNewDataset}
          />
        );
      case 'home':
      default:
        return (
          <HomePage 
            onDomainSelect={handleDomainSelect}
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