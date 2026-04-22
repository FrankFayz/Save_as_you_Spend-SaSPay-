import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "./Auth.css";
import CountrySelect from "./CountrySelect";
import logo from "../../assets/logo.png";

const Signup = ({ goToLogin, goToLanding }) => {
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("+256");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // prevent double clicks
    if (loading) return;

    // validation
    if (!username.trim() || !phone.trim() || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const userData = {
      username: username.trim(),
      phone: `${countryCode}${phone.trim()}`,
      password: password
    };

    console.log("Sending signup data:", JSON.stringify(userData, null, 2));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json().catch(() => ({}));

      console.log("Signup response:", response.status, data);

      if (response.ok) {
        alert(data.message || "Account created successfully!");
        // Go back to login page after successful signup
        goToLogin();
      } else {
        // Handle validation errors
        console.error("Signup validation errors:", data);
        if (data.username || data.phone || data.password) {
          const errors = [];
          if (data.username) errors.push(`Username: ${Array.isArray(data.username) ? data.username.join(', ') : data.username}`);
          if (data.phone) errors.push(`Phone: ${Array.isArray(data.phone) ? data.phone.join(', ') : data.phone}`);
          if (data.password) errors.push(`Password: ${Array.isArray(data.password) ? data.password.join(', ') : data.password}`);
          alert("Signup failed:\n" + errors.join('\n'));
        } else if (data.detail) {
          alert("Signup failed: " + data.detail);
        } else if (typeof data === 'string') {
          alert("Signup failed: " + data);
        } else {
          alert("Signup failed. Check console for details.");
        }
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("Server not reachable. Check backend.");
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

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p className="switch-text">
          Already have an account?
          <span onClick={goToLogin}> Login</span>
        </p>

      </div>
    </div>
  );
};

export default Signup;