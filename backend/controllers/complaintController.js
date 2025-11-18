const Complaint = require('../models/complaintModel');

// @desc    Create a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { title, room, category, description, image_url } = req.body;
    const { _id: user_id, hostel_id } = req.user; // from protect middleware

    if (!title || !room || !category || !description) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const complaint = await Complaint.create({
      user_id,
      hostel_id,
      title,
      room,
      category,
      description,
      image_url,
      votes: 1,
      votedBy: [user_id],
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all complaints for user's hostel
// @route   GET /api/complaints
exports.getComplaints = async (req, res) => {
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
// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
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
// @route   POST /api/complaints/vote/:id
exports.voteOnComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has already voted
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
// @route   PATCH /api/complaints/:id
exports.updateComplaint = async (req, res) => {
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
// @route   DELETE /api/complaints/:id
exports.deleteComplaint = async (req, res) => {
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