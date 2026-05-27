import {
  Award,
  Clock,
  Flame,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  getAverage,
  getBestDelay,
  getLatestEntry,
  getTotal,
} from "../utils/progressUtils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard({ entries }) {
  const averageCleaning = getAverage(entries, "cleaningMinutes");
  const averageAnxiety = getAverage(entries, "anxietyLevel");
  const bestDelay = getBestDelay(entries);
  const totalCheckIns = entries.length;
  const latestEntry = getLatestEntry(entries);

  const chartData = entries.map((entry) => ({
    date: entry.date.slice(5),
    cleaning: entry.cleaningMinutes,
    delay: entry.delayMinutes,
    anxiety: entry.anxietyLevel,
  }));

  return (
    <section className="section" id="dashboard">
      <div className="section-title">
        <span>
          <Activity size={18} /> Progress Dashboard
        </span>
        <h2>Your small wins overview</h2>
        <p>
          Use this dashboard to understand patterns, triggers, and slow progress.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Clock size={24} />
          <p>Average Cleaning</p>
          <h3>{averageCleaning} min</h3>
        </div>

        <div className="stat-card">
          <TrendingDown size={24} />
          <p>Best Delay</p>
          <h3>{bestDelay} min</h3>
        </div>

        <div className="stat-card">
          <Flame size={24} />
          <p>Total Check-ins</p>
          <h3>{totalCheckIns}</h3>
        </div>

        <div className="stat-card">
          <Award size={24} />
          <p>Average Anxiety</p>
          <h3>{averageAnxiety}/10</h3>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Cleaning vs Delay Trend</h3>
          <p>Track cleaning minutes and delay wins day by day.</p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cleaning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="delay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cleaning"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#cleaning)"
                />
                <Area
                  type="monotone"
                  dataKey="delay"
                  stroke="#14b8a6"
                  fillOpacity={1}
                  fill="url(#delay)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="latest-card">
          <h3>Latest Check-in</h3>

          {latestEntry ? (
            <>
              <p>
                <strong>Date:</strong> {latestEntry.date}
              </p>
              <p>
                <strong>Trigger:</strong> {latestEntry.trigger}
              </p>
              <p>
                <strong>Urge:</strong> {latestEntry.urgeLevel}/10
              </p>
              <p>
                <strong>Cleaning:</strong> {latestEntry.cleaningMinutes} min
              </p>
              <p>
                <strong>Delay:</strong> {latestEntry.delayMinutes} min
              </p>
              <p>
                <strong>Mood:</strong> {latestEntry.mood}
              </p>
            </>
          ) : (
            <p>No entries yet. Add today’s check-in first.</p>
          )}

          <div className="soft-note">
            Total cleaning tracked: {getTotal(entries, "cleaningMinutes")} min
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;