
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const matchingProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  

  return (
    <main className="collection-page">
      <div className="section-heading">
        <h1>Search Products</h1>

        <input
          type="search"
          value={query}
          onChange={(event) => setSearchParams(
            event.target.value ? { q: event.target.value } : {}
          )}
          placeholder="Search for jeans, jackets, shirts..."
          aria-label="Search products by name"
        />

        {query && (
          <p>
            {matchingProducts.length} result(s) for "{query}"
          </p>
        )}
      </div>

      {matchingProducts.length > 0 ? (
        <div className="product-grid">
          {matchingProducts.map((product) => (
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
      ) : (
        <div className="section-heading">
          <h2>No products found 😕</h2>
          <p>
            We couldn't find products matching "{query}".
            Try searching for a shirt, jeans, or jacket.
          </p>
        </div>
      )}

      {showAddedPopup && (
        <div
          className="cart-popup-overlay"
          onClick={() => setShowAddedPopup(false)}
        >
          <div
            className="cart-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="popup-close"
              onClick={() => setShowAddedPopup(false)}
              aria-label="Close popup"
            >
              ✕
            </button>

            <h2 id="search-cart-title">✅ Added to cart</h2>
            <p>Your item has been added successfully!</p>

            <button
              onClick={() => {
                setShowAddedPopup(false);
                window.location.href = "/cart";
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

export default SearchResults;
