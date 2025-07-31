const ExcelJS = require('exceljs');
const Employee = require('../models/Employee');
const Seat = require('../models/Seat');
const ImportSession = require('../models/ImportSession');
const { v4: uuidv4 } = require('uuid');

class ExcelService {
  constructor() {
    this.columnMappings = {
      // Default mappings - can be overridden
      'Space Status': 'status',
      'Emp #': 'employeeNumber',
      'Employee Number': 'employeeNumber',
      'First Name': 'firstName',
      'First': 'firstName',
      'Last Name': 'lastName',
      'Last': 'lastName',
      'Email': 'email',
      'Business Group': 'businessGroup',
      'Department': 'department',
      'Seat': 'seatId',
      'Seat Number': 'seatId',
      'Floor': 'floor',
      'Building': 'building'
    };
  }

  async parseExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    const headers = [];
    const data = [];
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Extract headers
        row.eachCell((cell) => {
          headers.push(cell.value);
        });
      } else {
        // Extract data
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          rowData[header] = cell.value;
        });
        data.push(rowData);
      }
    });
    
    return { headers, data };
  }

  async detectMappings(headers) {
    const detectedMappings = {};
    
    headers.forEach(header => {
      if (this.columnMappings[header]) {
        detectedMappings[header] = this.columnMappings[header];
      } else {
        // Try to match by partial string
        const headerLower = header.toLowerCase();
        Object.entries(this.columnMappings).forEach(([key, value]) => {
          if (headerLower.includes(value.toLowerCase()) || 
              key.toLowerCase().includes(headerLower)) {
            detectedMappings[header] = value;
          }
        });
      }
    });
    
    return detectedMappings;
  }

  async importData(data, mappings) {
    const results = {
      success: [],
      failed: [],
      conflicts: []
    };
    
    const sessionId = uuidv4();
    
    for (const row of data) {
      try {
        const mappedData = {};
        
        // Map Excel columns to database fields
        Object.entries(mappings).forEach(([excelCol, dbField]) => {
          if (row[excelCol] !== undefined && row[excelCol] !== null && row[excelCol] !== '') {
            mappedData[dbField] = row[excelCol];
          }
        });
        
        // Process based on whether it's a seat or employee record
        if (mappedData.seatId) {
          await this.processSeatRecord(mappedData, results);
        }
        
      } catch (error) {
        results.failed.push({
          row,
          error: error.message
        });
      }
    }
    
    // Save import session
    await ImportSession.create({
      sessionId,
      fileName: 'excel_import',
      recordsProcessed: data.length,
      recordsSuccess: results.success.length,
      recordsFailed: results.failed.length,
      mappingsUsed: mappings,
      conflicts: results.conflicts,
      errors: results.failed
    });
    
    return results;
  }

  async processSeatRecord(data, results) {
    // Create or update seat
    let seat = await Seat.findOne({ seatId: data.seatId });
    
    if (!seat) {
      seat = new Seat({
        seatId: data.seatId,
        floor: data.floor,
        building: data.building,
        status: 'vacant'
      });
    }
    
    // Handle employee assignment
    if (data.status && data.status.toLowerCase() === 'occupied' && data.employeeNumber) {
      // Find or create employee
      let employee = await Employee.findOne({ employeeNumber: data.employeeNumber });
      
      if (!employee) {
        employee = await Employee.create({
          employeeNumber: data.employeeNumber,
          firstName: data.firstName || 'Unknown',
          lastName: data.lastName || 'Unknown',
          email: data.email,
          businessGroup: data.businessGroup,
          department: data.department,
          status: 'active'
        });
      }
      
      // Check for conflicts
      const existingSeat = await Seat.findOne({ currentOccupant: employee._id });
      if (existingSeat && existingSeat.seatId !== data.seatId) {
        results.conflicts.push({
          employee: data.employeeNumber,
          currentSeat: existingSeat.seatId,
          newSeat: data.seatId
        });
        return;
      }
      
      seat.currentOccupant = employee._id;
      seat.status = 'occupied';
    } else {
      seat.status = 'vacant';
      seat.currentOccupant = null;
    }
    
    await seat.save();
    results.success.push(data);
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Office Space');
    
    // Add headers
    worksheet.columns = [
      { header: 'Seat Number', key: 'seatId', width: 15 },
      { header: 'Building', key: 'building', width: 15 },
      { header: 'Floor', key: 'floor', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Employee Number', key: 'employeeNumber', width: 15 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Business Group', key: 'businessGroup', width: 20 },
      { header: 'Department', key: 'department', width: 20 }
    ];
    
    // Style headers
    worksheet.getRow(1).font = { bold: true };
    
    // Get all seats with employee data
    const seats = await Seat.find().populate('currentOccupant').sort('seatId');
    
    // Add data
    seats.forEach(seat => {
      const row = {
        seatId: seat.seatId,
        building: seat.building,
        floor: seat.floor,
        status: seat.status
      };
      
      if (seat.currentOccupant) {
        row.employeeNumber = seat.currentOccupant.employeeNumber;
        row.firstName = seat.currentOccupant.firstName;
        row.lastName = seat.currentOccupant.lastName;
        row.email = seat.currentOccupant.email;
        row.businessGroup = seat.currentOccupant.businessGroup;
        row.department = seat.currentOccupant.department;
      }
      
      worksheet.addRow(row);
    });
    
    return workbook;
  }
}

module.exports = new ExcelService();
