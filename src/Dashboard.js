import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import InfoPanel from "./components/InfoPanel";
import "./components/dashboard.css";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <InfoPanel />

      {/* Direct Scan Access Button */}
      <div className="scan-quick-access">
        <h2>🚀 Quick Start</h2>
        <p>Begin your smart cart journey instantly:</p>
        <Link to="/home" className="scan-button">Start Scanning</Link>
      </div>

      {/* How to Use Steps */}
      <div className="how-to-use">
        <h2>🛠️ How to Use CartIQ</h2>
        <div className="steps-container">
          <div className="step-card">
            <h3>🏠 Step 1</h3>
            <p>Click on <b>Start Scanning</b> to begin your smart cart journey.</p>
          </div>
          <div className="step-card">
            <h3>🔍 Step 2</h3>
            <p>Use your camera to scan product barcodes.</p>
          </div>
          <div className="step-card">
            <h3>🛒 Step 3</h3>
            <p>Items are automatically added to your <b>Cart</b> in real time.</p>
          </div>
          <div className="step-card">
            <h3>📊 Step 4</h3>
            <p>Head over to the <b>Dashboard</b> to review your products and total bill.</p>
          </div>
          <div className="step-card">
            <h3>✅ Step 5</h3>
            <p>Click <b>Checkout</b> to complete your purchase — smooth and easy!</p>
          </div>
        </div>
      </div>
    </>
  );
}
