import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // 🔁 Load cart from localStorage on app start
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 💾 Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add or update an item with quantity
  const addToCart = (name, price) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.name === name);

      if (existingIndex !== -1) {
        // Update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity =
          (updatedItems[existingIndex].quantity || 1) + 1;
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            name,
            price,
            quantity: 1,
            time: new Date().toLocaleString("en-GB"),
          },
        ];
      }
    });
  };

  // ➕ Increase quantity
  const increaseQuantity = (name) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity
  const decreaseQuantity = (name) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.name === name
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🧹 Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // 🔐 User login/logout
  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => {
    setUser(null);
    clearCart(); // optional
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
