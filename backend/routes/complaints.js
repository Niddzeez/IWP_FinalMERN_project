const express = require('express')
const {
    createComplaint,
    getComplaints,
    getComplaint,
    deleteComplaint,
    updateComplaint
} = require('../controllers/complaintController')

const router = express.Router()

router.get('/', getComplaints)

router.get('/:id', getComplaint)

router.post('/', createComplaint)

router.delete('/:id', deleteComplaint)

router.patch('/:id', updateComplaint)

module.exports = router