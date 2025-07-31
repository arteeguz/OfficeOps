import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/summary');
      setStats(response.data.summary);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data</div>;

  return (
    <div>
      <h1>Office Space Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Seats</h3>
          <div className="value">{stats?.totalSeats || 0}</div>
          <div className="subtext">Across all buildings</div>
        </div>
        
        <div className="stat-card">
          <h3>Occupied Seats</h3>
          <div className="value">{stats?.occupiedSeats || 0}</div>
          <div className="subtext">
            {stats?.occupancyRate || 0}% occupancy rate
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Available Seats</h3>
          <div className="value">{stats?.vacantSeats || 0}</div>
          <div className="subtext">Ready for assignment</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Employees</h3>
          <div className="value">{stats?.totalEmployees || 0}</div>
          <div className="subtext">In the system</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/seats" className="action-card">
            <div className="action-icon">🪑</div>
            <h3>Manage Seats</h3>
            <p>Assign, move, or vacate employee seats</p>
          </Link>
          
          <Link to="/import-export" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Import Data</h3>
            <p>Upload Excel files with seat data</p>
          </Link>
          
          <Link to="/reports" className="action-card">
            <div className="action-icon">📈</div>
            <h3>View Reports</h3>
            <p>Analyze occupancy and utilization</p>
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>System Overview</h2>
        </div>
        <p>
          Welcome to the RBC Office Space Management System. This platform helps you efficiently 
          manage office seating arrangements, track occupancy, and generate reports for better 
          space utilization.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
