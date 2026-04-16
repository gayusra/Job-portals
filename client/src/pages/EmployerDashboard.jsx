import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    try {
      const { data } = await axios.get('/jobs/employer/myjobs');
      setJobs(data.jobs);
    } catch (error) {
      toast.error('Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await axios.put(`/jobs/${jobId}`, { status: newStatus });
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`);
      fetchMyJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Employer Dashboard</h2>
          <p style={styles.subtitle}>Manage your job listings</p>
        </div>
        <Link to='/post-job' style={styles.postBtn}>
          + Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{jobs.length}</h3>
          <p style={styles.statLabel}>Total Jobs</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {jobs.filter((j) => j.status === 'active').length}
          </h3>
          <p style={styles.statLabel}>Active Jobs</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {jobs.filter((j) => j.status === 'closed').length}
          </h3>
          <p style={styles.statLabel}>Closed Jobs</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Your Job Listings</h3>

        {loading ? (
          <p style={styles.loading}>Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <div style={styles.noJobs}>
            <p>You haven't posted any jobs yet.</p>
            <Link to='/post-job' style={styles.postBtn}>
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job._id} style={styles.jobRow}>
                <div style={styles.jobInfo}>
                  <h4 style={styles.jobTitle}>{job.title}</h4>
                  <div style={styles.jobMeta}>
                    <span style={styles.metaItem}>📍 {job.location}</span>
                    <span style={styles.metaItem}>💼 {job.jobType}</span>
                    <span style={styles.metaItem}>👥 {job.openings} openings</span>
                    <span style={styles.metaItem}>
                      📅 {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={styles.jobActions}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        job.status === 'active' ? '#d5f5e3' : '#fde8e8',
                      color: job.status === 'active' ? '#27ae60' : '#e74c3c'
                    }}
                  >
                    {job.status}
                  </span>

                  <button
                    onClick={() => navigate(`/employer/applications/${job._id}`)}
                    style={styles.viewBtn}
                  >
                    View Applicants
                  </button>

                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    style={styles.toggleBtn}
                  >
                    {job.status === 'active' ? 'Close' : 'Reopen'}
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    color: '#7f8c8d',
    marginTop: '5px'
  },
  postBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    flex: '1',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#3498db'
  },
  statLabel: {
    color: '#7f8c8d',
    marginTop: '5px'
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0'
  },
  loading: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '30px'
  },
  noJobs: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d'
  },
  jobRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #f0f0f0',
    flexWrap: 'wrap',
    gap: '15px'
  },
  jobInfo: {
    flex: '1'
  },
  jobTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  jobMeta: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: '#7f8c8d',
    fontSize: '13px'
  },
  jobActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  toggleBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  }
};

export default EmployerDashboard;