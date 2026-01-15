import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;
