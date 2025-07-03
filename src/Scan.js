// src/Scan.js
import React, { useEffect, useRef, useContext } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from "html5-qrcode";
import { doc, getDoc, addDoc, Timestamp, collection } from "firebase/firestore";
import { db, auth } from "./Firebase";
import { CartContext } from "./CartContext";

export default function Scan() {
  const { addToCart } = useContext(CartContext);
  const scannerRef = useRef(null);
  const scanLock = useRef(false);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 300, height: 100 },
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    // Force back camera only
    const html5QrCode = new Html5Qrcode("reader");
    Html5Qrcode.getCameras().then((devices) => {
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes("back")
      ) || devices[0]; // fallback if back camera not found

      if (!backCamera) {
        alert("No camera found.");
        return;
      }

      html5QrCode.start(
        backCamera.id,
        config,
        async (decodedText) => {
          if (scanLock.current) return;
          scanLock.current = true;

          let barcode = decodedText.trim().replace(/[^a-zA-Z0-9]/g, "");
          alert("📷 Scanned ID: " + barcode);

          try {
            const productRef = doc(db, "products", barcode);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
              const product = productSnap.data();
              addToCart(product.name, Number(product.price));

              await addDoc(collection(db, "scans"), {
                productId: barcode,
                productName: product.name,
                price: Number(product.price),
                quantity: 1,
                timestamp: Timestamp.now(),
                userId: auth.currentUser?.uid || "guest",
              });

              alert(`✅ Product added: ${product.name} – ₹${product.price}`);
            } else {
              alert(`❌ Product not found in database for ID: ${barcode}`);
            }
          } catch (error) {
            alert("❌ Error: " + error.message);
            console.error(error);
          }

          setTimeout(() => {
            scanLock.current = false;
          }, 1500);
        },
        (error) => {
          console.warn("Scan error:", error);
        }
      );

      scannerRef.current = html5QrCode;
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch((err) => console.error("Scanner clear error:", err));
      }
    };
  }, [addToCart]);

  return (
    <div className="home">
      <h2>📷 Scan Your Product</h2>
      <div
        id="reader"
        style={{ width: "100%", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            height: "2px",
            backgroundColor: "red",
            animation: "scan-line 1.2s infinite linear"
          }}
        />
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}
