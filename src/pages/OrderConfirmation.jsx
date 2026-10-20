
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  if (!order || !order.items || order.items.length === 0) {
    return (
      <main className="confirmation-page">
        <h1>No order found</h1>
        <p>Please complete checkout before viewing confirmation.</p>

        <button onClick={() => navigate("/cart")}>
          Go to Cart
        </button>
      </main>
    );
  }

  return (
    <main className="confirmation-page">
      <section className="confirmation-card">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you, {order.customer.name}! Your StyleNest
          order has been confirmed.
        </p>

        <div className="order-reference">
          <span>Order Reference</span>
          <strong>{order.orderReference}</strong>
        </div>

        <h2>Delivery Details</h2>
        <p>{order.customer.name}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
        <p>{order.customer.address}</p>

        <h2>Purchased Items</h2>

        {order.items.map((item) => (
          <div className="confirmed-item" key={item.id}>
            {item.image && (
              <img
                src={item.image}
                alt={item.alt || item.name}
              />
            )}

            <div>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>
                ₹{item.price} × {item.quantity} = ₹
                {item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}

        <div className="confirmed-total">
          <span>Total Amount</span>
          <strong>₹{order.total}</strong>
        </div>

        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </section>
    </main>
  );
}

export default OrderConfirmation;
