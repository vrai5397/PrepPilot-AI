import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-diamond">✦</span>
            <span className="footer-brand-name">PrepPilot AI</span>
          </div>
          <p className="footer-tagline">Prepare smarter. Interview with confidence.</p>
        </div>
        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#how-it-works">How it works</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        <div className="footer-copy">
          © 2026 PrepPilot AI
        </div>
      </div>
    </footer>
  );
};

export default Footer;
