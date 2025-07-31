const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
    unique: true
  },
  building: String,
  floor: Number,
  status: {
    type: String,
    enum: ['occupied', 'vacant'],
    default: 'vacant'
  },
  currentOccupant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Seat', seatSchema);
