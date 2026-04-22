import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { generateCoverLetter } from '../utils/groq';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Fetch job details
        const { data } = await axios.get(`/jobs/${id}`);
        setJob(data);

        // Check if user already applied
        if (user && user.role === 'jobseeker') {
          try {
            const { data: appData } = await axios.get('/applications/myapplications');
            const alreadyApplied = appData.applications.some(
              (app) => app.job?._id === id || app.job === id
            );
            if (alreadyApplied) {
              setApplied(true);
            }
          } catch (err) {
            console.log('Could not check application status');
          }
        }
      } catch (error) {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  // Handle resume file selection & auto upload
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate by extension
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Only PDF, DOC, DOCX files allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await axios.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResumeUrl(data.url);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload resume');
      setResumeFile(null);
      setResumeFileName('');
    } finally {
      setUploadingResume(false);
    }
  };

  // Generate cover letter using Groq AI
  const handleGenerateCoverLetter = async () => {
    if (!job) return;
    setGeneratingAI(true);
    try {
      const generated = await generateCoverLetter({
        jobTitle: job.title,
        company: job.company,
        skills: job.skills,
        experience: job.experience,
        description: job.description
      });
      setCoverLetter(generated);
      toast.success('Cover letter generated!');
    } catch (error) {
      toast.error('Failed to generate cover letter. Try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Submit application
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

    if (!resumeUrl) {
      toast.error('Please upload your resume first');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/applications/${id}`, {
        resume: resumeUrl,
        coverLetter
      });
      toast.success('Application submitted successfully!');
      setApplied(true);
      setShowApplyForm(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply';
      if (message.toLowerCase().includes('already applied')) {
        setApplied(true);
        setShowApplyForm(false);
        toast.warning('You have already applied for this job!');
      } else {
        toast.error(message);
      }
    } finally {
      setApplying(false);
    }
  };

/*   if (loading) {
    return <div style={styles.loading}>Loading job details...</div>;
  } */

    if (loading) {
  return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
      <div style={{ background:'white', borderRadius:'24px', padding:'52px 48px', textAlign:'center', boxShadow:'0 20px 60px rgba(99,102,241,0.1)', border:'1px solid #e2e8f0', maxWidth:'380px', width:'100%' }}>
        <div style={{ fontSize:'40px', marginBottom:'20px' }}>💼</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'20px' }}>
          <div style={{ width:'56px', height:'56px', border:'4px solid #eef2ff', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        </div>
        <div style={{ display:'flex', gap:'6px', justifyContent:'center', marginBottom:'16px' }}>
          {[0,1,2].map(i => (<div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#6366f1', animation:`bounce 1.2s ease-in-out ${i*0.15}s infinite` }} />))}
        </div>
        <h3 style={{ fontSize:'18px', fontWeight:'700', color:'#0f172a', marginBottom:'6px' }}>Loading Job Details...</h3>
        <p style={{ fontSize:'13px', color:'#94a3b8' }}>Please wait a moment</p>
      </div>
    </div>
  );
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
                <span style={styles.detailValue}>
                  {job.education || 'Not specified'}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>👥 Openings</span>
                <span style={styles.detailValue}>{job.openings}</span>
              </div>
              {job.salary?.min && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💰 Salary</span>
                  <span style={styles.detailValue}>
                    ₹{job.salary.min.toLocaleString()} -{' '}
                    ₹{job.salary.max.toLocaleString()} / month
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
          {showApplyForm && !applied && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Apply for this Job</h3>

              <form onSubmit={handleApply}>

                {/* Resume Upload */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Upload Resume *
                    <span style={styles.hint}> (PDF, DOC, DOCX — max 5MB)</span>
                  </label>

                  <div style={styles.uploadBox}>
                    <input
                      type='file'
                      accept='.pdf,.doc,.docx'
                      onChange={handleResumeChange}
                      style={styles.fileInput}
                      id='resume-upload'
                    />
                    <label
                      htmlFor='resume-upload'
                      style={styles.uploadLabel}
                    >
                      {uploadingResume ? (
                        <span>⏳ Uploading...</span>
                      ) : resumeFileName ? (
                        <span style={styles.uploadedFile}>
                          ✅ {resumeFileName}
                        </span>
                      ) : (
                        <span>📎 Click to upload resume</span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div style={styles.formGroup}>
                  <div style={styles.coverLetterHeader}>
                    <label style={styles.label}>Cover Letter</label>

                    {/* AI Generate Button */}
                    <button
                      type='button'
                      onClick={handleGenerateCoverLetter}
                      disabled={generatingAI}
                      style={styles.aiBtn}
                    >
                      {generatingAI ? '⏳ Generating...' : '✨ Generate with AI'}
                    </button>
                  </div>

                  {/* AI Loading State */}
                  {generatingAI && (
                    <div style={styles.aiLoading}>
                      <div style={styles.aiLoadingText}>
                        🤖 AI is writing your cover letter based on this job...
                      </div>
                    </div>
                  )}

                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder='Write your cover letter here or click "Generate with AI" to auto-generate one...'
                    style={styles.textarea}
                    rows={8}
                  />

                  <p style={styles.coverLetterHint}>
                    💡 AI will generate based on job title, company and required skills.
                    You can edit the generated content before submitting.
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={styles.applyButtons}>
                  <button
                    type='submit'
                    style={{
                      ...styles.submitBtn,
                      opacity: (!resumeUrl || applying) ? 0.6 : 1,
                      cursor: (!resumeUrl || applying) ? 'not-allowed' : 'pointer'
                    }}
                    disabled={!resumeUrl || applying}
                  >
                    {applying ? '⏳ Submitting...' : '🚀 Submit Application'}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowApplyForm(false);
                      setCoverLetter('');
                      setResumeFile(null);
                      setResumeFileName('');
                      setResumeUrl('');
                    }}
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

          {/* Apply Button Card */}
          <div style={styles.card}>
            {applied ? (
              <>
                {/* Already Applied Badge */}
                <div style={styles.appliedBadge}>
                  ✅ Already Applied!
                </div>
                {/* View Applications Link */}
                <div style={styles.alreadyAppliedInfo}>
                  <p>You have already submitted an application for this job.</p>
                  <Link to='/my-applications' style={styles.viewApplicationBtn}>
                    View My Applications →
                  </Link>
                </div>
              </>
            ) : user?.role === 'jobseeker' && !showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                style={styles.applyBtn}
              >
                Apply Now
              </button>
            ) : user?.role === 'jobseeker' && showApplyForm ? (
              <button
                onClick={() => {
                  setShowApplyForm(false);
                  setCoverLetter('');
                  setResumeFile(null);
                  setResumeFileName('');
                  setResumeUrl('');
                }}
                style={styles.cancelSideBtn}
              >
                ✕ Cancel Application
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

          {/* AI Feature Info — only show if not applied */}
          {!applied && (
            <div style={{ ...styles.card, backgroundColor: '#f0f7ff' }}>
              <h3 style={{ ...styles.sectionTitle, color: '#3498db' }}>
                ✨ AI Cover Letter
              </h3>
              <p style={styles.aiInfo}>
                Click Apply and use our free AI tool to instantly generate
                a professional cover letter tailored to this job.
              </p>
            </div>
          )}

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
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '15px'
  },
  hint: {
    color: '#95a5a6',
    fontWeight: 'normal',
    fontSize: '13px'
  },
  uploadBox: {
    border: '2px dashed #3498db',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8fbff',
    cursor: 'pointer'
  },
  fileInput: {
    display: 'none'
  },
  uploadLabel: {
    cursor: 'pointer',
    color: '#3498db',
    fontSize: '15px',
    fontWeight: '600'
  },
  uploadedFile: {
    color: '#27ae60',
    fontSize: '14px'
  },
  coverLetterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  aiBtn: {
    backgroundColor: '#8e44ad',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  aiLoading: {
    backgroundColor: '#f8f0ff',
    border: '1px solid #d7bde2',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px'
  },
  aiLoadingText: {
    color: '#8e44ad',
    fontSize: '14px',
    textAlign: 'center'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '1.6'
  },
  coverLetterHint: {
    color: '#95a5a6',
    fontSize: '13px',
    marginTop: '8px'
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
    padding: '13px',
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
    padding: '13px',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer'
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
  cancelSideBtn: {
    display: 'block',
    width: '100%',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '15px',
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
    marginBottom: '12px',
    fontSize: '16px'
  },
  alreadyAppliedInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#7f8c8d',
    textAlign: 'center'
  },
  viewApplicationBtn: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: '13px',
    display: 'block',
    marginTop: '8px'
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
  aiInfo: {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  backBtn: {
    display: 'block',
    color: '#7f8c8d',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px'
  }
};

export default JobDetail;
