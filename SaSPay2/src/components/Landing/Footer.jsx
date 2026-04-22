import React from "react";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h4>About SaSPay</h4>
            <p>
              SaSPay is a revolutionary fintech platform that makes saving easy
              and rewarding. Save automatically with every purchase and grow your
              crypto wealth instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Get In Touch</h4>
            <div className="contact-info">
              <p>
                <FiMail className="contact-icon" />
                <a href="mailto:support@saspay.com">support@saspay.com</a>
              </p>
              <p>
                <FiPhone className="contact-icon" />
                <a href="tel:+256701234567">+256 701 234 567</a>
              </p>
              <p>
                <FiMapPin className="contact-icon" />
                <span>Kampala, Uganda</span>
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a
                href="https://facebook.com/saspay"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Facebook"
              >
                <FiFacebook />
              </a>
              <a
                href="https://instagram.com/saspay"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Instagram"
              >
                <FiInstagram />
              </a>
              <a
                href="https://twitter.com/saspay"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Twitter"
              >
                <FiTwitter />
              </a>
              <a
                href="https://linkedin.com/company/saspay"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="LinkedIn"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            <FiHeart className="heart-icon" />
            &nbsp; Made with love by SaSPay Team © {currentYear}. All rights
            reserved.
          </p>
          <p className="footer-tagline">Transforming how Africa saves money</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
