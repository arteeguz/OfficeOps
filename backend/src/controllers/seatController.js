const Seat = require('../models/Seat');
const Employee = require('../models/Employee');
const AssignmentHistory = require('../models/AssignmentHistory');

// Get all seats with optional filters
exports.getAllSeats = async (req, res) => {
  try {
    const { floor, status, building } = req.query;
    const filter = {};
    
    if (floor) filter.floor = parseInt(floor);
    if (status) filter.status = status;
    if (building) filter.building = building;
    
    const seats = await Seat.find(filter)
      .populate('currentOccupant', 'employeeNumber firstName lastName department businessGroup')
      .sort('seatId');
    
    res.json({
      success: true,
      count: seats.length,
      seats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single seat
exports.getSeat = async (req, res) => {
  try {
    const seat = await Seat.findOne({ seatId: req.params.seatId })
      .populate('currentOccupant');
    
    if (!seat) {
      return res.status(404).json({ success: false, error: 'Seat not found' });
    }
    
    res.json({ success: true, seat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign employee to seat
exports.assignSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const { employeeId } = req.body;
    
    // Validate seat exists and is vacant
    const seat = await Seat.findOne({ seatId });
    if (!seat) {
      return res.status(404).json({ success: false, error: 'Seat not found' });
    }
    if (seat.status === 'occupied') {
      return res.status(400).json({ success: false, error: 'Seat is already occupied' });
    }
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    // Check if employee already has a seat
    const currentSeat = await Seat.findOne({ currentOccupant: employeeId });
    if (currentSeat) {
      return res.status(400).json({ 
        success: false, 
        error: `Employee already assigned to seat ${currentSeat.seatId}` 
      });
    }
    
    // Assign seat
    seat.currentOccupant = employeeId;
    seat.status = 'occupied';
    seat.updatedBy = 'system';
    await seat.save();
    
    // Create history record
    await AssignmentHistory.create({
      employeeId,
      seatId,
      action: 'assigned',
      assignedBy: 'system'
    });
    
    const updatedSeat = await Seat.findOne({ seatId }).populate('currentOccupant');
    res.json({ success: true, seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Vacate seat
exports.vacateSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    
    const seat = await Seat.findOne({ seatId });
    if (!seat) {
      return res.status(404).json({ success: false, error: 'Seat not found' });
    }
    if (seat.status === 'vacant') {
      return res.status(400).json({ success: false, error: 'Seat is already vacant' });
    }
    
    // Update history
    await AssignmentHistory.findOneAndUpdate(
      { employeeId: seat.currentOccupant, seatId, endDate: null },
      { endDate: new Date() }
    );
    
    // Create vacate record
    await AssignmentHistory.create({
      employeeId: seat.currentOccupant,
      seatId,
      action: 'vacated',
      assignedBy: 'system'
    });
    
    // Vacate seat
    seat.currentOccupant = null;
    seat.status = 'vacant';
    seat.updatedBy = 'system';
    await seat.save();
    
    res.json({ success: true, seat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Move employee to different seat
exports.moveEmployee = async (req, res) => {
  try {
    const { employeeId, fromSeatId, toSeatId } = req.body;
    
    // Validate employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    // Validate seats
    const fromSeat = await Seat.findOne({ seatId: fromSeatId });
    const toSeat = await Seat.findOne({ seatId: toSeatId });
    
    if (!fromSeat || !toSeat) {
      return res.status(404).json({ success: false, error: 'Seat not found' });
    }
    
    if (toSeat.status === 'occupied') {
      return res.status(400).json({ success: false, error: 'Target seat is occupied' });
    }
    
    // Perform move
    fromSeat.currentOccupant = null;
    fromSeat.status = 'vacant';
    await fromSeat.save();
    
    toSeat.currentOccupant = employeeId;
    toSeat.status = 'occupied';
    await toSeat.save();
    
    // Update history
    await AssignmentHistory.findOneAndUpdate(
      { employeeId, seatId: fromSeatId, endDate: null },
      { endDate: new Date() }
    );
    
    await AssignmentHistory.create({
      employeeId,
      seatId: toSeatId,
      action: 'moved',
      previousSeat: fromSeatId,
      assignedBy: 'system'
    });
    
    res.json({ 
      success: true, 
      message: `Employee moved from ${fromSeatId} to ${toSeatId}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
