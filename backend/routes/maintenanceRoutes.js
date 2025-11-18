const express = require('express');
const router = express.Router();
const {
  getMaintenanceChecks,
} = require('../controllers/maintenanceController');

const { protect } = require('../middleware/authMiddleware');

// All maintenance routes are also protected
router.use(protect);

// GET /api/maintenance (Get all maintenance checks for my hostel)
router.route('/')
  .get(getMaintenanceChecks);

module.exports = router;