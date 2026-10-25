
import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

function getSavedWishlist() {
  try {
    const saved = window.localStorage.getItem("stylenest-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getSavedWishlist);

  function toggleWishlist(product) {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);

      const updated = exists
        ? current.filter((item) => item.id !== product.id)
        : [...current, product];

      try {
        window.localStorage.setItem(
          "stylenest-wishlist",
          JSON.stringify(updated)
        );
      } catch {
        // Keep the wishlist working for this session.
      }

      return updated;
    });
  }

  function isWishlisted(productId) {
    return wishlist.some((item) => item.id === productId);
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
