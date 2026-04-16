import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>
        <span style={styles.jobType}>{job.jobType}</span>
      </div>

      <div style={styles.details}>
        <span style={styles.detail}>📍 {job.location}</span>
        <span style={styles.detail}>💼 {job.experience}</span>
        {job.salary?.min && (
          <span style={styles.detail}>
            💰 ₹{job.salary.min.toLocaleString()} -{' '}
            ₹{job.salary.max.toLocaleString()}
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div style={styles.skills}>
          {job.skills.slice(0, 4).map((skill, index) => (
            <span key={index} style={styles.skill}>
              {skill}
            </span>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.date}>
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job._id}`} style={styles.viewBtn}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    transition: 'transform 0.2s',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  company: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: '15px'
  },
  jobType: {
    backgroundColor: '#eaf4fd',
    color: '#3498db',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  details: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  detail: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  skill: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '13px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eee',
    paddingTop: '15px'
  },
  date: {
    color: '#95a5a6',
    fontSize: '13px'
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default JobCard;