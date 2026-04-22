import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '🔍', title: 'Smart Job Search', desc: 'Find jobs from LinkedIn, Indeed & our portal in one place' },
    { icon: '🤖', title: 'AI Cover Letter', desc: 'Generate professional cover letters instantly with AI' },
    { icon: '📊', title: 'Track Applications', desc: 'Monitor all your applications and their status in real time' },
    { icon: '🏢', title: 'Post Jobs', desc: 'Employers can post jobs and find top talent easily' }
  ];

  const stats = [
    { num: '500+', label: 'Jobs Available' },
    { num: '200+', label: 'Companies Hiring' },
    { num: '1000+', label: 'Job Seekers' },
    { num: '95%', label: 'Success Rate' }
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .home-page * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .hero-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 16px 36px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(99,102,241,0.5);
        }

        .hero-btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 16px 36px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }

        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s;
          border: 1px solid #e2e8f0;
          flex: 1;
          min-width: 200px;
          max-width: 240px;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.12);
          border-color: #c7d2fe;
        }

        .stat-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px 32px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.12);
          flex: 1;
          transition: all 0.3s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }

        .cta-btn-primary {
          background: white;
          color: #6366f1;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          display: inline-block;
        }
        .cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .cta-btn-secondary {
          background: transparent;
          color: white;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid rgba(255,255,255,0.4);
          transition: all 0.3s;
          display: inline-block;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Hero Section */}
      <div style={styles.hero} className='home-page'>
        {/* Background blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            🚀 Find Your Dream Career
          </div>
          <h1 style={styles.heroTitle}>
            The Smarter Way to<br />
            <span style={styles.heroHighlight}>Land Your Dream Job</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connecting talented professionals with amazing companies.
            Search jobs from LinkedIn, Indeed & more — all in one place.
          </p>
          <div style={styles.heroBtns}>
            <Link to='/jobs' className='hero-btn-primary'>
              Browse Jobs →
            </Link>
            {!user && (
              <Link to='/register' className='hero-btn-secondary'>
                Get Started Free
              </Link>
            )}
            {user?.role === 'employer' && (
              <Link to='/post-job' className='hero-btn-secondary'>
                Post a Job
              </Link>
            )}
            {user?.role === 'jobseeker' && (
              <Link to='/my-applications' className='hero-btn-secondary'>
                My Applications
              </Link>
            )}
          </div>

          {/* Search hint */}
          <div style={styles.searchHint}>
            <span style={styles.searchHintText}>
              Popular: </span>
            {['React Developer', 'UI/UX Designer', 'Node.js', 'Data Analyst'].map((tag) => (
              <Link
                key={tag}
                to={`/jobs?keyword=${tag}`}
                style={styles.searchTag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} className='stat-card'>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <div style={styles.sectionBadge}>Why JobPortal?</div>
        <h2 style={styles.sectionTitle}>Everything You Need to<br />Get Hired Faster</h2>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className='feature-card'>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={styles.howSection}>
        <div style={styles.sectionBadge}>How It Works</div>
        <h2 style={styles.sectionTitle}>Get Started in 3 Simple Steps</h2>
        <div style={styles.stepsGrid}>
          {[
            { step: '01', title: 'Create Account', desc: 'Sign up as a job seeker or employer in seconds' },
            { step: '02', title: 'Search & Apply', desc: 'Browse jobs and apply with AI-powered cover letters' },
            { step: '03', title: 'Get Hired', desc: 'Track your applications and land your dream job' }
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{s.step}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div style={styles.ctaSection}>
          <div style={styles.ctaBlob1} />
          <div style={styles.ctaBlob2} />
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p style={styles.ctaSubtitle}>
              Join thousands of professionals finding their dream jobs every day
            </p>
            <div style={styles.ctaBtns}>
              <Link to='/register' className='cta-btn-primary'>
                Register as Job Seeker
              </Link>
              <Link to='/register' className='cta-btn-secondary'>
                Register as Employer
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLogo}>
            <span style={styles.footerLogoIcon}>💼</span>
            <span style={styles.footerLogoText}>JobPortal</span>
          </div>
          <p style={styles.footerText}>
            © 2026 JobPortal.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  hero: {
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1040 50%, #0d1a3a 100%)',
    padding: '100px 40px 120px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  blob1: {
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
    filter: 'blur(40px)'
  },
  blob2: {
    position: 'absolute',
    bottom: '-100px',
    right: '-100px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
    filter: 'blur(60px)'
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.2)',
    color: '#818cf8',
    border: '1px solid rgba(99,102,241,0.3)',
    padding: '8px 20px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)'
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.15',
    marginBottom: '24px',
    letterSpacing: '-1px'
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.7',
    marginBottom: '40px',
    maxWidth: '560px',
    margin: '0 auto 40px'
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '40px'
  },
  searchHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  searchHintText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px'
  },
  searchTag: {
    background: 'rgba(255,255,255,0.07)',
    color: 'rgba(255,255,255,0.6)',
    padding: '5px 14px',
    borderRadius: '50px',
    fontSize: '13px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statsSection: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    padding: '50px 40px'
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  statNum: {
    fontSize: '38px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '6px'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: '500'
  },
  featuresSection: {
    padding: '90px 40px',
    backgroundColor: '#f8faff',
    textAlign: 'center'
  },
  sectionBadge: {
    display: 'inline-block',
    background: '#eef2ff',
    color: '#6366f1',
    padding: '6px 18px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '50px',
    lineHeight: '1.25',
    letterSpacing: '-0.5px'
  },
  featuresGrid: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '1050px',
    margin: '0 auto'
  },
  featureIcon: {
    fontSize: '44px',
    marginBottom: '16px',
    display: 'block'
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '10px'
  },
  featureDesc: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.65'
  },
  howSection: {
    padding: '90px 40px',
    backgroundColor: 'white',
    textAlign: 'center'
  },
  stepsGrid: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '900px',
    margin: '0 auto'
  },
  stepCard: {
    flex: '1',
    minWidth: '220px',
    maxWidth: '260px',
    padding: '32px 24px',
    borderRadius: '20px',
    background: '#f8faff',
    border: '1px solid #e2e8f0'
  },
  stepNumber: {
    fontSize: '40px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '14px'
  },
  stepTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '10px'
  },
  stepDesc: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1040 100%)',
    padding: '90px 40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  ctaBlob1: {
    position: 'absolute',
    top: '-80px',
    left: '10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    filter: 'blur(40px)'
  },
  ctaBlob2: {
    position: 'absolute',
    bottom: '-80px',
    right: '10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
    filter: 'blur(40px)'
  },
  ctaContent: {
    position: 'relative',
    zIndex: 1
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '16px',
    letterSpacing: '-0.5px'
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '18px',
    marginBottom: '40px'
  },
  ctaBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  footer: {
    backgroundColor: '#0a0f1e',
    padding: '28px 40px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  footerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: '12px'
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  footerLogoIcon: {
    fontSize: '20px'
  },
  footerLogoText: {
    color: 'white',
    fontWeight: '700',
    fontSize: '16px'
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '13px'
  }
};

export default Home;
