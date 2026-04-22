import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "./Auth.css";
import logo from "../../assets/logo.png";
import CountrySelect from "./CountrySelect";

const Login = ({ goToSignup, goToLanding, onLoginSuccess }) => {
  const [countryCode, setCountryCode] = useState("+256");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = { 
      phone: `${countryCode}${phone.trim()}`, 
      password 
    };

    console.log("Sending login data:", JSON.stringify(loginData, null, 2));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      console.log("Login response:", response.status, data);

      if (response.ok) {
        // 🔥 SAVE USER SESSION (TEMP FRONTEND STATE)
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        alert("Login successful");
        onLoginSuccess(); // go to dashboard
      } else {
        console.error("Login failed:", data);
        alert(data.message || "Invalid credentials");
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {goToLanding && (
        <button className="back-to-home" onClick={goToLanding}>
          <FiArrowLeft /> Back to Home
        </button>
      )}
      <div className="auth-card">

        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="SaSPay Logo" />
          <h1>SaS<span>Pay</span></h1>
          <p>Save As You Spend</p>
        </div>

        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>

          <label>Country</label>
          <CountrySelect setCountryCode={setCountryCode} />

          <label>Phone Number</label>
          <div className="phone-input">
            <span>{countryCode}</span>
            <input
              type="text"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={goToSignup}> Sign Up</span>
        </p>

      </div>
    </div>
  );
};

export default Login;