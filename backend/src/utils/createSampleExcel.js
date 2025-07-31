const ExcelJS = require('exceljs');

async function createSampleExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Office Space Data');

  // Add headers
  worksheet.columns = [
    { header: 'Seat Number', key: 'seat' },
    { header: 'Building', key: 'building' },
    { header: 'Floor', key: 'floor' },
    { header: 'Space Status', key: 'status' },
    { header: 'Emp #', key: 'empNum' },
    { header: 'First Name', key: 'firstName' },
    { header: 'Last Name', key: 'lastName' },
    { header: 'Email', key: 'email' },
    { header: 'Business Group', key: 'businessGroup' },
    { header: 'Department', key: 'department' }
  ];

  // Add sample data
  const sampleData = [
    {
      seat: 'A-101', building: 'Building-A', floor: 1, status: 'Occupied',
      empNum: '12345', firstName: 'John', lastName: 'Doe',
      email: 'john.doe@company.com', businessGroup: 'Engineering', department: 'Software'
    },
    {
      seat: 'A-102', building: 'Building-A', floor: 1, status: 'Vacant'
    },
    {
      seat: 'A-103', building: 'Building-A', floor: 1, status: 'Occupied',
      empNum: '23456', firstName: 'Jane', lastName: 'Smith',
      email: 'jane.smith@company.com', businessGroup: 'Marketing', department: 'Digital'
    },
    {
      seat: 'A-201', building: 'Building-A', floor: 2, status: 'Vacant'
    },
    {
      seat: 'B-101', building: 'Building-B', floor: 1, status: 'Occupied',
      empNum: '34567', firstName: 'Bob', lastName: 'Johnson',
      email: 'bob.johnson@company.com', businessGroup: 'Finance', department: 'Accounting'
    }
  ];

  sampleData.forEach(data => {
    worksheet.addRow(data);
  });

  // Style the header row
  worksheet.getRow(1).font = { bold: true };

  // Save the file
  await workbook.xlsx.writeFile('sample-office-data.xlsx');
  console.log('Sample Excel file created: sample-office-data.xlsx');
}

createSampleExcel();
