import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">🧠 CartIQ</div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/home">Scan</Link></li>
        <li><Link to="/payment-history">Payment History</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
}
