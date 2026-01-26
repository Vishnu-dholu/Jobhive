import { ArrowRight, Briefcase, Building, MapPin, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../api/jobService";
import type { Job } from "../types/job";

const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const data = await getJobs("", 0, 3)
        setFeaturedJobs(data.content)
      } catch (error) {
        console.error("Failed to load jobs")
      } finally {
        setLoading(false);
      }
    }
    fetchLatestJobs()
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get("keyword") as string
    navigate(`/jobs?keyword=${keyword}`)
  }

  return <div className="min-h-screen bg-base-100 font-sans">
    <nav className="navbar bg-base-100 max-w-7xl mx-auto px-4 py-3">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Briefcase className="w-8 h-8" /> JobHive
        </Link>
      </div>
      <div className="flex-none gap-3">
        <Link to="/login" className="btn btn-ghost">Login</Link>
        <Link to="/register" className="btn btn-primary px-6">Get Started</Link>
      </div>
    </nav>

    <header className="hero min-h-[500px] bg-base-200 rounded-b-[3rem] relative overflow-hidden">
      <div className="hero-content text-center max-w-3xl z-10">
        <div>
          <div className="badge badge-primary badge-outline mb-4 p-3">
            #1 Job Board for Developers
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Find Your <span className="text-primary">Dream Job</span> <br />
            Without the Hassle.
          </h1>
          <p className="py-4 text-xl text-base-content/70 mb-6">
            Connect with top tech companies. No spam, just real opportunities.</p>

          <form onSubmit={handleSearch} className="bg-base-100 p-2 rounded-full shadow-lg flex items-center max-w-lg mx-auto border border-base-300">
            <Search className="ml-4 w-5 h-5 text-base-content/50" />
            <input type="text" name="keyword" placeholder="Job title, keywords, or company..." className="input input-ghost w-full focus:bg-transparent border-none focus:outline-none ml-2" />
            <button className="btn btn-primary rounded-full px-8">Search</button>
          </form>

          <div className="mt-6 text-sm text-base-content/60">
            Popular: Backend, Frontend, DevOps, Java
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-48 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl"></div>
      </div>
    </header>

    {/* --- STATS SECTION --- */}
    <section className="py-16 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
          <div className="bg-primary/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
            <Briefcase className="text-primary w-6 h-6" />
          </div>
          <div className="text-4xl font-bold mb-1">1,000+</div>
          <div className="text-base-content/60">Active Jobs</div>
        </div>
        <div className="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
          <div className="bg-secondary/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
            <Building className="text-secondary w-6 h-6" />
          </div>
          <div className="text-4xl font-bold mb-1">500+</div>
          <div className="text-base-content/60">Top Companies</div>
        </div>
        <div className="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
          <div className="bg-secondary/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
            <Users className="text-secondary w-6 h-6" />
          </div>
          <div className="text-4xl font-bold mb-1">10k+</div>
          <div className="text-base-content/60">Candidates Hired</div>
        </div>
      </div>
    </section>

    {/* --- FEATURED JOBS SECTION --- */}
    <section className="py-16 bg-base-200/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Latest Opportunities</h2>
            <p className="text-base-content/60 mt-2">Fresh jobs posted recently</p>
          </div>
          <Link to="/jobs" className="btn btn-ghost gap-2">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
             <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-200">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-2">
                       <span className="badge badge-secondary badge-outline">{job.type}</span>
                       <span className="text-xs text-base-content/50">
                         {new Date(job.postedAt).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="card-title text-lg mb-1">{job.title}</h3>
                    <p className="text-sm text-base-content/60 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-base-content/70 mb-4">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="card-actions">
                      <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-outline btn-sm w-full">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </section>

    {/* --- FOOTER --- */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <aside>
          <Briefcase className="w-10 h-10 mb-2" />
          <p className="font-bold text-lg">JobHive Ltd.</p>
          <p>Connecting Talent with Opportunity since 2026</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </div>
        </nav>
      </footer>
  </div>
}

export default Home
