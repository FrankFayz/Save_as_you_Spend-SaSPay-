import React, { useState, useEffect } from "react";
import { FiMenu, FiHome, FiCreditCard, FiPercent, FiBarChart2, FiList, FiSettings, FiLogOut } from "react-icons/fi";
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
        <FiMenu className="hamburger-icon" />
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
              <FiHome className="menu-icon" />
              Dashboard
            </li>

            <li onClick={() => {
              handleNavigate("dashboard");
              if (onPayClick) onPayClick();
            }}>
              <FiCreditCard className="menu-icon" />
              Pay Merchant
            </li>

            <li onClick={() => handleNavigate("wallet")}>
              <FiPercent className="menu-icon" />
              Savings Wallet
            </li>

            <li onClick={() => handleNavigate("insights")}>
              <FiBarChart2 className="menu-icon" />
              Insights
            </li>

            <li onClick={() => handleNavigate("transactions")}>
              <FiList className="menu-icon" />
              Recent Transactions
            </li>

            <li>
              <FiSettings className="menu-icon" />
              Settings
            </li>
          </ul>

          <button className="sidebar-action-btn" onClick={() => handleNavigate("wallet")}>Savings Wallet</button>
        </div>

        <div className="sidebar-footer">
          {/* SASPAY FEATURE CARD */}
          <div className="sidebar-saspay">
            <h4>Auto Saving</h4>
            <p>You're saving {savingPercent}% on every payment</p>
          </div>

          {/* LOGOUT */}
          <button className="logout-btn" onClick={onLogout}>
            <FiLogOut className="logout-icon" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;