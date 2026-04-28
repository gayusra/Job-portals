import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    experience: 'fresher',
    education: '',
    openings: 1,
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax)
        },
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        openings: Number(formData.openings),
        deadline: formData.deadline
      };
      await axios.post('/jobs', jobData);
      toast.success('Job posted successfully! 🎉');
      navigate('/employer-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Info', icon: '📋' },
    { num: 2, label: 'Salary & Exp', icon: '💰' },
    { num: 3, label: 'Details', icon: '⚡' }
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Full Time', icon: '🏢', desc: 'Regular 9-5 position' },
    { value: 'part-time', label: 'Part Time', icon: '⏰', desc: 'Flexible hours' },
    { value: 'remote', label: 'Remote', icon: '🌐', desc: 'Work from anywhere' },
    { value: 'internship', label: 'Internship', icon: '🎓', desc: 'Learning opportunity' },
    { value: 'contract', label: 'Contract', icon: '📝', desc: 'Project based' }
  ];

  const experienceLevels = [
    { value: 'fresher', label: 'Fresher', icon: '🌱', desc: '0 years' },
    { value: '1-2 years', label: '1-2 Years', icon: '📈', desc: 'Junior level' },
    { value: '2-5 years', label: '2-5 Years', icon: '💼', desc: 'Mid level' },
    { value: '5+ years', label: '5+ Years', icon: '🏆', desc: 'Senior level' }
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .postjob * { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .postjob-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
          outline: none;
          background: white !important;
        }

        .postjob-input::placeholder {
          color: #c4cad4;
        }

        .job-type-card {
          transition: all 0.2s;
          cursor: pointer;
        }
        .job-type-card:hover {
          border-color: #6366f1 !important;
          background: #f5f3ff !important;
          transform: translateY(-2px);
        }

        .exp-card {
          transition: all 0.2s;
          cursor: pointer;
        }
        .exp-card:hover {
          border-color: #6366f1 !important;
          background: #f5f3ff !important;
          transform: translateY(-2px);
        }

        .step-btn {
          transition: all 0.2s;
        }
        .step-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .submit-btn {
          transition: all 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.4) !important;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .preview-tag {
          animation: fadeInUp 0.3s ease;
        }

        textarea.postjob-input {
          resize: vertical;
          min-height: 120px;
        }
      `}</style>

      <div style={styles.layout} className='postjob'>

        {/* ── Left Sidebar ── */}
        <div style={styles.sidebar}>

          {/* Logo */}
          <Link to='/' style={styles.sidebarLogo}>
            <span style={styles.sidebarLogoIcon}>💼</span>
            <span style={styles.sidebarLogoText}>JobPortal</span>
          </Link>

          <h2 style={styles.sidebarTitle}>Post a New Job</h2>
          <p style={styles.sidebarSubtitle}>
            Fill in the details to attract the right candidates for your role
          </p>

          {/* Steps */}
          <div style={styles.stepsWrapper}>
            {steps.map((step, i) => (
              <div key={step.num} style={styles.stepItem}>
                <div style={{
                  ...styles.stepCircle,
                  background: currentStep >= step.num
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.1)',
                  border: currentStep >= step.num
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.2)',
                  boxShadow: currentStep === step.num
                    ? '0 4px 15px rgba(99,102,241,0.5)'
                    : 'none'
                }}>
                  {currentStep > step.num ? '✓' : step.icon}
                </div>
                <div style={styles.stepInfo}>
                  <div style={{
                    ...styles.stepLabel,
                    color: currentStep >= step.num
                      ? 'white'
                      : 'rgba(255,255,255,0.45)'
                  }}>
                    {step.label}
                  </div>
                  <div style={styles.stepNum}>Step {step.num} of 3</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    background: currentStep > step.num
                      ? '#6366f1'
                      : 'rgba(255,255,255,0.1)'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div style={styles.previewCard}>
            <div style={styles.previewTitle}>📋 Live Preview</div>
            <div style={styles.previewContent}>
              <div style={styles.previewJobTitle}>
                {formData.title || 'Job Title'}
              </div>
              <div style={styles.previewCompany}>
                🏢 {formData.company || 'Company Name'}
              </div>
              {formData.location && (
                <div style={styles.previewMeta}>📍 {formData.location}</div>
              )}
              {formData.jobType && (
                <span style={styles.previewBadge}>{formData.jobType}</span>
              )}
              {formData.skills && (
                <div style={styles.previewSkills}>
                  {formData.skills.split(',').slice(0, 3).map((s, i) => (
                    s.trim() && (
                      <span key={i} style={styles.previewSkill} className='preview-tag'>
                        {s.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>💡</div>
            <div>
              <div style={styles.tipTitle}>Pro Tip</div>
              <div style={styles.tipText}>
                {currentStep === 1 && 'Be specific in your job title and description to attract the right candidates.'}
                {currentStep === 2 && 'Showing salary range increases applications by 30%.'}
                {currentStep === 3 && 'Adding required skills helps candidates self-qualify before applying.'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form ── */}
        <div style={styles.formArea}>

          {/* Progress Bar */}
          <div style={styles.progressWrapper}>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: `${(currentStep / 3) * 100}%`
              }} />
            </div>
            <span style={styles.progressText}>
              Step {currentStep} of 3
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Basic Info ── */}
            {currentStep === 1 && (
              <div style={styles.stepContent}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>📋</div>
                  <div>
                    <h2 style={styles.stepTitle}>Basic Information</h2>
                    <p style={styles.stepSubtitle}>
                      Tell us about the role and your company
                    </p>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Job Title <span style={styles.required}>*</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      placeholder='e.g. Senior React Developer'
                      style={styles.input}
                      className='postjob-input'
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Company Name <span style={styles.required}>*</span>
                    </label>
                    <input
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleChange}
                      placeholder='e.g. Tech Corp Pvt Ltd'
                      style={styles.input}
                      className='postjob-input'
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Location <span style={styles.required}>*</span>
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    placeholder='e.g. Chennai, Tamil Nadu or Remote'
                    style={styles.input}
                    className='postjob-input'
                    required
                  />
                </div>

                {/* Job Type Cards */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Job Type <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.typeGrid}>
                    {jobTypes.map((type) => (
                      <div
                        key={type.value}
                        className='job-type-card'
                        onClick={() => setFormData({ ...formData, jobType: type.value })}
                        style={{
                          ...styles.typeCard,
                          borderColor: formData.jobType === type.value ? '#6366f1' : '#e2e8f0',
                          background: formData.jobType === type.value ? '#eef2ff' : 'white',
                          boxShadow: formData.jobType === type.value
                            ? '0 4px 15px rgba(99,102,241,0.15)'
                            : 'none'
                        }}
                      >
                        <span style={styles.typeIcon}>{type.icon}</span>
                        <span style={{
                          ...styles.typeLabel,
                          color: formData.jobType === type.value ? '#6366f1' : '#374151'
                        }}>
                          {type.label}
                        </span>
                        <span style={styles.typeDesc}>{type.desc}</span>
                        {formData.jobType === type.value && (
                          <div style={styles.typeCheck}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Job Description <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Describe the role, key responsibilities, what the candidate will do daily, team structure, and growth opportunities...'
                    style={{ ...styles.input, ...styles.textarea }}
                    className='postjob-input'
                    rows={6}
                    required
                  />
                  <div style={styles.charCount}>
                    {formData.description.length} characters
                    {formData.description.length < 100 && (
                      <span style={{ color: '#ef4444' }}> (min 100 recommended)</span>
                    )}
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => {
                    if (!formData.title || !formData.company || !formData.location || !formData.description) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  style={styles.nextBtn}
                  className='step-btn'
                >
                  Continue to Salary & Experience →
                </button>
              </div>
            )}

            {/* ── Step 2: Salary & Experience ── */}
            {currentStep === 2 && (
              <div style={styles.stepContent}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>💰</div>
                  <div>
                    <h2 style={styles.stepTitle}>Salary & Experience</h2>
                    <p style={styles.stepSubtitle}>
                      Set compensation and required experience level
                    </p>
                  </div>
                </div>

                {/* Salary */}
                <div style={styles.salaryWrapper}>
                  <div style={styles.salaryHeader}>
                    <label style={styles.label}>💰 Salary Range (₹ per month)</label>
                    <span style={styles.salaryOptional}>Optional but recommended</span>
                  </div>
                  <div style={styles.salaryInputs}>
                    <div style={styles.salaryInput}>
                      <span style={styles.salaryPrefix}>₹</span>
                      <input
                        type='number'
                        name='salaryMin'
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder='Min e.g. 50000'
                        style={{ ...styles.input, paddingLeft: '36px' }}
                        className='postjob-input'
                      />
                    </div>
                    <div style={styles.salaryDivider}>to</div>
                    <div style={styles.salaryInput}>
                      <span style={styles.salaryPrefix}>₹</span>
                      <input
                        type='number'
                        name='salaryMax'
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder='Max e.g. 80000'
                        style={{ ...styles.input, paddingLeft: '36px' }}
                        className='postjob-input'
                      />
                    </div>
                  </div>
                  <div style={styles.salaryHint}>
                    💡 Jobs with salary ranges get 40% more applicants
                  </div>
                </div>

                {/* Experience Cards */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Experience Required <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.expGrid}>
                    {experienceLevels.map((exp) => (
                      <div
                        key={exp.value}
                        className='exp-card'
                        onClick={() => setFormData({ ...formData, experience: exp.value })}
                        style={{
                          ...styles.expCard,
                          borderColor: formData.experience === exp.value ? '#6366f1' : '#e2e8f0',
                          background: formData.experience === exp.value ? '#eef2ff' : 'white',
                          boxShadow: formData.experience === exp.value
                            ? '0 4px 15px rgba(99,102,241,0.15)'
                            : 'none'
                        }}
                      >
                        <span style={styles.expIcon}>{exp.icon}</span>
                        <span style={{
                          ...styles.expLabel,
                          color: formData.experience === exp.value ? '#6366f1' : '#374151'
                        }}>
                          {exp.label}
                        </span>
                        <span style={styles.expDesc}>{exp.desc}</span>
                        {formData.experience === exp.value && (
                          <div style={styles.expCheck}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Education Qualification</label>
                  <input
                    type='text'
                    name='education'
                    value={formData.education}
                    onChange={handleChange}
                    placeholder='e.g. B.Tech in Computer Science, MBA, Any Graduate'
                    style={styles.input}
                    className='postjob-input'
                  />
                </div>

                <div style={styles.navBtns}>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(1)}
                    style={styles.backBtn}
                    className='step-btn'
                  >
                    ← Back
                  </button>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(3)}
                    style={styles.nextBtn}
                    className='step-btn'
                  >
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Additional Details ── */}
            {currentStep === 3 && (
              <div style={styles.stepContent}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>⚡</div>
                  <div>
                    <h2 style={styles.stepTitle}>Additional Details</h2>
                    <p style={styles.stepSubtitle}>
                      Add skills, openings and deadline
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Required Skills
                    <span style={styles.hint}> (comma separated)</span>
                  </label>
                  <input
                    type='text'
                    name='skills'
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder='e.g. React, Node.js, MongoDB, TypeScript'
                    style={styles.input}
                    className='postjob-input'
                  />
                  {/* Skills Preview */}
                  {formData.skills && (
                    <div style={styles.skillsPreview}>
                      {formData.skills.split(',').map((s, i) => (
                        s.trim() && (
                          <span key={i} style={styles.skillPreviewTag}>
                            ⚡ {s.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Number of Openings</label>
                    <div style={styles.openingsWrapper}>
                      <button
                        type='button'
                        style={styles.openingBtn}
                        onClick={() => setFormData({
                          ...formData,
                          openings: Math.max(1, formData.openings - 1)
                        })}
                      >−</button>
                      <input
                        type='number'
                        name='openings'
                        value={formData.openings}
                        onChange={handleChange}
                        min='1'
                        style={{ ...styles.input, textAlign: 'center', width: '80px' }}
                        className='postjob-input'
                      />
                      <button
                        type='button'
                        style={styles.openingBtn}
                        onClick={() => setFormData({
                          ...formData,
                          openings: formData.openings + 1
                        })}
                      >+</button>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Application Deadline</label>
                    <input
                      type='date'
                      name='deadline'
                      value={formData.deadline}
                      onChange={handleChange}
                      style={styles.input}
                      className='postjob-input'
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Final Summary */}
                <div style={styles.summaryCard}>
                  <div style={styles.summaryTitle}>📋 Job Summary</div>
                  <div style={styles.summaryGrid}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Position</span>
                      <span style={styles.summaryValue}>{formData.title || '—'}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Company</span>
                      <span style={styles.summaryValue}>{formData.company || '—'}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Location</span>
                      <span style={styles.summaryValue}>{formData.location || '—'}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Job Type</span>
                      <span style={styles.summaryValue}>{formData.jobType}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Experience</span>
                      <span style={styles.summaryValue}>{formData.experience}</span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Openings</span>
                      <span style={styles.summaryValue}>{formData.openings}</span>
                    </div>
                    {(formData.salaryMin || formData.salaryMax) && (
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Salary</span>
                        <span style={styles.summaryValue}>
                          ₹{formData.salaryMin || '0'} - ₹{formData.salaryMax || '0'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.navBtns}>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(2)}
                    style={styles.backBtn}
                    className='step-btn'
                  >
                    ← Back
                  </button>
                  <button
                    type='submit'
                    style={styles.submitBtn}
                    className='submit-btn'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                          marginRight: '8px',
                          verticalAlign: 'middle'
                        }} />
                        Publishing Job...
                      </>
                    ) : (
                      '🚀 Publish Job Now'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8faff',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  layout: {
    display: 'flex',
    minHeight: '100vh'
  },

  // ── Sidebar ──
  sidebar: {
    width: '320px',
    flexShrink: 0,
    background: 'linear-gradient(160deg, #0a0f1e 0%, #1a1040 60%, #0d1a3a 100%)',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto'
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none'
  },
  sidebarLogoIcon: { fontSize: '24px' },
  sidebarLogoText: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'white'
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.3',
    letterSpacing: '-0.3px'
  },
  sidebarSubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: '1.6',
    marginTop: '-16px'
  },
  stepsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    position: 'relative',
    paddingBottom: '20px'
  },
  stepCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
    color: 'white',
    transition: 'all 0.3s'
  },
  stepInfo: {
    flex: '1'
  },
  stepLabel: {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '2px',
    transition: 'color 0.3s'
  },
  stepNum: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500'
  },
  stepLine: {
    position: 'absolute',
    left: '21px',
    top: '44px',
    width: '2px',
    height: '20px',
    transition: 'background 0.3s'
  },
  previewCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    padding: '16px'
  },
  previewTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  previewJobTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.3'
  },
  previewCompany: {
    fontSize: '13px',
    color: '#818cf8',
    fontWeight: '500'
  },
  previewMeta: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)'
  },
  previewBadge: {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.2)',
    color: '#818cf8',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  previewSkills: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '4px'
  },
  previewSkill: {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.6)',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500'
  },
  tipCard: {
    background: 'rgba(99,102,241,0.15)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  tipIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  tipTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#818cf8',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tipText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6'
  },

  // ── Form Area ──
  formArea: {
    flex: '1',
    padding: '40px 48px',
    overflowY: 'auto'
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '36px'
  },
  progressTrack: {
    flex: '1',
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: '10px',
    transition: 'width 0.5s ease'
  },
  progressText: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeInUp 0.4s ease'
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f1f5f9'
  },
  stepHeaderIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    border: '1px solid #c7d2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
    letterSpacing: '-0.3px'
  },
  stepSubtitle: {
    fontSize: '14px',
    color: '#64748b'
  },
  formRow: {
    display: 'flex',
    gap: '20px'
  },
  formGroup: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151'
  },
  required: {
    color: '#ef4444'
  },
  hint: {
    color: '#94a3b8',
    fontWeight: '400',
    fontSize: '13px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
    color: '#0f172a',
    fontFamily: 'inherit'
  },
  textarea: {
    resize: 'vertical',
    minHeight: '120px',
    lineHeight: '1.6'
  },
  charCount: {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'right'
  },

  // Job Type Cards
  typeGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  typeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 12px',
    borderRadius: '12px',
    border: '2px solid',
    minWidth: '90px',
    flex: '1',
    position: 'relative',
    transition: 'all 0.2s'
  },
  typeIcon: {
    fontSize: '24px',
    marginBottom: '6px'
  },
  typeLabel: {
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '2px'
  },
  typeDesc: {
    fontSize: '10px',
    color: '#94a3b8',
    textAlign: 'center'
  },
  typeCheck: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: '#6366f1',
    color: 'white',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '800'
  },

  // Experience Cards
  expGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  expCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 14px',
    borderRadius: '12px',
    border: '2px solid',
    flex: '1',
    minWidth: '100px',
    position: 'relative',
    transition: 'all 0.2s'
  },
  expIcon: {
    fontSize: '28px',
    marginBottom: '8px'
  },
  expLabel: {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '2px'
  },
  expDesc: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  expCheck: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#6366f1',
    color: 'white',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '800'
  },

  // Salary
  salaryWrapper: {
    background: '#f8faff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px'
  },
  salaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  salaryOptional: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  salaryInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  salaryInput: {
    flex: '1',
    position: 'relative'
  },
  salaryPrefix: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6366f1',
    fontWeight: '700',
    fontSize: '15px',
    zIndex: 1
  },
  salaryDivider: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '14px'
  },
  salaryHint: {
    fontSize: '12px',
    color: '#6366f1',
    marginTop: '10px',
    fontWeight: '500'
  },

  // Openings
  openingsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  openingBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    background: 'white',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6366f1',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },

  // Skills Preview
  skillsPreview: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },
  skillPreviewTag: {
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    color: '#6366f1',
    border: '1px solid #c7d2fe',
    padding: '5px 14px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '700'
  },

  // Summary
  summaryCard: {
    background: '#f8faff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px'
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '14px'
  },
  summaryGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid #f1f5f9'
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'capitalize'
  },

  // Navigation Buttons
  navBtns: {
    display: 'flex',
    gap: '12px'
  },
  backBtn: {
    padding: '14px 24px',
    background: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  nextBtn: {
    flex: '1',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
    fontFamily: 'inherit'
  },
  submitBtn: {
    flex: '1',
    padding: '15px 24px',
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(16,185,129,0.3)',
    fontFamily: 'inherit'
  }
};

export default PostJob;
