
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";

function Women() {
  const womenProducts = products.filter(
    (product) => product.category === "Women"
  );

  const { addToCart } = useCart();
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="collection-page">
      <div className="section-heading">
        <p>STYLE YOUR WAY</p>
        <h1>Women's Collection</h1>
        <p>Discover styles made for every day.</p>
      </div>

      <div className="product-grid">
        {womenProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img
  src={product.image}
  alt={product.alt || product.name}
  loading="lazy"
  decoding="async"
  className="clickable-product-image"
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/product/${product.id}`)}
/>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p>₹{product.price.toLocaleString("en-IN")}</p>

              <button
                onClick={() => {
                  addToCart(product);
                  setShowAddedPopup(true);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddedPopup && (
        <div className="cart-popup-overlay">
          <div
            className="cart-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-popup-title"
          >
            <button
              className="popup-close"
              onClick={() => setShowAddedPopup(false)}
              aria-label="Close popup"
            >
              ✕
            </button>

            <h2 id="cart-popup-title">
              ✅ Added to cart
            </h2>

            <p>Your item has been added successfully!</p>

            <button
              onClick={() => {
                setShowAddedPopup(false);
                navigate("/cart");
              }}
            >
              Go to Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Women;