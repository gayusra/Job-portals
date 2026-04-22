import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { fetchExternalJobs } from '../utils/jobsApi';
import { toast } from 'react-toastify';
import { JobsPageSkeleton, PageLoader } from '../components/Loader';

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experience: ''
  });

  const fetchAllJobs = async (showPageLoader = false) => {
    setLoading(true);
    if (showPageLoader) setLoadingExternal(true);

    try {
      // Fetch local jobs
      const { data } = await axios.get('/jobs');
      const localJobs = data.jobs.map((job) => ({ ...job, isExternal: false }));

      // Show local jobs immediately
      setAllJobs(localJobs);
      setFilteredJobs(localJobs);
      setLoading(false);

      // Then fetch external jobs
      setLoadingExternal(true);
      const keyword = filters.keyword || 'developer';
      const location = filters.location || 'india';
      const externalJobs = await fetchExternalJobs(keyword, location);

      const merged = [...localJobs, ...externalJobs];
      setAllJobs(merged);
      setFilteredJobs(merged);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      setLoading(false);
    } finally {
      setLoadingExternal(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  // Filter locally
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
      result = result.filter((job) => job.experience === filters.experience);
    }
    setFilteredJobs(result);
  }, [filters, allJobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllJobs(true);
  };

  const handleClear = () => {
    setFilters({ keyword: '', location: '', jobType: '', experience: '' });
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .jobs-page * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .search-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
          outline: none;
        }

        .job-card {
          transition: all 0.25s;
        }
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(99,102,241,0.12) !important;
          border-color: #c7d2fe !important;
        }

        .view-btn:hover {
          background: #4f46e5 !important;
          transform: translateY(-1px);
        }

        .apply-ext-btn:hover {
          background: #1e293b !important;
          transform: translateY(-1px);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .job-card-animated {
          animation: fadeInUp 0.4s ease both;
        }

        .external-loading-bar {
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1);
          background-size: 200% 100%;
          animation: shimmerBar 1.5s linear infinite;
          border-radius: 2px;
        }

        @keyframes shimmerBar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={styles.container} className='jobs-page'>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Browse Jobs</h1>
          <p style={styles.pageSubtitle}>
            Jobs from our portal + LinkedIn, Indeed & more
          </p>
        </div>

        {/* Search & Filter Card */}
        <div style={styles.searchCard}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type='text'
                name='keyword'
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder='Job title, skills or company...'
                style={styles.searchInput}
                className='search-input'
              />
            </div>

            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>📍</span>
              <input
                type='text'
                name='location'
                value={filters.location}
                onChange={handleFilterChange}
                placeholder='Location...'
                style={styles.searchInput}
                className='search-input'
              />
            </div>

            <select
              name='jobType'
              value={filters.jobType}
              onChange={handleFilterChange}
              style={styles.select}
              className='search-input'
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
              className='search-input'
            >
              <option value=''>All Experience</option>
              <option value='fresher'>Fresher</option>
              <option value='1-2 years'>1-2 Years</option>
              <option value='2-5 years'>2-5 Years</option>
              <option value='5+ years'>5+ Years</option>
            </select>

            <button type='submit' style={styles.searchBtn}>
              Search
            </button>

            <button
              type='button'
              onClick={handleClear}
              style={styles.clearBtn}
            >
              Clear
            </button>
          </form>
        </div>

        {/* External Loading Bar */}
        {loadingExternal && (
          <div style={styles.loadingBarWrapper}>
            <div style={styles.loadingBarInner}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #e2e8f0',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  flexShrink: 0
                }}
              />
              <span style={styles.loadingBarText}>
                Fetching jobs from LinkedIn & Indeed...
              </span>
            </div>
            <div className='external-loading-bar' style={{ marginTop: '10px' }} />
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div style={styles.resultsRow}>
            <span style={styles.resultCount}>
              {filteredJobs.length > 0
                ? `${filteredJobs.length} jobs found`
                : 'No jobs found'}
            </span>
            <div style={styles.sourceBadges}>
              <span style={styles.localBadge}>🟢 Our Portal</span>
              <span style={styles.externalBadge}>🟡 External</span>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <JobsPageSkeleton />
        ) : filteredJobs.length === 0 ? (
          <div style={styles.noJobs}>
            <div style={styles.noJobsIcon}>🔍</div>
            <h3 style={styles.noJobsTitle}>No jobs found</h3>
            <p style={styles.noJobsText}>
              Try different keywords or clear the filters
            </p>
            <button onClick={handleClear} style={styles.noJobsBtn}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <div
              key={job._id || index}
              className='job-card job-card-animated'
              style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
            >
              <JobCard job={job} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Unified Job Card ────────────────────────────────────────
const JobCard = ({ job }) => {
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.header}>
        <div style={cardStyles.headerLeft}>
          {job.employerLogo ? (
            <img
              src={job.employerLogo}
              alt={job.company}
              style={cardStyles.logo}
              onError={(e) => (e.target.style.display = 'none')}
            />
          ) : (
            <div style={cardStyles.logoPlaceholder}>
              {job.company?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <div style={cardStyles.titleRow}>
              <h3 style={cardStyles.title}>{job.title}</h3>
              {job.isExternal ? (
                <span style={cardStyles.externalBadge}>{job.source}</span>
              ) : (
                <span style={cardStyles.localBadge}>Our Portal</span>
              )}
            </div>
            <p style={cardStyles.company}>{job.company}</p>
          </div>
        </div>
        <span style={cardStyles.jobTypeBadge}>{job.jobType}</span>
      </div>

      {/* Details */}
      <div style={cardStyles.detailsRow}>
        {job.location && (
          <span style={cardStyles.detail}>📍 {job.location}</span>
        )}
        {job.experience && job.experience !== 'Not specified' && (
          <span style={cardStyles.detail}>💼 {job.experience}</span>
        )}
        {job.isRemote && (
          <span style={cardStyles.remoteBadge}>🌐 Remote</span>
        )}
        {job.salary?.min && (
          <span style={cardStyles.detail}>
            💰 {job.isExternal ? '$' : '₹'}
            {job.salary.min.toLocaleString()} -{' '}
            {job.isExternal ? '$' : '₹'}
            {job.salary.max?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div style={cardStyles.skills}>
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} style={cardStyles.skill}>{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span style={cardStyles.moreSkills}>+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={cardStyles.footer}>
        <span style={cardStyles.date}>
          {job.createdAt
            ? `Posted ${new Date(job.createdAt).toLocaleDateString()}`
            : ''}
        </span>
        {job.isExternal ? (
          <a
            href={job.applyLink}
            target='_blank'
            rel='noreferrer'
            style={cardStyles.applyBtn}
            className='apply-ext-btn'
          >
            Apply on {job.source} →
          </a>
        ) : (
          <Link
            to={`/jobs/${job._id}`}
            style={cardStyles.viewBtn}
            className='view-btn'
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────────
const styles = {
  page: {
    backgroundColor: '#f8faff',
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  container: {
    maxWidth: '920px',
    margin: '0 auto',
    padding: '36px 24px'
  },
  pageHeader: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    color: '#64748b',
    fontSize: '15px'
  },
  searchCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
    border: '1px solid #e2e8f0'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInputWrapper: {
    flex: '1',
    minWidth: '180px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '15px',
    zIndex: 1,
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '11px 14px 11px 36px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
    color: '#0f172a'
  },
  select: {
    flex: '1',
    minWidth: '150px',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
    color: '#0f172a',
    cursor: 'pointer'
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '11px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    whiteSpace: 'nowrap'
  },
  clearBtn: {
    background: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    padding: '11px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  loadingBarWrapper: {
    background: 'white',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0'
  },
  loadingBarInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  loadingBarText: {
    fontSize: '13px',
    color: '#6366f1',
    fontWeight: '600'
  },
  resultsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  resultCount: {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500'
  },
  sourceBadges: {
    display: 'flex',
    gap: '10px'
  },
  localBadge: {
    background: '#f0fdf4',
    color: '#16a34a',
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #bbf7d0'
  },
  externalBadge: {
    background: '#fefce8',
    color: '#ca8a04',
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #fde68a'
  },
  noJobs: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #e2e8f0'
  },
  noJobsIcon: {
    fontSize: '56px',
    marginBottom: '16px'
  },
  noJobsTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px'
  },
  noJobsText: {
    color: '#64748b',
    marginBottom: '24px'
  },
  noJobsBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

const cardStyles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.25s',
    cursor: 'default'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px'
  },
  headerLeft: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center'
  },
  logo: {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    flexShrink: 0
  },
  logoPlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '4px'
  },
  title: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a'
  },
  externalBadge: {
    background: '#fefce8',
    color: '#b45309',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    border: '1px solid #fde68a'
  },
  localBadge: {
    background: '#f0fdf4',
    color: '#15803d',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    border: '1px solid #bbf7d0'
  },
  company: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: '14px'
  },
  jobTypeBadge: {
    background: '#eef2ff',
    color: '#6366f1',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    border: '1px solid #c7d2fe'
  },
  detailsRow: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
    marginBottom: '14px'
  },
  detail: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '500'
  },
  remoteBadge: {
    background: '#f0fdf4',
    color: '#16a34a',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  skill: {
    background: '#f8faff',
    color: '#475569',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #e2e8f0'
  },
  moreSkills: {
    background: '#eef2ff',
    color: '#6366f1',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '14px'
  },
  date: {
    color: '#94a3b8',
    fontSize: '12px'
  },
  viewBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '9px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'all 0.2s',
    boxShadow: '0 3px 10px rgba(99,102,241,0.25)'
  },
  applyBtn: {
    background: '#1e293b',
    color: 'white',
    padding: '9px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'all 0.2s'
  }
};

export default Jobs;
