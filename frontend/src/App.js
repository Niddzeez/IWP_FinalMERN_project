import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import NewComplaintPage from './pages/NewComplaintPage';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        
        <Route 
          path="/student-dashboard"
          element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
        />
        <Route 
          path="/new-complaint"
          element={<ProtectedRoute><NewComplaintPage /></ProtectedRoute>}
        />
        <Route 
          path="/warden-dashboard"
          element={<ProtectedRoute><WardenDashboard /></ProtectedRoute>}
        />
        
        <Route 
          path="/" 
          element={
            !currentUser ? (
              <Navigate to="/login" replace />
            ) : currentUser.role === 'student' ? (
              <Navigate to="/student-dashboard" replace />
            ) : (
              <Navigate to="/warden-dashboard" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;