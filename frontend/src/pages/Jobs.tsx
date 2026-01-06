import { useEffect, useState } from 'react';
import type { Job } from '../types/job';
import { getJobs } from '../api/jobService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { Briefcase, IndianRupee, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [keyword, setKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch Data Function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(
        keyword,
        page,
        9,
        locationFilter,
        typeFilter || undefined
      );
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      toast.error('Could not load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Load on Mount & when Page changes
  useEffect(() => {
    fetchJobs();
  }, [page]); // Re-runs when page number changes

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* --- 1. SEARCH BAR --- */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body py-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col items-end gap-4 md:flex-row"
            >
              {/* Keyword Input */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Search</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <Search className="h-4 w-4 opacity-70" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Java, Manager..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </label>
              </div>

              {/* Location Input */}
              <div className="form-control w-full md:w-1/3">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-70" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="e.g. New York"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </label>
              </div>

              {/* Type DropDown */}
              <div className="form-control w-full md:w-1/3">
                <label className="label">
                  <span className="label-text">Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All types</option>
                  <option value="ONSITE">On Site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Search button */}
              <button className="btn btn-primary w-full md:w-auto">
                <Search className="h-4 w-4" /> Search
              </button>
            </form>
          </div>
        </div>

        {/* --- 2. JOB LIST --- */}
        {loading ? (
          <div className="py-20 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center text-gray-50">
            No jobs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card bg-base-100 border-base-200 border shadow-xl transition-shadow duration-300 hover:shadow-2xl"
              >
                <div className="card-body">
                  <h2 className="card-title text-primary">
                    {job.title}
                    {job.type === 'REMOTE' && (
                      <div className="badge badge-secondary badge-sm">
                        REMOTE
                      </div>
                    )}

                    {job.type === 'HYBRID' && (
                      <div className="badge badge-accent badge-sm text-white">
                        HYBRID
                      </div>
                    )}

                    {job.type === 'ONSITE' && (
                      <div className="badge badge-ghost badge-sm">ONSITE</div>
                    )}
                  </h2>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {job.description}
                  </p>

                  <div className="mb-4 flex flex-col gap-2 text-sm text-gray-600">
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

                  <div className="card-actions mt-auto justify-end">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="btn btn-outline btn-primary btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 3. PAGINATION --- */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center pb-8">
            <div className="join">
              <button
                className="join-item btn"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                «
              </button>
              <button className="join-item btn">
                Page {page + 1} of {totalPages}
              </button>
              <button
                className="join-item btn"
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
