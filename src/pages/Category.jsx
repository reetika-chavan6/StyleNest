import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";

function Category() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState(null);

  const categoryProducts = products.filter(
    (product) =>
      product.category.toLowerCase() ===
      decodeURIComponent(categoryName).toLowerCase()
  );

  function handleAddToCart(product) {
    addToCart(product);
    setAddedProduct(product.id);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  }

  return (
    <main className="category-page">
      <h1>{decodeURIComponent(categoryName)}</h1>
      <p>Explore our latest collection</p>

      {categoryProducts.length === 0 ? (
        <p>No products found in this category yet.</p>
      ) : (
        <div className="product-grid">
          {categoryProducts.map((product) => (
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

              <h3>{product.name}</h3>
              <p>₹{product.price}</p>

              <button onClick={() => handleAddToCart(product)}>
                {addedProduct === product.id ? "Added!" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </main>
  );
}

export default Category;
