// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


// --- Define Routes ---
const authRoutes = require('./routes/auth');
const maintenanceRoutes = require('./routes/maintenance'); 
const { verifyToken } = require('./middleware/auth');
const complaintroutes = require('./routes/complaints')

// Mount the Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes); 
app.use('/api/complaints', complaintroutes);

app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Hostel Complaint Backend API is Running...');
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6Miwicm9sZSI6IndhcmRlbiIsImhvc3RlbElkIjoia2FscGFuYS1jaGF3bGEifSwiaWF0IjoxNzYzNDQ3MTA2LCJleHAiOjE3NjM0NTA3MDZ9.z1QedrVtDM3JEolEidbSeJmaT5odCaMd1oZiXf_3fms