import React from "react";

const QuickActions = () => {
  return (
    <div className="actions">

      <div className="action action-send">
        <svg className="action-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 26l16-16 16 16M23 10v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Send</p>
      </div>

      <div className="action action-pay">
        <svg className="action-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="2"/>
          <circle cx="36" cy="28" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p>Pay</p>
      </div>

      <div className="action action-withdraw">
        <svg className="action-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20l14 14 14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="24" y1="4" x2="24" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Withdraw</p>
      </div>

      <div className="action action-save">
        <svg className="action-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6h32v12H8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 18v18h32V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="30" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p>Save</p>
      </div>

    </div>
  );
};

export default QuickActions;