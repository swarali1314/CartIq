import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./Firebase";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "scans"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setItems(fetchedItems);
    } catch (error) {
      console.error("❌ Error fetching cart items:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleClearCart = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (!confirmClear) return;

    try {
      const q = query(
        collection(db, "scans"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "scans", docSnap.id))
      );
      await Promise.all(deletePromises);
      alert("🧹 Cart cleared!");
      fetchCartItems();
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      alert("Something went wrong while clearing the cart.");
    }
  };

  const increaseQuantity = async (item) => {
    const itemRef = doc(db, "scans", item.id);
    await updateDoc(itemRef, {
      quantity: (item.quantity || 1) + 1,
    });
    fetchCartItems();
  };

  const decreaseQuantity = async (item) => {
    const itemRef = doc(db, "scans", item.id);
    const newQty = (item.quantity || 1) - 1;

    if (newQty <= 0) {
      await deleteDoc(itemRef);
    } else {
      await updateDoc(itemRef, { quantity: newQty });
    }
    fetchCartItems();
  };

  const totalAmount = items.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + item.price * qty;
  }, 0);

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { cartItems: items, totalAmount } });
  };

  return (
    <div className="home">
      <h1 className="title">🛒 Your Smart Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items scanned yet.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item, index) => (
              <li key={index} className="cart-item">
                <strong>{item.productName}</strong> - ₹{item.price} × {item.quantity || 1} = ₹
                {item.price * (item.quantity || 1)}
                <br />
                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => decreaseQuantity(item)}>➖</button>
                  <span style={{ margin: "0 10px" }}>{item.quantity || 1}</span>
                  <button onClick={() => increaseQuantity(item)}>➕</button>
                </div>
                <small>
                  🕒{" "}
                  {item.timestamp?.seconds
                    ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                    : "Unknown"}
                </small>
              </li>
            ))}
          </ul>

          <h3>💰 Total: ₹{totalAmount}</h3>

          <button className="btn" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>

          <button className="clear-cart-btn" onClick={handleClearCart}>
            🧹 Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
