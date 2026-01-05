import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login'; // <--- Import the real Login page
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import MyPostedJobs from './pages/recruiter/MyPostedJobs';
import JobApplicants from './pages/recruiter/JobApplicants';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

// Placeholders for now
const Register = () => (
  <h1 className="mt-10 text-center">Register Page (Coming Soon)</h1>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/recruiter/my-jobs" element={<MyPostedJobs />} />
        <Route
          path="/recruiter/jobs/:jobId/applications"
          element={<JobApplicants />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
