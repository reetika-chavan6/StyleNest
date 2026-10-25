import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products.json";
import "./OutfitStudio.css";

function OutfitStudio() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("T-Shirts");

  const categories = [
    "T-Shirts",
    "Jeans",
    "Jackets",
    "Hoodies",
    "Dresses",
    "Footwear",
    "Accessories",
    "Formal Wear",
  ];

  const visibleProducts = products.filter(
    (product) => product.category === activeCategory
  );
  


function buyThisOutfit() {
  if (selectedItems.length === 0) {
    return;
  }

  selectedItems.forEach((item) => {
    addToCart({
      ...item,
      size: item.size,
      color: item.color,
      quantity: 1,
    });
  });

  navigate("/cart");
}



  
function toggleItem(product) {
  setSelectedItems((current) => {
    const alreadySelected = current.some(
      (item) => item.id === product.id
    );

    if (alreadySelected) {
      return current.filter((item) => item.id !== product.id);
    }

    const defaultSize =
      product.category === "Footwear"
        ? "7"
        : product.category === "Accessories"
        ? "One Size"
        : "M";

    return [
      ...current,
      {
        ...product,
        size: product.size || defaultSize,
        color: product.color || "Black",
      },
    ];
  });
}

function updateSelectedItem(productId, field, value) {
  setSelectedItems((current) =>
    current.map((item) =>
      item.id === productId
        ? { ...item, [field]: value }
        : item
    )
  );
}


  const totalPrice = selectedItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  return (
    <main className="outfit-studio">
      <header className="studio-header">
        <p className="studio-eyebrow">YOUR PERSONAL FASHION SPACE</p>
        <h1>StyleNest Outfit Studio ✨</h1>
        <p>
          Mix your favourite pieces, create your own look,
          and discover an outfit that feels like you.
        </p>
      </header>

      <section className="outfit-board">
        <div className="board-heading">
          <div>
            <h2>Your Outfit Board</h2>
            <p>{selectedItems.length} items selected</p>
          </div>

          <button
            className="clear-outfit"
            onClick={() => setSelectedItems([])}
            disabled={selectedItems.length === 0}
          >
            Clear outfit
          </button>
        </div>

        {selectedItems.length === 0 ? (
          <div className="empty-outfit">
            <span>👚 👖 👟</span>
            <h3>Your outfit starts here</h3>
            <p>Select products below to build your look.</p>
          </div>
        ) : (
          <div className="selected-outfit">
            {selectedItems.map((item) => (
              <article className="selected-outfit-item" key={item.id}>
                <img src={item.image} alt={item.alt || item.name} />
                
<p>{item.name}</p>

<strong>
  ₹{Number(item.price).toLocaleString("en-IN")}
</strong>

<label className="outfit-option-label">
  Size
  <select
    value={item.size}
    onChange={(e) =>
      updateSelectedItem(item.id, "size", e.target.value)
    }
  >
    {(item.category === "Footwear"
      ? ["6", "7", "8", "9", "10"]
      : item.category === "Accessories"
      ? ["One Size"]
      : ["S", "M", "L", "XL"]
    ).map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>
</label>

<label className="outfit-option-label">
  Colour
  <select
    value={item.color}
    onChange={(e) =>
      updateSelectedItem(item.id, "color", e.target.value)
    }
  >
    {["Black", "White", "Beige", "Blue", "Pink"].map(
      (color) => (
        <option key={color} value={color}>
          {color}
        </option>
      )
    )}
  </select>
</label>

                <button onClick={() => toggleItem(item)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="outfit-total">
          <div>
            <span>Outfit total</span>
            <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
          </div>

          <p>Build a look that matches your style and budget.</p>
          

<button
  className="buy-outfit-button"
  onClick={buyThisOutfit}
  disabled={selectedItems.length === 0}
>
  Buy This Outfit 🛍️
</button>


        </div>
      </section>

      <section className="studio-products">
        <h2>Choose Your Pieces</h2>
        <p className="studio-subtitle">
          Browse a category and add pieces to your outfit.
        </p>

        <div className="studio-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "category-active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="studio-product-grid">
          {visibleProducts.map((product) => {
            const isSelected = selectedItems.some(
              (item) => item.id === product.id
            );

            return (
              <article className="studio-product-card" key={product.id}>
                <button
                  className="studio-image-button"
                  onClick={() => navigate(`/product/${product.id}`)}
                  aria-label={`View ${product.name} details`}
                >
                  <img
                    src={product.image}
                    alt={product.alt || product.name}
                    loading="lazy"
                  />
                </button>

                <div className="studio-product-info">
                  <h3>{product.name}</h3>
                  <p>₹{Number(product.price).toLocaleString("en-IN")}</p>

                  
<div className="studio-product-actions">
  <button
    className="studio-add-button"
    onClick={() => toggleItem(product)}
  >
    {isSelected ? "✓ Added to Outfit" : "+ Add to Outfit"}
  </button>

  <button
    className="studio-buy-button"
    onClick={() => navigate(`/product/${product.id}`)}
  >
    Buy Now →
  </button>
</div>

                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default OutfitStudio;
