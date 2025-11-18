import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await AuthService.login(email, password);
      
      login(data.user);

      if (data.user.role === 'student') {
        navigate('/student-dashboard');
      } else if (data.user.role === 'warden') {
        navigate('/warden-dashboard');
      }

    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <main className="login-page-container">
      <div className="login-form-box">
        
        <header className="login-header">
          <h2>Welcome back</h2>
          <p>Welcome back! Please enter your details.</p>
        </header>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

         <a href="#" className="forgot-password-link">
            Forgot password
          </a>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </form>
      </div>
    </main>
  );
}

export default LoginPage;