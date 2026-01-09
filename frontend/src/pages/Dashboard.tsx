import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import {
  getMyApplications,
  getRecruiterApplications,
} from '../api/applicationService';
import { getMyPostedJobs } from '../api/jobService';
import { getMyProfile } from '../api/userService';
import { Link } from 'react-router-dom';

interface DashboardStats {
  stat1: { label: string; value: number; icon: any; color: string };
  stat2: { label: string; value: number; icon: any; color: string };
  stat3: { label: string; value: number; icon: any; color: string };
}

interface ActivityItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  status: string;
}

const Dashboard = () => {
  const [role, setRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Stats & Activity
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const userRole =
        decoded.roles && decoded.roles.length > 0
          ? decoded.roles[0].replace('ROLE_', '')
          : 'USER';
      setRole(userRole);
      loadDashboardData(userRole);
    }
  }, []);

  const loadDashboardData = async (userRole: string) => {
    setLoading(true);
    try {
      // 1. Fetch Name (Common)
      const profile = await getMyProfile();
      setUserName(profile.name);

      if (userRole === 'RECRUITER') {
        // --- RECRUITER LOGIC ---
        const [jobs, applicants] = await Promise.all([
          getMyPostedJobs(),
          getRecruiterApplications(),
        ]);

        // Calculate Stats
        const totalJobs = jobs.length;
        const totalApplicants = applicants.length;
        const hiredCount = applicants.filter(
          (a) => a.status === 'ACCEPTED'
        ).length;

        setStats({
          stat1: {
            label: 'Posted Jobs',
            value: totalJobs,
            icon: Briefcase,
            color: 'text-primary',
          },
          stat2: {
            label: 'Total Applicants',
            value: totalApplicants,
            icon: Users,
            color: 'text-secondary',
          },
          stat3: {
            label: 'Candidates Hired',
            value: hiredCount,
            icon: CheckCircle,
            color: 'text-success',
          },
        });

        // Recent Activity (Last 5 Applicants)
        setRecentActivity(
          applicants.slice(0, 5).map((app) => ({
            id: app.id,
            title: app.applicantName,
            subtitle: `Applied for ${app.jobTitle}`,
            date: app.appliedAt,
            status: app.status,
          }))
        );
      } else {
        // --- APPLICANT LOGIC ---
        const myApps = await getMyApplications();

        // Calculate Stats
        const totalApplied = myApps.length;
        const shortlisted = myApps.filter(
          (a) => a.status === 'SHORTLISTED'
        ).length;
        const rejected = myApps.filter((a) => a.status === 'REJECTED').length;

        setStats({
          stat1: {
            label: 'Jobs Applied',
            value: totalApplied,
            icon: FileText,
            color: 'text-primary',
          },
          stat2: {
            label: 'Shortlisted',
            value: shortlisted,
            icon: TrendingUp,
            color: 'text-info',
          },
          stat3: {
            label: 'Rejected',
            value: rejected,
            icon: XCircle,
            color: 'text-error',
          },
        });

        // Recent Activity (Last 5 Applications)
        setRecentActivity(
          myApps.slice(0, 5).map((app) => ({
            id: app.id,
            title: app.jobTitle,
            subtitle: app.jobLocation,
            date: app.appliedAt,
            status: app.status,
          }))
        );
      }
    } catch (error) {
      console.error('Dashboard load failed', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <div className="badge badge-success gap-1 text-white">Hired</div>
        );
      case 'SHORTLISTED':
        return (
          <div className="badge badge-info gap-1 text-white">Shortlisted</div>
        );
      case 'REJECTED':
        return (
          <div className="badge badge-error gap-1 text-white">Rejected</div>
        );
      default:
        return <div className="badge badge-ghost gap-1">Pending</div>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mt-20 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* WELCOME SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-500">
          Here is what's happening with your job activities today.
        </p>
      </div>

      {/* STATS GRID */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="card bg-base-100 border-base-200 border shadow-xl">
            <div className="card-body flex-row items-center gap-4">
              <div
                className={`bg-base-200 rounded-full p-4 ${stats.stat1.color}`}
              >
                <stats.stat1.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="card-title text-3xl font-bold">
                  {stats.stat1.value}
                </h2>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {stats.stat1.label}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-100 border-base-200 border shadow-xl">
            <div className="card-body flex-row items-center gap-4">
              <div
                className={`bg-base-200 rounded-full p-4 ${stats.stat2.color}`}
              >
                <stats.stat2.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="card-title text-3xl font-bold">
                  {stats.stat2.value}
                </h2>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {stats.stat2.label}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-100 border-base-200 border shadow-xl">
            <div className="card-body flex-row items-center gap-4">
              <div
                className={`bg-base-200 rounded-full p-4 ${stats.stat3.color}`}
              >
                <stats.stat3.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="card-title text-3xl font-bold">
                  {stats.stat3.value}
                </h2>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {stats.stat3.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY TABLE */}
      <div className="card bg-base-100 border-base-200 border shadow-xl">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title">
              <Clock className="h-5 w-5 text-gray-400" /> Recent Activity
            </h2>
            <Link
              to={
                role === 'RECRUITER'
                  ? '/recruiter/applications'
                  : '/my-applications'
              }
              className="btn btn-link btn-sm no-underline"
            >
              View All
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              No recent activity found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item.id} className="hover">
                      <td>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-xs text-gray-500">
                          {item.subtitle}
                        </div>
                      </td>
                      <td className="text-right text-sm text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
