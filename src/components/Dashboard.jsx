import {
  Award,
  Clock,
  Heart,
  TrendingDown,
  Activity,
  Repeat,
  ShowerHead,
  Sparkles,
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

function getActionTotal(entries) {
  return entries.reduce((total, entry) => {
    const actions = entry.actions || [];
    return (
      total +
      actions.reduce((sum, action) => sum + Number(action.count || 0), 0)
    );
  }, 0);
}

function getActionCountByKeyword(entries, keyword) {
  return entries.reduce((total, entry) => {
    const actions = entry.actions || [];

    return (
      total +
      actions.reduce((sum, action) => {
        const type = action.type?.toLowerCase() || "";

        if (type.includes(keyword.toLowerCase())) {
          return sum + Number(action.count || 0);
        }

        return sum;
      }, 0)
    );
  }, 0);
}

function getMostRepeatedAction(entries) {
  const actionMap = {};

  entries.forEach((entry) => {
    const actions = entry.actions || [];

    actions.forEach((action) => {
      const type = action.type || "Action";
      actionMap[type] = (actionMap[type] || 0) + Number(action.count || 0);
    });
  });

  const sortedActions = Object.entries(actionMap).sort((a, b) => b[1] - a[1]);

  if (!sortedActions.length) return null;

  return {
    type: sortedActions[0][0],
    count: sortedActions[0][1],
  };
}

function Dashboard({ entries }) {
  const averageCleaning = getAverage(entries, "cleaningMinutes");
  const averageAnxiety = getAverage(entries, "anxietyLevel");
  const bestDelay = getBestDelay(entries);
  const totalCheckIns = entries.length;
  const latestEntry = getLatestEntry(entries);

  const totalActions = getActionTotal(entries);
  const bathCount = getActionCountByKeyword(entries, "bath");
  const cleanCount = getActionCountByKeyword(entries, "clean");
  const washCount = getActionCountByKeyword(entries, "wash");
  const mostRepeatedAction = getMostRepeatedAction(entries);

  const chartData = entries.map((entry) => {
    const actions = entry.actions || [];
    const repeatedActions = actions.reduce(
      (sum, action) => sum + Number(action.count || 0),
      0
    );

    return {
      date: entry.date.slice(5),
      cleaning: entry.cleaningMinutes,
      pause: entry.delayMinutes,
      anxiety: entry.anxietyLevel,
      actions: repeatedActions,
    };
  });

  return (
    <section className="section" id="dashboard">
      <div className="section-title">
        <span>
          <Activity size={18} /> Gentle Progress
        </span>

        <h2>Your calm progress overview</h2>

        <p>
          See repeated actions, pauses, and patterns with kindness. The goal is
          not perfection — it is small awareness and gentle progress.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Clock size={24} />
          <p>Average cleaning time</p>
          <h3>{averageCleaning} min</h3>
        </div>

        <div className="stat-card">
          <TrendingDown size={24} />
          <p>Longest pause</p>
          <h3>{bestDelay} min</h3>
        </div>

        <div className="stat-card">
          <Heart size={24} />
          <p>Reflections saved</p>
          <h3>{totalCheckIns}</h3>
        </div>

        <div className="stat-card">
          <Repeat size={24} />
          <p>Repeated actions</p>
          <h3>{totalActions}</h3>
        </div>
      </div>

      <div className="stats-grid action-summary-grid">
        <div className="stat-card mini-pattern-card">
          <ShowerHead size={22} />
          <p>Bath count</p>
          <h3>{bathCount}</h3>
        </div>

        <div className="stat-card mini-pattern-card">
          <Sparkles size={22} />
          <p>Cleaning count</p>
          <h3>{cleanCount}</h3>
        </div>

        <div className="stat-card mini-pattern-card">
          <Repeat size={22} />
          <p>Hand wash / wash count</p>
          <h3>{washCount}</h3>
        </div>

        <div className="stat-card mini-pattern-card">
          <Award size={22} />
          <p>Average anxiety</p>
          <h3>{averageAnxiety}/10</h3>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Cleaning, pause, and repeated actions</h3>
          <p>
            This helps you see whether actions are repeating more or slowly
            reducing over time.
          </p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cleaning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b6cff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#9b6cff" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="pause" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f0a6ff" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#f0a6ff" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="actions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6d4bd6" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#6d4bd6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(116, 70, 180, 0.12)"
                />
                <XAxis dataKey="date" stroke="#8b7b99" />
                <YAxis stroke="#8b7b99" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="cleaning"
                  name="Cleaning minutes"
                  stroke="#7c5be8"
                  fillOpacity={1}
                  fill="url(#cleaning)"
                />

                <Area
                  type="monotone"
                  dataKey="pause"
                  name="Pause minutes"
                  stroke="#d875f0"
                  fillOpacity={1}
                  fill="url(#pause)"
                />

                <Area
                  type="monotone"
                  dataKey="actions"
                  name="Repeated actions"
                  stroke="#6d4bd6"
                  fillOpacity={1}
                  fill="url(#actions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="latest-card">
          <h3>Latest reflection</h3>

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
                <strong>Pause:</strong> {latestEntry.delayMinutes} min
              </p>
              <p>
                <strong>Mood:</strong> {latestEntry.mood}
              </p>

              <div className="latest-actions">
                <h4>Actions recorded</h4>

                {latestEntry.actions && latestEntry.actions.length > 0 ? (
                  latestEntry.actions.map((action) => (
                    <div className="latest-action-item" key={action.id}>
                      <span>{action.type}</span>
                      <p>
                        {action.count} time{action.count > 1 ? "s" : ""} •{" "}
                        {action.minutes} min
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No repeated actions added for this reflection.</p>
                )}
              </div>
            </>
          ) : (
            <p>No reflections yet. Start with today’s check-in.</p>
          )}

          <div className="soft-note">
            {mostRepeatedAction ? (
              <>
                Most repeated pattern: {mostRepeatedAction.type} happened{" "}
                {mostRepeatedAction.count} time
                {mostRepeatedAction.count > 1 ? "s" : ""}.
              </>
            ) : (
              <>No repeated pattern noticed yet.</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;