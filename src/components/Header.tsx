import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <header className="sova-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">SOVA</Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/app" className="nav-link">Guest App</Link></li>
            <li><Link to="/dashboard/consumer" className="nav-link">Guest Dashboard</Link></li>
            <li><Link to="/dashboard/business" className="nav-link">Business Dashboard</Link></li>
            <li><Link to="/dashboard/investor" className="nav-link">Investor Dashboard</Link></li>
            <li><Link to="/dashboard/reporting" className="nav-link">Reporting Suite</Link></li>
          </ul>
        </nav>
        <button className="mobile-nav-toggle" onClick={toggleMobileNav}>
          <span className="sr-only">Menu</span>
          <i className={mobileNavOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileNavOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" className="nav-link" onClick={() => setMobileNavOpen(false)}>Home</Link></li>
          <li><Link to="/app" className="nav-link" onClick={() => setMobileNavOpen(false)}>Guest App</Link></li>
          <li><Link to="/dashboard/consumer" className="nav-link" onClick={() => setMobileNavOpen(false)}>Guest Dashboard</Link></li>
          <li><Link to="/dashboard/business" className="nav-link" onClick={() => setMobileNavOpen(false)}>Business Dashboard</Link></li>
          <li><Link to="/dashboard/investor" className="nav-link" onClick={() => setMobileNavOpen(false)}>Investor Dashboard</Link></li>
          <li><Link to="/dashboard/reporting" className="nav-link" onClick={() => setMobileNavOpen(false)}>Reporting Suite</Link></li>
          <li><Link to="/login" className="nav-link" onClick={() => setMobileNavOpen(false)}>Login</Link></li>
          <li><Link to="/signup" className="nav-link" onClick={() => setMobileNavOpen(false)}>Sign Up</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
