import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildATSResume } from '../utils/groq';
import { toast } from 'react-toastify';

const ResumeBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef(null);

  const {
    resumeText = '',
    atsScore = 0,
    improvements = [],
    suggestedSkills = [],
    keywordsMissing = [],
    jobTitle = ''
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [targetJob, setTargetJob] = useState(jobTitle);

  // If no data redirect back
  if (!resumeText) {
    return (
      <div style={styles.emptyPage}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); * { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>
        <div style={styles.emptyCard}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={styles.emptyTitle}>No Resume Data Found</h2>
          <p style={styles.emptyText}>
            Please analyze your resume first in the ATS Checker
          </p>
          <button onClick={() => navigate('/ats-checker')} style={styles.emptyBtn}>
            Go to ATS Checker →
          </button>
        </div>
      </div>
    );
  }

  const handleBuild = async () => {
    setLoading(true);
    try {
      const result = await buildATSResume({
        resumeText,
        atsScore,
        improvements,
        suggestedSkills,
        keywordsMissing,
        jobTitle: targetJob
      });
      setResume(result);
      toast.success('ATS Resume built successfully! 🎉');
      setTimeout(() => {
        resumeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error(error);
      toast.error('Failed to build resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume?.name || 'resume'}_ATS_Optimized.pdf`);
      toast.success('Resume downloaded! ✅');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes buildGlow {
          0%,100% { box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
          50% { box-shadow: 0 10px 35px rgba(99,102,241,0.7); }
        }
        @keyframes progressAnim {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .build-btn { transition: all 0.3s; animation: buildGlow 2s infinite; }
        .build-btn:hover:not(:disabled) { transform: translateY(-3px); animation: none; box-shadow: 0 14px 40px rgba(99,102,241,0.6) !important; }
        .build-btn:disabled { opacity: 0.7; cursor: not-allowed; animation: none; }
        .download-btn { transition: all 0.3s; }
        .download-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(16,185,129,0.4) !important; }
        .result-section { animation: fadeInUp 0.5s ease both; }
        .ai-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1);
          background-size: 200% 100%;
          animation: progressAnim 1.5s linear infinite;
          border-radius: 10px;
          width: 100%;
        }
        .pj-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; outline: none; }
      `}</style>

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/ats-checker')} style={styles.backBtn}>
            ← Back to ATS Checker
          </button>
          <h1 style={styles.title}>🚀 ATS Resume Builder</h1>
          <p style={styles.subtitle}>
            AI builds a brand new optimized resume using your feedback and missing keywords
          </p>
        </div>

        {/* Info Cards */}
        <div style={styles.infoRow}>
          {[
            { icon: '📊', label: 'Current Score', value: `${atsScore}/100`, color: atsScore >= 80 ? '#16a34a' : atsScore >= 60 ? '#f59e0b' : '#ef4444' },
            { icon: '⚡', label: 'Expected Score', value: '85-95/100', color: '#16a34a' },
            { icon: '🔑', label: 'Keywords to Add', value: `${keywordsMissing?.length || 0}`, color: '#6366f1' },
            { icon: '💡', label: 'Improvements', value: `${improvements?.length || 0}`, color: '#f59e0b' }
          ].map((item, i) => (
            <div key={i} style={styles.infoCard}>
              <span style={styles.infoIcon}>{item.icon}</span>
              <div>
                <div style={styles.infoLabel}>{item.label}</div>
                <div style={{ ...styles.infoValue, color: item.color }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Build Form */}
        {!resume && (
          <div style={styles.buildCard}>
            <h2 style={styles.buildTitle}>🎯 Customize Your New Resume</h2>
            <p style={styles.buildSubtitle}>
              Add a target job title to make the resume more specific (optional)
            </p>

            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Target Job Title (Optional)</label>
              <input
                type='text'
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder='e.g. Senior React Developer, Full Stack Engineer'
                style={styles.input}
                className='pj-input'
              />
              <p style={styles.inputHint}>
                💡 Adding a job title helps AI tailor the resume to that specific role
              </p>
            </div>

            {/* What AI will do */}
            <div style={styles.whatSection}>
              <h3 style={styles.whatTitle}>🤖 What AI will improve:</h3>
              <div style={styles.whatGrid}>
                {[
                  { icon: '🔑', title: 'Add Missing Keywords', desc: keywordsMissing?.slice(0, 3).join(', ') || 'Industry keywords' },
                  { icon: '📈', title: 'Quantify Achievements', desc: 'Add numbers & metrics' },
                  { icon: '⚡', title: 'Add Suggested Skills', desc: suggestedSkills?.slice(0, 3).join(', ') || 'Relevant skills' },
                  { icon: '✍️', title: 'Rewrite Summary', desc: 'Keyword-rich professional summary' },
                  { icon: '📊', title: 'Boost ATS Score', desc: `${atsScore} → 85-95/100` },
                  { icon: '🎯', title: 'Target Alignment', desc: targetJob ? `Optimize for ${targetJob}` : 'General optimization' }
                ].map((item, i) => (
                  <div key={i} style={styles.whatCard}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={styles.whatCardTitle}>{item.title}</div>
                      <div style={styles.whatCardDesc}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleBuild}
              disabled={loading}
              style={styles.buildBtn}
              className='build-btn'
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <span style={{
                    width: '20px', height: '20px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                  }} />
                  Building your ATS Resume...
                </span>
              ) : (
                '🚀 Build My ATS Optimized Resume'
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingCard}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <div style={{
              width: '56px', height: '56px',
              border: '4px solid #eef2ff',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h3 style={styles.loadingTitle}>Building Your ATS Resume...</h3>
            <p style={styles.loadingSubtitle}>
              AI is analyzing your resume and creating an optimized version
            </p>
            <div style={styles.loadingBar}>
              <div className='ai-bar-fill' />
            </div>
            <div style={styles.loadingSteps}>
              {[
                '📄 Reading your existing resume',
                '🔑 Adding missing keywords',
                '📈 Quantifying achievements',
                '⚡ Adding suggested skills',
                '✨ Finalizing your new resume'
              ].map((step, i) => (
                <div key={i} style={styles.loadingStep}>
                  <span style={{ animation: `pulse 1.5s infinite`, animationDelay: `${i * 0.3}s` }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Result */}
        {resume && !loading && (
          <div className='result-section'>

            {/* Score Banner */}
            <div style={styles.scoreBanner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '36px' }}>🎉</span>
                <div>
                  <h3 style={styles.scoreBannerTitle}>Your ATS Optimized Resume is Ready!</h3>
                  <p style={styles.scoreBannerSubtitle}>
                    ATS Score improved from {atsScore} → {resume.atsScore}/100
                  </p>
                </div>
              </div>
              <div style={styles.scoreBox}>
                <span style={styles.scoreOld}>{atsScore}</span>
                <span style={styles.scoreArrow}>→</span>
                <span style={styles.scoreNew}>{resume.atsScore}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionRow}>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={styles.downloadBtn}
                className='download-btn'
              >
                {downloading ? '⏳ Preparing...' : '📥 Download PDF'}
              </button>
              <button onClick={() => setResume(null)} style={styles.rebuildBtn}>
                🔄 Rebuild Resume
              </button>
              <button onClick={() => navigate('/ats-checker')} style={styles.backToAtsBtn}>
                ← ATS Checker
              </button>
            </div>

            {/* Resume Paper */}
            <div ref={resumeRef} style={styles.resumePaper}>

              {/* Header */}
              <div style={rStyles.header}>
                <h1 style={rStyles.name}>{resume.name}</h1>
                <div style={rStyles.contactRow}>
                  {resume.email && <span style={rStyles.contact}>✉ {resume.email}</span>}
                  {resume.phone && <span style={rStyles.contact}>📞 {resume.phone}</span>}
                  {resume.location && <span style={rStyles.contact}>📍 {resume.location}</span>}
                  {resume.linkedin && <span style={rStyles.contact}>💼 {resume.linkedin}</span>}
                  {resume.github && <span style={rStyles.contact}>🔗 {resume.github}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.summary && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>PROFESSIONAL SUMMARY</div>
                  <div style={rStyles.divider} />
                  <p style={rStyles.summary}>{resume.summary}</p>
                </div>
              )}

              {/* Skills */}
              {resume.skills && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>SKILLS</div>
                  <div style={rStyles.divider} />
                  {resume.skills.technical?.length > 0 && (
                    <div style={rStyles.skillRow}>
                      <span style={rStyles.skillLabel}>Technical: </span>
                      <span style={rStyles.skillValue}>{resume.skills.technical.join(' • ')}</span>
                    </div>
                  )}
                  {resume.skills.tools?.length > 0 && (
                    <div style={rStyles.skillRow}>
                      <span style={rStyles.skillLabel}>Tools: </span>
                      <span style={rStyles.skillValue}>{resume.skills.tools.join(' • ')}</span>
                    </div>
                  )}
                  {resume.skills.soft?.length > 0 && (
                    <div style={rStyles.skillRow}>
                      <span style={rStyles.skillLabel}>Soft Skills: </span>
                      <span style={rStyles.skillValue}>{resume.skills.soft.join(' • ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {resume.experience?.length > 0 && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>WORK EXPERIENCE</div>
                  <div style={rStyles.divider} />
                  {resume.experience.map((exp, i) => (
                    <div key={i} style={rStyles.item}>
                      <div style={rStyles.itemHeader}>
                        <div>
                          <div style={rStyles.itemTitle}>{exp.title}</div>
                          <div style={rStyles.itemSub}>{exp.company}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={rStyles.itemDuration}>{exp.duration}</div>
                          {exp.location && <div style={rStyles.itemLocation}>{exp.location}</div>}
                        </div>
                      </div>
                      {exp.points?.map((point, j) => (
                        <div key={j} style={rStyles.bullet}>
                          <span style={rStyles.bulletDot}>▸</span>
                          <span style={rStyles.bulletText}>{point}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resume.projects?.length > 0 && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>PROJECTS</div>
                  <div style={rStyles.divider} />
                  {resume.projects.map((proj, i) => (
                    <div key={i} style={rStyles.item}>
                      <div style={rStyles.itemHeader}>
                        <div style={rStyles.itemTitle}>{proj.name}</div>
                        <span style={rStyles.techBadge}>{proj.tech}</span>
                      </div>
                      {proj.points?.map((point, j) => (
                        <div key={j} style={rStyles.bullet}>
                          <span style={rStyles.bulletDot}>▸</span>
                          <span style={rStyles.bulletText}>{point}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resume.education?.length > 0 && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>EDUCATION</div>
                  <div style={rStyles.divider} />
                  {resume.education.map((edu, i) => (
                    <div key={i} style={rStyles.item}>
                      <div style={rStyles.itemHeader}>
                        <div>
                          <div style={rStyles.itemTitle}>{edu.degree}</div>
                          <div style={rStyles.itemSub}>{edu.institution}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={rStyles.itemDuration}>{edu.year}</div>
                          {edu.gpa && <div style={rStyles.itemLocation}>GPA: {edu.gpa}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {resume.certifications?.length > 0 && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>CERTIFICATIONS</div>
                  <div style={rStyles.divider} />
                  {resume.certifications.map((cert, i) => (
                    <div key={i} style={rStyles.bullet}>
                      <span style={rStyles.bulletDot}>▸</span>
                      <span style={rStyles.bulletText}>{cert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages */}
              {resume.languages?.length > 0 && (
                <div style={rStyles.section}>
                  <div style={rStyles.sectionTitle}>LANGUAGES</div>
                  <div style={rStyles.divider} />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {resume.languages.map((lang, i) => (
                      <span key={i} style={rStyles.langBadge}>{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Watermark */}
              <div style={rStyles.watermark}>
                ✨ ATS Score: {resume.atsScore}/100 — Built with JobPortal AI
              </div>
            </div>

            {/* Bottom Download */}
            <div style={styles.bottomRow}>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={styles.downloadBtnLarge}
                className='download-btn'
              >
                {downloading ? '⏳ Preparing PDF...' : '📥 Download ATS Resume as PDF'}
              </button>
              <button onClick={() => setResume(null)} style={styles.rebuildBtnLarge}>
                🔄 Build Another Version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Resume Paper Styles ───────────────────────────────────
const rStyles = {
  header: {
    borderBottom: '3px solid #1e293b',
    paddingBottom: '16px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  name: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
    fontFamily: 'Inter, sans-serif'
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center'
  },
  contact: { fontSize: '12px', color: '#475569', fontWeight: '500' },
  section: { marginBottom: '18px' },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: '1.5px',
    marginBottom: '4px'
  },
  divider: { height: '2px', backgroundColor: '#1e293b', marginBottom: '10px' },
  summary: { fontSize: '13px', color: '#374151', lineHeight: '1.6' },
  skillRow: { fontSize: '13px', lineHeight: '1.8' },
  skillLabel: { fontWeight: '700', color: '#1e293b' },
  skillValue: { color: '#374151' },
  item: { marginBottom: '14px' },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px'
  },
  itemTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
  itemSub: { fontSize: '13px', color: '#6366f1', fontWeight: '600' },
  itemDuration: { fontSize: '12px', fontWeight: '600', color: '#374151' },
  itemLocation: { fontSize: '12px', color: '#64748b' },
  bullet: { display: 'flex', gap: '8px', marginBottom: '3px', alignItems: 'flex-start' },
  bulletDot: { color: '#6366f1', fontWeight: '700', fontSize: '12px', flexShrink: 0, marginTop: '1px' },
  bulletText: { fontSize: '12px', color: '#374151', lineHeight: '1.6' },
  techBadge: {
    fontSize: '11px',
    background: '#eef2ff',
    color: '#6366f1',
    padding: '2px 10px',
    borderRadius: '20px',
    fontWeight: '600'
  },
  langBadge: {
    background: '#f1f5f9',
    color: '#374151',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  watermark: {
    marginTop: '20px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'center',
    fontSize: '11px',
    color: '#94a3b8'
  }
};

// ── Page Styles ───────────────────────────────────────────
const styles = {
  page: { backgroundColor: '#f8faff', minHeight: '100vh' },
  container: { maxWidth: '950px', margin: '0 auto', padding: '36px 24px 60px' },
  header: { marginBottom: '28px' },
  backBtn: {
    background: 'none', border: 'none', color: '#6366f1',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    marginBottom: '12px', padding: '0', fontFamily: 'inherit', display: 'block'
  },
  title: {
    fontSize: '32px', fontWeight: '800', color: '#0f172a',
    marginBottom: '8px', letterSpacing: '-0.5px'
  },
  subtitle: { color: '#64748b', fontSize: '15px', lineHeight: '1.6' },
  infoRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  infoCard: {
    flex: '1', minWidth: '160px',
    background: 'white', borderRadius: '14px', padding: '18px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', gap: '14px'
  },
  infoIcon: { fontSize: '28px', flexShrink: 0 },
  infoLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px' },
  infoValue: { fontSize: '20px', fontWeight: '800' },
  buildCard: {
    background: 'white', borderRadius: '20px', padding: '32px',
    boxShadow: '0 4px 20px rgba(99,102,241,0.08)', border: '1px solid #e2e8f0',
    marginBottom: '24px'
  },
  buildTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' },
  buildSubtitle: { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
  formGroup: { marginBottom: '24px' },
  inputLabel: { display: 'block', fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' },
  input: {
    width: '100%', padding: '13px 16px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', fontFamily: 'inherit', color: '#0f172a',
    backgroundColor: '#fafafa', transition: 'all 0.2s'
  },
  inputHint: { fontSize: '12px', color: '#6366f1', marginTop: '6px' },
  whatSection: {
    background: '#f8faff', border: '1px solid #e2e8f0',
    borderRadius: '14px', padding: '20px', marginBottom: '24px'
  },
  whatTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' },
  whatGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  whatCard: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '10px 14px', background: 'white',
    borderRadius: '10px', border: '1px solid #e2e8f0'
  },
  whatCardTitle: { fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' },
  whatCardDesc: { fontSize: '12px', color: '#64748b' },
  buildBtn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(99,102,241,0.35)', fontFamily: 'inherit'
  },
  loadingCard: {
    background: 'white', borderRadius: '20px', padding: '48px 32px',
    textAlign: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
    border: '1px solid #e2e8f0', marginBottom: '24px'
  },
  loadingTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  loadingSubtitle: { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
  loadingBar: {
    height: '6px', backgroundColor: '#eef2ff',
    borderRadius: '10px', overflow: 'hidden', marginBottom: '24px'
  },
  loadingSteps: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' },
  loadingStep: {
    background: '#f8faff', border: '1px solid #e2e8f0',
    borderRadius: '8px', padding: '8px 14px',
    fontSize: '13px', color: '#64748b'
  },
  scoreBanner: {
    background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
    borderRadius: '16px', padding: '24px 28px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px',
    flexWrap: 'wrap', gap: '16px'
  },
  scoreBannerTitle: { fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '4px' },
  scoreBannerSubtitle: { color: 'rgba(255,255,255,0.55)', fontSize: '14px' },
  scoreBox: { display: 'flex', alignItems: 'center', gap: '10px' },
  scoreOld: { fontSize: '24px', fontWeight: '800', color: '#ef4444' },
  scoreArrow: { fontSize: '20px', color: 'rgba(255,255,255,0.5)' },
  scoreNew: { fontSize: '32px', fontWeight: '800', color: '#4ade80' },
  actionRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  downloadBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white', border: 'none', padding: '12px 24px',
    borderRadius: '10px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
    fontFamily: 'inherit'
  },
  rebuildBtn: {
    background: '#f1f5f9', color: '#64748b', border: 'none',
    padding: '12px 20px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit'
  },
  backToAtsBtn: {
    background: 'none', color: '#6366f1',
    border: '1.5px solid #c7d2fe', padding: '12px 20px',
    borderRadius: '10px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', fontFamily: 'inherit'
  },
  resumePaper: {
    background: 'white', borderRadius: '16px', padding: '48px 52px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0',
    maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif'
  },
  bottomRow: {
    display: 'flex', gap: '16px', justifyContent: 'center',
    marginTop: '28px', flexWrap: 'wrap'
  },
  downloadBtnLarge: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white', border: 'none', padding: '15px 36px',
    borderRadius: '12px', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
    fontFamily: 'inherit', transition: 'all 0.3s'
  },
  rebuildBtnLarge: {
    background: '#f1f5f9', color: '#64748b', border: 'none',
    padding: '15px 28px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit'
  },
  emptyPage: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyCard: {
    background: 'white', borderRadius: '24px', padding: '52px 48px',
    textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    maxWidth: '380px', width: '100%'
  },
  emptyTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
  emptyText: { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
  emptyBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white', border: 'none', padding: '13px 28px',
    borderRadius: '10px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', fontFamily: 'inherit'
  }
};

export default ResumeBuilder;