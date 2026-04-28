import { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ── Groq AI ATS Analysis ──────────────────────────────────
const analyzeWithAI = async (resumeText, jobDescription = '') => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume and provide a detailed assessment.

RESUME TEXT:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : ''}

Analyze the resume and respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "atsScore": 75,
  "scoreBreakdown": {
    "formatting": 80,
    "keywords": 70,
    "experience": 75,
    "education": 85,
    "skills": 65
  },
  "goodPoints": [
    "Clear contact information provided",
    "Strong work experience section"
  ],
  "missingSection": [
    "No LinkedIn profile URL",
    "Missing professional summary"
  ],
  "suggestedSkills": [
    "Docker",
    "AWS",
    "TypeScript"
  ],
  "improvements": [
    {
      "section": "Professional Summary",
      "issue": "Missing professional summary",
      "suggestion": "Add a 2-3 line professional summary at the top highlighting your key skills and years of experience"
    },
    {
      "section": "Work Experience",
      "issue": "Bullet points lack quantifiable achievements",
      "suggestion": "Add numbers and metrics to your achievements. Example: 'Improved app performance by 40%' instead of 'Improved app performance'"
    }
  ],
  "keywordsFound": ["React", "JavaScript", "Node.js"],
  "keywordsMissing": ["TypeScript", "Docker", "CI/CD"],
  "overallFeedback": "Your resume shows strong technical skills but needs better formatting and quantifiable achievements to pass ATS systems effectively."
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from AI');

  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ── Score Circle ──────────────────────────────────────────
const ScoreCircle = ({ score }) => {
  const color =
    score >= 80 ? '#16a34a' :
    score >= 60 ? '#f59e0b' :
    '#ef4444';

  const bg =
    score >= 80 ? '#f0fdf4' :
    score >= 60 ? '#fffbeb' :
    '#fff1f2';

  const label =
    score >= 80 ? 'Excellent' :
    score >= 60 ? 'Good' :
    score >= 40 ? 'Fair' :
    'Poor';

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ ...scoreStyles.wrapper, backgroundColor: bg }}>
      <svg width='140' height='140' viewBox='0 0 140 140'>
        <circle cx='70' cy='70' r='54' fill='none' stroke='#e2e8f0' strokeWidth='10' />
        <circle
          cx='70' cy='70' r='54'
          fill='none'
          stroke={color}
          strokeWidth='10'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          transform='rotate(-90 70 70)'
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
        <text x='70' y='65' textAnchor='middle' fontSize='28' fontWeight='800' fill={color} fontFamily='Plus Jakarta Sans, sans-serif'>
          {score}
        </text>
        <text x='70' y='84' textAnchor='middle' fontSize='11' fill='#64748b' fontFamily='Plus Jakarta Sans, sans-serif'>
          out of 100
        </text>
      </svg>
      <div style={{ ...scoreStyles.label, color }}>{label}</div>
      <div style={scoreStyles.sublabel}>ATS Score</div>
    </div>
  );
};

const scoreStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    borderRadius: '20px',
    gap: '8px'
  },
  label: { fontSize: '20px', fontWeight: '800' },
  sublabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' }
};

// ── Mini Score Bar ────────────────────────────────────────
const ScoreBar = ({ label, value }) => {
  const color =
    value >= 80 ? '#16a34a' :
    value >= 60 ? '#f59e0b' :
    '#ef4444';

  return (
    <div style={barStyles.wrapper}>
      <div style={barStyles.top}>
        <span style={barStyles.label}>{label}</span>
        <span style={{ ...barStyles.value, color }}>{value}%</span>
      </div>
      <div style={barStyles.track}>
        <div style={{
          ...barStyles.fill,
          width: `${value}%`,
          backgroundColor: color,
          transition: 'width 1.2s ease'
        }} />
      </div>
    </div>
  );
};

const barStyles = {
  wrapper: { marginBottom: '12px' },
  top: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  value: { fontSize: '13px', fontWeight: '700' },
  track: { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: '10px' }
};

