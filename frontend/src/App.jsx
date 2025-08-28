import React from "react";
import HomePage from "./components/HomePage/HomePage";
import DevelopersSection from "./components/HomePage/Developers/Developers";
import DeveloperSection from "./components/HomePage/Developers/Developer";
import DevSection from "./components/HomePage/Developers/Dev";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HomePage />
      <DevelopersSection />
      <DeveloperSection />
      <DevSection />
    </div>
  );
}

export default App;