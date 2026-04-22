import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      login(data);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .login-page * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .login-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; outline: none; }
        .login-btn { transition: all 0.3s; }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div style={styles.left}>
        <div style={styles.leftBlob1} />
        <div style={styles.leftBlob2} />
        <div style={styles.leftContent}>
          <Link to='/' style={styles.logoLink}>
            <span style={styles.logoIcon}>💼</span>
            <span style={styles.logoText}>JobPortal</span>
          </Link>
          <h2 style={styles.leftTitle}>
            Your Next Big<br />Opportunity Awaits
          </h2>
          <p style={styles.leftSubtitle}>
            Join thousands of professionals finding their dream jobs every day
          </p>
          <div style={styles.leftFeatures}>
            {[
              '🤖 AI-powered cover letter generation',
              '🔍 Jobs from LinkedIn, Indeed & more',
              '📊 Real-time application tracking',
              '🏢 Top companies hiring now'
            ].map((f, i) => (
              <div key={i} style={styles.leftFeature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right} className='login-page'>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Welcome back 👋</h1>
            <p style={styles.formSubtitle}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                style={styles.input}
                className='login-input'
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  style={{ ...styles.input, paddingRight: '48px' }}
                  className='login-input'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type='submit'
              style={styles.submitBtn}
              className='login-btn'
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to='/register' style={styles.switchLink}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  left: {
    flex: '1',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1040 50%, #0d1a3a 100%)',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh'
  },
  leftBlob1: {
    position: 'absolute',
    top: '10%',
    left: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    filter: 'blur(50px)'
  },
  leftBlob2: {
    position: 'absolute',
    bottom: '10%',
    right: '-10%',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
    filter: 'blur(50px)'
  },
  leftContent: {
    position: 'relative',
    zIndex: 1
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    marginBottom: '60px'
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'white'
  },
  leftTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.2',
    marginBottom: '16px',
    letterSpacing: '-0.5px'
  },
  leftSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '16px',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  leftFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  leftFeature: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.05)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  right: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#f8faff'
  },
  formCard: {
    width: '100%',
    maxWidth: '450px',
    background: 'white',
    borderRadius: '24px',
    padding: '48px 40px',
    boxShadow: '0 20px 60px rgba(99,102,241,0.08)',
    border: '1px solid #e2e8f0'
  },
  formHeader: {
    marginBottom: '36px'
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  formSubtitle: {
    color: '#64748b',
    fontSize: '15px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  },
  input: {
    width: '85%',
    padding: '13px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
    color: '#0f172a'
  },
  passwordWrapper: {
    position: 'relative'
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0'
  },
  dividerLine: {
    flex: '1',
    height: '1px',
    backgroundColor: '#e2e8f0'
  },
  dividerText: {
    color: '#94a3b8',
    fontSize: '13px'
  },
  switchText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px'
  },
  switchLink: {
    color: '#6366f1',
    fontWeight: '700',
    textDecoration: 'none'
  }
};

export default Login;
