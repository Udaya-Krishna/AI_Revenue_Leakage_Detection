import React, { useState } from 'react';
import { GlobalThemeProvider } from './components/HomePage/GlobalThemeContext';
import HomePage from './components/HomePage/HomePage';
import Telecommunication from './components/Telecommunication/Telecommunication';
import SuperMarket from './components/Super_market/Super_market';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleDomainSelect = (domain) => {
    setCurrentPage(domain);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'telecom':
        return <Telecommunication onBackToHome={handleBackToHome} />;
      case 'supermarket':
        return <SuperMarket onBackToHome={handleBackToHome} />;
      case 'home':
      default:
        return <HomePage onDomainSelect={handleDomainSelect} />;
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