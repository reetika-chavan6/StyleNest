
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import products from "../data/products.json";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/")}>
          Back to Shopping
        </button>
      </div>
    );
  }

  const category = product.category.toLowerCase();

const isFootwear = category.includes("footwear");
const isAccessory = category.includes("accessor");

const isOneSize = isAccessory;

  const sizes = isFootwear
    ? ["5", "6", "7", "8", "9", "10"]
    : ["XS", "S", "M", "L", "XL", "XXL"];

  const colors = [
    { name: "Black", hex: "#222222" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Beige", hex: "#d6c1a5" },
    { name: "Blue", hex: "#426b9a" },
    { name: "Pink", hex: "#e6a8b5" },
  ];

  function handleAddToCart() {
    if (!isAccessory && !selectedSize) {
      setMessage("Please select a size.");
      return;
    }

    if (!selectedColor) {
      setMessage("Please select a color.");
      return;
    }

    addToCart({
      ...product,
      size: isAccessory ? "One Size" : selectedSize,
      color: selectedColor,
      quantity,
    });

    setMessage("Product added to your cart!");
  }

  function handleBuyNow() {
    if (!isAccessory && !selectedSize) {
      setMessage("Please select a size.");
      return;
    }

    if (!selectedColor) {
      setMessage("Please select a color.");
      return;
    }

    addToCart({
      ...product,
      size: isAccessory ? "One Size" : selectedSize,
      color: selectedColor,
      quantity,
    });

    navigate("/checkout");
  }

  return (
    <main className="product-details">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Shopping
      </button>

      <div className="product-details-layout">
        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.alt || product.name}
          />
        </div>

        <section className="product-details-info">
          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-description">
            Discover comfort and style with {product.name}.
            A versatile addition to your wardrobe.
          </p>

          <p className="product-availability">
            Check size and color before adding to your cart.
          </p>

          {!isAccessory && (
            <div className="option-group">
              <h3>Select Size</h3>

              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={
                      selectedSize === size ? "selected" : ""
                    }
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage("");
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="option-group">
            <h3>Select Color</h3>

            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={
                    selectedColor === color.name
                      ? "color-swatch selected"
                      : "color-swatch"
                  }
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setMessage("");
                  }}
                />
              ))}
            </div>

            <p>Color: {selectedColor || "Not selected"}</p>
          </div>

          <div className="option-group">
            <h3>Quantity</h3>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
                disabled={quantity === 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(10, current + 1)
                  )
                }
                disabled={quantity === 10}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <p className="details-total">
            Total: ₹
            {(product.price * quantity).toLocaleString("en-IN")}
          </p>

          {message && (
            <p className="product-message" role="status">
              {message}
            </p>
          )}

          <div className="purchase-buttons">
            <button
              className="add-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="buy-now-button"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
