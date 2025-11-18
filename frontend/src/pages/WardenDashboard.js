import React, { useState, useEffect, useMemo } from 'react';
import ComplaintService from '../services/ComplaintService';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import WardenDetailPanel from '../components/WardenDetailPanel';
import { COMPLAINT_CATEGORIES } from '../config';
import { useAuth } from '../context/AuthContext';
import './WardenDashboard.css';

const getISODate = (date) => {
  return date.toISOString().split('T')[0];
};
const today = getISODate(new Date());
const filterCategories = ['All', ...COMPLAINT_CATEGORIES];

function WardenDashboard() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [maintenanceChecks, setMaintenanceChecks] = useState([]);
  const [dateFilter, setDateFilter] = useState('triage');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [searchTerm, setSearchTerm] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
    
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allTasks = useMemo(() => {
    const complaintsAsTasks = allComplaints.map(c => ({
      ...c,
      type: 'complaint',
      date: c.scheduledFor || c.createdAt,
    }));
    const maintenanceAsTasks = maintenanceChecks.map(m => ({
      ...m,
      type: 'maintenance',
      date: m.scheduledFor,
    }));
    return [...complaintsAsTasks, ...maintenanceAsTasks];
  }, [allComplaints, maintenanceChecks]);

  const filteredTasks = useMemo(() => {
    let tasks = allTasks;

    if (dateFilter === 'triage') {
      tasks = allTasks.filter(t => t.type === 'complaint' && t.status === 'Submitted');
    } else if (dateFilter === 'today') {
      tasks = allTasks.filter(t => t.scheduledFor && getISODate(new Date(t.scheduledFor)) === today);
    } else if (dateFilter === 'upcoming') {
      tasks = allTasks.filter(t => t.scheduledFor && getISODate(new Date(t.scheduledFor)) > today);
    }
    
    tasks = tasks
      .filter(t => statusFilter === 'All' || t.status === statusFilter)
      .filter(t => categoryFilter === 'All' || !t.category || t.category === categoryFilter)
      .filter(t => {
        const search = searchTerm.toLowerCase();
        return t.title.toLowerCase().includes(search) ||
               (t.description && t.description.toLowerCase().includes(search));
      });

    return tasks.sort((a, b) => {
      if (sortBy === 'priority') return (b.votes || 0) - (a.votes || 0);
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });
  }, [allTasks, dateFilter, statusFilter, categoryFilter, searchTerm, sortBy]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleManageClick = (id) => setSelectedComplaintId(id);

  const renderDetailPanel = () => {
    if (selectedComplaintId) {
      return (
        <WardenDetailPanel 
          complaintId={selectedComplaintId} 
          onClose={() => setSelectedComplaintId(null)}
        />
      );
    }
  };

  return (
    <main className="warden-dashboard-page pages">
      <header className="warden-page-header">
        <div className="header-title-group">
          <h2>Warden Dashboard</h2>
          <p className="dashboard-subtitle">{currentUser?.hostelName || 'Hostel Portal'}</p>
        </div>
        <button onClick={handleLogout} className="warden-logout-button">
          Logout
        </button>
      </header>

      <section className="widget-section">
        <h3 className="widget-title">Warden's In-Tray</h3>
        <div className="checklist-filters">
          <button
            className={`filter-chip ${dateFilter === 'triage' ? 'active' : ''}`}
            onClick={() => setDateFilter('triage')}
          >
            Triage
          </button>
          <button
            className={`filter-chip ${dateFilter === 'today' ? 'active' : ''}`}
            onClick={() => setDateFilter('today')}
          >
            Today
          </button>
          <button
            className={`filter-chip ${dateFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setDateFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-chip ${dateFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDateFilter('all')}
          >
            View All
          </button>
        </div>

        <div className="warden-controls">
          <input
            type="text"
            placeholder="Search tasks..."
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Completed">Completed</option>
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

        <div className="widget-list">
          {filteredTasks.length === 0 && (
            <p className="widget-empty">No tasks in this list.</p>
          )}
          {filteredTasks.map(task => (
            <TaskItem 
              key={`${task.type}-${task.id}`} 
              task={task} 
              onManageClick={handleManageClick}
            />
          ))}
        </div>
      </section>
      
      {isMobile && selectedComplaintId && renderDetailPanel()}
      {!isMobile && renderDetailPanel()}
    </main>
  );
}

export default WardenDashboard;