import { useState } from "react";
import categories from "../data/categories.json";
import products from "../data/products.json";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showAddedPopup, setShowAddedPopup] = useState(false);

  // ADD THIS FUNCTION HERE 👇
  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAddedPopup(true);
  };


  return (
    <main>
      {/* Hero Section */}

      <section className="hero">
        <div className="hero-content">
          <p className="small-title">NEW SEASON COLLECTION</p>

          <h1>
            Style that
            <br />
            feels like you.
          </h1>

          <p className="hero-text">
            Discover timeless fashion made for your everyday style.
          </p>

          
        <div className="hero-buttons">
          <button onClick={() => navigate("/women")}>
          Shop Women
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/men")}
        >
          Shop Men
        </button>
        </div>

        </div>

        <div className="hero-image">
          <img
  src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
  alt="Fashion collection displayed in a clothing store"
  fetchPriority="high"
  decoding="async"
/>
        </div>
      </section>

     



{/* Categories */}

<section className="categories">
  <div className="section-heading">
    <p>EXPLORE</p>
    <h2>Shop by Category</h2>
  </div>

  
<div className="category-grid">
  {categories.map((category) => (
    <div
      className="category-card"
      key={category.id}
      onClick={() =>
        navigate(
          `/category/${encodeURIComponent(category.name)}`
        )
      }
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(
            `/category/${encodeURIComponent(category.name)}`
          );
        }
      }}
    >
      <img
  src={category.image}
  alt={category.alt || category.name}
  loading="lazy"
  decoding="async"
/>
      <h3>{category.name}</h3>
    </div>
  ))}
</div>

</section>



{/* Featured Products */}

<section className="featured">
  <div className="section-heading">
    <p>OUR PICKS</p>
    <h2>Featured Collection</h2>
  </div>

  <div className="product-grid">
    {products.map((product) => (
      <div className="product-card" key={product.id}>
        <img
  src={product.image}
  alt={product.alt || product.name}
  loading="lazy"
  decoding="async"
  onClick={() => navigate(`/product/${product.id}`)}
  className="clickable-product-image"
  style={{ cursor: "pointer" }}
/>

<h3
  onClick={() => navigate(`/product/${product.id}`)}
  className="clickable-product-name"
>
  {product.name}
</h3>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p>₹{product.price.toLocaleString("en-IN")}</p>
          <button onClick={() => handleAddToCart(product)}>
  Add to Cart
</button>
        </div>
        
      </div>
    ))}
  </div>
</section>



      {/* Promotion */}

      <section className="promotion">
        <p>STYLE FOR EVERY DAY</p>
        <h2>Up to 30% Off Selected Styles</h2>
        <button>Shop Collection</button>
      </section>
      
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

      <h2 id="cart-popup-title">✅ Added to cart</h2>
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

export default Home;