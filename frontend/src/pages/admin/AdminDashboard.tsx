import { useEffect, useState } from 'react';
import {
  deleteJob,
  deleteUser,
  getAdminStats,
  getAllJobs,
  getAllUsers,
  type AdminStats,
} from '../../api/adminService';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { Briefcase, Trash2, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, usersData, jobsData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllJobs(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setJobs(jobsData);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User removed');
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Delete this job post?')) return;
    try {
      await deleteJob(id);
      toast.success('Job removed');
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Loading Admin Panel...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      {/* STATS CARD */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{stats?.totalUsers}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-secondary">{stats?.totalJobs}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="stat-title">Applications</div>
            <div className="stat-value text-accent">
              {stats?.totalApplications}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </a>
        <a
          className={`tab ${activeTab === 'jobs' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Manage Jobs
        </a>
      </div>

      {/* TABLE CONTENT */}
      <div className="bg-base-100 overflow-x-auto rounded-xl shadow-xl">
        <table className="table w-full">
          {activeTab === 'users' ? (
            <>
              <thead className="bg-base-200">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="font-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-ghost">{user.role}</span>
                    </td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-error btn-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead className="bg-base-200">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company Recruiter</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td className="font-bold">{job.title}</td>
                    <td>{job.postedBy?.name || 'Unknown'}</td>
                    <td>{job.location}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="btn btn-error btn-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
