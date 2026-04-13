import React, { useState, useRef } from "react";
import "./MainDashboard.css";
import "./AutoSavings.css";
import Header from "./Header";
import QuickActions from "./QuickActions";
import SavingsCard from "./SavingsCard";
import Transactions from "./Transactions";
import CurrencyMarket from "./CurrencyMarket";
import Insights from "./Insights";
import GoalTracker from "./GoalTracker";
import Sidebar from "./Sidebar";
import PaymentModal from "./PaymentModal";

const MainDashboard = ({ user, onLogout, onProfileClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const savingsRef = useRef(null);

  const handleNavigate = (section) => {
    if (section === "dashboard") {
      setCurrentView("dashboard");
      return;
    }

    if (section === "transactions") {
      setCurrentView("transactions");
      return;
    }

    if (section === "insights") {
      setCurrentView("insights");
      return;
    }

    setCurrentView("dashboard");

    if (section === "savings" && savingsRef.current) {
      savingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNewTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  return (
    <div className="app">
      <Sidebar
        user={user}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onNavigate={handleNavigate}
        onPayClick={() => setShowModal(true)}
      />
      <div className="main">
        <Header user={user} onPayClick={() => setShowModal(true)} />

        {currentView === "dashboard" ? (
          <>
            <QuickActions />

            <div ref={savingsRef}>
              <SavingsCard transactions={transactions} />
            </div>

            <GoalTracker transactions={transactions} />

            <CurrencyMarket />
          </>
        ) : currentView === "transactions" ? (
          <div className="transactions-page">
            <div className="transactions-header">
              <button className="back-button" onClick={() => setCurrentView("dashboard")}>← Back to Dashboard</button>
              <h3>Recent Transactions</h3>
            </div>
            <Transactions transactions={transactions} />
          </div>
        ) : currentView === "insights" ? (
          <div className="insights-page">
            <button className="back-button" onClick={() => setCurrentView("dashboard")}>← Back to Dashboard</button>
            <Insights />
          </div>
        ) : null}
      </div>

      {showModal && (
        <PaymentModal
          closeModal={() => setShowModal(false)}
          addTransaction={handleNewTransaction}
        />
      )}
    </div>
  );
};

export default MainDashboard;