import axios from 'axios';

// This is the URL of your backend server
const API_URL = 'http://localhost:5000/api'; 

// --- Helper function to get the token ---
// It assumes you save your user's info in localStorage after login
const getToken = () => {
  // Check if 'userInfo' exists in localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // Return the token, or null if it's not there
  return userInfo ? userInfo.token : null; 
};

/**
 * Gets all complaints for the logged-in user.
 * This is a REAL API call.
 */
const getAllComplaints = async () => {
  const token = getToken();

  // If there's no token, we can't get complaints
  if (!token) {
    console.warn('No login token found, returning empty list.');
    return []; // Return an empty array so the page doesn't crash
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // <-- Send the token to the backend
    },
  };

  try {
    // Make the GET request to your backend
    const { data } = await axios.get(`${API_URL}/complaints`, config);
    return data;
  } catch (error) {
    console.error('Error fetching complaints:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Creates a new complaint.
 * This is a REAL API call.
 */
const createComplaint = async (complaintData) => {
  const token = getToken();

  if (!token) {
    throw new Error('No login token found. Please log in again.');
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // <-- Send the token
    },
  };

  try {
    // Make the POST request to your backend
    const { data } = await axios.post(
      `${API_URL}/complaints`, 
      complaintData, 
      config
    );
    return data;
  } catch (error) {
    console.error('Error creating complaint:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- (You can add your other REAL API calls here) ---
// For example, to get a single complaint:
const getComplaintById = async (id) => {
  const token = getToken();
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}/complaints/${id}`, config);
  return data;
};

// To vote on a complaint:
const voteOnComplaint = async (id) => {
  const token = getToken();
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.post(`${API_URL}/complaints/vote/${id}`, {}, config);
  return data;
};

// --- EXPORT THE REAL SERVICE ---
const ComplaintService = {
  getAllComplaints,
  createComplaint,
  getComplaintById,
  voteOnComplaint,
  // (add getMaintenanceChecks when you build that API)
};

export default ComplaintService;