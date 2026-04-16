import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.logo}>
        JobPortal
      </Link>

  

      <div style={styles.links}>
        <Link to='/jobs' style={styles.link}>Jobs</Link>

        {user ? (
          <>
            <span style={styles.username}>Hi, {user.name}</span>
            {user.role === 'employer' && (
              <Link to='/post-job' style={styles.link}>Post Job</Link>
            )}
            {user.role === 'employer' && (
              <Link to='/employer-dashboard' style={styles.link}>Dashboard</Link>
            )}
            {user.role === 'jobseeker' && (
              <Link to='/my-applications' style={styles.link}>My Applications</Link>
            )}
            <Link to='/profile' style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3498db'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'white',
    fontSize: '15px'
  },
  username: {
    color: '#3498db',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  registerBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '5px',
    fontSize: '14px'
  }
};

export default Navbar;