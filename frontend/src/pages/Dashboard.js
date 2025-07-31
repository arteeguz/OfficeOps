import React, { useState, useEffect } from 'react';
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Seats</h3>
          <div className="value">{stats?.totalSeats || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Occupied Seats</h3>
          <div className="value">{stats?.occupiedSeats || 0}</div>
          <div className="subtext">
            {stats?.occupancyRate || 0}% occupancy
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Vacant Seats</h3>
          <div className="value">{stats?.vacantSeats || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Employees</h3>
          <div className="value">{stats?.totalEmployees || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/seats" className="btn btn-primary">Manage Seats</a>
          <a href="/import-export" className="btn btn-success">Import Data</a>
          <a href="/reports" className="btn btn-info">View Reports</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
