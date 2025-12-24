import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Simple placeholders with TS types
const Login = () => (
  <h1 className="text-3xl font-bold text-center mt-10">Login Page</h1>
);
const Register = () => (
  <h1 className="text-3xl font-bold text-center mt-10">Register Page</h1>
);
const Dashboard = () => (
  <h1 className="text-3xl font-bold text-center mt-10">Dashboard</h1>
);

function App() {
  return (
    <Router>
      {/* Toaster for global notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen bg-base-200">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
