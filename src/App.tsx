import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ReasonersTable from './components/ReasonersTable';
import NewReasonerPage from './components/NewReasonerPage';

function App() {
  const [selectedSection, setSelectedSection] = useState('reasoners');

  const renderMainContent = () => {
    switch (selectedSection) {
      case 'reasoners':
        return <ReasonersTable />;
      case 'analytics':
        return (
          <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analytics</h2>
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </div>
          </div>
        );
      case 'knowledge-graph':
        return (
          <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Knowledge Graph</h2>
              <p className="text-gray-600">Knowledge graph interface coming soon...</p>
            </div>
          </div>
        );
      case 're-ranking':
        return (
          <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Re-Ranking</h2>
              <p className="text-gray-600">Re-ranking interface coming soon...</p>
            </div>
          </div>
        );
      default:
        return <ReasonersTable />;
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              selectedSection={selectedSection} 
              onSectionSelect={setSelectedSection} 
            />
            {renderMainContent()}
          </div>
        } 
      />
      <Route path="/new-reasoner" element={<NewReasonerPage />} />
    </Routes>
  );
}

export default App;