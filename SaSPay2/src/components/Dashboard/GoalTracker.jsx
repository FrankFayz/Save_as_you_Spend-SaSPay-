import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./GoalTracker.css";

const GoalTracker = ({ transactions }) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [savingPercent, setSavingPercent] = useState(10);

  useEffect(() => {
    const saved = localStorage.getItem("savingsPercentage");
    setSavingPercent(saved ? Number(saved) : 10);

    const handlePercentChange = (event) => {
      const value = Number(event.detail);
      setSavingPercent(value > 0 ? value : 10);
    };

    window.addEventListener("savingsPercentageChanged", handlePercentChange);
    return () => window.removeEventListener("savingsPercentageChanged", handlePercentChange);
  }, []);

  useEffect(() => {
    const percent = savingPercent || 10;

    const savings = transactions.reduce((acc, tx) => {
      const price = Number(tx.price) || 0;
      return acc + (price * percent) / 100;
    }, 0);

    setTotalSaved(savings);
  }, [transactions, savingPercent]);

  const [goalTitle, setGoalTitle] = useState("Dream Savings Goal");
  const [goalTarget, setGoalTarget] = useState(100000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [goalMessage, setGoalMessage] = useState("");

  useEffect(() => {
    const savedTitle = localStorage.getItem("goalTitle");
    const savedTarget = localStorage.getItem("goalTarget");
    const savedDeposit = localStorage.getItem("monthlyDeposit");

    if (savedTitle) setGoalTitle(savedTitle);
    if (savedTarget) setGoalTarget(Number(savedTarget));
    if (savedDeposit) setMonthlyDeposit(Number(savedDeposit));
  }, []);

  const goalData = transactions
    .slice()
    .reverse()
    .reduce((acc, tx) => {
      const previous = acc[acc.length - 1] || { cumulative: 0 };
      const price = Number(tx.price) || 0;
      const nextSaved = previous.cumulative + (price * savingPercent) / 100;
      acc.push({ date: new Date(tx.time).toLocaleDateString(), cumulative: Math.round(nextSaved) });
      return acc;
    }, []);

  const progressPercent = goalTarget > 0 ? Math.min(100, Math.round((totalSaved / goalTarget) * 100)) : 0;
  const remainingAmount = Math.max(0, Math.round(goalTarget - totalSaved));
  const estimateMonths = monthlyDeposit > 0 ? Math.max(0, Math.ceil(remainingAmount / monthlyDeposit)) : null;

  const handleGoalSubmit = (event) => {
    event.preventDefault();

    if (!goalTitle.trim()) {
      setGoalMessage("Please enter a goal title.");
      return;
    }

    if (goalTarget <= 0) {
      setGoalMessage("Set a target amount greater than 0.");
      return;
    }

    setGoalMessage("Goal saved! Your tracker is up to date.");
    localStorage.setItem("goalTitle", goalTitle);
    localStorage.setItem("goalTarget", goalTarget.toString());
    localStorage.setItem("monthlyDeposit", monthlyDeposit.toString());
  };

  return (
    <div className="goal-tracker">
      <div className="goal-tracker-top">
        <div>
          <h3>Goal Tracker</h3>
          <p className="goal-subtitle">Set a savings goal and track your progress with a clean, modern dashboard.</p>
        </div>
        <div className="goal-rate">Current saving rate: <strong>{savingPercent}%</strong></div>
      </div>

      <form className="goal-form" onSubmit={handleGoalSubmit}>
        <div>
          <label htmlFor="goalTitle">Goal name</label>
          <input
            id="goalTitle"
            placeholder="e.g. Emergency Fund"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="goalTarget">Goal amount</label>
          <input
            id="goalTarget"
            type="number"
            placeholder="KES 100,000"
            value={goalTarget}
            onChange={(e) => setGoalTarget(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="monthlyDeposit">Monthly contribution</label>
          <input
            id="monthlyDeposit"
            type="number"
            placeholder="KES 5,000"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
          />
        </div>

        <div className="goal-form-actions">
          <button type="submit">Save goal</button>
          <p className="goal-form-note">Keep your goal updated and watch the progress bar move with each payment.</p>
        </div>
      </form>

      {goalMessage && <p className="goal-form-message">{goalMessage}</p>}

      <div className="goal-progress">
        <div className="goal-progress-header">
          <div>
            <h4>{goalTitle}</h4>
            <p>Track your milestone progress</p>
          </div>
          <div className="goal-progress-percent">{progressPercent}%</div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="goal-stats">
          <div>
            <span>Goal target</span>
            <strong>UGX {goalTarget.toLocaleString()}</strong>
          </div>
          <div>
            <span>Current saved</span>
            <strong>UGX {Math.round(totalSaved).toLocaleString()}</strong>
          </div>
          <div>
            <span>Remaining</span>
            <strong>UGX {remainingAmount.toLocaleString()}</strong>
          </div>
          <div>
            <span>Monthly plan</span>
            <strong>UGX {monthlyDeposit.toLocaleString()}</strong>
          </div>
        </div>

        <p className="goal-estimate">
          {progressPercent >= 100
            ? "Goal achieved — well done!"
            : estimateMonths !== null
            ? `At your current plan, you could reach this goal in ${estimateMonths} month${estimateMonths === 1 ? "" : "s"}.`
            : "Add a monthly contribution to estimate your goal timeline."}
        </p>
      </div>

      <div className="goal-chart-card">
        <h4>Progress trend</h4>
        {goalData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={goalData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`UGX ${Number(value).toLocaleString()}`, 'Saved']}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
              />
              <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder">Make your first payment and the savings trend will appear here.</div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;