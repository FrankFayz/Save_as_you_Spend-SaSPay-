import React, { useState, useEffect } from "react";
import "./SavingsWallet.css";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

const SavingsWallet = ({ user, refreshTrigger }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [xlmRate] = useState(0.000222); // 1 UGX = 0.000222 XLM
  const API_BASE_URL = "http://localhost:8000/api";

  // Fetch wallet on mount and when refreshTrigger changes (after payment)
  useEffect(() => {
    if (user?.phone) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user?.phone, refreshTrigger]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.phone) {
        setError("User phone number not found. Please log in again.");
        return;
      }
      
      console.log(`Fetching wallet for phone: ${user.phone}`);
      const response = await fetch(
        `${API_BASE_URL}/wallet/get/?phone=${encodeURIComponent(user.phone)}`
      );
      
      console.log(`Wallet API response status: ${response.status}`);
      const data = await response.json();
      console.log(`Wallet API response data:`, data);

      if (response.ok) {
        setWallet(data.wallet);
      } else {
        // If wallet doesn't exist, create one
        if (data.message && data.message.includes("not found")) {
          console.log("Wallet not found, creating new one...");
          createWallet();
        } else {
          setError(data.message || "Error fetching wallet");
        }
      }
    } catch (err) {
      console.error("Fetch wallet error:", err);
      setError(`Failed to connect to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      console.log("Creating wallet for phone:", user.phone);
      const response = await fetch(`${API_BASE_URL}/wallet/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone }),
      });
      const data = await response.json();
      
      console.log(`Create wallet response status: ${response.status}`);
      console.log(`Create wallet response:`, data);

      if (response.ok) {
        setWallet(data.wallet);
        setError(null);
      } else {
        setError(data.message || "Error creating wallet");
      }
    } catch (err) {
      console.error("Create wallet error:", err);
      setError(`Failed to create wallet: ${err.message}`);
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log("Fetching transactions for phone:", user.phone);
      const response = await fetch(
        `${API_BASE_URL}/wallet/transactions/?phone=${encodeURIComponent(user.phone)}`
      );
      const data = await response.json();
      
      console.log(`Transactions API response:`, data);

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        console.error("Error fetching transactions:", data.message);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(wallet.ugx_balance)) {
      setError("Insufficient balance");
      return;
    }

    try {
      setIsWithdrawing(true);
      setError(null);
      console.log("Processing withdrawal:", { phone: user.phone, amount_ugx: withdrawAmount });
      
      const response = await fetch(`${API_BASE_URL}/wallet/withdraw/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user.phone,
          amount_ugx: withdrawAmount,
        }),
      });
      const data = await response.json();
      
      console.log(`Withdraw response status: ${response.status}`, data);

      if (response.ok) {
        setWallet(data.wallet);
        setWithdrawAmount("");
        setShowWithdrawModal(false);
        await fetchTransactions();
      } else {
        setError(data.message || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      setError(`Failed to process withdrawal: ${err.message}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatXLMBalance = (balance) => {
    return parseFloat(balance).toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  };

  if (loading) {
    return (
      <div className="savings-wallet">
        <div className="wallet-loading">
          <div className="spinner"></div>
          <p>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="savings-wallet">
        <div className="wallet-error">
          <FiAlertCircle className="error-icon" />
          <p>{error || "Wallet not found"}</p>
          <button className="retry-btn" onClick={createWallet}>
            Create Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="savings-wallet">
      <div className="wallet-header">
        <h2>💳 Savings Wallet</h2>
        <button className="refresh-btn" onClick={() => fetchWallet()}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* BALANCE CARDS */}
      <div className="balance-cards">
        <div className="balance-card xlm-primary">
          <div className="card-label">💎 Stellar Lumens (Real XLM)</div>
          <div className="card-amount-xlm">{formatXLMBalance(wallet.xlm_balance)} XLM</div>
          <div className="card-subtitle">Your blockchain balance</div>
          <div className="card-equivalent-ugx">
            ≈ UGX {formatBalance(wallet.ugx_balance)}
          </div>
          <div className="exchange-rate-small">@ 1 XLM = 4,500 UGX</div>
        </div>

        <div className="balance-card ugx">
          <div className="card-label">Uganda Shillings</div>
          <div className="card-amount">UGX {formatBalance(wallet.ugx_balance)}</div>
          <div className="card-subtitle">Equivalent Value</div>
          <div className="card-equivalent">
            ≈ {formatXLMBalance(wallet.xlm_balance)} XLM
          </div>
        </div>
      </div>

      {/* EXCHANGE RATE INFO */}
      <div className="exchange-info">
        <p>💱 Exchange Rate: 1 XLM = 4,500 UGX</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="wallet-actions">
        <button
          className="action-btn withdraw"
          onClick={() => setShowWithdrawModal(true)}
        >
          <FiArrowDown /> Withdraw Savings
        </button>
        <button className="action-btn info">
          <FiArrowUp /> View Deposits
        </button>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="transactions-section">
        <h3>Recent Activity</h3>
        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-icon">
                  {tx.transaction_type === "withdraw" ? (
                    <FiArrowDown />
                  ) : (
                    <FiArrowUp />
                  )}
                </div>
                <div className="tx-details">
                  <div className="tx-type">
                    {tx.transaction_type === "withdraw"
                      ? "Withdrawal"
                      : "Deposit"}
                  </div>
                  <div className="tx-date">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="tx-amounts">
                  <div className="tx-amount">
                    UGX {formatBalance(tx.amount_ugx)}
                  </div>
                  <div className="tx-xlm">
                    {formatXLMBalance(tx.amount_xlm)} XLM
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Withdraw Savings</h3>
              <button
                className="close-btn"
                onClick={() => setShowWithdrawModal(false)}
              >
                ✖
              </button>
            </div>

            <div className="modal-content">
              <div className="balance-display">
                <span>Available Balance:</span>
                <span className="balance-amount">
                  UGX {formatBalance(wallet.ugx_balance)}
                </span>
              </div>

              <input
                type="number"
                placeholder="Enter amount in UGX"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={wallet.ugx_balance}
                min="0"
                className="withdraw-input"
              />

              {withdrawAmount && (
                <div className="conversion-preview">
                  <p>
                    You will withdraw: {formatXLMBalance(parseFloat(withdrawAmount) * 0.000222)} XLM
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsWallet;
