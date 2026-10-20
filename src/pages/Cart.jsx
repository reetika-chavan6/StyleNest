
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice
  } = useCart();

  const navigate = useNavigate();

  return (
    <main className="cart-page">
      <h1>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty 🛍️</h2>
          <p>Find something you love at StyleNest!</p>

          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section
            className="cart-items"
            aria-label="Cart products"
          >
            {cartItems.map((item) => (
              <article
                className="cart-item"
                key={item.cartKey}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.name}
                  className="cart-item-image"
                  loading="lazy"
                />

                <div className="cart-item-details">
                  <h2>{item.name}</h2>

                  <p className="cart-item-price">
                    Price: ₹
                    {item.price.toLocaleString("en-IN")}
                  </p>

                  <p>Size: {item.size || "One Size"}</p>
                  <p>Color: {item.color || "Not selected"}</p>

                  <div className="quantity-control">
                    <span>Quantity:</span>

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.cartKey)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <span
                      className="quantity-number"
                      aria-live="polite"
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.cartKey)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-subtotal">
                    Subtotal: ₹
                    {(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() =>
                      removeFromCart(item.cartKey)
                    }
                  >
                    Remove item
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <p>
              Total items:{" "}
              {cartItems.reduce(
                (total, item) => total + item.quantity,
                0
              )}
            </p>

            <div className="summary-total">
              <span>Total Price</span>
              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <Link to="/" className="back-to-shopping">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
