import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import pages
import Dashboard from './pages/Dashboard';
import SeatManagement from './pages/SeatManagement';
import ImportExport from './pages/ImportExport';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <img 
                src="/rbc-logo.png" 
                alt="RBC Logo" 
                className="navbar-logo"
              />
              <h1>Office Space Management</h1>
            </div>
            <div className="nav-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                Dashboard
              </NavLink>
              <NavLink to="/seats" className={({ isActive }) => isActive ? 'active' : ''}>
                Seat Management
              </NavLink>
              <NavLink to="/import-export" className={({ isActive }) => isActive ? 'active' : ''}>
                Import/Export
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                Reports
              </NavLink>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seats" element={<SeatManagement />} />
            <Route path="/import-export" element={<ImportExport />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        
        <ToastContainer 
          position="bottom-right"
          theme="light"
          toastStyle={{
            backgroundColor: '#FFFFFF',
            color: '#1F1F1F',
            borderLeft: '4px solid #005DAA'
          }}
        />
      </div>
    </Router>
  );
}

export default App;
