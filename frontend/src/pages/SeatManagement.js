import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import SeatList from '../components/SeatList';
import AssignSeatModal from '../components/AssignSeatModal';

function SeatManagement() {
  const [seats, setSeats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    floor: '',
    status: '',
    building: ''
  });
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchSeats();
    fetchEmployees();
  }, [filters]);

  const fetchSeats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.floor) params.append('floor', filters.floor);
      if (filters.status) params.append('status', filters.status);
      if (filters.building) params.append('building', filters.building);
      
      const response = await api.get(`/seats?${params}`);
      setSeats(response.data.seats);
    } catch (error) {
      toast.error('Error fetching seats');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAssignSeat = (seat) => {
    setSelectedSeat(seat);
    setShowAssignModal(true);
  };

  const handleVacateSeat = async (seatId) => {
    if (window.confirm('Are you sure you want to vacate this seat?')) {
      try {
        await api.put(`/seats/${seatId}/vacate`);
        toast.success('Seat vacated successfully');
        fetchSeats();
      } catch (error) {
        toast.error('Error vacating seat');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleAssignmentComplete = () => {
    setShowAssignModal(false);
    fetchSeats();
    toast.success('Seat assigned successfully');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Seat Management</h1>
      
      <div className="card">
        <h2>Filters</h2>
        <div className="filters">
          <select 
            name="building" 
            className="form-control"
            value={filters.building}
            onChange={handleFilterChange}
          >
            <option value="">All Buildings</option>
            <option value="Building-A">Building A</option>
            <option value="Building-B">Building B</option>
          </select>
          
          <select 
            name="floor" 
            className="form-control"
            value={filters.floor}
            onChange={handleFilterChange}
          >
            <option value="">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
          
          <select 
            name="status" 
            className="form-control"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      <SeatList 
        seats={seats}
        onAssign={handleAssignSeat}
        onVacate={handleVacateSeat}
      />

      {showAssignModal && (
        <AssignSeatModal
          seat={selectedSeat}
          employees={employees}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignmentComplete}
        />
      )}
    </div>
  );
}

export default SeatManagement;
