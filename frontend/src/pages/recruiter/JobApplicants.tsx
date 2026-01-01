import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  downloadResume,
  getApplicationsForJob,
  updateApplicationStatus,
  type Application,
} from '../../api/applicationService';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { ArrowLeft, Download } from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Job ID from URL:', jobId);

    if (jobId) {
      loadData();
    } else {
      setLoading(false);
      toast.error('Invalid Job ID. Please check the URL.');
    }
  }, [jobId]);

  const loadData = () => {
    getApplicationsForJob(Number(jobId))
      .then((data) => setApplications(data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      toast.success(`Status updated to ${newStatus}`);

      // Refresh list or update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDownload = async (appId: number, name: string) => {
    const toastId = toast.loading('Downloading...');
    try {
      await downloadResume(appId, `Resume_${name}.pdf`);
      toast.success('Download started', { id: toastId });
    } catch (error) {
      toast.error('Failed to download resume', { id: toastId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-success';
      case 'REJECTED':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="mt-20 flex justify-center">
          {' '}
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Jobs
      </button>

      <h1 className="mb-6 text-2xl font-bold">Manage Applicants</h1>

      {applications.length === 0 ? (
        <div className="alert">
          <span>No applicants received for this job yet.</span>
        </div>
      ) : (
        <div className="bg-base-100 overflow-x-auto rounded-xl shadow-xl">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Candidate</th>
                <th>Applied Date</th>
                <th>Resume</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="hover">
                  {/* 1. Candidate Info */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-10 rounded-full">
                          <span>{app.applicantName.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{app.applicantName}</div>
                        <div className="text-sm opacity-50">
                          {app.applicantEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Date */}
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>

                  {/* 3. Resume Download */}
                  <td>
                    <button
                      onClick={() => handleDownload(app.id, app.applicantName)}
                    >
                      <Download className="h-4 w-4" /> PDF
                    </button>
                  </td>

                  {/* 4. Status Display */}
                  <td className={`font-bold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </td>

                  {/* 5. Actions (Status update) */}
                  <td>
                    <select
                      className="select select-bordered select-sm w-full max-w-xs"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
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

export default JobApplicants;
