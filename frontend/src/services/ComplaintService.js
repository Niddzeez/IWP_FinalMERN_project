let mockComplaints = [
  {
    id: 'c1001',
    title: 'Leaking Faucet in Room 201',
    description: 'The tap in the bathroom won\'t stop dripping. It\'s wasting water and the noise is annoying.',
    room: '201',
    category: 'Plumbing',
    status: 'Submitted',
    submittedBy: 's101',
    createdAt: new Date('2025-11-18T09:30:00Z').toISOString(),
    scheduledFor: null,
    votes: 12
  },
  {
    id: 'c1002',
    title: 'Wi-Fi not working on 3rd floor',
    description: 'The Wi-Fi router on the 3rd-floor landing seems to be down. Can\'t connect to any network.',
    room: '305',
    category: 'Internet',
    status: 'In Progress',
    submittedBy: 's102',
    createdAt: new Date('2025-11-16T11:00:00Z').toISOString(),
    scheduledFor: new Date('2025-11-18T14:00:00Z').toISOString(),
    votes: 28
  },
  {
    id: 'c1003',
    title: 'Broken light fixture',
    description: 'The main ceiling light in Room 104 flickers constantly and won\'t stay on.',
    room: '104',
    category: 'Electrical',
    status: 'Resolved',
    submittedBy: 's103',
    createdAt: new Date('2025-11-14T14:15:00Z').toISOString(),
    scheduledFor: new Date('2025-11-15T10:00:00Z').toISOString(),
    votes: 5
  },
  {
    id: 'c1004',
    title: 'Clogged drain in shower',
    description: 'Water is not draining in the 2nd floor west wing shower.',
    room: '2W Shower',
    category: 'Plumbing',
    status: 'Submitted',
    submittedBy: 's104',
    createdAt: new Date('2025-11-17T08:00:00Z').toISOString(),
    scheduledFor: null,
    votes: 8
  }
];

let mockMaintenanceChecks = [
  {
    id: 'm2001',
    title: 'Fire Extinguisher Check - Wing A',
    status: 'Pending',
    scheduledFor: new Date('2025-11-20T10:00:00Z').toISOString(),
  },
  {
    id: 'm2002',
    title: 'Water Filter Cleaning - Mess',
    status: 'Completed',
    scheduledFor: new Date('2025-11-15T15:00:00Z').toISOString(),
  }
];

class ComplaintService {

  static async getAllComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockComplaints]);
      }, 500);
    });
  }

  static async getComplaintById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = mockComplaints.find(c => c.id === id);
        if (complaint) {
          resolve(complaint);
        } else {
          reject(new Error('Complaint not found'));
        }
      }, 300);
    });
  }
  
  static async createComplaint(complaintData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComplaint = {
          ...complaintData,
          id: `c${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'Submitted',
          createdAt: new Date().toISOString(),
          votes: 1,
        };
        mockComplaints.unshift(newComplaint);
        resolve(newComplaint);
      }, 700);
    });
  }

  static async updateComplaintStatus(id, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = mockComplaints.findIndex(c => c.id === id);
        if (complaintIndex > -1) {
          mockComplaints[complaintIndex].status = newStatus;
          resolve(mockComplaints[complaintIndex]);
        } else {
          reject(new Error('Complaint not found for update'));
        }
      }, 400);
    });
  }
  
  static async deleteComplaint(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockComplaints = mockComplaints.filter(c => c.id !== id);
        resolve({ success: true });
      }, 500);
    });
  }

  static async getMaintenanceChecks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockMaintenanceChecks]);
      }, 500);
    });
  }
}

export default ComplaintService;