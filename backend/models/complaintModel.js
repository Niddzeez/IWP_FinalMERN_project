const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user_id: { // Matches 'submittedBy'
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    title: { // NEW: From frontend mock
      type: String,
      required: [true, 'Please add a title'],
    },
    room: { // NEW: From frontend mock
      type: String,
      required: [true, 'Please add a room number'],
    },
    category: { // RENAMED: Was 'complaint_type'
      type: String,
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image_url: {
      type: String,
      default: null,
    },
    status: { // UPDATED: Enum matches frontend mock
      type: String,
      enum: ['Submitted', 'In Progress', 'Resolved'],
      default: 'Submitted',
    },
    votes: { // RENAMED: Was 'priority_score'
      type: Number,
      default: 1,
    },
    votedBy: [ // RENAMED: Was 'votes' (array)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    scheduledFor: { // NEW: From frontend mock
      type: Date,
      default: null,
    },
    warden_comments: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // This adds 'createdAt'
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a virtual 'id' field
complaintSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// module.exports = mongoose.model('Complaint', complaintSchema);