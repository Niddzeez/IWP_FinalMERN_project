import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import './WardenOverview.css';

function WardenOverview() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [maintenanceChecks, setMaintenanceChecks] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [complaintsData, maintenanceData] = await Promise.all([
          ComplaintService.getAllComplaints(),
          ComplaintService.getMaintenanceChecks()
        ]);
        setAllComplaints(complaintsData);
        setMaintenanceChecks(maintenanceData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchAllData();
  }, []);

  const newComplaints = allComplaints
    .filter(c => c.status === 'Submitted')
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const stats = {
    new: newComplaints.length,
    inProgress: allComplaints.filter(c => c.status === 'In Progress').length,
  };

  const upcomingMaintenance = maintenanceChecks.filter(c => c.status === 'Pending');

  return (
    <div className="warden-overview-layout">
      <section className="stats-grid">
        <div className="stat-card">
          <span>New Complaints</span>
          <strong>{stats.new}</strong>
        </div>
        <div className="stat-card">
          <span>In Progress</span>
          <strong>{stats.inProgress}</strong>
        </div>
      </section>

      <section className="widget-section">
        <h4>Upcoming Maintenance</h4>
        <div className="widget-list">
          {upcomingMaintenance.length === 0 && <p className="widget-empty">No upcoming maintenance.</p>}
          {upcomingMaintenance.map(check => (
            <div key={check.id} className="widget-list-item">
              <span>{check.title}</span>
              <strong className="status-pending">{check.status}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="widget-section">
        <h4>New Complaints for Triage</h4>
        <div className="widget-list">
          {newComplaints.length === 0 && <p className="widget-empty">No new complaints. All clear!</p>}
          {newComplaints.slice(0, 5).map(complaint => (
            <div key={complaint.id} className="widget-list-item triage-item">
              <div className="triage-info">
                <strong>{complaint.title}</strong>
                <span>Room {complaint.room} • {complaint.votes} Votes</span>
              </div>
              <button className="assign-button">Manage</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default WardenOverview;