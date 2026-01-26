import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { JobRequest } from '../../types/job';
import { postJob } from '../../api/jobService';
import toast from 'react-hot-toast';
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  IndianRupee,
  MapPin,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useEffect } from 'react';

const PostJob = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<JobRequest>();

  const selectedJobType = watch('jobType');
  const isRemote = selectedJobType === 'REMOTE';

  useEffect(() => {
    if (isRemote) {
      setValue('location', 'Remote');
    } else if (selectedJobType) {
      setValue('location', '');
    }
  }, [isRemote, setValue, clearErrors, selectedJobType]);

  const onSubmit = async (data: JobRequest) => {
    try {
      const payload = {
        ...data,
        salary: Number(data.salary),
        type: data.jobType,
      };

      await postJob(payload);

      toast.success('Job Posted Successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Post Job Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to post job. Please try again.'
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full justify-center">
        <div className="card bg-base-100 w-full max-w-3xl shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4 border-b pb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <Briefcase className="text-primary h-8 w-8" />
              </div>
              <div>
                <h2 className="card-title text-3xl font-bold">Post a Job</h2>
                <p className="text-base-content/60">
                  Create a new opportunity for candidates
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Job Title */}
              <div className="form-control">
                <label className="label font-medium">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  className="input input-bordered w-full"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && (
                  <span className="text-error mt-1 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Location & Salary Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Location */}
                <div className="form-control">
                  <label className="label font-medium">Location</label>
                  <div className="relative">
                    <MapPin className="text-base-content/50 pointer-events-none absolute top-2 left-3 z-10 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="e.g. Remote / Bengaluru"
                      disabled={isRemote}
                      className={`input input-bordered w-full pl-10 ${isRemote ? 'bg-base-200 text-base-content/60' : ''}`}
                      {...register('location', {
                        required: 'Location is required',
                      })}
                    />
                  </div>
                  {errors.location && (
                    <span className="text-error mt-1 text-sm">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                {/* Salary */}
                <div className="form-control">
                  <label className="label font-medium">Salary (₹)</label>
                  <div className="relative">
                    <IndianRupee className="text-base-content/50 pointer-events-none absolute top-2 left-3 z-10 h-5 w-5" />
                    <input
                      type="number"
                      placeholder="e.g. 1200000"
                      className="input input-bordered w-full pl-10"
                      {...register('salary', {
                        required: 'Salary is required',
                        min: { value: 1, message: 'Salary must be positive' },
                      })}
                    />
                  </div>
                  {errors.salary && (
                    <span className="text-error mt-1 text-sm">
                      {errors.salary.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Job Type */}
              <div className="form-control">
                <label className="label font-medium">Job Type</label>
                <div className="relative">
                  <Clock className="text-base-content/50 pointer-events-none absolute top-2 left-3 z-10 h-5 w-5" />
                  <select
                    className="select select-bordered w-full pl-10"
                    {...register('jobType', {
                      required: 'Job Type is required',
                    })}
                  >
                    <option value="">Select Type...</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                {errors.jobType && (
                  <span className="text-error mt-1 text-sm">
                    {errors.jobType.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label font-medium">Job Description</label>
                <div className="relative">
                  <FileText className="text-base-content/50 absolute top-3.5 left-3 h-5 w-5" />
                  <textarea
                    className="textarea textarea-bordered h-32 w-full pt-3 pl-10"
                    placeholder="Describe the role responsibilities..."
                    {...register('description', {
                      required: 'Description is required',
                    })}
                  ></textarea>
                </div>
                {errors.description && (
                  <span className="text-error mt-1 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Requirements */}
              <div className="form-control">
                <label className="label font-medium">Requirements</label>
                <div className="relative">
                  <CheckCircle className="text-base-content/50 absolute top-3.5 left-3 h-5 w-5" />
                  <textarea
                    className="textarea textarea-bordered h-24 w-full pt-3 pl-10"
                    placeholder="Java, Spring Boot, React, Docker..."
                    {...register('requirements', {
                      required: 'Requirements are required',
                    })}
                  ></textarea>
                </div>
                {errors.requirements && (
                  <span className="text-error mt-1 text-sm">
                    {errors.requirements.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  className="btn btn-primary w-full text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting Job...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
