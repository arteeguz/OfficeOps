const Employee = require('../models/Employee');
const Seat = require('../models/Seat');

exports.getAllEmployees = async (req, res) => {
  try {
    const { businessGroup, department, status } = req.query;
    const filter = {};
    
    if (businessGroup) filter.businessGroup = businessGroup;
    if (department) filter.department = department;
    if (status) filter.status = status;
    
    const employees = await Employee.find(filter).sort('employeeNumber');
    
    // Add current seat info
    const employeesWithSeats = await Promise.all(
      employees.map(async (emp) => {
        const seat = await Seat.findOne({ currentOccupant: emp._id });
        return {
          ...emp.toObject(),
          currentSeat: seat ? seat.seatId : null
        };
      })
    );
    
    res.json({ success: true, employees: employeesWithSeats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    const seat = await Seat.findOne({ currentOccupant: employee._id });
    
    res.json({ 
      success: true, 
      employee: {
        ...employee.toObject(),
        currentSeat: seat ? seat.seatId : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, employee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
