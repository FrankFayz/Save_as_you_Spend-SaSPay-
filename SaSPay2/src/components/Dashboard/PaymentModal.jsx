import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

const PaymentModal = ({ closeModal, addTransaction }) => {
  const [commodity, setCommodity] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [confirmNumber, setConfirmNumber] = useState("");
  const [savingPercent, setSavingPercent] = useState(10);

  // Load user's configured savings percentage from localStorage
  useEffect(() => {
    const savedPercentage = localStorage.getItem("savingsPercentage");
    if (savedPercentage) {
      setSavingPercent(Number(savedPercentage));
    }
  }, []);

  const savings = price ? (price * savingPercent) / 100 : 0;
  const total = price ? Number(price) + savings : 0;

  const handleSubmit = () => {
    if (!commodity || !price || !number || !confirmNumber) {
      alert("Please fill all fields");
      return;
    }

    if (number !== confirmNumber) {
      alert("Numbers do not match");
      return;
    }

    // CREATE TRANSACTION OBJECT
    const transaction = {
      id: Date.now(), // unique ID
      commodity,
      price: Number(price),
      savings,
      total,
      number,
      time: new Date().toLocaleString()
    };

    // ADD TO TRANSACTIONS
    if (addTransaction) addTransaction(transaction);

    alert(`Payment Successful!`);

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Pay for Commodity</h2>
          <button className="close-btn" onClick={closeModal}>✖</button>
        </div>
        <div className="modal-form">
          <input
            type="text"
            placeholder="Commodity (e.g Sugar)"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price (UGX)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Receiver Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Confirm Receiver Number"
            value={confirmNumber}
            onChange={(e) => setConfirmNumber(e.target.value)}
          />

          <div className="summary">
            <p>💰 Saving ({savingPercent}%): UGX {savings}</p>
            <p>💸 Total Deducted: UGX {total}</p>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;