import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [searchText, setSearchText] = useState("");
const navigate = useNavigate();

function handleSearch(event) {
  event.preventDefault();

  if (searchText.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    setMenuOpen(false);
  }
}

  return (
    <nav className="navbar">
      <Link to="/" className="logo">StyleNest</Link>

      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/women" onClick={() => setMenuOpen(false)}>Women</Link>
        <Link to="/men" onClick={() => setMenuOpen(false)}>Men</Link>
        
<Link to="/wishlist" onClick={() => setMenuOpen(false)}>
  ❤️ Wishlist
</Link>

<Link to="/outfit-studio">Outfit Studio ✨</Link>

      </div>

      <div className="nav-icons">
        <form className="navbar-search" onSubmit={handleSearch}>
  <input
    type="search"
    placeholder="Search products..."
    value={searchText}
    onChange={(event) => setSearchText(event.target.value)}
    aria-label="Search products by name"
  />
  <button type="submit" aria-label="Submit search">
    ⌕
  </button>
</form>
        <button aria-label="Account">♙</button>

        <Link
          to="/cart"
          className="cart-link"
          aria-label={`Shopping cart, ${cartCount} items`}
        >
          🛒 <span>{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;