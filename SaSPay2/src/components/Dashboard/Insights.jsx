import React, { useState, useEffect } from "react";
import { FiDollarSign, FiTarget, FiBarChart2, FiZap } from "react-icons/fi";
import "./Insights.css";

const Insights = () => {
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(10);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Load transactions from localStorage
    const txnString = sessionStorage.getItem("all_transactions");
    if (txnString) {
      const txns = JSON.parse(txnString);
      setTransactions(txns);
      
      const total = txns.reduce((sum, txn) => sum + txn.amount, 0);
      const saved = (total * savingsPercentage) / 100;
      
      setTotalSpent(total);
      setSavingsAmount(saved);
    }

    const savedPercent = localStorage.getItem("savingsPercentage");
    if (savedPercent) {
      setSavingsPercentage(Number(savedPercent));
    }
  }, []);

  // Calculate spending by category
  const spendingByCategory = transactions.reduce((acc, txn) => {
    const existing = acc.find(item => item.category === txn.category);
    if (existing) {
      existing.amount += txn.amount;
    } else {
      acc.push({ category: txn.category, amount: txn.amount });
    }
    return acc;
  }, []);

  // Calculate monthly trend
  const monthlyTrend = [
    { month: "Jan", spending: 2400, savings: 240 },
    { month: "Feb", spending: 1398, savings: 140 },
    { month: "Mar", spending: 2210, savings: 221 },
    { month: "Apr", spending: 2290, savings: 229 },
    { month: "May", spending: 2000, savings: 200 },
    { month: "Jun", spending: 2181, savings: 218 },
  ];

  const getTopCategory = () => {
    if (spendingByCategory.length === 0) return { category: "No data", amount: 0 };
    return spendingByCategory.reduce((max, current) => 
      current.amount > max.amount ? current : max
    );
  };

  const topCategory = getTopCategory();

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>Financial Insights</h2>
        <p>Analyze your spending patterns and savings</p>
      </div>

      {/* KPI CARDS */}
      <div className="insights-kpi">
        <div className="kpi-card total-spent">
          <div className="kpi-icon"><FiDollarSign /></div>
          <div className="kpi-content">
            <p className="kpi-label">Total Spent</p>
            <h3 className="kpi-value">KES {totalSpent.toLocaleString()}</h3>
            <p className="kpi-change">This month</p>
          </div>
        </div>

        <div className="kpi-card amount-saved">
          <div className="kpi-icon"><FiTarget /></div>
          <div className="kpi-content">
            <p className="kpi-label">Automatically Saved</p>
            <h3 className="kpi-value">KES {savingsAmount.toLocaleString()}</h3>
            <p className="kpi-change">{savingsPercentage}% of spending</p>
          </div>
        </div>

        <div className="kpi-card spending-rate">
          <div className="kpi-icon"><FiBarChart2 /></div>
          <div className="kpi-content">
            <p className="kpi-label">Top Category</p>
            <h3 className="kpi-value">{topCategory.category}</h3>
            <p className="kpi-change">KES {topCategory.amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="kpi-card efficiency">
          <div className="kpi-icon"><FiZap /></div>
          <div className="kpi-content">
            <p className="kpi-label">Efficiency Score</p>
            <h3 className="kpi-value">A+</h3>
            <p className="kpi-change">Great spending habits</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="insights-charts">
        {/* Spending Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Spending Trend</h3>
            <span className="chart-period">Last 6 months</span>
          </div>
          <div className="chart-bars">
            {monthlyTrend.map((item, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ height: `${(item.spending / 2500) * 100}%` }}
                    title={`${item.month}: KES ${item.spending}`}
                  ></div>
                </div>
                <p className="chart-label">{item.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spending by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Spending by Category</h3>
            <span className="chart-period">Current distribution</span>
          </div>
          <div className="category-list">
            {spendingByCategory.length > 0 ? (
              spendingByCategory.map((item, idx) => {
                const percentage = (item.amount / totalSpent) * 100;
                return (
                  <div key={idx} className="category-item">
                    <div className="category-info">
                      <p className="category-name">{item.category}</p>
                      <p className="category-amount">KES {item.amount.toLocaleString()}</p>
                    </div>
                    <div className="progress-wrapper">
                      <div className="progress-bar-category" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="category-percent">{percentage.toFixed(1)}%</p>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No spending data available yet</p>
            )}
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="insights-recommendations">
        <h3>Smart Recommendations</h3>
        <ul>
          <li>You're saving {savingsPercentage}% per transaction — keep it up!</li>
          <li>Your biggest expense category is {topCategory.category || "uncategorized"}</li>
          <li>Consider setting a goal to reduce spending in this category by 10%</li>
          <li>You've been consistent - maintain this excellent discipline</li>
        </ul>
      </div>
    </div>
  );
};

export default Insights;
