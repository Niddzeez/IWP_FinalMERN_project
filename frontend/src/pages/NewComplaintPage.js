import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintService from '../services/ComplaintService';
import { COMPLAINT_CATEGORIES } from '../config';
import './NewComplaintPage.css';

function NewComplaintPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalCategory = category === 'Other' ? otherCategory : category;

    const complaintData = {
      title,
      description,
      room,
      category: finalCategory,
    };

    try {
      await ComplaintService.createComplaint(complaintData);
      setIsLoading(false);
      navigate('/student-dashboard');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to submit complaint. Please try again.');
      console.error(err);
    }
  };

  return (
    <main className="new-complaint-page pages">
      <div className="form-container">
        <header className="form-header">
          <h2>Submit a New Complaint</h2>
          <p>Please provide as much detail as possible.</p>
        </header>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="e.g., Leaking Faucet in Room 201"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {COMPLAINT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {category === 'Other' && (
            <div className="form-group other-category-fade-in">
              <label htmlFor="other-category">Please specify</label>
              <input
                type="text"
                id="other-category"
                placeholder="e.g., Broken furniture"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="room">Room Number / Location</label>
            <input
              type="text"
              id="room"
              placeholder="e.g., Room 201, 3rd Floor Washroom"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe the issue in detail..."
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={() => navigate('/student-dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default NewComplaintPage;