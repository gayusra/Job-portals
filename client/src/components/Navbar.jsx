import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .navbar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 15, 30, 0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(99,102,241,0.4);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          color: #818cf8;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link {
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.07);
        }

        .nav-link.active {
          color: #818cf8;
          background: rgba(99,102,241,0.12);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-login {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-login:hover {
          color: white;
          background: rgba(255,255,255,0.07);
        }

        .btn-register {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 9px 20px;
          border-radius: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }

        .btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }

        /* Profile Button */
        .profile-wrapper {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 14px 6px 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(99,102,241,0.4);
        }

        .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-role {
          font-size: 11px;
          color: #818cf8;
          font-weight: 500;
          text-transform: capitalize;
        }

        .chevron {
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          transition: transform 0.2s;
          margin-left: 2px;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        /* Dropdown */
        .dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          background: #131929;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: dropIn 0.2s ease;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 16px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dropdown-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .dropdown-name {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .dropdown-email {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 140px;
        }

        .dropdown-role-badge {
          display: inline-block;
          margin-top: 4px;
          background: rgba(99,102,241,0.2);
          color: #818cf8;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: capitalize;
        }

        .dropdown-section {
          padding: 8px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: rgba(255,255,255,0.06);
          color: white;
        }

        .dropdown-item.danger:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .dropdown-item-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 4px 8px;
        }

        /* Post Job Button */
        .btn-post-job {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(16,185,129,0.25);
          white-space: nowrap;
        }

        .btn-post-job:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16,185,129,0.35);
        }

        /* Mobile hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }

        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          transition: all 0.3s;
        }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          background: #0d1220;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 16px;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          transition: all 0.2s;
          display: block;
        }

        .mobile-link:hover, .mobile-link.active {
          background: rgba(99,102,241,0.12);
          color: #818cf8;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 8px 0;
        }

        .mobile-logout {
          color: #f87171;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s;
          font-family: inherit;
        }

        .mobile-logout:hover {
          background: rgba(239,68,68,0.1);
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-right { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className='navbar'>
        <div className='navbar-inner'>

          {/* Logo */}
          <Link to='/' className='navbar-logo'>
            <div className='logo-icon'>💼</div>
            <span className='logo-text'>Job<span>Portal</span></span>
          </Link>

          {/* Center Nav Links */}
          <div className='navbar-links'>
            <Link
              to='/'
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to='/jobs'
              className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
            >
              Browse Jobs
            </Link>
            {user?.role === 'employer' && (
              <>
                <Link
                  to='/employer-dashboard'
                  className={`nav-link ${isActive('/employer-dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </>
            )}
            {user?.role === 'jobseeker' && (
              <Link
                to='/my-applications'
                className={`nav-link ${isActive('/my-applications') ? 'active' : ''}`}
              >
                My Applications
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className='navbar-right'>
            {user ? (
              <>
                {/* Post Job Button for Employer */}
                {user.role === 'employer' && (
                  <Link to='/post-job' className='btn-post-job'>
                    + Post Job
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className='profile-wrapper' ref={dropdownRef}>
                  <button
                    className='profile-btn'
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className='profile-avatar'>
                      {getInitials(user.name)}
                    </div>
                    <div className='profile-info'>
                      <span className='profile-name'>
                        {user.name?.split(' ')[0]}
                      </span>
                      <span className='profile-role'>{user.role}</span>
                    </div>
                    <span className={`chevron ${dropdownOpen ? 'open' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className='dropdown'>

                      {/* User Info Header */}
                      <div className='dropdown-header'>
                        <div className='dropdown-avatar'>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className='dropdown-name'>{user.name}</div>
                          <div className='dropdown-email'>{user.email}</div>
                          <span className='dropdown-role-badge'>
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='dropdown-section'>
                        <Link
                          to='/profile'
                          className='dropdown-item'
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className='dropdown-item-icon'>👤</span>
                          My Profile
                        </Link>

                        {user.role === 'jobseeker' && (
                          <Link
                            to='/my-applications'
                            className='dropdown-item'
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className='dropdown-item-icon'>📋</span>
                            My Applications
                          </Link>
                        )}

                        {user.role === 'employer' && (
                          <>
                            <Link
                              to='/employer-dashboard'
                              className='dropdown-item'
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className='dropdown-item-icon'>📊</span>
                              Dashboard
                            </Link>
                            <Link
                              to='/post-job'
                              className='dropdown-item'
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className='dropdown-item-icon'>➕</span>
                              Post a Job
                            </Link>
                          </>
                        )}

                        <Link
                          to='/jobs'
                          className='dropdown-item'
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className='dropdown-item-icon'>🔍</span>
                          Browse Jobs
                        </Link>

                        <div className='dropdown-divider' />

                        <button
                          className='dropdown-item danger'
                          onClick={handleLogout}
                        >
                          <span className='dropdown-item-icon'>🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to='/login' className='btn-login'>Sign In</Link>
                <Link to='/register' className='btn-register'>Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger for Mobile */}
          <button
            className='hamburger'
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <Link to='/' className={`mobile-link ${isActive('/') ? 'active' : ''}`}>
            🏠 Home
          </Link>
          <Link to='/jobs' className={`mobile-link ${isActive('/jobs') ? 'active' : ''}`}>
            🔍 Browse Jobs
          </Link>

          {user ? (
            <>
              <Link to='/profile' className='mobile-link'>
                👤 My Profile
              </Link>
              {user.role === 'jobseeker' && (
                <Link to='/my-applications' className='mobile-link'>
                  📋 My Applications
                </Link>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to='/employer-dashboard' className='mobile-link'>
                    📊 Dashboard
                  </Link>
                  <Link to='/post-job' className='mobile-link'>
                    ➕ Post a Job
                  </Link>
                </>
              )}
              <div className='mobile-divider' />
              <button className='mobile-logout' onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </>
          ) : (
            <>
              <div className='mobile-divider' />
              <Link to='/login' className='mobile-link'>Sign In</Link>
              <Link to='/register' className='mobile-link'>Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
