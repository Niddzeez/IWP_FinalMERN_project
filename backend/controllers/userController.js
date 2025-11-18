const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password, role, hostel_id, floor_number, room_number } = req.body;

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email }); // <-- CHANGED

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username, // This is now just a display name
      email,    // This is the login field
      password,
      role,
      hostel_id,
      floor_number,
      room_number
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        hostel_id: user.hostel_id,
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
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // <-- CHANGED

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password'); // <-- CHANGED

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        hostel_id: user.hostel_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' }); // <-- CHANGED
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};