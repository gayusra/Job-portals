import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('/applications/myapplications');
        setApplications(data.applications);
      } catch (error) {
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await axios.delete(`/applications/${applicationId}`);
      toast.success('Application withdrawn successfully');
      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending:     { bg: '#fef9e7', color: '#f39c12' },
      reviewed:    { bg: '#eaf4fd', color: '#3498db' },
      shortlisted: { bg: '#d5f5e3', color: '#27ae60' },
      rejected:    { bg: '#fde8e8', color: '#e74c3c' },
      hired:       { bg: '#d5f5e3', color: '#1a7a4a' }
    };
    return styles[status] || { bg: '#f0f0f0', color: '#555' };
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>My Applications</h2>
        <p style={styles.subtitle}>Track the status of your job applications</p>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{applications.length}</h3>
          <p style={styles.statLabel}>Total Applied</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {applications.filter((a) => a.status === 'pending').length}
          </h3>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {applications.filter((a) => a.status === 'shortlisted').length}
          </h3>
          <p style={styles.statLabel}>Shortlisted</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {applications.filter((a) => a.status === 'hired').length}
          </h3>
          <p style={styles.statLabel}>Hired</p>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <p style={styles.loading}>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div style={styles.noApps}>
          <h3>No applications yet</h3>
          <p>Start applying for jobs to track them here</p>
          <Link to='/jobs' style={styles.browseBtn}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app._id} style={styles.appCard}>
            <div style={styles.appHeader}>
              <div>
                <h3 style={styles.jobTitle}>
                  {app.job?.title || 'Job no longer available'}
                </h3>
                <p style={styles.company}>{app.job?.company}</p>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusStyle(app.status).bg,
                  color: getStatusStyle(app.status).color
                }}
              >
                {app.status}
              </span>
            </div>

            <div style={styles.appDetails}>
              {app.job?.location && (
                <span style={styles.detail}>📍 {app.job.location}</span>
              )}
              {app.job?.jobType && (
                <span style={styles.detail}>💼 {app.job.jobType}</span>
              )}
              {app.job?.salary?.min && (
                <span style={styles.detail}>
                  💰 ₹{app.job.salary.min.toLocaleString()} -{' '}
                  ₹{app.job.salary.max.toLocaleString()}
                </span>
              )}
              <span style={styles.detail}>
                📅 Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </span>
            </div>

            {app.coverLetter && (
              <div style={styles.coverLetter}>
                <strong>Your Cover Letter:</strong>
                <p>{app.coverLetter}</p>
              </div>
            )}

            <div style={styles.cardFooter}>
              {app.job?._id && (
                <Link
                  to={`/jobs/${app.job._id}`}
                  style={styles.viewJobBtn}
                >
                  View Job
                </Link>
              )}
              {app.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(app._id)}
                  style={styles.withdrawBtn}
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  header: {
    marginBottom: '25px'
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
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    flex: '1',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3498db'
  },
  statLabel: {
    color: '#7f8c8d',
    marginTop: '5px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '50px'
  },
  noApps: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#7f8c8d',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  browseBtn: {
    display: 'inline-block',
    marginTop: '15px',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 25px',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  appCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  company: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: '15px'
  },
  statusBadge: {
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  appDetails: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  detail: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  coverLetter: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6'
  },
  cardFooter: {
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px'
  },
  viewJobBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  },
  withdrawBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default MyApplications;