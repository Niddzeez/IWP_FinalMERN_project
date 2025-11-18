const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This function checks if the user is logged in
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the req object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Go to the next function (the controller)
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This function checks if the user is a Warden
exports.warden = (req, res, next) => {
  if (req.user && req.user.role === 'Warden') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as a Warden' });
  }
};