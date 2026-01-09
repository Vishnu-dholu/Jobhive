import { useEffect, useState } from 'react';
import type { Job } from '../../types/job';
import { useNavigate } from 'react-router-dom';
import { getMyPostedJobs } from '../../api/jobService';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { Briefcase, Calendar, MapPin, User } from 'lucide-react';

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyPostedJobs()
      .then((data) => setJobs(data))
      .catch(() => toast.error('Failed to load your jobs'))
      .finally(() => setLoading(false));
  }, []);

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Briefcase className="text-primary h-6 w-6" /> My Posted Jobs
        </h1>
        <button
          onClick={() => navigate('/post-jobs')}
          className="btn btn-primary btn-sm"
        >
          + Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-20 text-center text-gray-500">
          <p>You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card bg-base-100 border-primary border-l-4 shadow-md"
            >
              <div className="card-body flex-row items-center justify-between p-6">
                <div>
                  <h2 className="card-title text-left">{job.title}</h2>
                  <div className="mt-1 flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Posted{' '}
                      {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/recruiter/jobs/${job.id}/applications`)
                  }
                  className="btn btn-outline btn-primary gap-2"
                >
                  <User className="h-4 w-4" /> View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyPostedJobs;
