import { useEffect, useState } from 'react';
import {
  getRecruiterApplications,
  updateApplicationStatus,
  type Application,
} from '../../api/applicationService';
import toast from 'react-hot-toast';
import { Briefcase, CheckCircle, Circle, Clock, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ManageApplication = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getRecruiterApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const oldApps = [...applications];
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status: newStatus as any } : app
      )
    );

    try {
      await updateApplicationStatus(id, newStatus);
      toast.success(`Candidate marked as ${newStatus}`);
    } catch (error) {
      setApplications(oldApps);
      toast.error('Failed to update status');
    }
  };

  // Helper to render colored badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="badge badge-success gap-1 text-white">
            <CheckCircle className="h-3 w-3" /> Hired
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-error gap-1 text-white">
            <Circle className="h-3 w-3" /> Rejected
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="badge badge-info gap-1 text-white">
            <UserCheck className="h-3 w-3" /> Shortlisted
          </span>
        );
      default:
        return (
          <span className="badge badge-info gap-1 text-white">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Candidates</h1>
        <div className="badge badge-lg badge-ghost badge-outline">
          {applications.length} Applications
        </div>
      </div>

      {loading ? (
        <div className="pt-10 text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-base-100 border-base-200 rounded-xl border py-20 text-center shadow-sm">
          <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-lg text-gray-500">No applications received yet.</p>
        </div>
      ) : (
        <div className="bg-base-100 border-base-200 overflow-x-auto rounded-xl border shadow-xl">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Candidate</th>
                <th>Role Applied For</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-10 rounded-full">
                          <span className="text-xs">
                            {app.applicantName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{app.applicantName}</div>
                        <div className="text-xs opacity-50">
                          {app.applicantEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-primary font-medium">{app.jobTitle}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <select
                      className="select select-bordered select-xs w-full max-w-xs"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlist</option>
                      <option value="ACCEPTED">Hire</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageApplication;
