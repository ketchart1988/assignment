"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [items, setItems] = useState([
    { name: "T-Shirt", price: 350, quantity: 0, category: "Clothing" },
    { name: "Hoodie", price: 700, quantity: 0, category: "Clothing" },
    { name: "Watch", price: 850, quantity: 0, category: "Accessories" },
    { name: "Bag", price: 640, quantity: 0, category: "Accessories" },
    { name: "Belt", price: 230, quantity: 0, category: "Accessories" },
    { name: "Hat", price: 250, quantity: 0, category: "Accessories" },
  ]);

  const [coupon, setCoupon] = useState("none");
  const [onTop, setOnTop] = useState("none");
  const [seasonal, setSeasonal] = useState("none");
  const [customerPoints, setCustomerPoints] = useState<number | "">(0);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  // Parameters for discounts
  const fixedDiscountAmount = 50;
  const percentageDiscount = 10;
  const onTopCategoryDiscount = 15; // %
  const maxPointsDiscountPercentage = 20; // %
  const seasonalEvery = 300; // THB
  const seasonalDiscount = 40; // THB

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const calculateDiscount = () => {
    let totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply Coupon Discount
    if (coupon === "fixed") {
      totalPrice -= fixedDiscountAmount;
    } else if (coupon === "percentage") {
      totalPrice *= 1 - percentageDiscount / 100;
    }

    // Apply OnTop Discount
    if (onTop === "category") {
      const categoryDiscount = items.reduce((sum, item) => {
        if (item.category === "Clothing") {
          return sum + item.price * item.quantity * (onTopCategoryDiscount / 100);
        }
        return sum;
      }, 0);
      totalPrice -= categoryDiscount;
    } else if (onTop === "points" && customerPoints) {
      const maxPointsDiscount = totalPrice * (maxPointsDiscountPercentage / 100);
      totalPrice -= Math.min(customerPoints, maxPointsDiscount);
    }

    // Apply Seasonal Discount
    if (seasonal === "seasonal") {
      totalPrice -= Math.floor(totalPrice / seasonalEvery) * seasonalDiscount;
    }

    setFinalPrice(Math.max(totalPrice, 0));
  };

  const totalPriceBeforeDiscount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gifUrl = "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExamdibGVuanVhbTY5NHgyZXA2dzRreGlqanc3bHQ2NmRiNTBxbW14MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qLWOr2A6qrFSPJk6Vt/giphy.gif"; // Your GIF URL

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Assignment#1 Discount Module</h1>

        <div>

          {/* GIF Section */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={gifUrl}
            alt="Discount Animation"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
          />
        </div>

          <h2>List Items</h2>
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span>
                  {item.name}: {item.price} THB
                </span>
                <label>
                  Quantity:
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value) || 0)
                    }
                    style={{ marginLeft: "5px", width: "50px" }}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>

        

        <div>
          <h2>Select Discount Campaigns</h2>
          <div>
            <label>
              Coupon:
              <select value={coupon} onChange={(e) => setCoupon(e.target.value)}>
                <option value="none">None</option>
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage Discount</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              On Top:
              <select value={onTop} onChange={(e) => setOnTop(e.target.value)}>
                <option value="none">None</option>
                <option value="category">Percentage Discount by Category</option>
                <option value="points">Discount by Points</option>
              </select>
            </label>
            {onTop === "points" && (
              <div style={{ marginTop: "10px" }}>
                <label>
                  Customer Points:
                  <input
                    type="number"
                    min="0"
                    value={customerPoints}
                    onChange={(e) => setCustomerPoints(Number(e.target.value) || 0)}
                    style={{ marginLeft: "5px", width: "80px" }}
                  />
                </label>
              </div>
            )}
          </div>

          <div>
            <label>
              Seasonal:
              <select value={seasonal} onChange={(e) => setSeasonal(e.target.value)}>
                <option value="none">None</option>
                <option value="seasonal">Special campaigns</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <h2>Shopping Cart</h2>
          <ul>
            {items
              .filter((item) => item.quantity > 0)
              .map((item, index) => (
                <li key={index}>
                  {item.name}: {item.quantity} pcs ({item.price * item.quantity} THB)
                </li>
              ))}
            {items.every((item) => item.quantity === 0) && <li>No items purchased.</li>}
          </ul>
        </div>

        <div>
          <h2>Summary of Discount Campaigns</h2>
          <ul>
            <li>
              Coupon:{" "}
              {coupon === "none"
                ? "None"
                : coupon === "fixed"
                ? `${fixedDiscountAmount} THB`
                : `${percentageDiscount}%`}
            </li>
            <li>
              On Top:{" "}
              {onTop === "none"
                ? "None"
                : onTop === "category"
                ? `${onTopCategoryDiscount}% on Clothing`
                : `Points Discount (Max ${maxPointsDiscountPercentage}%)`}
              {onTop === "points" && customerPoints > 0 && (
                <span> (Using {customerPoints} points)</span>
              )}
            </li>
            <li>
              Seasonal:{" "}
              {seasonal === "none"
                ? "None"
                : `Every ${seasonalEvery} THB, ${seasonalDiscount} THB`}
            </li>
          </ul>
        </div>

        <div>
          <h3>Total Price Before Discount: {totalPriceBeforeDiscount.toFixed(2)} THB</h3>
        </div>

        <button onClick={calculateDiscount}>Calculate Final Price</button>

        {finalPrice !== null && (
          <div>
            <h2>Final Price: {finalPrice.toFixed(2)} THB</h2>
          </div>
        )}
      </main>
    </div>
  );
}
