import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const total = wishlist.reduce(
    (sum, product) => sum + Number(product.price),
    0
  );

  const hasBudget = budget.trim() !== "";
  const budgetAmount = Number(budget);
  const fitsBudget =
    hasBudget && Number.isFinite(budgetAmount) &&
    budgetAmount >= 0 && total <= budgetAmount;

  return (
    <main className="wishlist-page">
      <h1>My Wishlist ❤️</h1>
      <p>Save your favourites and plan your shopping budget.</p>

      <section className="budget-card">
        <label htmlFor="wishlist-budget">
          Your shopping budget (₹)
        </label>

        <input
          id="wishlist-budget"
          type="number"
          min="0"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="Enter your budget"
        />

        <h2>
          Wishlist total: ₹{total.toLocaleString("en-IN")}
        </h2>

        {hasBudget && budgetAmount >= 0 && Number.isFinite(budgetAmount) && (
          <p role="status">
            {fitsBudget
              ? `Great! You have ₹${(budgetAmount - total).toLocaleString("en-IN")} left.`
              : `You are ₹${(total - budgetAmount).toLocaleString("en-IN")} over budget.`}
          </p>
        )}
      </section>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">
          Your wishlist is empty. Explore StyleNest and save your favourites!
        </p>
      ) : (
        <div className="wishlist-grid">
  {wishlist.map((product) => (
    <article className="wishlist-item" key={product.id}>
      <img
        src={product.image}
        alt={product.alt || product.name}
        onClick={() => navigate(`/product/${product.id}`)}
        className="wishlist-product-image"
      />

      <h2
        onClick={() => navigate(`/product/${product.id}`)}
        className="wishlist-product-name"
      >
        {product.name}
      </h2>

      <p>₹{Number(product.price).toLocaleString("en-IN")}</p>

      <button onClick={() => toggleWishlist(product)}>
        Remove ❤️
      </button>
    </article>
  ))}
</div>
      )}
    </main>
  );
}

export default Wishlist;
