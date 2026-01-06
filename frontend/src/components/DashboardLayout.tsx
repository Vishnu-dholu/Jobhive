import { jwtDecode } from 'jwt-decode';
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Shield,
  User,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface TokenPayload {
  sub: string; // Email
  roles: string[]; // Role
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userEmail, setUserEmail] = useState('User');
  const [userRole, setUserRole] = useState('USER');

  useEffect(() => {
    // 1. Get User Info from Token
    const token = localStorage.getItem('token');

    if (!token) {
      // No token? Kick them out.
      // (In a real app, use a proper ProtectedRoute wrapper)
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserEmail(decoded.sub);

      // The backend returns roles like "ROLE_RECRUITER", let's clean it
      const roles = decoded.roles || [];
      const role = roles.length > 0 ? roles[0].replace('ROLE_', '') : 'USER';
      setUserRole(role);
    } catch (e) {
      console.error('Invalid Token');
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // 3. Define Menu Items
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    ...(userRole !== 'RECRUITER' && userRole !== 'ADMIN'
      ? [{ name: 'My Applications', path: '/my-applications', icon: FileText }]
      : []),
    ...(userRole === 'RECRUITER'
      ? [
          { name: 'Post a Job', path: '/post-job', icon: PlusCircle },
          {
            name: 'My Posted Job',
            path: '/recruiter/my-jobs',
            icon: Briefcase,
          },
        ]
      : []),
    ...(userRole === 'ADMIN'
      ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }]
      : []),
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="bg-base-200 flex h-screen">
      {/* --- SIDEBAR --- */}
      <aside className="bg-base-100 hidden w-64 flex-col shadow-xl md:flex">
        <div className="border-base-200 border-b p-4">
          <h1 className="text-primary flex items-center gap-2 text-2xl font-bold">
            <Briefcase className="h-8 w-8" /> JobHive
          </h1>
          <span className="badge badge-ghost badge-sm mt-2">
            {userRole} MODE
          </span>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-content'
                    : 'hover:bg-base-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-base-200 border-t p-4">
          <button
            onClick={handleLogout}
            className="text-error hover:bg-error/10 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar (Mobile only, or for User Info) */}
        <header className="bg-base-100 flex items-center justify-between p-4 shadow-sm md:justify-end">
          <div className="text-xl font-bold md:hidden">JobHive</div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold">{userEmail}</p>
              <p className="text-base-content/60 text-xs">Logged In</p>
            </div>
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xl">{userEmail[0].toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
