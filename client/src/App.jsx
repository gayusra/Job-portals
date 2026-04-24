import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import EmployerDashboard from './pages/EmployerDashboard';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ATSChecker from './pages/ATSChecker';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/jobs/:id' element={<JobDetail />} />
          <Route path='/ats-checker' element={<ATSChecker />} />
          
       

          {/* Employer Only Routes */}
          <Route
            path='/post-job'
            element={
              <ProtectedRoute role='employer'>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path='/employer-dashboard'
            element={
              <ProtectedRoute role='employer'>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/employer/applications/:jobId'
            element={
              <ProtectedRoute role='employer'>
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Only Routes */}
          <Route
            path='/my-applications'
            element={
              <ProtectedRoute role='jobseeker'>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer position='top-right' autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;