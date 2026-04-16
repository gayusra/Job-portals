import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { fetchExternalJobs } from '../utils/jobsApi';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experience: ''
  });

  // Fetch both local and external jobs
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      // Fetch local jobs from your MongoDB
      const { data } = await axios.get('/jobs');
      const localJobs = data.jobs.map((job) => ({
        ...job,
        isExternal: false
      }));

      // Fetch external jobs from JSearch API
      const keyword = filters.keyword || 'developer';
      const location = filters.location || 'india';
      const externalJobs = await fetchExternalJobs(keyword, location);

      // Merge both lists — local jobs first
      const merged = [...localJobs, ...externalJobs];
      setAllJobs(merged);
      setFilteredJobs(merged);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  // Filter jobs locally after fetch
  useEffect(() => {
    let result = [...allJobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(kw) ||
          job.company?.toLowerCase().includes(kw) ||
          job.description?.toLowerCase().includes(kw) ||
          job.skills?.some((s) => s.toLowerCase().includes(kw))
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      result = result.filter((job) =>
        job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    if (filters.experience) {
      result = result.filter(
        (job) => job.experience === filters.experience
      );
    }

    setFilteredJobs(result);
  }, [filters, allJobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllJobs();
  };

  const handleClear = () => {
    setFilters({ keyword: '', location: '', jobType: '', experience: '' });
  };

  return (
    <div style={styles.container}>

      {/* Search & Filter */}
      <div style={styles.searchSection}>
        <h2 style={styles.searchTitle}>Find Your Perfect Job</h2>
        <p style={styles.searchSubtitle}>
          Showing jobs from our portal + LinkedIn, Indeed & more
        </p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type='text'
            name='keyword'
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder='Job title, skills or company'
            style={styles.searchInput}
          />
          <input
            type='text'
            name='location'
            value={filters.location}
            onChange={handleFilterChange}
            placeholder='Location'
            style={styles.searchInput}
          />
          <select
            name='jobType'
            value={filters.jobType}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value=''>All Job Types</option>
            <option value='full-time'>Full Time</option>
            <option value='part-time'>Part Time</option>
            <option value='remote'>Remote</option>
            <option value='internship'>Internship</option>
            <option value='contract'>Contract</option>
          </select>
          <select
            name='experience'
            value={filters.experience}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value=''>All Experience</option>
            <option value='fresher'>Fresher</option>
            <option value='1-2 years'>1-2 Years</option>
            <option value='2-5 years'>2-5 Years</option>
            <option value='5+ years'>5+ Years</option>
          </select>
          <button type='submit' style={styles.searchBtn}>Search</button>
          <button
            type='button'
            onClick={handleClear}
            style={styles.clearBtn}
          >
            Clear
          </button>
        </form>
      </div>

      {/* Results */}
      <div style={styles.results}>
        <p style={styles.resultCount}>
          {loading
            ? 'Loading jobs...'
            : `${filteredJobs.length} jobs found`}
        </p>

        {loading ? (
          <div style={styles.loading}>
            Fetching jobs from all sources...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={styles.noJobs}>
            <h3>No jobs found</h3>
            <p>Try different search terms or clear filters</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <JobCard key={job._id || index} job={job} />
          ))
        )}
      </div>
    </div>
  );
};

// ── Unified Job Card ─────────────────────────────────────
const JobCard = ({ job }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardLeft}>

          {/* Company Logo (external jobs only) */}
          {job.employerLogo && (
            <img
              src={job.employerLogo}
              alt={job.company}
              style={styles.logo}
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}

          <div>
            <div style={styles.titleRow}>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              {/* Source badge */}
              {job.isExternal ? (
                <span style={styles.externalBadge}>
                  {job.source}
                </span>
              ) : (
                <span style={styles.localBadge}>
                  Our Portal
                </span>
              )}
            </div>
            <p style={styles.company}>{job.company}</p>
          </div>
        </div>
        <span style={styles.jobTypeBadge}>{job.jobType}</span>
      </div>

      {/* Details Row */}
      <div style={styles.detailsRow}>
        {job.location && (
          <span style={styles.detail}>📍 {job.location}</span>
        )}
        {job.experience && job.experience !== 'Not specified' && (
          <span style={styles.detail}>💼 {job.experience}</span>
        )}
        {job.isRemote && (
          <span style={styles.remoteBadge}>🌐 Remote</span>
        )}
        {job.salary?.min && (
          <span style={styles.detail}>
            💰 {job.isExternal ? '$' : '₹'}
            {job.salary.min.toLocaleString()} -{' '}
            {job.isExternal ? '$' : '₹'}
            {job.salary.max?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div style={styles.skills}>
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} style={styles.skill}>{skill}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={styles.cardFooter}>
        <span style={styles.date}>
          {job.createdAt
            ? `Posted ${new Date(job.createdAt).toLocaleDateString()}`
            : ''}
        </span>

        {/* External job → open original link */}
        {job.isExternal ? (
          <a
            href={job.applyLink}
            target='_blank'
            rel='noreferrer'
            style={styles.applyBtn}
          >
            Apply on {job.source} →
          </a>
        ) : (
          // Local job → open detail page
          <Link to={`/jobs/${job._id}`} style={styles.viewBtn}>
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  searchSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  },
  searchTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  searchSubtitle: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '20px'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1',
    minWidth: '180px',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    flex: '1',
    minWidth: '150px',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white'
  },
  searchBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  clearBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  results: {
    marginTop: '10px'
  },
  resultCount: {
    color: '#7f8c8d',
    marginBottom: '20px',
    fontSize: '15px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#7f8c8d',
    fontSize: '16px'
  },
  noJobs: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#7f8c8d',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #eee'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  cardLeft: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  logo: {
    width: '45px',
    height: '45px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #eee'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '5px',
    flexWrap: 'wrap'
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  externalBadge: {
    backgroundColor: '#fef9e7',
    color: '#f39c12',
    padding: '3px 10px',
    borderRadius: '15px',
    fontSize: '11px',
    fontWeight: '600'
  },
  localBadge: {
    backgroundColor: '#d5f5e3',
    color: '#27ae60',
    padding: '3px 10px',
    borderRadius: '15px',
    fontSize: '11px',
    fontWeight: '600'
  },
  company: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: '15px'
  },
  jobTypeBadge: {
    backgroundColor: '#eaf4fd',
    color: '#3498db',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  },
  detailsRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  detail: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  remoteBadge: {
    backgroundColor: '#d5f5e3',
    color: '#27ae60',
    padding: '3px 10px',
    borderRadius: '15px',
    fontSize: '13px',
    fontWeight: '600'
  },
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  skill: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '13px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px'
  },
  date: {
    color: '#95a5a6',
    fontSize: '13px'
  },
  applyBtn: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Jobs;