import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.subtitle}>
        The page you are looking for does not exist.
      </p>
      <Link to='/' style={styles.homeBtn}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px'
  },
  code: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '10px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '18px',
    marginBottom: '30px'
  },
  homeBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

export default NotFound;