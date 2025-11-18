import React from 'react';
import './TaskItem.css';

function TaskItem({ task, onManageClick }) {
  const isComplaint = task.type === 'complaint';
  const isTriage = isComplaint && task.status === 'Submitted';

  const getStatusInfo = () => {
    if (task.status === 'Submitted') return { text: 'New', class: 'status-new' };
    if (task.status === 'In Progress') return { text: 'In Progress', class: 'status-in-progress' };
    if (task.status === 'Pending') return { text: 'Pending', class: 'status-new' };
    return { text: task.status, class: 'status-resolved' };
  };

  const statusInfo = getStatusInfo();
  
  const getDisplayDate = () => {
    if (isTriage) return `Submitted ${new Date(task.createdAt).toLocaleDateString()}`;
    if (task.scheduledFor) return new Date(task.scheduledFor).toLocaleDateString();
    return '';
  };

  return (
    <div 
      className={`task-item-card ${isTriage ? 'triage' : ''} ${isComplaint ? 'complaint' : ''}`}
      onClick={isComplaint ? () => onManageClick(task.id) : undefined}
    >
      <span className={`task-type-tag ${isComplaint ? 'complaint' : 'maintenance'}`}>
        {isComplaint ? task.category : 'Maintenance'}
      </span>
      
      <div className="task-info">
        <strong>{task.title}</strong>
        <span>
          {isComplaint && `Room ${task.room} • `} {getDisplayDate()}
        </span>
      </div>

      <div className="task-actions">
        {isComplaint && <span className="task-votes">{task.votes || 0} Votes</span>}
        
        <span className={`task-status-tag ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
        
        {isComplaint && (
          <button 
            className="manage-button"
            onClick={(e) => {
              e.stopPropagation();
              onManageClick(task.id);
            }}
          >
            {isTriage ? 'Schedule' : 'Manage'}
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;