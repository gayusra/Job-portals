import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🔍',
      title: 'Search Jobs',
      desc: 'Find jobs that match your skills and experience'
    },
    {
      icon: '📝',
      title: 'Easy Apply',
      desc: 'Apply to jobs with just a few clicks'
    },
    {
      icon: '📊',
      title: 'Track Applications',
      desc: 'Monitor the status of all your applications'
    },
    {
      icon: '🏢',
      title: 'Post Jobs',
      desc: 'Employers can post jobs and find top talent'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find Your <span style={styles.highlight}>Dream Job</span> Today
        </h1>
        <p style={styles.heroSubtitle}>
          Connecting talented professionals with amazing companies across India
        </p>
        <div style={styles.heroBtns}>
          <Link to='/jobs' style={styles.primaryBtn}>
            Browse Jobs →
          </Link>
          {!user && (
            <Link to='/register' style={styles.secondaryBtn}>
              Get Started Free
            </Link>
          )}
          {user?.role === 'employer' && (
            <Link to='/post-job' style={styles.secondaryBtn}>
              Post a Job
            </Link>
          )}
          {user?.role === 'jobseeker' && (
            <Link to='/my-applications' style={styles.secondaryBtn}>
              My Applications
            </Link>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.stat}>
          <h3 style={styles.statNum}>500+</h3>
          <p style={styles.statLabel}>Jobs Available</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <h3 style={styles.statNum}>200+</h3>
          <p style={styles.statLabel}>Companies Hiring</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <h3 style={styles.statNum}>1000+</h3>
          <p style={styles.statLabel}>Job Seekers</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <h3 style={styles.statNum}>95%</h3>
          <p style={styles.statLabel}>Success Rate</p>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <h2 style={styles.featuresTitle}>Why Choose JobPortal?</h2>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of professionals finding their dream jobs
          </p>
          <div style={styles.ctaBtns}>
            <Link to='/register' style={styles.ctaPrimaryBtn}>
              Register as Job Seeker
            </Link>
            <Link to='/register' style={styles.ctaSecondaryBtn}>
              Register as Employer
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 JobPortal. Built with MERN Stack.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    color: 'white',
    padding: '100px 40px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  highlight: {
    color: '#f1c40f'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#bdc3c7',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px'
  },
  heroBtns: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#f1c40f',
    color: '#2c3e50',
    padding: '15px 35px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '2px solid white'
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 40px',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  stat: {
    textAlign: 'center',
    padding: '0 50px'
  },
  statNum: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#3498db'
  },
  statLabel: {
    color: '#7f8c8d',
    marginTop: '5px',
    fontSize: '15px'
  },
  statDivider: {
    width: '1px',
    height: '60px',
    backgroundColor: '#eee'
  },
  featuresSection: {
    padding: '80px 40px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  },
  featuresTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '50px'
  },
  featuresGrid: {
    display: 'flex',
    gap: '25px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '35px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    flex: '1',
    minWidth: '200px',
    maxWidth: '220px'
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  featureDesc: {
    color: '#7f8c8d',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  ctaSection: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '80px 40px',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  ctaSubtitle: {
    color: '#bdc3c7',
    fontSize: '18px',
    marginBottom: '40px'
  },
  ctaBtns: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimaryBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '14px 30px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  ctaSecondaryBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '14px 30px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  footer: {
    backgroundColor: '#1a252f',
    padding: '25px',
    textAlign: 'center'
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: '14px'
  }
};

export default Home;