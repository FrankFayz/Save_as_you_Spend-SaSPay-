import React, { useState, useEffect } from "react";
import "./MainDashboard.css";

const Sidebar = ({ user, onLogout, onProfileClick, onNavigate, onPayClick }) => {
  const [open, setOpen] = useState(false);
  const [savingPercent, setSavingPercent] = useState(10);
  const displayName = user ? user.username : "User";
  const profilePicture = user?.profile_picture || "https://img.icons8.com/fluency/96/user-male-circle.png";

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("savingsPercentage");
    setSavingPercent(saved ? Number(saved) : 10);
  }, [open]);

  useEffect(() => {
    const handlePercentChange = (event) => {
      const value = Number(event.detail);
      setSavingPercent(value > 0 ? value : 10);
    };

    window.addEventListener("savingsPercentageChanged", handlePercentChange);
    return () => window.removeEventListener("savingsPercentageChanged", handlePercentChange);
  }, []);

  const handleNavigate = (section) => {
    if (onNavigate) onNavigate(section);
    setOpen(false);
  };

  return (
    <>
      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* OVERLAY (for mobile) */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-body">
          {/* TOP SECTION */}
          <div className="sidebar-header">
            <h2>SaS<span>Pay</span></h2>
            <p>Save As You Spend</p>
          </div>

          {/* USER PROFILE */}
          <div className="profile" onClick={() => onProfileClick && onProfileClick()}>
            <img 
              src={profilePicture} 
              alt="user"
              className="profile-clickable"
            />
            <h4>{displayName}</h4>
            <p>Active User</p>
          </div>

          {/* MENU */}
          <ul className="menu">
          <li onClick={() => handleNavigate("dashboard")}> 
            <img src="https://img.icons8.com/fluency/24/dashboard-layout.png"/>
            Dashboard
          </li>

          <li onClick={() => {
            handleNavigate("dashboard");
            if (onPayClick) onPayClick();
          }}>
            <img src="https://img.icons8.com/fluency/24/qr-code.png"/>
            Pay Merchant
          </li>

          <li onClick={() => handleNavigate("savings")}> 
            <img src="https://img.icons8.com/fluency/24/wallet.png"/>
            Savings Wallet
          </li>

          <li onClick={() => handleNavigate("insights")}> 
            <img src="https://img.icons8.com/fluency/24/combo-chart.png"/>
            Insights
          </li>

          <li onClick={() => handleNavigate("transactions")}> 
            <img src="https://img.icons8.com/fluency/24/list.png"/>
            Recent Transactions
          </li>

          <li>
            <img src="https://img.icons8.com/fluency/24/settings.png"/>
            Settings
          </li>
        </ul>

          <button className="sidebar-action-btn" onClick={() => handleNavigate("savings")}>Savings Wallet</button>
        </div>

        <div className="sidebar-footer">
          {/* SASPAY FEATURE CARD */}
          <div className="sidebar-saspay">
            <h4>💡 Auto Saving</h4>
            <p>You're saving {savingPercent}% on every payment</p>
          </div>

          {/* LOGOUT */}
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;