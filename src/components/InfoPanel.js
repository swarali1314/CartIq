import React, { useState, useContext } from "react";
import "./InfoPanel.css";
import { CartContext } from "../CartContext";

export default function InfoPanel() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, cartItems } = useContext(CartContext);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme", !darkMode);
  };

  const itemCount = cartItems?.length || 0;
  const totalValue = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const lastItem = itemCount > 0 ? cartItems[itemCount - 1] : null;

  // 🧠 Today's date in DD/MM/YYYY format
  const today = new Date().toLocaleDateString("en-GB");

  // 📅 Items added today
  const todayItems = cartItems.filter((item) =>
    item.time?.startsWith(today)
  ).length;

  return (
    <div className={`info-panel ${darkMode ? "dark" : ""}`}>
      <div className="info-top">
        <div className="greeting">👋 Hello, {user?.name || "Guest"}!</div>

        <div className="actions">
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button className="notify-btn">🔔</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          🛒 {itemCount} item{itemCount !== 1 ? "s" : ""} | ₹{totalValue}
        </div>
        <div className="stat">
          📦 Last: {lastItem ? `${lastItem.name} – ₹${lastItem.price}` : "None"}
        </div>
        <div className="stat">
          📅 Items today: {todayItems}
        </div>
      </div>
    </div>
  );
}
