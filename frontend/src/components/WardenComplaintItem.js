import React from 'react';
import './WardenComplaintItem.css';

function WardenComplaintItem({ complaint, onClick, isSelected }) {
  const submittedDate = new Date(complaint.createdAt).toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric'
  });

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div 
      className={`warden-item-card ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(complaint.id)}
    >
      <div className="warden-item-header">
        <span className="warden-item-room">Room {complaint.room}</span>
        <span className={`status-tag status-${getStatusClass(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>
      <h4 className="warden-item-title">{complaint.title}</h4>
      <p className="warden-item-meta">
        {complaint.category} • {submittedDate}
      </p>
      <div className="warden-item-footer">
        <span className="warden-item-votes">{complaint.votes || 0} Votes</span>
      </div>
    </div>
  );
}

export default WardenComplaintItem;