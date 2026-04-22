import React, { useState, useEffect } from "react";
import "./Transactions.css";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const Transactions = ({ transactions, user, refreshTrigger }) => {
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchWalletTransactions();
  }, [user?.phone, refreshTrigger]);

  const fetchWalletTransactions = async () => {
    if (!user?.phone) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/wallet/transactions/?phone=${encodeURIComponent(user.phone)}`
      );
      const data = await response.json();

      if (response.ok) {
        setWalletTransactions(data.transactions || []);
      } else {
        console.error("Error fetching wallet transactions:", data.message);
      }
    } catch (err) {
      console.error("Fetch wallet transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatXLM = (balance) => {
    return parseFloat(balance).toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  };

  // Combine and sort transactions
  const allTransactions = [
    ...transactions.map(tx => ({
      ...tx,
      source: 'local',
      type: 'payment'
    })),
    ...walletTransactions.map(tx => ({
      ...tx,
      source: 'wallet',
      type: tx.transaction_type
    }))
  ].sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : new Date(a.created_at).getTime();
    const timeB = b.time ? new Date(b.time).getTime() : new Date(b.created_at).getTime();
    return timeB - timeA;
  });

  if (loading && walletTransactions.length === 0) {
    return (
      <div className="transactions">
        <h3>Recent Transactions</h3>
        <p style={{ color: '#94a3b8' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions">
      <h3>💳 Recent Transactions</h3>

      {error && (
        <div style={{ 
          color: '#ef4444',
          padding: '10px',
          background: '#7f1d1d',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {allTransactions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#64748b'
        }}>
          <p>No transactions yet</p>
        </div>
      )}

      {allTransactions.length > 0 && (
        <ul className="transactions-list">
          {allTransactions.map((tx, idx) => (
            <li key={`${tx.source}-${idx}`} className="transaction-item">
              <div className="tx-icon-container">
                {(tx.source === 'wallet' && tx.type === 'withdraw') || tx.source === 'local' ? (
                  <div className="tx-icon deposit">
                    <FiArrowUp />
                  </div>
                ) : (
                  <div className="tx-icon payment">
                    <FiArrowDown />
                  </div>
                )}
              </div>

              <div className="tx-info">
                <div className="tx-header">
                  {tx.source === 'wallet' ? (
                    <span className="tx-title">
                      {tx.type === 'withdraw' ? '💰 Withdrawal' : '💵 Payment Saved'}
                    </span>
                  ) : (
                    <span className="tx-title">🛒 Payment: {tx.commodity}</span>
                  )}
                </div>
                <div className="tx-date">
                  {tx.created_at 
                    ? new Date(tx.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : tx.time
                  }
                </div>
              </div>

              <div className="tx-amount-info">
                <div className="tx-amount-ugx">
                  {tx.source === 'wallet' 
                    ? `UGX ${formatBalance(tx.amount_ugx)}`
                    : `UGX ${formatBalance(tx.savings || tx.price)}`
                  }
                </div>
                {tx.source === 'wallet' && (
                  <div className="tx-amount-xlm">
                    {formatXLM(tx.amount_xlm)} XLM
                  </div>
                )}
                {tx.source === 'local' && (
                  <div className="tx-amount-xlm">
                    ≈ {formatXLM((tx.savings || tx.price) * 0.000222)} XLM
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;