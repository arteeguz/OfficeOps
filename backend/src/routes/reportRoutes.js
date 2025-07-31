const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/summary', reportController.getSummaryReport);
router.get('/business-group', reportController.getBusinessGroupReport);
router.get('/floor', reportController.getFloorReport);

module.exports = router;
