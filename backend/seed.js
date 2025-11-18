// seed.js (NOW USES EMAIL)
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 1. --- Import YOUR Models ---
const Hostel = require('./models/hostelModel');
const User = require('./models/User');
const Complaint = require('./models/complaintModel');
const MaintenanceCheck = require('./models/maintenanceModel');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // 2. --- Clear ALL Old Data ---
        console.log('Clearing old data...');
        await Hostel.deleteMany({});
        await User.deleteMany({});
        await Complaint.deleteMany({});
        await MaintenanceCheck.deleteMany({});
        console.log('All collections cleared.');

        // 3. --- Create Hostels ---
        console.log('Creating hostels...');
        const hostelsData = [
            { name: "Kalpana Chawla", hostelStringId: "kalpana-chawla" },
            { name: "Anandi Gopal Joshi", hostelStringId: "anandi-joshi" },
            { name: "C.V.Raman", hostelStringId: "cv-raman" },
            { name: "J.C.Bose", hostelStringId: "jc-bose" },
            { name: "Homi Baba", hostelStringId: "homi-baba" }
        ];
        
        const createdHostels = await Hostel.insertMany(hostelsData);
        const hostelMap = new Map(createdHostels.map(h => [h.hostelStringId, h._id]));
        console.log(`${createdHostels.length} hostels created.`);


        // 4. --- Create Users ---
        console.log('Creating users...');
        const usersToCreate = [];
        for (const hostel of createdHostels) {
            usersToCreate.push({
                username: `Student (${hostel.hostelStringId})`, // Display Name
                email: `student_${hostel.hostelStringId}@example.com`, // Login Email
                password: 'password123',
                role: 'Student',
                hostel_id: hostel._id,
                floor_number: 1,
                room_number: '101'
            });
            usersToCreate.push({
                username: `Warden (${hostel.hostelStringId})`, // Display Name
                email: `warden_${hostel.hostelStringId}@example.com`, // Login Email
                password: 'password123',
                role: 'Warden',
                hostel_id: hostel._id
            });
        }
        
        const createdUsers = await User.insertMany(usersToCreate);
        // Create a lookup map based on EMAIL now
        const userMap = new Map(createdUsers.map(u => [u.email, u._id]));
        console.log(`${createdUsers.length} users created.`);
        console.log('--- (Login with email: "student_kalpana-chawla@example.com", password: "password123") ---');

        // 5. --- Create Complaints ---
        console.log('Creating complaints...');
        const studentKC = userMap.get('student_kalpana-chawla@example.com');
        const studentAJ = userMap.get('student_anandi-joshi@example.com');
        const studentCVR = userMap.get('student_cv-raman@example.com');
        const studentJCB = userMap.get('student_jc-bose@example.com');
        const studentHB = userMap.get('student_homi-baba@example.com');

        const complaintsToCreate = [
            // Kalpana Chawla
            {
                title: 'Leaking Faucet in Room 201', description: 'The tap...', room: 'KC-201',
                category: 'Plumbing', status: 'Submitted', votes: 12,
                user_id: studentKC, hostel_id: hostelMap.get('kalpana-chawla'),
                votedBy: [studentKC]
            },
            {
                title: 'Wi-Fi not working on 3rd floor', description: '...', room: 'KC-305',
                category: 'Internet', status: 'In Progress', votes: 28,
                user_id: studentKC, hostel_id: hostelMap.get('kalpana-chawla'),
                scheduledFor: new Date('2025-11-18T14:00:00Z')
            },
            // Anandi Gopal Joshi
            {
                title: 'Broken window pane', description: 'Window pane...', room: 'AGJ-Common',
                category: 'Carpentry', status: 'Submitted', votes: 5,
                user_id: studentAJ, hostel_id: hostelMap.get('anandi-joshi'),
                votedBy: [studentAJ]
            },
            // C.V.Raman
            {
                title: 'Clogged drain in shower', description: 'Water is not draining...', room: 'CVR-2W',
                category: 'Plumbing', status: 'Submitted', votes: 8,
                user_id: studentCVR, hostel_id: hostelMap.get('cv-raman'),
                votedBy: [studentCVR]
            },
            // J.C.Bose
            {
                title: 'Pest control needed for Room 105', description: 'There are ants...', room: 'JCB-105',
                category: 'Pest Control', status: 'In Progress', votes: 2,
                user_id: studentJCB, hostel_id: hostelMap.get('jc-bose'),
                scheduledFor: new Date('2025-11-19T10:00:00Z')
            },
            // Homi Baba
            {
                title: 'AC unit making loud noises', description: 'The AC in the study hall...', room: 'HB-Study',
                category: 'Electrical', status: 'Resolved', votes: 1,
                user_id: studentHB, hostel_id: hostelMap.get('homi-baba'),
                scheduledFor: new Date('2025-11-16T10:00:00Z')
            }
        ];
        
        await Complaint.insertMany(complaintsToCreate);
        console.log(`${complaintsToCreate.length} complaints created.`);

        // 6. --- Create Maintenance Checks ---
        console.log('Creating maintenance checks...');
        const maintenanceChecksToCreate = [
            {
                title: 'Fire Extinguisher Check - Wing A', status: 'Pending',
                scheduledFor: new Date('2025-11-20T10:00:00Z'),
                hostel_id: hostelMap.get('kalpana-chawla')
            },
            {
                title: 'Water Filter Cleaning - Mess', status: 'Completed',
                scheduledFor: new Date('2025-11-15T15:00:00Z'),
                hostel_id: hostelMap.get('kalpana-chawla')
            },
            {
                title: 'Gym Equipment Inspection', status: 'Pending',
                scheduledFor: new Date('2025-11-18T10:00:00Z'),
                hostel_id: hostelMap.get('anandi-joshi')
            },
            {
                title: 'Rooftop Water Tank Cleaning', status: 'Pending',
                scheduledFor: new Date('2025-11-17T10:00:00Z'),
                hostel_id: hostelMap.get('cv-raman')
            },
            {
                title: 'Solar Panel Inspection', status: 'Pending',
                scheduledFor: new Date('2025-11-22T10:00:00Z'),
                hostel_id: hostelMap.get('jc-bose')
            },
            {
                title: 'Lab Safety Shower Test', status: 'Pending',
                scheduledFor: new Date('2025-11-21T10:00:00Z'),
                hostel_id: hostelMap.get('homi-baba')
            }
        ];

        await MaintenanceCheck.insertMany(maintenanceChecksToCreate);
        console.log(`${maintenanceChecksToCreate.length} maintenance checks created.`);

        console.log('------------------------------------');
        console.log('✅ Database Seeding Successful!');
        console.log('------------------------------------');

    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        // 7. --- Disconnect ---
        await mongoose.connection.close();
        console.log('MongoDB Disconnected.');
    }
};

// Run the seeder function
seedDB();