import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    companyName: user?.profile?.companyName || '',
    companyWebsite: user?.profile?.companyWebsite || ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          skills: formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite
        }
      };

      const { data } = await axios.put('/auth/profile', updateData);

      // Update local storage and context
      const updatedUser = { ...user, ...data };
      login(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.name}>{user?.name}</h2>
            <p style={styles.email}>{user?.email}</p>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <h3 style={styles.sectionTitle}>Basic Information</h3>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='e.g. +91 9876543210'
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleChange}
              placeholder='e.g. Chennai, Tamil Nadu'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea
              name='bio'
              value={formData.bio}
              onChange={handleChange}
              placeholder='Write a short bio about yourself...'
              style={styles.textarea}
              rows={3}
            />
          </div>

          {/* Job Seeker Fields */}
          {user?.role === 'jobseeker' && (
            <>
              <h3 style={styles.sectionTitle}>Professional Info</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Skills
                  <span style={styles.hint}> (comma separated)</span>
                </label>
                <input
                  type='text'
                  name='skills'
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder='e.g. React, Node.js, MongoDB'
                  style={styles.input}
                />
              </div>
            </>
          )}

          {/* Employer Fields */}
          {user?.role === 'employer' && (
            <>
              <h3 style={styles.sectionTitle}>Company Info</h3>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name</label>
                  <input
                    type='text'
                    name='companyName'
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder='e.g. Tech Corp'
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Website</label>
                  <input
                    type='text'
                    name='companyWebsite'
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder='e.g. https://techcorp.com'
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type='submit'
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '35px',
    paddingBottom: '25px',
    borderBottom: '2px solid #f0f0f0'
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  name: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '4px'
  },
  email: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '8px'
  },
  roleBadge: {
    backgroundColor: '#eaf4fd',
    color: '#3498db',
    padding: '3px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '15px',
    marginTop: '25px',
    paddingBottom: '8px',
    borderBottom: '2px solid #eaf4fd'
  },
  row: {
    display: 'flex',
    gap: '20px'
  },
  formGroup: {
    flex: '1',
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '14px'
  },
  hint: {
    color: '#95a5a6',
    fontWeight: 'normal',
    fontSize: '13px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical'
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default Profile;