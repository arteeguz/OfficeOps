import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
          <h1>Office Space Management System</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/seats">Seat Management</Link>
            <Link to="/import-export">Import/Export</Link>
            <Link to="/reports">Reports</Link>
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
        
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
