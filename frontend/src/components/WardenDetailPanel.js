import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import './WardenDetailPanel.css';

const getISODate = (date) => {
  return date.toISOString().split('T')[0];
};

function WardenDetailPanel({ complaintId, onClose }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const [currentStatus, setCurrentStatus] = useState('');
  const today = getISODate(new Date());

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!complaintId) return;
      try {
        setLoading(true);
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);
        setCurrentStatus(data.status);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch complaint:", error);
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    console.log("Submitting internal note:", newComment);
    setNewComment('');
  };
  
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    console.log(`Updating status to ${newStatus}`);
  };

  const timelineEvents = [
    { type: 'comment', author: 'Warden (You)', date: '2 days ago', body: 'Plumber assigned.' },
    { type: 'submitted', author: 'Student', date: '3 days ago', body: complaint?.description },
  ];

  if (loading || !complaint) {
    return (
      <>
        <div className="panel-backdrop" onClick={onClose}></div>
        <aside className="warden-detail-panel">
          <p className="panel-loading">Loading...</p>
        </aside>
      </>
    );
  }

  return (
    <>
      <div className="panel-backdrop" onClick={onClose}></div>
      <aside className="warden-detail-panel">
        <button onClick={onClose} className="panel-close-btn">&times;</button>
        <header className="panel-header">
          <h2 className="panel-title">
            {complaint.title}
            <span>ID: #{complaint.id}</span>
          </h2>
        </header>
        
        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Manage
          </button>
          <button 
            className={`panel-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'details' && (
            <>
              <section className="panel-section">
                <h4>Change Status</h4>
                <div className="select-group">
                  <select value={currentStatus} onChange={handleStatusChange}>
                    <option value="Submitted">Submitted (New)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </section>

              <section className="panel-section">
                <h4>Schedule Task</h4>
                <div className="select-group">
                  <input
                    type="date"
                    className="warden-date-input"
                    min={today}
                    defaultValue={complaint.scheduledFor ? getISODate(new Date(complaint.scheduledFor)) : ''}
                  />
                </div>
              </section>
              
              <section className="panel-section">
                <h4>Details</h4>
                <div className="details-grid">
                  <span>Room</span>
                  <strong>{complaint.room}</strong>
                  <span>Category</span>
                  <strong>{complaint.category}</strong>
                  <span>Votes</span>
                  <strong>{complaint.votes || 0}</strong>
                  <span>Submitted</span>
                  <strong>{new Date(complaint.createdAt).toLocaleString()}</strong>
                </div>
              </section>
            </>
          )}

          {activeTab === 'timeline' && (
            <>
              <section className="panel-section">
                <h4>Activity Timeline</h4>
                <div className="timeline">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{event.author}</strong>
                          <span>{event.date}</span>
                        </div>
                        <div className="timeline-body">
                          <p>{event.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel-section">
                <h4>Add Internal Note / Comment</h4>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="e.g., Assigned to plumber. ETA 2 hours..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">Add Note</button>
                </form>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default WardenDetailPanel;