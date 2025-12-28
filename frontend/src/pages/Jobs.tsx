import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import { getJobs } from "../api/jobService";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { Briefcase, IndianRupee, MapPin, Search } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetch Data Function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(
        page,
        9,
        locationFilter,
        typeFilter || undefined
      );
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Could not load jobs");
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
              className="flex flex-col md:flex-row gap-4 items-end"
            >
              {/* Location Input */}
              <div className="form-control w-full md:w-1/3">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-70" />
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
                  <option value="ON_SITE">On Site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Search button */}
              <button className="btn btn-primary w-full md:w-auto">
                <Search className="w-4 h-4" /> Search
              </button>
            </form>
          </div>
        </div>

        {/* --- 2. JOB LIST --- */}
        {loading ? (
          <div className="text-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-50">
            No jobs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200"
              >
                <div className="card-body">
                  <h2 className="card-title text-primary">
                    {job.title}
                    {job.type === "REMOTE" && (
                      <div className="badge badge-secondary badge-sm">
                        REMOTE
                      </div>
                    )}

                    {job.type === "HYBRID" && (
                      <div className="badge badge-accent badge-sm text-white">
                        HYBRID
                      </div>
                    )}

                    {job.type === "ONSITE" && (
                      <div className="badge badge-ghost badge-sm">ONSITE</div>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />{" "}
                      {job.postedByRecruiterName}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />{" "}
                      {job.salary.toLocaleString()}
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-auto">
                    <button className="btn btn-outline btn-primary btn-sm">
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
          <div className="flex justify-center mt-8 pb-8">
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
