import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login"; // <--- Import the real Login page
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";

// Placeholders for now
const Register = () => (
  <h1 className="text-center mt-10">Register Page (Coming Soon)</h1>
);
const Profile = () => <div className="p-10 text-center">Profile Page</div>;

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
