import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    try {
      // Fetch jobs
      const { data } = await axios.get('/jobs/employer/myjobs');
      setJobs(data.jobs);

      // Fetch application counts for each job
      try {
        const { data: countData } = await axios.get('/applications/employer/counts');
        setAppCounts(countData.countMap);

        // Calculate total applications
        const total = Object.values(countData.countMap).reduce(
          (sum, count) => sum + count, 0
        );
        setTotalApplications(total);
      } catch (err) {
        console.log('Could not fetch application counts:', err.message);
      }
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
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dashboard * { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .shimmer {
          background: linear-gradient(90deg, #f0f4ff 25%, #e2e8f0 50%, #f0f4ff 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 8px;
        }

        .stat-card-hover {
          transition: all 0.25s;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(99,102,241,0.12) !important;
        }

        .job-row-hover {
          transition: all 0.2s;
        }
        .job-row-hover:hover {
          background: #f8faff;
        }

        .action-btn {
          transition: all 0.2s;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .post-btn-hover {
          transition: all 0.2s;
        }
        .post-btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.35) !important;
        }
      `}</style>

      <div style={styles.container} className='dashboard'>

        {/* Page Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Employer Dashboard</h1>
            <p style={styles.subtitle}>
              Manage your job listings and track applicants
            </p>
          </div>
          <Link
            to='/post-job'
            style={styles.postBtn}
            className='post-btn-hover'
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            {
              icon: '💼',
              value: loading ? '-' : jobs.length,
              label: 'Total Jobs Posted',
              color: '#6366f1',
              bg: '#eef2ff'
            },
            {
              icon: '✅',
              value: loading ? '-' : jobs.filter((j) => j.status === 'active').length,
              label: 'Active Jobs',
              color: '#16a34a',
              bg: '#f0fdf4'
            },
            {
              icon: '📋',
              value: loading ? '-' : totalApplications,
              label: 'Total Applications',
              color: '#0ea5e9',
              bg: '#f0f9ff'
            },
            {
              icon: '🔒',
              value: loading ? '-' : jobs.filter((j) => j.status === 'closed').length,
              label: 'Closed Jobs',
              color: '#ef4444',
              bg: '#fff1f2'
            }
          ].map((stat, i) => (
            <div
              key={i}
              style={{ ...styles.statCard, animationDelay: `${i * 0.1}s` }}
              className='stat-card-hover'
            >
              <div style={{ ...styles.statIcon, backgroundColor: stat.bg }}>
                {stat.icon}
              </div>
              <div style={styles.statInfo}>
                <div style={{ ...styles.statValue, color: stat.color }}>
                  {loading ? (
                    <div className='shimmer' style={{ width: '40px', height: '32px' }} />
                  ) : (
                    stat.value
                  )}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Your Job Listings</h3>
            <span style={styles.jobCount}>
              {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div style={styles.loadingWrapper}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #eef2ff',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px'
              }} />
              <p style={styles.loadingText}>Loading your jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={styles.noJobs}>
              <div style={styles.noJobsIcon}>📭</div>
              <h3 style={styles.noJobsTitle}>No jobs posted yet</h3>
              <p style={styles.noJobsText}>
                Post your first job to start receiving applications
              </p>
              <Link to='/post-job' style={styles.noJobsBtn}>
                + Post Your First Job
              </Link>
            </div>
          ) : (
            <div>
              {/* Table Head */}
              <div style={styles.tableHead}>
                <span style={{ flex: '2' }}>Job Details</span>
                <span style={{ flex: '1', textAlign: 'center' }}>Applicants</span>
                <span style={{ flex: '1', textAlign: 'center' }}>Status</span>
                <span style={{ flex: '2', textAlign: 'right' }}>Actions</span>
              </div>

              {/* Table Rows */}
              {jobs.map((job, index) => {
                const applicantCount = appCounts[job._id] || 0;
                return (
                  <div
                    key={job._id}
                    style={{
                      ...styles.jobRow,
                      animationDelay: `${index * 0.05}s`
                    }}
                    className='job-row-hover'
                  >
                    {/* Job Info */}
                    <div style={{ flex: '2' }}>
                      <h4 style={styles.jobTitle}>{job.title}</h4>
                      <div style={styles.jobMeta}>
                        <span style={styles.metaItem}>📍 {job.location}</span>
                        <span style={styles.metaItem}>💼 {job.jobType}</span>
                        <span style={styles.metaItem}>
                          👥 {job.openings} opening{job.openings !== 1 ? 's' : ''}
                        </span>
                        <span style={styles.metaItem}>
                          📅 {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Count */}
                    <div style={{ flex: '1', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/employer/applications/${job._id}`)}
                        style={{
                          ...styles.applicantBadge,
                          backgroundColor: applicantCount > 0 ? '#eef2ff' : '#f8faff',
                          color: applicantCount > 0 ? '#6366f1' : '#94a3b8',
                          border: `1px solid ${applicantCount > 0 ? '#c7d2fe' : '#e2e8f0'}`
                        }}
                      >
                        {applicantCount > 0 ? (
                          <>
                            <span style={styles.applicantCount}>{applicantCount}</span>
                            <span style={styles.applicantText}>
                              {applicantCount === 1 ? 'applicant' : 'applicants'}
                            </span>
                          </>
                        ) : (
                          <span style={styles.applicantText}>No applicants yet</span>
                        )}
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div style={{ flex: '1', textAlign: 'center' }}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: job.status === 'active' ? '#f0fdf4' : '#fff1f2',
                        color: job.status === 'active' ? '#16a34a' : '#ef4444',
                        border: `1px solid ${job.status === 'active' ? '#bbf7d0' : '#fecdd3'}`
                      }}>
                        {job.status === 'active' ? '🟢' : '🔴'} {job.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ flex: '2', display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => navigate(`/employer/applications/${job._id}`)}
                        style={styles.viewBtn}
                        className='action-btn'
                      >
                        👥 Applicants
                        {applicantCount > 0 && (
                          <span style={styles.countBubble}>{applicantCount}</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        style={{
                          ...styles.toggleBtn,
                          backgroundColor: job.status === 'active' ? '#f59e0b' : '#10b981'
                        }}
                        className='action-btn'
                      >
                        {job.status === 'active' ? '🔒 Close' : '🔓 Reopen'}
                      </button>

                      <button
                        onClick={() => handleDelete(job._id)}
                        style={styles.deleteBtn}
                        className='action-btn'
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {!loading && jobs.length > 0 && totalApplications === 0 && (
          <div style={styles.tipsCard}>
            <div style={styles.tipsIcon}>💡</div>
            <div>
              <h4 style={styles.tipsTitle}>No applications yet</h4>
              <p style={styles.tipsText}>
                Your jobs are live! Share them on social media to attract more candidates.
                Make sure your job descriptions are detailed and clear.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#f8faff',
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '30px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px'
  },
  postBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
  },
  statsGrid: {
    display: 'flex',
    gap: '16px',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: '1',
    minWidth: '180px',
    backgroundColor: 'white',
    padding: '22px 20px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeInUp 0.4s ease both'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0
  },
  statInfo: {
    flex: '1'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '500'
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a'
  },
  jobCount: {
    background: '#eef2ff',
    color: '#6366f1',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  },
  tableHead: {
    display: 'flex',
    padding: '10px 14px',
    backgroundColor: '#f8faff',
    borderRadius: '10px',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  loadingWrapper: {
    padding: '50px',
    textAlign: 'center'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px'
  },
  noJobs: {
    textAlign: 'center',
    padding: '60px 40px'
  },
  noJobsIcon: {
    fontSize: '52px',
    marginBottom: '16px'
  },
  noJobsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px'
  },
  noJobsText: {
    color: '#64748b',
    marginBottom: '24px',
    fontSize: '14px'
  },
  noJobsBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-block'
  },
  jobRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 14px',
    borderRadius: '10px',
    marginBottom: '6px',
    flexWrap: 'wrap',
    gap: '12px',
    animation: 'fadeInUp 0.4s ease both'
  },
  jobTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '6px'
  },
  jobMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  metaItem: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '500'
  },
  applicantBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: 'inherit'
  },
  applicantCount: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#6366f1',
    lineHeight: '1'
  },
  applicantText: {
    fontSize: '11px',
    fontWeight: '500',
    marginTop: '2px'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  viewBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
    fontFamily: 'inherit'
  },
  countBubble: {
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '10px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: '800'
  },
  toggleBtn: {
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  tipsCard: {
    marginTop: '20px',
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '14px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  tipsIcon: {
    fontSize: '28px',
    flexShrink: 0
  },
  tipsTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#92400e',
    marginBottom: '4px'
  },
  tipsText: {
    color: '#a16207',
    fontSize: '13px',
    lineHeight: '1.6'
  }
};

export default EmployerDashboard;
