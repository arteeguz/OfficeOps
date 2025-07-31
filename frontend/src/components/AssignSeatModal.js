import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function AssignSeatModal({ seat, employees, onClose, onAssign }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter out employees who already have seats
  const availableEmployees = employees.filter(emp => !emp.currentSeat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      toast.error('Please select an employee');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/seats/${seat.seatId}/assign`, {
        employeeId: selectedEmployeeId
      });
      onAssign();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error assigning seat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assign Seat {seat.seatId}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Employee</label>
              <select 
                className="form-control"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                required
              >
                <option value="">-- Select Employee --</option>
                {availableEmployees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeNumber} - {emp.firstName} {emp.lastName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
            
            {availableEmployees.length === 0 && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#FFF7E6', 
                borderRadius: '4px',
                marginBottom: '1rem',
                color: '#B87500'
              }}>
                No available employees without seats. All employees are currently assigned.
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || availableEmployees.length === 0}
              >
                {loading ? 'Assigning...' : 'Assign Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignSeatModal;
