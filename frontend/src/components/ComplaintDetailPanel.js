import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import './ComplaintDetailPanel.css';
import { useAuth } from '../context/AuthContext';

function ComplaintDetailPanel({ complaintId, onClose }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!complaintId) return;
      try {
        setLoading(true);
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);
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
    console.log("Submitting comment:", newComment);
    setNewComment('');
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    return status.toLowerCase().replace(' ', '-');
  };

  const timelineEvents = [
    {
      type: 'comment',
      author: 'Warden (Admin)',
      date: '2 days ago',
      body: 'A plumber has been assigned. Their estimated time of arrival is 2 hours.',
    },
    {
      type: 'status_change',
      author: 'Warden (Admin)',
      date: '2 days ago',
      oldStatus: 'Submitted',
      newStatus: 'In Progress',
    },
    {
      type: 'submitted',
      author: 'Original Poster',
      date: '3 days ago',
      body: complaint?.description,
    },
  ];

  if (loading || !complaint) {
    return (
      <>
        <div className="panel-backdrop" onClick={onClose}></div>
        <aside className="complaint-detail-panel">
          <p className="panel-loading">Loading details...</p>
        </aside>
      </>
    );
  }

  const isOriginalPoster = complaint.submittedBy === currentUser.id;
  const isResolvedByWarden = complaint.status === 'Resolved';

  return (
    <>
      <div className="panel-backdrop" onClick={onClose}></div>
      <aside className="complaint-detail-panel">
        <button onClick={onClose} className="panel-close-btn">&times;</button>
        <header className="panel-header">
          <div className={`status-badge ${getStatusClass(complaint.status)}`}>
            {complaint.status}
          </div>
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
            Details
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
              <section className="panel-details-section">
                <h4>Details</h4>
                <div className="details-grid">
                  <span>Room</span>
                  <strong>{complaint.room}</strong>
                  <span>Category</span>
                  <strong>{complaint.category}</strong>
                  <span>Submitted by</span>
                  <strong>{isOriginalPoster ? "You" : `User ${complaint.submittedBy}`}</strong>
                  <span>Submitted</span>
                  <strong>{new Date(complaint.createdAt).toLocaleString()}</strong>
                </div>
              </section>

              <section className="panel-confirmation-section">
                <h4>Confirmation</h4>
                {isOriginalPoster && isResolvedByWarden && (
                  <div className="action-box">
                    <p>The issue is marked as resolved. Are you satisfied?</p>
                    <button className="confirm-button">Yes, Close Complaint</button>
                    <button className="reopen-button">No, Re-open Complaint</button>
                  </div>
                )}
                {isOriginalPoster && !isResolvedByWarden && (
                  <p className="sidebar-note">You can confirm or re-open this once it is resolved.</p>
                )}
                {!isOriginalPoster && (
                  <p className="sidebar-note">Only the original poster can confirm this complaint.</p>
                )}
              </section>
            </>
          )}

          {activeTab === 'timeline' && (
            <>
              <section className="panel-timeline-section">
                <h4>Activity Timeline</h4>
                <div className="timeline">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className={`timeline-icon ${event.type}`}></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{event.author}</strong>
                          <span>{event.date}</span>
                        </div>
                        <div className="timeline-body">
                          {event.type === 'status_change' ? (
                            <p>
                              Changed status from
                              <span className={`status-tag-inline ${getStatusClass(event.oldStatus)}`}>{event.oldStatus}</span>
                              to
                              <span className={`status-tag-inline ${getStatusClass(event.newStatus)}`}>{event.newStatus}</span>
                            </p>
                          ) : (
                            <p>{event.body}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel-comment-section">
                <h4>Add Comment</h4>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Add a comment to help resolve this issue..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">Comment</button>
                </form>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default ComplaintDetailPanel;