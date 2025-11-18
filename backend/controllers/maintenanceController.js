const MaintenanceCheck = require('../models/maintenanceModel');

// @desc    Get all maintenance checks for user's hostel
// @route   GET /api/maintenance
exports.getMaintenanceChecks = async (req, res) => {
  try {
    const checks = await MaintenanceCheck.find({ hostel_id: req.user.hostel_id })
      .sort({ scheduledFor: 1 }); // Sort by upcoming date

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};