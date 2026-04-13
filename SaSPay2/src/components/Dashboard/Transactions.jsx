import React from "react";
import "./Transactions.css";

const Transactions = ({ transactions }) => {
  return (
    <div className="transactions">
      <h3>Recent Transactions</h3>

      {transactions.length === 0 && <p>No transactions yet</p>}

      <ul>
        {transactions.map(tx => (
          <li key={tx.id} className="transaction-item">
            <div>
              <strong>{tx.commodity}</strong> - UGX {tx.price}
            </div>
            <div>
              Saved: UGX {tx.savings} | Total: UGX {tx.total}
            </div>
            <div className="time">{tx.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;