import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Register from './pages/Register';
import SavedJobs from './pages/SavedJobs';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobApplicants from './pages/recruiter/JobApplicants';
import ManageApplication from './pages/recruiter/ManageApplications';
import MyPostedJobs from './pages/recruiter/MyPostedJobs';
import PostJob from './pages/recruiter/PostJob';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected/App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/post-job" element={<PostJob />} />

        {/* Candidate Routes */}
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter/my-jobs" element={<MyPostedJobs />} />
        <Route path="/recruiter/applications" element={<ManageApplication />} />
        <Route
          path="/recruiter/jobs/:jobId/applications"
          element={<JobApplicants />}
        />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
