import { useEffect, useState } from 'react';
import { getMyApplications, type Application } from '../api/applicationService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((data) => setApplications(data))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load applications');
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper to color-code the status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'badge-success';
      case 'REJECTED':
        return 'badge-error';
      case 'SHORTLISTED':
        return 'badge-warning';
      default:
        return 'badge-ghost'; // Pending
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="mt-20 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Briefcase className="text-primary h-6 w-6" /> Application History
      </h1>

      {applications.length === 0 ? (
        <div className="mt-20 text-center text-gray-500">
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="bg-base-100 overflow-x-auto rounded-xl shadow-xl">
          <table className="table-zebra table w-full">
            {/* Table Head */}
            <thead className="bg-base-200">
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="font-bold">{app.jobTitle}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-5 w-5" /> {app.jobLocation}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-5 w-5" />{' '}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusBadge(app.status)} badge-sm`}
                    >
                      {app.status}
                    </span>
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

export default MyApplications;
