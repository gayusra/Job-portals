import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'jobseeker') {
      toast.error('Only job seekers can apply');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/applications/${id}`, {
        resume: user.profile?.resume || 'https://res.cloudinary.com/sample/resume.pdf',
        coverLetter
      });
      toast.success('Application submitted successfully!');
      setApplied(true);
      setShowApplyForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading job details...</div>;
  }

  if (!job) return null;

  return (
    <div style={styles.container}>
      {/* Job Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{job.title}</h1>
          <p style={styles.company}>{job.company}</p>
        </div>
        <span style={styles.jobType}>{job.jobType}</span>
      </div>

      <div style={styles.content}>
        {/* Left Column */}
        <div style={styles.main}>

          {/* Job Details */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Job Details</h3>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>📍 Location</span>
                <span style={styles.detailValue}>{job.location}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>💼 Experience</span>
                <span style={styles.detailValue}>{job.experience}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>🎓 Education</span>
                <span style={styles.detailValue}>{job.education || 'Not specified'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>👥 Openings</span>
                <span style={styles.detailValue}>{job.openings}</span>
              </div>
              {job.salary?.min && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💰 Salary</span>
                  <span style={styles.detailValue}>
                    ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()} / month
                  </span>
                </div>
              )}
              {job.deadline && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>⏰ Deadline</span>
                  <span style={styles.detailValue}>
                    {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Job Description</h3>
            <p style={styles.description}>{job.description}</p>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Required Skills</h3>
              <div style={styles.skills}>
                {job.skills.map((skill, index) => (
                  <span key={index} style={styles.skill}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Apply for this Job</h3>
              <form onSubmit={handleApply}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cover Letter (Optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder='Write a brief cover letter...'
                    style={styles.textarea}
                    rows={5}
                  />
                </div>
                <div style={styles.applyButtons}>
                  <button
                    type='submit'
                    style={styles.submitBtn}
                    disabled={applying}
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowApplyForm(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={styles.sidebar}>

          {/* Apply Button */}
          <div style={styles.card}>
            {applied ? (
              <div style={styles.appliedBadge}>
                ✅ Application Submitted!
              </div>
            ) : user?.role === 'jobseeker' && !showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                style={styles.applyBtn}
              >
                Apply Now
              </button>
            ) : !user ? (
              <Link to='/login' style={styles.applyBtn}>
                Login to Apply
              </Link>
            ) : null}

            <p style={styles.postedDate}>
              Posted on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Company Info */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>About Company</h3>
            <p style={styles.companyName}>{job.company}</p>
         {job.postedBy?.profile?.companyWebsite && (
              <a
                href={job.postedBy.profile.companyWebsite}
                target='_blank'
                rel='noreferrer'
                style={styles.websiteLink}
              >
                Visit Website →
              </a>
            )}
          </div>

          {/* Back Button */}
          <Link to='/jobs' style={styles.backBtn}>
            ← Back to Jobs
          </Link>
        </div>
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
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px',
    color: '#7f8c8d'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '25px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  company: {
    color: '#3498db',
    fontSize: '18px',
    fontWeight: '600'
  },
  jobType: {
    backgroundColor: '#eaf4fd',
    color: '#3498db',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  content: {
    display: 'flex',
    gap: '25px',
    alignItems: 'flex-start'
  },
  main: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sidebar: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0'
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  detailValue: {
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '14px'
  },
  description: {
    color: '#555',
    lineHeight: '1.8',
    fontSize: '15px'
  },
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  skill: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    padding: '6px 14px',
    borderRadius: '15px',
    fontSize: '13px'
  },
  applyBtn: {
    display: 'block',
    width: '100%',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    marginBottom: '15px'
  },
  appliedBadge: {
    backgroundColor: '#d5f5e3',
    color: '#27ae60',
    padding: '14px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  postedDate: {
    color: '#95a5a6',
    fontSize: '13px',
    textAlign: 'center'
  },
  companyName: {
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '10px'
  },
  websiteLink: {
    color: '#3498db',
    fontSize: '14px'
  },
  backBtn: {
    display: 'block',
    color: '#7f8c8d',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical'
  },
  applyButtons: {
    display: 'flex',
    gap: '10px'
  },
  submitBtn: {
    flex: '1',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelBtn: {
    flex: '1',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer'
  }
};

export default JobDetail;