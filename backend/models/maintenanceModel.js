const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'], // From your mock data
      default: 'Pending',
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    hostel_id: { // Matches the seeder script's logic
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    }
  },
  {
    timestamps: true,
    // Add virtuals so the 'id' field matches the frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a virtual 'id' field that the frontend mock data uses
maintenanceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('MaintenanceCheck', maintenanceSchema);