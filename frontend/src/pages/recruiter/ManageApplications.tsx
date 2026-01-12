import { useEffect, useState } from 'react';
import {
  getRecruiterApplications,
  sendEmailToCandidate,
  updateApplicationStatus,
  type Application,
} from '../../api/applicationService';
import toast from 'react-hot-toast';
import {
  Briefcase,
  CheckCircle,
  Circle,
  Clock,
  Mail,
  UserCheck,
  Send,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ManageApplication = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [emailForm, setEmailForm] = useState({ subject: '', body: '' });

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
    // Optimistic Update
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status: newStatus as any } : app
      )
    );

    try {
      await updateApplicationStatus(id, newStatus);
      toast.success(`Candidate marked as ${newStatus}`);
    } catch (error) {
      setApplications(oldApps); // Revert on failure
      toast.error('Failed to update status');
    }
  };

  const openEmailModal = (app: Application) => {
    setSelectedApplicant(app);
    setEmailForm({
      subject: `Update regarding your application for ${app.jobTitle}`,
      body: `Hi ${app.applicantName},\n\n`,
    });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedApplicant) return;

    const toastId = toast.loading('Sending email...');
    try {
      await sendEmailToCandidate(
        selectedApplicant.id,
        emailForm.subject,
        emailForm.body
      );
      toast.success('Email sent successfully!', { id: toastId });
      setIsEmailModalOpen(false);
    } catch (error) {
      toast.error('Failed to send email', { id: toastId });
    }
  };

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
          <span className="badge badge-ghost gap-1">
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
        <>
          <div className="bg-base-100 border-base-200 rounded-xl border shadow-xl">
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
                    <td className="max-w-50">
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

                    {/* Actions Column */}
                    <td>
                      <div className="flex items-center gap-2">
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

                        <button
                          onClick={() => openEmailModal(app)}
                          className="btn btn-xs btn-circle btn-ghost tooltip"
                          data-tip="Email Candidate"
                        >
                          <Mail className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Email Modal */}
          {isEmailModalOpen && selectedApplicant && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="mb-4 text-lg font-bold">
                  Contact {selectedApplicant.applicantName}
                </h3>

                <div className="form-control mb-4">
                  <label className="label font-bold">Subject</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                  />
                </div>

                <div className="form-control mb-6 flex flex-col">
                  <label className="label font-bold">Message</label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    value={emailForm.body}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, body: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="modal-action">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setIsEmailModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleSendEmail}
                  >
                    <Send className="h-4 w-4" /> Send Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ManageApplication;