// ── Main Component ────────────────────────────────────────
const ATSChecker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [resumeText, setResumeText] = useState(''); // ← stores extracted text
  const [step, setStep] = useState('upload');

  if (!user) {
    return (
      <div style={styles.loginPrompt}>
        <div style={styles.loginCard}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔒</div>
          <h2 style={styles.loginTitle}>Login Required</h2>
          <p style={styles.loginText}>Please login to use the ATS Resume Checker</p>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>
            Login to Continue →
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setFile(f);
    setFileName(f.name);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first');
      return;
    }

    setStep('analyzing');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await axios.post('/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ← Save extracted resume text for Resume Builder
      setResumeText(data.resumeText);

      setUploading(false);
      setAnalyzing(true);

      const aiResult = await analyzeWithAI(data.resumeText, jobDescription);

      setResult({
        ...aiResult,
        pages: data.pages,
        wordCount: data.wordCount
      });

      setStep('result');
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('ATS error:', error);
      toast.error(error.message || 'Failed to analyze resume');
      setStep('upload');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setJobDescription('');
    setResult(null);
    setResumeText('');
    setStep('upload');
  };

  // ← Navigate to Resume Builder with all data
  const handleBuildResume = () => {
    navigate('/resume-builder', {
      state: {
        resumeText,
        atsScore: result.atsScore,
        improvements: result.improvements,
        suggestedSkills: result.suggestedSkills,
        keywordsMissing: result.keywordsMissing,
        jobTitle: ''
      }
    });
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ats-page * { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes progressBar {
          0% { width: 0%; }
          30% { width: 40%; }
          60% { width: 70%; }
          90% { width: 90%; }
        }
        @keyframes buildGlow {
          0%,100% { box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
          50% { box-shadow: 0 8px 35px rgba(99,102,241,0.7); }
        }

        .upload-zone { transition: all 0.3s; cursor: pointer; }
        .upload-zone:hover {
          border-color: #6366f1 !important;
          background: #f5f3ff !important;
          transform: scale(1.01);
        }

        .analyze-btn { transition: all 0.3s; }
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.4) !important;
        }
        .analyze-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .result-card { animation: fadeInUp 0.5s ease both; }

        .tag-skill { transition: all 0.2s; }
        .tag-skill:hover { transform: scale(1.05); }

        .build-resume-btn {
          transition: all 0.3s;
          animation: buildGlow 2.5s ease-in-out infinite;
        }
        .build-resume-btn:hover {
          transform: translateY(-3px) scale(1.03);
          animation: none;
          box-shadow: 0 12px 40px rgba(99,102,241,0.6) !important;
        }
      `}</style>

      <div style={styles.container} className='ats-page'>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>✨ AI Powered</div>
          <h1 style={styles.heroTitle}>ATS Resume Checker</h1>
          <p style={styles.heroSubtitle}>
            Upload your resume and get instant AI-powered feedback,
            ATS score, and improvement suggestions
          </p>
          <div style={styles.heroStats}>
            {[
              { icon: '🎯', label: 'ATS Score' },
              { icon: '💡', label: 'Skill Gaps' },
              { icon: '📝', label: 'Improvements' },
              { icon: '🔑', label: 'Keywords' }
            ].map((s, i) => (
              <div key={i} style={styles.heroStat}>
                <span>{s.icon}</span>
                <span style={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        {step === 'upload' && (
          <div style={styles.uploadSection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📄 Upload Your Resume</h2>
              <p style={styles.cardSubtitle}>PDF format only — max 5MB</p>

              <input
                type='file'
                accept='.pdf'
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id='ats-upload'
              />
              <label htmlFor='ats-upload'>
                <div
                  className='upload-zone'
                  style={{
                    ...styles.uploadZone,
                    borderColor: fileName ? '#6366f1' : '#c7d2fe',
                    backgroundColor: fileName ? '#f5f3ff' : '#fafafe'
                  }}
                >
                  {fileName ? (
                    <>
                      <div style={styles.uploadIcon}>✅</div>
                      <div style={styles.uploadedName}>{fileName}</div>
                      <div style={styles.uploadedSub}>Click to change file</div>
                    </>
                  ) : (
                    <>
                      <div style={styles.uploadIcon}>📄</div>
                      <div style={styles.uploadTitle}>Click to upload your resume</div>
                      <div style={styles.uploadSub}>PDF files only — max 5MB</div>
                    </>
                  )}
                </div>
              </label>

              <div style={styles.jdSection}>
                <label style={styles.jdLabel}>
                  🎯 Target Job Description
                  <span style={styles.optional}> (Optional but recommended)</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder='Paste the job description here for a more accurate match score...'
                  style={styles.jdTextarea}
                  rows={4}
                />
                <p style={styles.jdHint}>
                  💡 Adding a job description helps AI match your resume to the specific role
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!file}
                style={styles.analyzeBtn}
                className='analyze-btn'
              >
                {!file ? '📄 Upload Resume First' : '🔍 Analyze My Resume with AI'}
              </button>
            </div>

            <div style={styles.howCard}>
              <h3 style={styles.howTitle}>How It Works</h3>
              <div style={styles.steps}>
                {[
                  { icon: '📄', step: '01', title: 'Upload PDF', desc: 'Upload your resume in PDF format' },
                  { icon: '🤖', step: '02', title: 'AI Analyzes', desc: 'Groq AI reads and scores your resume' },
                  { icon: '📊', step: '03', title: 'Get Score', desc: 'Receive ATS score out of 100' },
                  { icon: '🚀', step: '04', title: 'Build Resume', desc: 'AI builds an optimized new resume' }
                ].map((s, i) => (
                  <div key={i} style={styles.howStep}>
                    <div style={styles.howStepNum}>{s.step}</div>
                    <div style={styles.howStepIcon}>{s.icon}</div>
                    <div style={styles.howStepTitle}>{s.title}</div>
                    <div style={styles.howStepDesc}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {step === 'analyzing' && (
          <div style={styles.analyzingWrapper}>
            <div style={styles.analyzingCard}>
              <div style={{ fontSize: '52px', marginBottom: '20px' }}>🤖</div>
              <div style={{
                width: '64px', height: '64px',
                border: '5px solid #eef2ff',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 24px'
              }} />
              <h2 style={styles.analyzingTitle}>
                {uploading ? 'Extracting resume text...' : 'AI is analyzing your resume...'}
              </h2>
              <p style={styles.analyzingSubtitle}>
                {uploading ? 'Reading your PDF file' : 'Checking ATS compatibility, keywords, formatting & more'}
              </p>
              <div style={styles.progressTrack}>
                <div style={styles.progressFill} className='progress-fill' />
              </div>
              <div style={styles.analyzingSteps}>
                {[
                  { icon: '📄', label: 'Reading PDF', done: !uploading },
                  { icon: '🔍', label: 'Scanning content', done: !uploading && !analyzing },
                  { icon: '🤖', label: 'AI analyzing', done: false },
                  { icon: '📊', label: 'Generating score', done: false }
                ].map((s, i) => (
                  <div key={i} style={styles.analyzingStep}>
                    <span style={{
                      ...styles.analyzingStepIcon,
                      opacity: s.done ? 1 : 0.4,
                      animation: !s.done ? 'pulse 1.5s infinite' : 'none'
                    }}>
                      {s.done ? '✅' : s.icon}
                    </span>
                    <span style={{
                      ...styles.analyzingStepLabel,
                      color: s.done ? '#16a34a' : '#64748b'
                    }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {step === 'result' && result && (
          <div style={styles.resultsSection}>

            {/* Top Row */}
            <div style={styles.topRow}>
              <div style={{ ...styles.card, textAlign: 'center' }} className='result-card'>
                <h3 style={styles.cardTitle}>Your ATS Score</h3>
                <ScoreCircle score={result.atsScore} />
                <div style={styles.resumeStats}>
                  <div style={styles.resumeStat}>
                    <span style={styles.resumeStatVal}>{result.pages}</span>
                    <span style={styles.resumeStatLabel}>Pages</span>
                  </div>
                  <div style={styles.resumeStat}>
                    <span style={styles.resumeStatVal}>{result.wordCount}</span>
                    <span style={styles.resumeStatLabel}>Words</span>
                  </div>
                </div>
                <button onClick={handleReset} style={styles.resetBtn}>
                  🔄 Check Another Resume
                </button>
              </div>

              <div style={{ ...styles.card, flex: '2' }} className='result-card'>
                <h3 style={styles.cardTitle}>📊 Score Breakdown</h3>
                {result.scoreBreakdown && Object.entries(result.scoreBreakdown).map(([key, val]) => (
                  <ScoreBar
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={val}
                  />
                ))}
                <div style={styles.feedbackBox}>
                  <p style={styles.feedbackText}>💬 {result.overallFeedback}</p>
                </div>
              </div>
            </div>

            {/* Good & Missing */}
            <div style={styles.midRow}>
              <div style={styles.card} className='result-card'>
                <h3 style={styles.cardTitle}>✅ What's Good</h3>
                {result.goodPoints?.map((point, i) => (
                  <div key={i} style={styles.goodPoint}>
                    <span style={styles.goodIcon}>✓</span>
                    <span style={styles.goodText}>{point}</span>
                  </div>
                ))}
              </div>
              <div style={styles.card} className='result-card'>
                <h3 style={styles.cardTitle}>❌ What's Missing</h3>
                {result.missingSection?.map((item, i) => (
                  <div key={i} style={styles.missingPoint}>
                    <span style={styles.missingIcon}>✗</span>
                    <span style={styles.missingText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div style={styles.midRow}>
              <div style={styles.card} className='result-card'>
                <h3 style={styles.cardTitle}>🔑 Keywords Found</h3>
                <div style={styles.tagsWrapper}>
                  {result.keywordsFound?.map((kw, i) => (
                    <span key={i} style={styles.foundTag} className='tag-skill'>✓ {kw}</span>
                  ))}
                </div>
              </div>
              <div style={styles.card} className='result-card'>
                <h3 style={styles.cardTitle}>🔍 Keywords Missing</h3>
                <div style={styles.tagsWrapper}>
                  {result.keywordsMissing?.map((kw, i) => (
                    <span key={i} style={styles.missingTag} className='tag-skill'>+ {kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Skills */}
            <div style={styles.card} className='result-card'>
              <h3 style={styles.cardTitle}>💡 Suggested Skills to Add</h3>
              <p style={styles.cardSubtitle}>
                Based on current job market trends, consider adding these skills
              </p>
              <div style={styles.tagsWrapper}>
                {result.suggestedSkills?.map((skill, i) => (
                  <span key={i} style={styles.skillTag} className='tag-skill'>⚡ {skill}</span>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div style={styles.card} className='result-card'>
              <h3 style={styles.cardTitle}>📝 Improvement Suggestions</h3>
              <p style={styles.cardSubtitle}>
                Follow these suggestions to improve your ATS score
              </p>
              {result.improvements?.map((imp, i) => (
                <div key={i} style={styles.improvementCard}>
                  <div style={styles.impHeader}>
                    <span style={styles.impSection}>{imp.section}</span>
                    <span style={styles.impIssueBadge}>⚠️ {imp.issue}</span>
                  </div>
                  <div style={styles.impSuggestion}>
                    <span style={styles.impSugIcon}>💡</span>
                    <span style={styles.impSugText}>{imp.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── BUILD RESUME CTA ── */}
            <div style={styles.buildResumeCard} className='result-card'>
              <div style={styles.buildResumeLeft}>
                <div style={styles.buildResumeIconBox}>🚀</div>
                <div>
                  <h3 style={styles.buildResumeTitle}>
                    Build a New ATS Optimized Resume
                  </h3>
                  <p style={styles.buildResumeSubtitle}>
                    AI will create a brand new resume using your feedback,
                    missing keywords and suggested skills — ready to download as PDF
                  </p>
                  <div style={styles.buildResumeFeatures}>
                    {[
                      `🔑 Add ${result.keywordsMissing?.length || 0} missing keywords`,
                      `⚡ Add ${result.suggestedSkills?.length || 0} suggested skills`,
                      `📈 Fix ${result.improvements?.length || 0} improvements`,
                      `🎯 Score: ${result.atsScore} → 85-95`
                    ].map((f, i) => (
                      <span key={i} style={styles.buildResumeFeature}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.buildResumeRight}>
                <button
                  onClick={handleBuildResume}
                  style={styles.buildResumeBtn}
                  className='build-resume-btn'
                >
                  🚀 Build ATS Resume
                </button>
                <div style={styles.buildResumeNote}>
                  Free • AI Powered • Download PDF
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div style={styles.ctaCard}>
              <div style={styles.ctaLeft}>
                <h3 style={styles.ctaTitle}>What's Next?</h3>
                <p style={styles.ctaText}>
                  Build an optimized resume or browse matching jobs
                </p>
              </div>
              <div style={styles.ctaButtons}>
                <button
                  onClick={handleBuildResume}
                  style={styles.ctaBuildBtn}
                >
                  🚀 Build ATS Resume
                </button>
                <button onClick={handleReset} style={styles.ctaSecBtn}>
                  🔄 Check Another
                </button>
                <a href='/jobs' style={styles.ctaPriBtn}>
                  Browse Jobs →
                </a>
              </div>
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
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '36px 24px 60px'
  },
  hero: { textAlign: 'center', marginBottom: '36px' },
  heroBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '6px 18px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  heroTitle: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '12px',
    letterSpacing: '-0.5px'
  },
  heroSubtitle: {
    color: '#64748b',
    fontSize: '16px',
    maxWidth: '560px',
    margin: '0 auto 24px',
    lineHeight: '1.6'
  },
  heroStats: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    padding: '10px 18px',
    borderRadius: '50px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  heroStatLabel: { color: '#374151' },
  uploadSection: { display: 'flex', flexDirection: 'column', gap: '24px' },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(99,102,241,0.07)',
    border: '1px solid #e2e8f0'
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' },
  cardSubtitle: { fontSize: '13px', color: '#64748b', marginBottom: '20px' },
  uploadZone: {
    border: '2px dashed',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center',
    transition: 'all 0.3s',
    marginBottom: '20px',
    display: 'block'
  },
  uploadIcon: { fontSize: '48px', marginBottom: '12px' },
  uploadTitle: { fontSize: '16px', fontWeight: '700', color: '#374151', marginBottom: '6px' },
  uploadSub: { fontSize: '13px', color: '#94a3b8' },
  uploadedName: { fontSize: '15px', fontWeight: '700', color: '#6366f1', marginBottom: '6px' },
  uploadedSub: { fontSize: '13px', color: '#94a3b8' },
  jdSection: { marginBottom: '20px' },
  jdLabel: { display: 'block', fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' },
  optional: { color: '#94a3b8', fontWeight: '400', fontSize: '13px' },
  jdTextarea: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '1.6',
    color: '#374151',
    fontFamily: 'inherit'
  },
  jdHint: { fontSize: '12px', color: '#94a3b8', marginTop: '6px' },
  analyzeBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
    fontFamily: 'inherit'
  },
  howCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(99,102,241,0.07)',
    border: '1px solid #e2e8f0'
  },
  howTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', textAlign: 'center' },
  steps: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  howStep: {
    flex: '1',
    minWidth: '160px',
    textAlign: 'center',
    padding: '20px 12px',
    background: '#f8faff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0'
  },
  howStepNum: { fontSize: '12px', fontWeight: '800', color: '#6366f1', marginBottom: '8px' },
  howStepIcon: { fontSize: '32px', marginBottom: '10px' },
  howStepTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' },
  howStepDesc: { fontSize: '12px', color: '#64748b', lineHeight: '1.5' },
  analyzingWrapper: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  analyzingCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '52px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(99,102,241,0.1)',
    border: '1px solid #e2e8f0',
    maxWidth: '460px',
    width: '100%'
  },
  analyzingTitle: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  analyzingSubtitle: { color: '#64748b', fontSize: '14px', marginBottom: '28px' },
  progressTrack: {
    height: '6px',
    backgroundColor: '#eef2ff',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '28px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: '10px',
    animation: 'progressBar 4s ease-in-out infinite'
  },
  analyzingSteps: { display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' },
  analyzingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    background: '#f8faff',
    borderRadius: '10px'
  },
  analyzingStepIcon: { fontSize: '18px' },
  analyzingStepLabel: { fontSize: '14px', fontWeight: '500' },
  resultsSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  topRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' },
  midRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  resumeStats: { display: 'flex', justifyContent: 'center', gap: '24px', margin: '16px 0' },
  resumeStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  resumeStatVal: { fontSize: '22px', fontWeight: '800', color: '#6366f1' },
  resumeStatLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  resetBtn: {
    width: '100%',
    padding: '11px',
    background: '#f8faff',
    color: '#6366f1',
    border: '1.5px solid #c7d2fe',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '16px',
    fontFamily: 'inherit'
  },
  feedbackBox: {
    background: '#f8faff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '14px',
    marginTop: '16px'
  },
  feedbackText: { color: '#374151', fontSize: '14px', lineHeight: '1.6' },
  goodPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  goodIcon: { color: '#16a34a', fontWeight: '800', fontSize: '16px', flexShrink: 0 },
  goodText: { color: '#374151', fontSize: '14px', lineHeight: '1.5' },
  missingPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  missingIcon: { color: '#ef4444', fontWeight: '800', fontSize: '16px', flexShrink: 0 },
  missingText: { color: '#374151', fontSize: '14px', lineHeight: '1.5' },
  tagsWrapper: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' },
  foundTag: {
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600'
  },
  missingTag: {
    background: '#fff1f2',
    color: '#ef4444',
    border: '1px solid #fecdd3',
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600'
  },
  skillTag: {
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    color: '#6366f1',
    border: '1px solid #c7d2fe',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700'
  },
  improvementCard: {
    background: '#f8faff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px'
  },
  impHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  impSection: { fontSize: '14px', fontWeight: '800', color: '#0f172a' },
  impIssueBadge: {
    background: '#fffbeb',
    color: '#b45309',
    border: '1px solid #fde68a',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  impSuggestion: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  impSugIcon: { fontSize: '16px', flexShrink: 0 },
  impSugText: { color: '#374151', fontSize: '13px', lineHeight: '1.6' },

  // ── Build Resume Card ──
  buildResumeCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1a1040 100%)',
    borderRadius: '20px',
    padding: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    border: '1px solid rgba(99,102,241,0.3)',
    boxShadow: '0 8px 40px rgba(99,102,241,0.2)'
  },
  buildResumeLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    flex: '1'
  },
  buildResumeIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    flexShrink: 0,
    boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
  },
  buildResumeTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '8px',
    letterSpacing: '-0.3px'
  },
  buildResumeSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '13px',
    lineHeight: '1.6',
    marginBottom: '14px'
  },
  buildResumeFeatures: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  buildResumeFeature: {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  buildResumeRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  buildResumeBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '15px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 25px rgba(99,102,241,0.5)',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap'
  },
  buildResumeNote: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500'
  },

  // Bottom CTA
  ctaCard: {
    background: 'linear-gradient(135deg, #0a0f1e, #1a1040)',
    borderRadius: '20px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  ctaLeft: {},
  ctaTitle: { fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '6px' },
  ctaText: { color: 'rgba(255,255,255,0.55)', fontSize: '14px' },
  ctaButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  ctaBuildBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
  },
  ctaSecBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '11px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  ctaPriBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '11px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(16,185,129,0.4)'
  },
  loginPrompt: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '52px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(99,102,241,0.1)',
    border: '1px solid #e2e8f0',
    maxWidth: '380px'
  },
  loginTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' },
  loginText: { color: '#64748b', marginBottom: '28px', fontSize: '15px' },
  loginBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
};

export default ATSChecker;