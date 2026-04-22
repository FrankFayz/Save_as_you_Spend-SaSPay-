import React, { useState, useEffect } from "react";
import { FiDollarSign } from "react-icons/fi";
import logo from "../../assets/logo.png";

const Header = ({ user, onPayClick, onWalletClick }) => {
  const displayName = user ? user.username : "User";
  const [showWalletQuick, setShowWalletQuick] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    if (showWalletQuick && user?.phone) {
      fetchQuickWallet();
    }
  }, [showWalletQuick, user?.phone]);

  const fetchQuickWallet = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wallet/get/?phone=${encodeURIComponent(user.phone)}`
      );
      const data = await response.json();
      if (response.ok) {
        setWalletBalance(data.wallet);
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-logo-wrap">
          <img src={logo} alt="SaSPay Logo" className="header-logo" />
        </div>

        <div className="header-welcome">
          <span className="header-subtitle">Good day,</span>
          <h1>Hello {displayName}</h1>
          <p>Welcome to <strong>SaSPay</strong></p>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="header-wallet-btn"
          onClick={() => setShowWalletQuick(!showWalletQuick)}
          style={{ marginRight: "10px" }}
          title="View wallet balance"
        >
          💳 {walletBalance ? `${parseFloat(walletBalance.ugx_balance).toFixed(2)} UGX` : "Wallet"}
        </button>
        <button className="header-pay-btn" onClick={onPayClick}>
          <FiDollarSign className="header-pay-icon" />
          Pay Now
        </button>
      </div>

      {showWalletQuick && walletBalance && (
        <div className="wallet-quick-view">
          <div className="quick-wallet-card">
            <div className="qw-row">
              <span className="qw-label">XLM Balance:</span>
              <span className="qw-value">{parseFloat(walletBalance.xlm_balance).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 })} XLM</span>
            </div>
            <div className="qw-row">
              <span className="qw-label">UGX Equivalent:</span>
              <span className="qw-value">UGX {parseFloat(walletBalance.ugx_balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="qw-rate">Exchange Rate: 1 XLM = 4,500 UGX</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;