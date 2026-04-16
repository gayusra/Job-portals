import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get(`/applications/job/${jobId}`);
        setApplications(data.applications);

        // Get job title
        const jobData = await axios.get(`/jobs/${jobId}`);
        setJobTitle(jobData.data.title);
      } catch (error) {
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(`/applications/${applicationId}/status`, { status });
      toast.success('Status updated successfully');
      setApplications(applications.map((app) =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef9e7', color: '#f39c12' },
      reviewed: { bg: '#eaf4fd', color: '#3498db' },
      shortlisted: { bg: '#d5f5e3', color: '#27ae60' },
      rejected: { bg: '#fde8e8', color: '#e74c3c' },
      hired: { bg: '#d5f5e3', color: '#1a7a4a' }
    };
    return colors[status] || { bg: '#f0f0f0', color: '#555' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <Link to='/employer-dashboard' style={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h2 style={styles.title}>Applicants for "{jobTitle}"</h2>
          <p style={styles.subtitle}>{applications.length} application(s) received</p>
        </div>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading applicants...</p>
      ) : applications.length === 0 ? (
        <div style={styles.noApps}>
          <h3>No applications yet</h3>
          <p>Share your job listing to attract candidates</p>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app._id} style={styles.appCard}>
            <div style={styles.appHeader}>
              <div>
                <h3 style={styles.applicantName}>
                  {app.applicant?.name}
                </h3>
                <p style={styles.applicantEmail}>
                  {app.applicant?.email}
                </p>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(app.status).bg,
                  color: getStatusColor(app.status).color
                }}
              >
                {app.status}
              </span>
            </div>

            <div style={styles.appDetails}>
              {app.applicant?.profile?.phone && (
                <span style={styles.detail}>
                  📞 {app.applicant.profile.phone}
                </span>
              )}
              {app.applicant?.profile?.location && (
                <span style={styles.detail}>
                  📍 {app.applicant.profile.location}
                </span>
              )}
              <span style={styles.detail}>
                📅 Applied {new Date(app.appliedAt).toLocaleDateString()}
              </span>
            </div>

            {app.applicant?.profile?.skills?.length > 0 && (
              <div style={styles.skills}>
                {app.applicant.profile.skills.map((skill, i) => (
                  <span key={i} style={styles.skill}>{skill}</span>
                ))}
              </div>
            )}

            {app.coverLetter && (
              <div style={styles.coverLetter}>
                <strong>Cover Letter:</strong>
                <p>{app.coverLetter}</p>
              </div>
            )}

            <div style={styles.actions}>
              <a
                href={app.resume}
                target='_blank'
                rel='noreferrer'
                style={styles.resumeBtn}
              >
                View Resume
              </a>
              <select
                value={app.status}
                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                style={styles.statusSelect}
              >
                <option value='pending'>Pending</option>
                <option value='reviewed'>Reviewed</option>
                <option value='shortlisted'>Shortlisted</option>
                <option value='rejected'>Rejected</option>
                <option value='hired'>Hired</option>
              </select>
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
    marginBottom: '30px'
  },
  backLink: {
    color: '#7f8c8d',
    fontSize: '14px',
    display: 'block',
    marginBottom: '10px'
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    color: '#7f8c8d',
    marginTop: '5px'
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
  applicantName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '4px'
  },
  applicantEmail: {
    color: '#7f8c8d',
    fontSize: '14px'
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
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  skill: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '13px'
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
  actions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px'
  },
  resumeBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  },
  statusSelect: {
    padding: '8px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'white'
  }
};

export default Applicants;