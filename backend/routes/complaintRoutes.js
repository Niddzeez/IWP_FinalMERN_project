const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  voteComplaint,
  updateComplaintStatus, // For the frontend
  updateWardenDetails, // For your Task 5
  deleteComplaint,
} = require('../controllers/complaintController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(createComplaint) // POST /api/complaints
  .get(getComplaints); // GET /api/complaints?hostelId=...

// --- Task 4: Voting Route (Frontend needs to add this) ---
router.route('/vote/:id')
  .post(voteComplaint); // POST /api/complaints/vote/:id

// --- Task 5: The Split Route Solution ---
// This route is ONLY for `updateComplaintStatus(id, newStatus)`
router.route('/:id/status')
  .patch(restrictTo('Warden'), updateComplaintStatus); // PATCH /api/complaints/:id/status

// This route is for the REST of your Task 5 (comments, etc.)
router.route('/:id/warden')
  .patch(restrictTo('Warden'), updateWardenDetails); // PATCH /api/complaints/:id/warden

// --- Other Routes ---
router.route('/:id')
  .get(getComplaintById) // GET /api/complaints/:id
  .delete(restrictTo('Warden'), deleteComplaint); // DELETE /api/complaints/:id

module.exports = router;