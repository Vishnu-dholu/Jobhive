import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Job } from '../types/job';
import { getJobById } from '../api/jobService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  IndianRupee,
  MapPin,
  UploadCloud,
  X,
} from 'lucide-react';
import { applyForJob } from '../api/applicationService';

const JobDetails = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check if user is Recruiter (to hide Apply button)
  const isRecruiter = localStorage.getItem('token')?.includes('ROLE_RECRUITER');

  useEffect(() => {
    if (id) {
      getJobById(id)
        .then((data) => setJob(data))
        .catch(() => toast.error('Job not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleApply = async () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const submitApplication = async () => {
    if (!selectedFile || !job) {
      toast.error('Please select a resume first,');
      return;
    }

    setApplying(true);
    try {
      await applyForJob(job.id, selectedFile);
      toast.success('Application Submitted Successfully!');
      setIsModalOpen(false); // Close modal
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-md mb-4"
      >
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />{' '}
          <span className="flex items-center">Back to Jobs</span>
        </div>
      </button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* LEFT: Main Content */}
        <div className="space-y-6 md:col-span-2">
          <div className="card bg-base-100 border-primary border-t-5 shadow-xl">
            <div className="card-body">
              <h1 className="text-base-content text-3xl font-bold">
                {job.title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 text-gray-500">
                {/* Job Type */}
                <div className="flex justify-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>

                {/* Location */}
                <div className="flex justify-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>

                {/* Posted Date */}
                <div className="flex justify-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="divider"></div>

              <h3 className="mb-2 text-xl font-bold">Job Description</h3>
              <p className="leading-relaxed whitespace-pre-line text-gray-600">
                {job.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Action Sidebar */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 sticky top-6 shadow-xl">
            <div className="card-body">
              <h3 className="mb-4 text-lg font-bold">Job Overview</h3>

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Salary</span>
                  <span className="text-primary flex items-center gap-1 font-bold">
                    <IndianRupee className="h-4 w-4" />{' '}
                    {job.salary.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Recruiter</span>
                  <span className="font-medium">
                    {job.postedByRecruiterName}
                  </span>
                </div>
              </div>

              {!isRecruiter ? (
                <button
                  onClick={handleApply}
                  className="btn btn-primary hover:shadow-primary/50 w-full shadow-lg transition-all"
                  disabled={applying}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              ) : (
                <div className="alert alert-info text-sm">
                  You are viewing this as a Recruiter
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <form method="dialog">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-circle btn-ghost absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </button>
            </form>

            <h3 className="mb-4 text-lg font-bold">Apply for {job?.title}</h3>

            <div className="flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Upload Resume (PDF)</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              <button
                onClick={submitApplication}
                disabled={applying}
                className="btn btn-primary mt-4 w-full gap-2"
              >
                {applying ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" /> Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </DashboardLayout>
  );
};

export default JobDetails;
