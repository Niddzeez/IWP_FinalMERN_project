const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // This creates the token by combining:
  // 1. The user's unique ID
  // 2. Your secret key from the .env file
  // 3. An expiration date (so the token doesn't last forever)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

module.exports = generateToken;