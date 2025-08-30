import React, { createContext, useContext, useState } from 'react';

// Global Theme Context
const GlobalThemeContext = createContext();

export const useGlobalTheme = () => {
  const context = useContext(GlobalThemeContext);
  if (!context) {
    throw new Error('useGlobalTheme must be used within a GlobalThemeProvider');
  }
  return context;
};

export const GlobalThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <GlobalThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </GlobalThemeContext.Provider>
  );
};