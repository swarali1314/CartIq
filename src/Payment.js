import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./payment.css";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cartItems = state?.cartItems || [];
  const totalAmount = state?.totalAmount || 0;

  const handlePayment = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty. Add items before paying.");
      return;
    }

    // 🏦 Dynamic UPI link
    const upiLink = `upi://pay?pa=byteblaze@upi&pn=ByteBlaze&am=${totalAmount}&cu=INR&tn=CartIQ+Smart+Checkout`;

    // 📲 Redirect to UPI app
    window.location.href = upiLink;

    // Optional: clear local cart after some time or on confirmation
    setTimeout(() => {
      navigate("/"); // Go back to home or cart
    }, 5000);
  };

  return (
    <div className="home">
      <h1 className="title">💳 Payment</h1>
      <p>Total Items: {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}</p>
      <p>Total Amount: ₹{totalAmount}</p>

      <button className="btn" onClick={handlePayment}>
        Pay Now via UPI
      </button>
    </div>
  );
}
