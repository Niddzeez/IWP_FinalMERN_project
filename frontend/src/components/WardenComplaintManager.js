import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import WardenComplaintItem from '../components/WardenComplaintItem';
import WardenDetailPanel from '../components/WardenDetailPanel';
import { COMPLAINT_CATEGORIES } from '../config';
import './WardenComplaintManager.css';

const filterCategories = ['All', ...COMPLAINT_CATEGORIES];

function WardenComplaintManager() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const complaintsData = await ComplaintService.getAllComplaints();
        setAllComplaints(complaintsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchAllData();

    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const processedComplaints = allComplaints
    .filter(c => statusFilter === 'All' || c.status === statusFilter)
    .filter(c => categoryFilter === 'All' || c.category === categoryFilter)
    .filter(c => {
      const search = searchTerm.toLowerCase();
      return c.title.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return (b.votes || 0) - (a.votes || 0);
    });

  const handleComplaintClick = (id) => {
    setSelectedComplaintId(id);
  };

  const renderDetailPanel = () => {
    if (selectedComplaintId) {
      return (
        <WardenDetailPanel 
          complaintId={selectedComplaintId} 
          onClose={() => setSelectedComplaintId(null)}
        />
      );
    }
    return (
      <div className="manager-placeholder">
        <h3>Select a complaint</h3>
        <p>Select a complaint from the list to view its details, timeline, and actions.</p>
      </div>
    );
  };

  return (
    <div className="warden-manager-layout">
      <div className="warden-list-panel">
        <div className="warden-controls">
          <input
            type="text"
            placeholder="Search complaints..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="select-grid">
            <div className="select-group">
              <label>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="select-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {filterCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="select-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="warden-complaint-list">
          {processedComplaints.map(complaint => (
            <WardenComplaintItem
              key={complaint.id}
              complaint={complaint}
              onClick={handleComplaintClick}
              isSelected={selectedComplaintId === complaint.id}
            />
          ))}
        </div>
      </div>
      
      {!isMobile && (
        <div className="warden-detail-view">
          {renderDetailPanel()}
        </div>
      )}
      
      {isMobile && selectedComplaintId && (
        <div className="warden-detail-view">
          {renderDetailPanel()}
        </div>
      )}
    </div>
  );
}

export default WardenComplaintManager;