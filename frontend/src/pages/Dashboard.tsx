import DashboardLayout from "../components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-base-content/60 text-sm">
              Total Jobs
            </h2>
            <p className="text-4xl font-bold text-primary">1,240</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-base-content/60 text-sm">
              Active Applications
            </h2>
            <p className="text-4xl font-bold text-primary">5</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-base-content/60 text-sm">
              Profile Views
            </h2>
            <p className="text-4xl font-bold text-primary">12</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="text-center text-gray-500 py-10">
              No recent activity found.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
