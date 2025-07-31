import React from 'react';

function SeatList({ seats, onAssign, onVacate }) {
  if (seats.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>No seats found</h3>
          <p>Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Seats ({seats.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Seat ID</th>
              <th>Building</th>
              <th>Floor</th>
              <th>Status</th>
              <th>Occupant</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seats.map(seat => (
              <tr key={seat._id}>
                <td>{seat.seatId}</td>
                <td>{seat.building}</td>
                <td>{seat.floor}</td>
                <td>
                  <span className={`badge ${seat.status === 'vacant' ? 'badge-success' : 'badge-danger'}`}>
                    {seat.status}
                  </span>
                </td>
                <td>
                  {seat.currentOccupant ? 
                    `${seat.currentOccupant.firstName} ${seat.currentOccupant.lastName}` : 
                    '-'
                  }
                </td>
                <td>{seat.currentOccupant?.department || '-'}</td>
                <td>
                  {seat.status === 'vacant' ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onAssign(seat)}
                    >
                      Assign
                    </button>
                  ) : (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => onVacate(seat.seatId)}
                    >
                      Vacate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeatList;
