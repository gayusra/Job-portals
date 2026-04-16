import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      toast.success('Job posted successfully!');
      navigate('/employer-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a New Job</h2>
        <p style={styles.subtitle}>Fill in the details to attract the right candidates</p>

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <h3 style={styles.sectionTitle}>Basic Information</h3>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title *</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='e.g. React Developer'
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name *</label>
              <input
                type='text'
                name='company'
                value={formData.company}
                onChange={handleChange}
                placeholder='e.g. Tech Corp'
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <input
                type='text'
                name='location'
                value={formData.location}
                onChange={handleChange}
                placeholder='e.g. Chennai, Tamil Nadu'
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Type *</label>
              <select
                name='jobType'
                value={formData.jobType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value='full-time'>Full Time</option>
                <option value='part-time'>Part Time</option>
                <option value='remote'>Remote</option>
                <option value='internship'>Internship</option>
                <option value='contract'>Contract</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Description *</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Describe the role, responsibilities and requirements...'
              style={styles.textarea}
              rows={5}
              required
            />
          </div>

          {/* Salary & Experience */}
          <h3 style={styles.sectionTitle}>Salary & Experience</h3>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Minimum Salary (₹)</label>
              <input
                type='number'
                name='salaryMin'
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder='e.g. 50000'
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Maximum Salary (₹)</label>
              <input
                type='number'
                name='salaryMax'
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder='e.g. 80000'
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Experience Required *</label>
              <select
                name='experience'
                value={formData.experience}
                onChange={handleChange}
                style={styles.input}
              >
                <option value='fresher'>Fresher</option>
                <option value='1-2 years'>1-2 Years</option>
                <option value='2-5 years'>2-5 Years</option>
                <option value='5+ years'>5+ Years</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Education</label>
              <input
                type='text'
                name='education'
                value={formData.education}
                onChange={handleChange}
                placeholder='e.g. B.Tech, MBA'
                style={styles.input}
              />
            </div>
          </div>

          {/* Additional Info */}
          <h3 style={styles.sectionTitle}>Additional Information</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Required Skills
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

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Openings</label>
              <input
                type='number'
                name='openings'
                value={formData.openings}
                onChange={handleChange}
                min='1'
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Application Deadline</label>
              <input
                type='date'
                name='deadline'
                value={formData.deadline}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <button
            type='submit'
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '30px'
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
    outline: 'none',
    backgroundColor: 'white'
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
    padding: '14px',
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

export default PostJob;