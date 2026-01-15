import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import Sidebar from '../Sidebar/Sidebar';
import LinkList from '../Links/LinkList';
import './Dashboard.css';

const Dashboard = () => {
  const { searchQuery, setSearchQuery } = useContext(DataContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <button 
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>ViewLater</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          <LinkList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
