import React, { useState, useEffect } from "react";
import "./Landing.css";
import ImageSlider from "./ImageSlider";
import Footer from "./Footer";
import { FiArrowRight, FiDollarSign } from "react-icons/fi";
import { SiStellar } from "react-icons/si";
import logo from "../../assets/logo.png";

const Landing = ({ goToLogin, goToSignup }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* HEADER/NAV */}
      <header className={`landing-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo">
            <img src={logo} alt="SaSPay Logo" className="logo-img" />
            <div className="logo-text">
              <h1>SaS<span>Pay</span></h1>
              <p className="tagline">Save As You Spend</p>
            </div>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn login-btn" onClick={goToLogin}>
              Login
            </button>
            <button className="nav-btn signup-btn" onClick={goToSignup}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            Save While You Spend<span className="highlight">.</span>
          </h2>
          <p className="hero-subtitle">
            Seamlessly save money on every purchase. Convert your savings to cryptocurrency instantly.
            No hidden fees. Just smart saving.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={goToSignup}>
              Get Started Free <FiArrowRight />
            </button>
            <button className="btn btn-secondary" onClick={goToLogin}>
              Login to Account
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon ugx-icon">
              <FiDollarSign size={36} />
            </div>
            <div className="card-content">
              <span className="amount">UGX 50,000</span>
              <span className="label">Saved This Month</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon xlm-icon">
              <SiStellar size={36} />
            </div>
            <div className="card-content">
              <span className="amount">11.11 XLM</span>
              <span className="label">Blockchain Assets</span>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE SLIDER SECTION */}
      <section className="slider-section">
        <div className="container">
          <div className="section-header">
            <h2>How SaSPay Works</h2>
            <p>Watch how easy it is to save while you spend</p>
          </div>
          <ImageSlider />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="container">
          <h2>Why Choose SaSPay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-1">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" alt="Automatic Savings" />
              </div>
              <h3>Automatic Savings</h3>
              <p>Every transaction automatically saves a percentage to your wallet. Set it and forget it.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-2">
                <img src="https://cdn-icons-png.flaticon.com/512/825/825540.png" alt="Instant Crypto" />
              </div>
              <h3>Instant Crypto</h3>
              <p>Your savings are instantly converted to XLM (Stellar Lumens) on the blockchain.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-3">
                <img src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png" alt="Secure & Safe" />
              </div>
              <h3>Secure & Safe</h3>
              <p>Bank-level security with blockchain transparency. Your funds are always in your control.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-4">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Lightning Fast" />
              </div>
              <h3>Lightning Fast</h3>
              <p>Instant transactions with zero hidden fees. See your balance update in real-time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-5">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135679.png" alt="Mobile First" />
              </div>
              <h3>Mobile First</h3>
              <p>Manage your savings on the go. Full-featured app right in your pocket.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-6">
                <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt="Real Value" />
              </div>
              <h3>Real Value</h3>
              <p>Convert your savings back to local currency anytime. No lock-in period.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="container">
          <div className="stat">
            <h3>50K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat">
            <h3>$5M+</h3>
            <p>Saved Together</p>
          </div>
          <div className="stat">
            <h3>100K+</h3>
            <p>Daily Transactions</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Saving?</h2>
          <p>Join thousands of smart savers. Start your journey to financial freedom today.</p>
          <button className="btn btn-primary btn-large" onClick={goToSignup}>
            Create Free Account <FiArrowRight />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Landing;
