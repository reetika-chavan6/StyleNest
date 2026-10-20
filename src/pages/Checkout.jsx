
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
    setMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your delivery address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  

async function handleSubmit(e) {
  e.preventDefault();

  if (cartItems.length === 0) {
    setMessage("Your cart is empty. Please add products first.");
    return;
  }

  if (!validateForm()) {
    return;
  }

  setMessage("Placing your order...");

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: formData,
        items: cartItems
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Unable to place your order.");
      return;
    }

    const order = {
      customer: formData,
      items: data.items,
      total: data.total,
      orderReference: data.orderReference
    };

    navigate("/order-confirmation", {
      state: { order }
    });
  } catch (error) {
    console.error("Order request failed:", error);
    setMessage(
      "Cannot connect to the server. Please try again."
    );
  }
}



  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate>
          <h2>Delivery Details</h2>

          <div className="checkout-field">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="checkout-field">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="checkout-field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              required
            />
            {errors.phone && (
              <p id="phone-error" className="field-error" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="checkout-field">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
              aria-invalid={!!errors.address}
              aria-describedby={
                errors.address ? "address-error" : undefined
              }
              required
            />
            {errors.address && (
              <p id="address-error" className="field-error" role="alert">
                {errors.address}
              </p>
            )}
          </div>

          {message && (
            <p className="checkout-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        <section className="order-summary" aria-labelledby="summary-title">
          <h2 id="summary-title">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  {item.image && (
                    <img src={item.image} alt={item.alt || item.name} />
                  )}

                  <div className="summary-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      ₹{item.price} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              <div className="summary-total">
                <span>Total Amount</span>
                <strong>₹{totalPrice}</strong>
              </div>
            </>
          )}

          <button
            type="button"
            className="back-to-cart-btn"
            onClick={() => navigate("/cart")}
          >
            Back to Cart
          </button>
        </section>
      </div>
    </main>
  );
}

export default Checkout;
