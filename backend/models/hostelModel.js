const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Kalpana Chawla"
  hostelStringId: { // "kalpana-chawla"
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Hostel', hostelSchema);