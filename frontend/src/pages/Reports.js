import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Reports() {
  const [businessGroupReport, setBusinessGroupReport] = useState([]);
  const [floorReport, setFloorReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [bgResponse, floorResponse] = await Promise.all([
        api.get('/reports/business-group'),
        api.get('/reports/floor')
      ]);
      
      setBusinessGroupReport(bgResponse.data.report);
      setFloorReport(floorResponse.data.report);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Reports</h1>
      
      <div className="card">
        <h2>Business Group Occupancy</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Business Group</th>
                <th>Total Seats</th>
                <th>Occupied</th>
                <th>Occupancy Rate</th>
              </tr>
            </thead>
            <tbody>
              {businessGroupReport.map((group, index) => (
                <tr key={index}>
                  <td>{group.businessGroup || 'Unassigned'}</td>
                  <td>{group.totalSeats}</td>
                  <td>{group.occupiedSeats}</td>
                  <td>
                    <span className={`badge ${group.occupancyRate > 80 ? 'badge-danger' : 'badge-success'}`}>
                      {group.occupancyRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Floor Occupancy</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Floor</th>
                <th>Total Seats</th>
                <th>Occupied</th>
                <th>Vacant</th>
                <th>Occupancy Rate</th>
              </tr>
            </thead>
            <tbody>
              {floorReport.map((floor, index) => (
                <tr key={index}>
                  <td>{floor.building}</td>
                  <td>{floor.floor}</td>
                  <td>{floor.totalSeats}</td>
                  <td>{floor.occupiedSeats}</td>
                  <td>{floor.vacantSeats}</td>
                  <td>
                    <span className={`badge ${floor.occupancyRate > 80 ? 'badge-danger' : 'badge-success'}`}>
                      {floor.occupancyRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
