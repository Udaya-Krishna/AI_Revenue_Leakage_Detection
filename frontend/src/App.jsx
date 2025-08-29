import React from "react";
import HomePage from "./components/HomePage/HomePage";
import DevelopersSection from "./components/HomePage/Developers/Developers";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HomePage />
      <DevelopersSection />
      
    </div>
  );
}

export default App;