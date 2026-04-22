import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

const PaymentModal = ({ closeModal, addTransaction, user, onPaymentSuccess }) => {
  const [commodity, setCommodity] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [confirmNumber, setConfirmNumber] = useState("");
  const [savingPercent, setSavingPercent] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_BASE_URL = "http://localhost:8000/api";

  // Load user's configured savings percentage from localStorage
  useEffect(() => {
    const savedPercentage = localStorage.getItem("savingsPercentage");
    if (savedPercentage) {
      setSavingPercent(Number(savedPercentage));
    }
  }, []);

  const savings = price ? (price * savingPercent) / 100 : 0;
  const total = price ? Number(price) + savings : 0;

  const handleSubmit = async () => {
    if (!commodity || !price || !number || !confirmNumber) {
      setError("Please fill all fields");
      return;
    }

    if (number !== confirmNumber) {
      setError("Numbers do not match");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      // CREATE TRANSACTION OBJECT
      const transaction = {
        id: Date.now(),
        commodity,
        price: Number(price),
        savings,
        total,
        number,
        time: new Date().toLocaleString()
      };

      // ADD TO TRANSACTIONS
      if (addTransaction) addTransaction(transaction);

      // DEPOSIT SAVINGS TO WALLET (if user has a phone number)
      let walletSaved = false;
      if (user?.phone && savings > 0) {
        const walletResponse = await fetch(
          `${API_BASE_URL}/wallet/deposit/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: user.phone,
              amount_ugx: savings.toString(),
              transaction_id: transaction.id
            })
          }
        );

        if (walletResponse.ok) {
          walletSaved = true;
          const xlmAmount = (savings * 0.000222).toFixed(4);
          setSuccessMessage(`✓ Payment successful! UGX ${savings.toFixed(2)} saved as ${xlmAmount} XLM to your wallet.`);
          console.log("Wallet deposit successful:", walletResponse);
        } else {
          const errorData = await walletResponse.json();
          console.warn("Wallet deposit warning:", errorData.message);
          setSuccessMessage(`✓ Payment successful! (Wallet save pending)`);
        }
      }

      // Trigger parent callback to refresh wallet
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      // Wait a moment to show success message
      setTimeout(() => {
        setError(null);
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment processing error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Pay for Commodity</h2>
          <button className="close-btn" onClick={closeModal} disabled={isLoading}>✖</button>
        </div>
        <div className="modal-form">
          <input
            type="text"
            placeholder="Commodity (e.g Sugar)"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="number"
            placeholder="Price (UGX)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Receiver Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Confirm Receiver Number"
            value={confirmNumber}
            onChange={(e) => setConfirmNumber(e.target.value)}
            disabled={isLoading}
          />

          <div className="summary">
            <div className="summary-item">
              <span className="summary-label">Price:</span>
              <span className="summary-value">UGX {Number(price || 0).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Saving ({savingPercent}%):</span>
              <span className="summary-value">UGX {savings.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total Deducted:</span>
              <span className="summary-value">UGX {total.toFixed(2)}</span>
            </div>
            {user?.phone && savings > 0 && (
              <div className="wallet-savings-display">
                <div className="wallet-savings-header">
                  <span>✓ Automatic Savings to Wallet</span>
                </div>
                <div className="wallet-savings-content">
                  <div className="savings-ugx">
                    <span className="label">UGX Amount</span>
                    <span className="value">{savings.toFixed(2)} UGX</span>
                  </div>
                  <div className="savings-xlm">
                    <span className="label">Real XLM Stored</span>
                    <span className="value">{(savings * 0.000222).toFixed(4)} XLM</span>
                  </div>
                </div>
                <div className="exchange-rate-note">
                  @ 1 XLM = 4,500 UGX
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ 
              color: "#ef4444", 
              fontSize: "0.9rem", 
              marginBottom: "12px",
              padding: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "6px"
            }}>
              {error}
            </div>
          )}

          {successMessage && (
            <div style={{ 
              color: "#10b981", 
              fontSize: "0.9rem", 
              marginBottom: "12px",
              padding: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "6px",
              fontWeight: "500"
            }}>
              {successMessage}
            </div>
          )}

          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;