class AuthService {

  static async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'student@hostel.com' && password === 'password123') {
          resolve({
            success: true,
            token: 'fake-student-token-xyz',
            user: { 
              id: 's101', 
              name: 'Test Student', 
              role: 'student',
              hostelName: 'Springfield Hostels'
            }
          });
        } else if (email === 'warden@hostel.com' && password === 'password123') {
          resolve({
            success: true,
            token: 'fake-warden-token-abc',
            user: { 
              id: 'w201', 
              name: 'Test Warden', 
              role: 'warden',
              hostelName: 'Springfield Hostels'
            }
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }
}

export default AuthService;