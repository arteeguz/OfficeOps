const Seat = require('../models/Seat');
const Employee = require('../models/Employee');

exports.getSummaryReport = async (req, res) => {
  try {
    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ status: 'occupied' });
    const vacantSeats = await Seat.countDocuments({ status: 'vacant' });
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    
    const occupancyRate = totalSeats > 0 ? (occupiedSeats / totalSeats * 100).toFixed(2) : 0;
    
    res.json({
      success: true,
      summary: {
        totalSeats,
        occupiedSeats,
        vacantSeats,
        totalEmployees,
        occupancyRate: parseFloat(occupancyRate)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBusinessGroupReport = async (req, res) => {
  try {
    const report = await Seat.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'currentOccupant',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: {
          path: '$employee',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$employee.businessGroup',
          totalSeats: { $sum: 1 },
          occupiedSeats: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          businessGroup: '$_id',
          totalSeats: 1,
          occupiedSeats: 1,
          occupancyRate: {
            $round: [
              { $multiply: [{ $divide: ['$occupiedSeats', '$totalSeats'] }, 100] },
              2
            ]
          }
        }
      },
      {
        $sort: { businessGroup: 1 }
      }
    ]);
    
    res.json({
      success: true,
      report: report.filter(r => r.businessGroup !== null)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFloorReport = async (req, res) => {
  try {
    const report = await Seat.aggregate([
      {
        $group: {
          _id: { building: '$building', floor: '$floor' },
          totalSeats: { $sum: 1 },
          occupiedSeats: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
          },
          vacantSeats: {
            $sum: { $cond: [{ $eq: ['$status', 'vacant'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          building: '$_id.building',
          floor: '$_id.floor',
          totalSeats: 1,
          occupiedSeats: 1,
          vacantSeats: 1,
          occupancyRate: {
            $round: [
              { $multiply: [{ $divide: ['$occupiedSeats', '$totalSeats'] }, 100] },
              2
            ]
          }
        }
      },
      {
        $sort: { building: 1, floor: 1 }
      }
    ]);
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
