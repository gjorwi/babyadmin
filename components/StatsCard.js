export default function StatsCard({ icon: Icon, label, value, color, subtext }) {
  const colorMap = {
    pink: "from-pink-500 to-rose-400",
    cyan: "from-cyan-500 to-teal-400",
    purple: "from-purple-500 to-violet-400",
    green: "from-emerald-500 to-green-400",
    orange: "from-orange-500 to-amber-400",
    blue: "from-blue-500 to-indigo-400",
  };

  return (
    <div className="stat-card bg-white rounded-xl border border-border p-5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtext && <p className="text-xs text-muted mt-1">{subtext}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.cyan} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
