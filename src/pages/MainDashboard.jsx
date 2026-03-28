// import Board from "../components/KanbanBoard/Board";

const MainDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Welcome back! 🚀
        </h2>
        <p className="text-white/60 mt-2 font-medium">
          Here's a quick overview of your workspace.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Tasks", value: "12", color: "from-blue-500 to-cyan-500" },
          { label: "Projects", value: "4", color: "from-purple-500 to-pink-500" },
          { label: "Team Members", value: "8", color: "from-orange-500 to-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-default group">
            <p className="text-sm font-semibold text-white/40 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-4">
              <span className="text-4xl font-bold text-white">{stat.value}</span>
              <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
