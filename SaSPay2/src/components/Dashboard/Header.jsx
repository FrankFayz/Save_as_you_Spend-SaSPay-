import React from "react";
import logo from "../../assets/logo.png";

const Header = ({ user, onPayClick }) => {
  const displayName = user ? user.username : "User";

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
        <button className="header-pay-btn" onClick={onPayClick}>
          💸 Pay Now
        </button>
      </div>
    </div>
  );
};

export default Header;