import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker'
  });
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
      const { data } = await axios.post('/auth/register', formData);
      login(data);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .reg-page * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .reg-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; outline: none; }
        .reg-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .role-card { transition: all 0.2s; cursor: pointer; }
        .role-card:hover { border-color: #6366f1 !important; }
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
            Start Your Career<br />Journey Today
          </h2>
          <p style={styles.leftSubtitle}>
            Create your free account and unlock access to thousands of job opportunities
          </p>
          <div style={styles.statsRow}>
            {[
              { num: '500+', label: 'Jobs' },
              { num: '200+', label: 'Companies' },
              { num: '1000+', label: 'Members' }
            ].map((s, i) => (
              <div key={i} style={styles.statItem}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right} className='reg-page'>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Create your account</h1>
            <p style={styles.formSubtitle}>Join thousands of professionals today</p>
          </div>

          {/* Role Selection */}
          <div style={styles.roleSection}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleCards}>
              <div
                className='role-card'
                onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
                style={{
                  ...styles.roleCard,
                  borderColor: formData.role === 'jobseeker' ? '#6366f1' : '#e2e8f0',
                  background: formData.role === 'jobseeker' ? '#eef2ff' : 'white'
                }}
              >
                <span style={styles.roleIcon}>👤</span>
                <span style={styles.roleName}>Job Seeker</span>
                <span style={styles.roleDesc}>Looking for work</span>
                {formData.role === 'jobseeker' && (
                  <span style={styles.roleCheck}>✓</span>
                )}
              </div>
              <div
                className='role-card'
                onClick={() => setFormData({ ...formData, role: 'employer' })}
                style={{
                  ...styles.roleCard,
                  borderColor: formData.role === 'employer' ? '#6366f1' : '#e2e8f0',
                  background: formData.role === 'employer' ? '#eef2ff' : 'white'
                }}
              >
                <span style={styles.roleIcon}>🏢</span>
                <span style={styles.roleName}>Employer</span>
                <span style={styles.roleDesc}>Hiring talent</span>
                {formData.role === 'employer' && (
                  <span style={styles.roleCheck}>✓</span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Gayathri Kumar'
                style={styles.input}
                className='reg-input'
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                style={styles.input}
                className='reg-input'
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
                  placeholder='Min. 6 characters'
                  style={{ ...styles.input, paddingRight: '48px' }}
                  className='reg-input'
                  required
                  minLength={6}
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
              className='reg-btn'
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to='/login' style={styles.switchLink}>
              Sign in →
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
    overflow: 'hidden'
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
    marginBottom: '48px',
    lineHeight: '1.6'
  },
  statsRow: {
    display: 'flex',
    gap: '24px'
  },
  statItem: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.06)',
    padding: '20px 24px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    flex: '1'
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#818cf8',
    marginBottom: '4px'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px'
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
    maxWidth: '440px',
    background: 'white',
    borderRadius: '24px',
    padding: '44px 40px',
    boxShadow: '0 20px 60px rgba(99,102,241,0.08)',
    border: '1px solid #e2e8f0'
  },
  formHeader: {
    marginBottom: '28px'
  },
  formTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
    letterSpacing: '-0.5px'
  },
  formSubtitle: {
    color: '#64748b',
    fontSize: '14px'
  },
  roleSection: {
    marginBottom: '24px'
  },
  roleCards: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  roleCard: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    borderRadius: '12px',
    border: '2px solid',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s'
  },
  roleIcon: {
    fontSize: '28px',
    marginBottom: '6px'
  },
  roleName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px'
  },
  roleDesc: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  roleCheck: {
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
    fontWeight: '700'
  },
  formGroup: {
    marginBottom: '18px'
  },
  label: {
    display: 'block',
    marginBottom: '7px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  },
  input: {
    width: '80%',
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
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
  },
  switchText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    marginTop: '24px'
  },
  switchLink: {
    color: '#6366f1',
    fontWeight: '700',
    textDecoration: 'none'
  }
};

export default Register;
