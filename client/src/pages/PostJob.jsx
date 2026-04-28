import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { generateJobDescription } from '../utils/groq';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatingAI, setGeneratingAI] = useState(false);
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

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      toast.error('Please enter a job title first');
      return;
    }
    if (!formData.company) {
      toast.error('Please enter a company name first');
      return;
    }
    setGeneratingAI(true);
    try {
      const generated = await generateJobDescription({
        jobTitle: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        experience: formData.experience,
        skills: formData.skills,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax
      });
      setFormData({ ...formData, description: generated });
      toast.success('Job description generated! ✨');
    } catch (error) {
      toast.error('Failed to generate. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
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

  const jobTypes = [
    { value: 'full-time', label: 'Full Time', icon: '🏢' },
    { value: 'part-time', label: 'Part Time', icon: '⏰' },
    { value: 'remote', label: 'Remote', icon: '🌐' },
    { value: 'internship', label: 'Internship', icon: '🎓' },
    { value: 'contract', label: 'Contract', icon: '📝' }
  ];

  const experienceLevels = [
    { value: 'fresher', label: 'Fresher', icon: '🌱' },
    { value: '1-2 years', label: '1-2 Years', icon: '📈' },
    { value: '2-5 years', label: '2-5 Years', icon: '💼' },
    { value: '5+ years', label: '5+ Years', icon: '🏆' }
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        @keyframes progressAnim {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .pj-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
          background: #fafafa;
          color: #0f172a;
          font-family: inherit;
        }
        .pj-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          outline: none;
          background: white;
        }
        .pj-input::placeholder { color: #c4cad4; }
        .pj-textarea {
          resize: vertical;
          min-height: 200px;
          line-height: 1.7;
        }

        .type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 10px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          flex: 1;
          min-width: 85px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          position: relative;
        }
        .type-card:hover {
          border-color: #6366f1;
          background: #f5f3ff;
          transform: translateY(-2px);
        }
        .type-card.selected {
          border-color: #6366f1;
          background: #eef2ff;
          box-shadow: 0 4px 15px rgba(99,102,241,0.15);
        }

        .exp-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          flex: 1;
          min-width: 100px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          position: relative;
        }
        .exp-card:hover {
          border-color: #6366f1;
          background: #f5f3ff;
          transform: translateY(-2px);
        }
        .exp-card.selected {
          border-color: #6366f1;
          background: #eef2ff;
          box-shadow: 0 4px 15px rgba(99,102,241,0.15);
        }

        .check-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          background: #6366f1;
          color: white;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
        }

        .ai-btn {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(139,92,246,0.4);
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .ai-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139,92,246,0.5);
        }
        .ai-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .next-btn {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(99,102,241,0.3);
          font-family: inherit;
          transition: all 0.2s;
        }
        .next-btn:hover { transform: translateY(-2px); }

        .back-btn {
          padding: 14px 24px;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .back-btn:hover { background: #e2e8f0; }

        .submit-btn {
          flex: 1;
          padding: 15px 24px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(16,185,129,0.3);
          font-family: inherit;
          transition: all 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(16,185,129,0.4);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .opening-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          color: #6366f1;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .opening-btn:hover { background: #eef2ff; border-color: #6366f1; }

        .skill-tag {
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          color: #6366f1;
          border: 1px solid #c7d2fe;
          padding: 5px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          animation: fadeInUp 0.3s ease;
        }

        .step-content { animation: fadeInUp 0.4s ease; }

        .ai-loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed);
          background-size: 200% 100%;
          animation: progressAnim 1.5s linear infinite;
          border-radius: 10px;
          width: 100%;
        }
      `}</style>

      {/* ── Top Reference Banner ── */}
      {(formData.title || formData.company) && (
        <div style={styles.topBanner}>
          <div style={styles.topBannerInner}>
            <div style={styles.topBannerLeft}>
              <div style={styles.topBannerLogoBox}>
                {formData.company?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={styles.topBannerTitle}>
                  {formData.title || 'Job Title'}
                </div>
                <div style={styles.topBannerMeta}>
                  <span style={styles.topBannerCompany}>
                    🏢 {formData.company || 'Company Name'}
                  </span>
                  {formData.location && (
                    <span style={styles.topBannerDot}>•</span>
                  )}
                  {formData.location && (
                    <span style={styles.topBannerMetaItem}>
                      📍 {formData.location}
                    </span>
                  )}
                  {formData.jobType && (
                    <>
                      <span style={styles.topBannerDot}>•</span>
                      <span style={styles.topBannerBadge}>
                        {formData.jobType}
                      </span>
                    </>
                  )}
                  {formData.experience && (
                    <>
                      <span style={styles.topBannerDot}>•</span>
                      <span style={styles.topBannerMetaItem}>
                        💼 {formData.experience}
                      </span>
                    </>
                  )}
                  {(formData.salaryMin || formData.salaryMax) && (
                    <>
                      <span style={styles.topBannerDot}>•</span>
                      <span style={styles.topBannerMetaItem}>
                        💰 ₹{formData.salaryMin || '0'} - ₹{formData.salaryMax || '0'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={styles.topBannerRight}>
              {formData.skills && (
                <div style={styles.topBannerSkills}>
                  {formData.skills.split(',').slice(0, 4).map((s, i) => (
                    s.trim() && (
                      <span key={i} style={styles.topBannerSkill}>
                        {s.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
              <div style={styles.topBannerStatus}>
                <span style={styles.topBannerDraft}>
                  ✏️ Draft — Step {currentStep} of 3
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.layout}>

        {/* ── Left Sidebar ── */}
        <div style={styles.sidebar}>
          <Link to='/' style={styles.sidebarLogo}>
            <span>💼</span>
            <span style={styles.sidebarLogoText}>JobPortal</span>
          </Link>

          <div>
            <h2 style={styles.sidebarTitle}>Post a New Job</h2>
            <p style={styles.sidebarSubtitle}>
              Fill in the details to attract the right candidates
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { num: 1, label: 'Basic Info', icon: '📋' },
              { num: 2, label: 'Salary & Exp', icon: '💰' },
              { num: 3, label: 'Details', icon: '⚡' }
            ].map((step, i, arr) => (
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
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: currentStep >= step.num
                      ? 'white' : 'rgba(255,255,255,0.4)',
                    marginBottom: '2px'
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>
                    Step {step.num} of 3
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '19px',
                    top: '40px',
                    width: '2px',
                    height: '18px',
                    background: currentStep > step.num
                      ? '#6366f1' : 'rgba(255,255,255,0.1)'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div style={styles.previewCard}>
            <div style={styles.previewLabel}>📋 Live Preview</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
                {formData.title || 'Job Title'}
              </div>
              <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>
                🏢 {formData.company || 'Company Name'}
              </div>
              {formData.location && (
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  📍 {formData.location}
                </div>
              )}
              {formData.jobType && (
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(99,102,241,0.2)',
                  color: '#818cf8',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  width: 'fit-content'
                }}>
                  {formData.jobType}
                </span>
              )}
              {formData.skills && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {formData.skills.split(',').slice(0, 3).map((s, i) => (
                    s.trim() && (
                      <span key={i} style={{
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.55)',
                        padding: '2px 7px',
                        borderRadius: '20px',
                        fontSize: '10px'
                      }}>
                        {s.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Highlight */}
          <div style={styles.aiHighlight}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#c4b5fd', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Powered
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Enter title & company then click Generate with AI to write a professional description
              </div>
            </div>
          </div>

          {/* Tip */}
          <div style={styles.tipCard}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Pro Tip
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                {currentStep === 1 && 'Use AI to generate a professional job description in seconds!'}
                {currentStep === 2 && 'Showing salary range increases applications by 30%.'}
                {currentStep === 3 && 'Adding skills helps candidates self-qualify before applying.'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form Area ── */}
        <div style={styles.formArea}>

          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '10px',
                width: `${(currentStep / 3) * 100}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Step {currentStep} of 3
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Step 1 ── */}
            {currentStep === 1 && (
              <div className='step-content' style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>📋</div>
                  <div>
                    <h2 style={styles.stepTitle}>Basic Information</h2>
                    <p style={styles.stepSubtitle}>Tell us about the role and your company</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={styles.label}>Job Title <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type='text' name='title' value={formData.title}
                      onChange={handleChange}
                      placeholder='e.g. Senior React Developer'
                      className='pj-input' required
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={styles.label}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type='text' name='company' value={formData.company}
                      onChange={handleChange}
                      placeholder='e.g. Tech Corp Pvt Ltd'
                      className='pj-input' required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.label}>Location <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type='text' name='location' value={formData.location}
                    onChange={handleChange}
                    placeholder='e.g. Chennai, Tamil Nadu or Remote'
                    className='pj-input' required
                  />
                </div>

                {/* Job Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.label}>Job Type <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {jobTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`type-card ${formData.jobType === type.value ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, jobType: type.value })}
                      >
                        <span style={{ fontSize: '22px', marginBottom: '5px' }}>{type.icon}</span>
                        <span style={{
                          fontSize: '12px', fontWeight: '700',
                          color: formData.jobType === type.value ? '#6366f1' : '#374151'
                        }}>{type.label}</span>
                        {formData.jobType === type.value && <div className='check-badge'>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={styles.label}>
                      Job Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <button
                      type='button'
                      onClick={handleGenerateDescription}
                      disabled={generatingAI}
                      className='ai-btn'
                    >
                      {generatingAI ? (
                        <>
                          <span style={{
                            width: '13px', height: '13px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                            display: 'inline-block'
                          }} />
                          Generating...
                        </>
                      ) : (
                        <>✨ Generate with AI</>
                      )}
                    </button>
                  </div>

                  {/* AI Reference Box — shows what AI is using */}
                  {(formData.title || formData.company) && (
                    <div style={styles.aiRefBox}>
                      <div style={styles.aiRefTitle}>
                        🤖 AI will generate based on:
                      </div>
                      <div style={styles.aiRefItems}>
                        {formData.title && (
                          <span style={styles.aiRefItem}>
                            📌 {formData.title}
                          </span>
                        )}
                        {formData.company && (
                          <span style={styles.aiRefItem}>
                            🏢 {formData.company}
                          </span>
                        )}
                        {formData.location && (
                          <span style={styles.aiRefItem}>
                            📍 {formData.location}
                          </span>
                        )}
                        <span style={styles.aiRefItem}>
                          💼 {formData.jobType}
                        </span>
                        <span style={styles.aiRefItem}>
                          🎯 {formData.experience}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Loading State */}
                  {generatingAI && (
                    <div style={styles.aiLoadingBox}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '20px' }}>🤖</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#7c3aed', animation: 'pulse 1.5s infinite' }}>
                            Writing job description for "{formData.title}"...
                          </div>
                          <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '2px' }}>
                            at {formData.company} — This takes a few seconds
                          </div>
                        </div>
                      </div>
                      <div style={{ height: '5px', backgroundColor: '#ede9fe', borderRadius: '10px', overflow: 'hidden' }}>
                        <div className='ai-loading-bar-fill' />
                      </div>
                    </div>
                  )}

                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Write your job description here OR click "✨ Generate with AI" above to auto-generate...'
                    className='pj-input pj-textarea'
                    rows={8}
                    required
                    disabled={generatingAI}
                    style={{ opacity: generatingAI ? 0.6 : 1 }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {formData.description.length} characters
                      {formData.description.length > 0 && formData.description.length < 100 && (
                        <span style={{ color: '#ef4444' }}> (min 100 recommended)</span>
                      )}
                    </span>
                    {formData.description && !generatingAI && (
                      <button
                        type='button'
                        onClick={handleGenerateDescription}
                        style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        🔄 Regenerate
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type='button'
                  className='next-btn'
                  onClick={() => {
                    if (!formData.title || !formData.company || !formData.location || !formData.description) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                >
                  Continue to Salary & Experience →
                </button>
              </div>
            )}

            {/* ── Step 2 ── */}
            {currentStep === 2 && (
              <div className='step-content' style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>💰</div>
                  <div>
                    <h2 style={styles.stepTitle}>Salary & Experience</h2>
                    <p style={styles.stepSubtitle}>Set compensation and required experience level</p>
                  </div>
                </div>

                {/* Salary */}
                <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={styles.label}>💰 Salary Range (₹ per month)</label>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Optional but recommended</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', fontWeight: '700', zIndex: 1 }}>₹</span>
                      <input
                        type='number' name='salaryMin' value={formData.salaryMin}
                        onChange={handleChange} placeholder='Min e.g. 50000'
                        className='pj-input' style={{ paddingLeft: '34px' }}
                      />
                    </div>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>to</span>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', fontWeight: '700', zIndex: 1 }}>₹</span>
                      <input
                        type='number' name='salaryMax' value={formData.salaryMax}
                        onChange={handleChange} placeholder='Max e.g. 80000'
                        className='pj-input' style={{ paddingLeft: '34px' }}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '10px', fontWeight: '500' }}>
                    💡 Jobs with salary ranges get 40% more applicants
                  </p>
                </div>

                {/* Experience */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.label}>Experience Required <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {experienceLevels.map((exp) => (
                      <div
                        key={exp.value}
                        className={`exp-card ${formData.experience === exp.value ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, experience: exp.value })}
                      >
                        <span style={{ fontSize: '26px', marginBottom: '6px' }}>{exp.icon}</span>
                        <span style={{
                          fontSize: '13px', fontWeight: '700',
                          color: formData.experience === exp.value ? '#6366f1' : '#374151'
                        }}>{exp.label}</span>
                        {formData.experience === exp.value && <div className='check-badge'>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.label}>Education Qualification</label>
                  <input
                    type='text' name='education' value={formData.education}
                    onChange={handleChange}
                    placeholder='e.g. B.Tech in Computer Science, MBA, Any Graduate'
                    className='pj-input'
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type='button' className='back-btn' onClick={() => setCurrentStep(1)}>← Back</button>
                  <button type='button' className='next-btn' onClick={() => setCurrentStep(3)}>
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {currentStep === 3 && (
              <div className='step-content' style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepHeaderIcon}>⚡</div>
                  <div>
                    <h2 style={styles.stepTitle}>Additional Details</h2>
                    <p style={styles.stepSubtitle}>Add skills, openings and deadline</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={styles.label}>
                    Required Skills <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '13px' }}>(comma separated)</span>
                  </label>
                  <input
                    type='text' name='skills' value={formData.skills}
                    onChange={handleChange}
                    placeholder='e.g. React, Node.js, MongoDB, TypeScript'
                    className='pj-input'
                  />
                  {formData.skills && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {formData.skills.split(',').map((s, i) => (
                        s.trim() && <span key={i} className='skill-tag'>⚡ {s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={styles.label}>Number of Openings</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button type='button' className='opening-btn'
                        onClick={() => setFormData({ ...formData, openings: Math.max(1, formData.openings - 1) })}>
                        −
                      </button>
                      <input
                        type='number' name='openings' value={formData.openings}
                        onChange={handleChange} min='1'
                        className='pj-input' style={{ textAlign: 'center', width: '80px' }}
                      />
                      <button type='button' className='opening-btn'
                        onClick={() => setFormData({ ...formData, openings: formData.openings + 1 })}>
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={styles.label}>Application Deadline</label>
                    <input
                      type='date' name='deadline' value={formData.deadline}
                      onChange={handleChange}
                      className='pj-input'
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Final Summary */}
                <div style={styles.summaryCard}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '14px' }}>
                    📋 Final Job Summary
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    {[
                      { label: 'Position', value: formData.title },
                      { label: 'Company', value: formData.company },
                      { label: 'Location', value: formData.location },
                      { label: 'Job Type', value: formData.jobType },
                      { label: 'Experience', value: formData.experience },
                      { label: 'Openings', value: formData.openings },
                      ...(formData.salaryMin ? [{ label: 'Salary', value: `₹${formData.salaryMin} - ₹${formData.salaryMax}` }] : [])
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{item.label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>{item.value || '—'}</span>
                      </div>
                    ))}
                  </div>
                  {formData.description && (
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        📝 Description Preview
                      </div>
                      <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                        {formData.description.slice(0, 180)}{formData.description.length > 180 ? '...' : ''}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type='button' className='back-btn' onClick={() => setCurrentStep(2)}>← Back</button>
                  <button type='submit' className='submit-btn' disabled={loading}>
                    {loading ? (
                      <>
                        <span style={{
                          display: 'inline-block', width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                          borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                          marginRight: '8px', verticalAlign: 'middle'
                        }} />
                        Publishing Job...
                      </>
                    ) : '🚀 Publish Job Now'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8faff',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },

  // ── Top Banner ──
  topBanner: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(99,102,241,0.08)'
  },
  topBannerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  topBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  topBannerLogoBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '800',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
  },
  topBannerTitle: {
    fontSize: '17px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '5px',
    letterSpacing: '-0.3px'
  },
  topBannerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  topBannerCompany: {
    fontSize: '13px',
    color: '#6366f1',
    fontWeight: '600'
  },
  topBannerDot: {
    color: '#cbd5e1',
    fontSize: '12px'
  },
  topBannerMetaItem: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  topBannerBadge: {
    background: '#eef2ff',
    color: '#6366f1',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
    border: '1px solid #c7d2fe'
  },
  topBannerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  topBannerSkills: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  topBannerSkill: {
    background: '#f8faff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600'
  },
  topBannerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  topBannerDraft: {
    background: '#fffbeb',
    color: '#b45309',
    border: '1px solid #fde68a',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },

  layout: {
    display: 'flex',
    minHeight: '100vh'
  },

  // ── Sidebar ──
  sidebar: {
    width: '290px',
    flexShrink: 0,
    background: 'linear-gradient(160deg, #0a0f1e 0%, #1a1040 60%, #0d1a3a 100%)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    position: 'sticky',
    top: '0',
    height: '100vh',
    overflowY: 'auto'
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    fontSize: '20px'
  },
  sidebarLogoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'white'
  },
  sidebarTitle: {
    fontSize: '19px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.3',
    letterSpacing: '-0.3px',
    marginBottom: '4px'
  },
  sidebarSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: '1.6'
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    paddingBottom: '18px'
  },
  stepCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
    color: 'white',
    transition: 'all 0.3s'
  },
  previewCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px'
  },
  previewLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px'
  },
  aiHighlight: {
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  tipCard: {
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },

  // ── Form ──
  formArea: {
    flex: 1,
    padding: '40px 48px',
    overflowY: 'auto'
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f1f5f9'
  },
  stepHeaderIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    border: '1px solid #c7d2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
    letterSpacing: '-0.3px'
  },
  stepSubtitle: {
    fontSize: '14px',
    color: '#64748b'
  },
  label: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151'
  },

  // AI Ref Box
  aiRefBox: {
    background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)',
    border: '1px solid #ddd6fe',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  aiRefTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#7c3aed',
    marginBottom: '8px'
  },
  aiRefItems: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  aiRefItem: {
    background: 'white',
    border: '1px solid #ddd6fe',
    color: '#6d28d9',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },

  // AI Loading
  aiLoadingBox: {
    background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)',
    border: '1px solid #ddd6fe',
    borderRadius: '12px',
    padding: '16px'
  },

  // Summary
  summaryCard: {
    background: '#f8faff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px'
  }
};

export default PostJob;