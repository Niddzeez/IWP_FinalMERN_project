require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Import ALL your models here ---
const User = require('./models/User');
const Complaint = require('./models/complaintModel');
const MaintenanceCheck = require('./models/maintenanceModel');
const Hostel = require('./models/hostelModel'); // Assuming this exists

const app = express();

// --- Middleware ---
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cors()); // Enable CORS for all routes

// --- DB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit process with failure
  });

// -----------------------------------------------------------------
// --- AUTH MIDDLEWARE (Moved from middleware/authMiddleware.js) ---
// -----------------------------------------------------------------
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const warden = (req, res, next) => {
  if (req.user && req.user.role === 'Warden') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as a Warden' });
  }
};

// -----------------------------------------------------------------
// --- TOKEN UTIL (Moved from utils/generateToken.js) ---
// -----------------------------------------------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// -----------------------------------------------------------------
// --- USER CONTROLLER LOGIC (Moved from controllers/userController.js) ---
// -----------------------------------------------------------------

// @desc    Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, role, hostel_id, floor_number, room_number } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      username, email, password, role, hostel_id, floor_number, room_number
    });
    if (user) {
      res.status(201).json({
        _id: user._id, username: user.username, email: user.email,
        role: user.role, hostel_id: user.hostel_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, username: user.username, email: user.email,
        role: user.role, hostel_id: user.hostel_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -----------------------------------------------------------------
// --- COMPLAINT CONTROLLER LOGIC (Moved from controllers/complaintController.js) ---
// -----------------------------------------------------------------

// @desc    Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, room, category, description, image_url } = req.body;
    const { _id: user_id, hostel_id } = req.user; // from protect middleware

    if (!title || !room || !category || !description) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }
    const complaint = await Complaint.create({
      user_id, hostel_id, title, room, category, description, image_url,
      votes: 1, votedBy: [user_id],
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all complaints for user's hostel
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ hostel_id: req.user.hostel_id })
      .populate('user_id', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user_id', 'username email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Vote for a complaint
const voteOnComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (complaint.votedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already voted' });
    }
    complaint.votedBy.push(req.user._id);
    complaint.votes = complaint.votedBy.length;
    const updatedComplaint = await complaint.save();
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a complaint (Warden)
const updateComplaint = async (req, res) => {
  try {
    const { status, warden_comments, scheduledFor } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.status = status || complaint.status;
    complaint.warden_comments = warden_comments || complaint.warden_comments;
    complaint.scheduledFor = scheduledFor || complaint.scheduledFor;
    const updatedComplaint = await complaint.save();
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a complaint (Warden)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    await complaint.deleteOne();
    res.status(200).json({ success: true, message: 'Complaint removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -----------------------------------------------------------------
// --- MAINTENANCE CONTROLLER LOGIC (Moved from controllers/maintenanceController.js) ---
// -----------------------------------------------------------------

// @desc    Get all maintenance checks for user's hostel
const getMaintenanceChecks = async (req, res) => {
  try {
    const checks = await MaintenanceCheck.find({ hostel_id: req.user.hostel_id })
      .sort({ scheduledFor: 1 });
    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// -----------------------------------------------------------------
// --- ROUTES (Moved from routes/*.js) ---
// -----------------------------------------------------------------

// --- User Routes ---
app.post('/api/users/register', registerUser);
app.post('/api/users/login', loginUser);

// --- Complaint Routes ---
// We apply the 'protect' middleware to all complaint routes
app.get('/api/complaints', protect, getComplaints);
app.post('/api/complaints', protect, createComplaint);
app.get('/api/complaints/:id', protect, getComplaintById);
app.patch('/api/complaints/:id', protect, warden, updateComplaint); // Only wardens
app.delete('/api/complaints/:id', protect, warden, deleteComplaint); // Only wardens
app.post('/api/complaints/vote/:id', protect, voteOnComplaint);

// --- Maintenance Routes ---
app.get('/api/maintenance', protect, getMaintenanceChecks);

// --- Basic Test Route ---
app.get('/', (req, res) => res.send('API Running'));

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));