import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';
import Sidebar from '../Sidebar/Sidebar';
import LinkList from '../Links/LinkList';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(DataContext);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ViewLater</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="user-info">
            <span>{user?.email}</span>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <LinkList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
