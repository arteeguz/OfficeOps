const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Seat = require('../models/Seat');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/office_space_poc');
    
    // Clear existing data
    await Employee.deleteMany({});
    await Seat.deleteMany({});
    
    // Create sample employees
    const employees = await Employee.create([
      {
        employeeNumber: '12345',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        businessGroup: 'Engineering',
        department: 'Software Development',
        transitNumber: 'T001'
      },
      {
        employeeNumber: '23456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        businessGroup: 'Marketing',
        department: 'Digital Marketing',
        transitNumber: 'T002'
      },
      {
        employeeNumber: '34567',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@company.com',
        businessGroup: 'Finance',
        department: 'Accounting',
        transitNumber: 'T003'
      }
    ]);
    
    // Create sample seats
    const seats = [];
    const buildings = ['Building-A', 'Building-B'];
    
    for (const building of buildings) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let seatNum = 1; seatNum <= 10; seatNum++) {
          const seatId = `${building.split('-')[1]}-${floor}0${seatNum}`;
          seats.push({
            seatId,
            building,
            floor,
            status: 'vacant'
          });
        }
      }
    }
    
    await Seat.create(seats);
    
    // Assign some employees to seats
    await Seat.findOneAndUpdate(
      { seatId: 'A-101' },
      { status: 'occupied', currentOccupant: employees[0]._id }
    );
    
    await Seat.findOneAndUpdate(
      { seatId: 'A-201' },
      { status: 'occupied', currentOccupant: employees[1]._id }
    );
    
    await Seat.findOneAndUpdate(
      { seatId: 'B-101' },
      { status: 'occupied', currentOccupant: employees[2]._id }
    );
    
    console.log('Sample data created successfully!');
    console.log(`Created ${employees.length} employees and ${seats.length} seats`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
