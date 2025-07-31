const mongoose = require('mongoose');

const assignmentHistorySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  seatId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['assigned', 'moved', 'vacated'],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  previousSeat: String,
  assignedBy: {
    type: String,
    default: 'system'
  },
  reason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('AssignmentHistory', assignmentHistorySchema);
