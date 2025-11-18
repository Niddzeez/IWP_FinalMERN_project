import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  // This is the change.
  // Instead of useState(null), we use a function to set the
  // initial state. This function runs ONCE on page load.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userItem = localStorage.getItem('user');
      // If we find a user in storage, parse it and set it
      // as the initial user.
      return userItem ? JSON.parse(userItem) : null;
    } catch (error) {
      // If parsing fails (e.g., corrupt data), return null
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};