import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../types/job';
import { getMySavedJobs, toggleSavedJob } from '../api/jobService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { Briefcase, IndianRupee, MapPin, Trash2 } from 'lucide-react';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const data = await getMySavedJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await toggleSavedJob(id);
      toast.success('Removed from saved');
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">My Saved Jobs</h1>

      {loading ? (
        <div className="py-10 text-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : jobs.length === 0 ? (
        <div>
          <p className="text-lg">You haven't saved any jobs yet!</p>
          <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card bg-base-100 border-base-200 border shadow-xl"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h2 className="card-title text-primary">{job.title}</h2>
                  <button
                    onClick={() => handleRemove(job.id)}
                    className="btn btn-ghost btn-circle btn-sm text-error"
                    title="Remove"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-px text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />{' '}
                    {job.postedByRecruiterName}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />{' '}
                    {job.salary.toLocaleString()}
                  </div>
                </div>

                <div className="card-actions mt-4 justify-end">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="btn btn-primary btn-outline btn-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedJobs;
