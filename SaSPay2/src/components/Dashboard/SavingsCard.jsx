import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SavingsCard = ({ transactions }) => {
  const [percentage, setPercentage] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPercentage, setTempPercentage] = useState(percentage);
  const [monthlyProjection, setMonthlyProjection] = useState(0);

  // Load saved percentage from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savingsPercentage");
    if (saved) {
      const value = Number(saved);
      setPercentage(value);
      setTempPercentage(value);
    }
  }, []);

  // Calculate monthly projection (assuming 50,000/month average spending)
  useEffect(() => {
    const monthlySpending = 50000;
    const savings = Math.floor(monthlySpending * (percentage / 100));
    setMonthlyProjection(savings);
  }, [percentage]);

  const handleSave = () => {
    const value = Number(tempPercentage);
    if (value < 1 || value > 100) {
      alert("Please enter a percentage between 1 and 100");
      return;
    }
    setPercentage(value);
    localStorage.setItem("savingsPercentage", value.toString());
    window.dispatchEvent(new CustomEvent("savingsPercentageChanged", { detail: value }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPercentage(percentage);
    setIsEditing(false);
  };

  const exampleAmount = 10000;
  const exampleSavings = Math.floor(exampleAmount * (percentage / 100));

  // Calculate real financial data from transactions
  const totalSpent = transactions.reduce((sum, txn) => sum + txn.price, 0);
  const totalSaved = transactions.reduce((sum, txn) => sum + txn.savings, 0);

  // Pie chart data
  const pieData = [
    { name: 'Money Spent', value: totalSpent, color: '#ef4444' },
    { name: 'Money Saved', value: totalSaved, color: '#10b981' }
  ];

  // Line chart data - cumulative spending and saving over time
  const lineData = transactions.slice().reverse().map((txn, index) => {
    const cumulativeSpent = transactions.slice(0, transactions.length - index).reduce((sum, t) => sum + t.price, 0);
    const cumulativeSaved = transactions.slice(0, transactions.length - index).reduce((sum, t) => sum + t.savings, 0);
    return {
      date: new Date(txn.time).toLocaleDateString(),
      spent: cumulativeSpent,
      saved: cumulativeSaved
    };
  });

  return (
    <div className="auto-savings-section">
      {/* SAVINGS SETTINGS CARD */}
      <div className="savings-settings">
        <div className="settings-header">
          <div className="settings-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
              <path d="M3 7h18" />
              <path d="M16 3h-2a2 2 0 0 0-4 0H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
            </svg>
          </div>
          <div className="settings-title">
            <h3>Auto Savings Settings</h3>
            <p>Configure your automatic savings on every payment</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="settings-display">
            <div className="current-setting">
              <div className="setting-label">Current Savings Rate</div>
              <div className="setting-value">{percentage}%</div>
            </div>

            <div className="monthly-projection">
              <div className="projection-icon">📈</div>
              <div className="projection-details">
                <div className="projection-label">Estimated Monthly Savings</div>
                <div className="projection-amount">UGX {monthlyProjection.toLocaleString()}</div>
                <p className="projection-note">Based on UGX 50,000 monthly spending</p>
              </div>
            </div>

            <button className="edit-settings-btn" onClick={() => setIsEditing(true)}>
              ✎ Change Percentage
            </button>
          </div>
        ) : (
          <div className="settings-form">
            <div className="form-group">
              <label>Enter Your Desired Savings Percentage</label>
              <div className="percentage-input-wrapper">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempPercentage}
                  onChange={(e) => setTempPercentage(e.target.value)}
                  className="percentage-input-field"
                  placeholder="Enter 1-100"
                />
                <span className="percentage-symbol">%</span>
              </div>
            </div>

            <div className="form-preview">
              <div className="preview-box">
                <p className="preview-label">Preview:</p>
                <p className="preview-text">
                  Pay UGX 10,000 → Save UGX {exampleSavings}
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button className="submit-percentage-btn" onClick={handleSave}>
                ✓ Save Percentage
              </button>
              <button className="cancel-percentage-btn" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FINANCIAL INSIGHTS */}
      <div className="financial-insights">
        <div className="insights-header">
          <div className="insights-icon">💡</div>
          <h3>Financial Insights</h3>
        </div>

        <div className="insights-charts">
          {/* PIE CHART */}
          <div className="chart-card">
            <h4>Spending vs Savings</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Total Spent:</span>
                <span className="summary-value spent">UGX {totalSpent.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Saved:</span>
                <span className="summary-value saved">UGX {totalSaved.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* LINE CHART */}
          <div className="chart-card">
            <h4>Spending & Savings Trend</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [`UGX ${value.toLocaleString()}`, name === 'spent' ? 'Cumulative Spent' : 'Cumulative Saved']}
                    labelStyle={{ color: '#f3f4f6' }}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saved"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCard;