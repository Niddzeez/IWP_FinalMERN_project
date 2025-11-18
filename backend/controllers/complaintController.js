const Complaint = require('../models/ComplaintM')
const mongoose = require('mongoose')

const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).sort({ createdAt: -1 })
        res.status(200).json(complaints)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getComplaint = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    const complaint = await Complaint.findById(id)

    if (!complaint) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    res.status(200).json(complaint)
}

const createComplaint = async (req, res) => {
    const { hostelId, submittedBy, title, description, room, category } = req.body

    try {
        const complaint = await Complaint.create({
            hostelId, 
            submittedBy, 
            title, 
            description, 
            room, 
            category
        })
        res.status(200).json(complaint)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteComplaint = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    const complaint = await Complaint.findOneAndDelete({ _id: id })

    if (!complaint) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    res.status(200).json(complaint)
}

const updateComplaint = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    const complaint = await Complaint.findOneAndUpdate(
        { _id: id }, 
        { ...req.body },
        { new: true } 
    )

    if (!complaint) {
        return res.status(404).json({ error: 'No such complaint found' })
    }

    res.status(200).json(complaint)
}

module.exports = {
    getComplaints,
    getComplaint,
    createComplaint,
    deleteComplaint,
    updateComplaint
}