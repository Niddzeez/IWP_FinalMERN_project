// backend/models/User.js (REVISED for Frontend Mock Alignment)
const mongoose = require('mongoose');
const Counter = require('./Counter');
const UserSchema = new mongoose.Schema({
    userId: { // <-- NEW FIELD FOR SEQUENTIAL ID
        type: Number, 
        unique: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required.'], 
        unique: true, 
        trim: true 
    },
    password_hash: { 
        type: String, 
        required: [true, 'Password is required.'] 
    },
    role: { 
        type: String, 
        enum: ['student', 'warden'], // Changed to lowercase to match mock
        required: [true, 'Role is required.'] 
    },
    hostel_id: { 
        type: String, 
        required: [true, 'Hostel ID is required.'] 
    },
    hostel_name: { // ADDED for frontend display consistency
        type: String, 
        required: [true, 'Hostel Name is required.'] 
    },
    // These fields are only required if the role is 'student'
    floor_number: { 
        type: Number, 
        required: function() { return this.role === 'student'; } 
    },
    room_number: { 
        type: String, 
        required: function() { return this.role === 'student'; } 
    }
}, { timestamps: true });


// --- Pre-Save Hook for Auto-Increment ---
UserSchema.pre('save', async function(next) {
    if (!this.isNew) { // Only run for new documents
        return next();
    }

    try {
        // Find and atomically increment the 'userId' counter sequence
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Assign the new sequential number to userId
        this.userId = counter.seq;
        next();
    } catch (error) {
        console.error('Error auto-incrementing userId:', error);
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);