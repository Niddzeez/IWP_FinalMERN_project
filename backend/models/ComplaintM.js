const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    hostelId: {
        type: String,
        required: true
    },
    submittedBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Resolved', 'Closed'],
        default: 'Submitted'
    },
    scheduledFor: {
        type: Date,
        default: null
    },
    votes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


module.exports = mongoose.model('Complaint', ComplaintSchema);