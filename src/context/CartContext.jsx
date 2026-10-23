
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CartContext = createContext();

// Give each product variant its own unique key
function getCartKey(product) {
  return JSON.stringify([
    product.id,
    product.size || "One Size",
    product.color || "Default"
  ]);
}

// Load the saved cart from localStorage

function getSavedCart() {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = window.localStorage.getItem("stylenest-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Unable to load saved cart:", error);
    return [];
  }
}


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);

  // Save cart changes to localStorage

useEffect(() => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "stylenest-cart",
        JSON.stringify(cartItems)
      );
    }
  } catch (error) {
    console.error("Unable to save cart:", error);
  }
}, [cartItems]);


  // Add a product with its selected size, color and quantity
  function addToCart(product) {
    const quantityToAdd = Math.max(
      1,
      Number(product.quantity) || 1
    );

    const newItem = {
      ...product,
      quantity: quantityToAdd
    };

    newItem.cartKey = getCartKey(newItem);

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => getCartKey(item) === newItem.cartKey
      );

      if (existingItem) {
        return previousItems.map((item) =>
          getCartKey(item) === newItem.cartKey
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd
              }
            : item
        );
      }

      return [...previousItems, newItem];
    });
  }

  // Remove one specific size/color variant
  function removeFromCart(cartKey) {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => getCartKey(item) !== cartKey
      )
    );
  }

  // Increase quantity of one specific variant
  function increaseQuantity(cartKey) {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        getCartKey(item) === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrease quantity without going below one
  function decreaseQuantity(cartKey) {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        getCartKey(item) === cartKey && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  // Total quantity of all items
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price of all items
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
