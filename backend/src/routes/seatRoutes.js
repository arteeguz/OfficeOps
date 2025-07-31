const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Get all seats with filters
router.get('/', seatController.getAllSeats);

// Get single seat
router.get('/:seatId', seatController.getSeat);

// Assign employee to seat
router.put('/:seatId/assign', seatController.assignSeat);

// Vacate seat
router.put('/:seatId/vacate', seatController.vacateSeat);

// Move employee to different seat
router.post('/move', seatController.moveEmployee);

module.exports = router;
