import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Women from "./pages/Women";
import Men from "./pages/Men";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import SearchResults from "./pages/SearchResults";
import Category from "./pages/Category";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/women" element={<Women />} />
          <Route path="/men" element={<Men />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:category" element={<Category />}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />}/>
          <Route
  path="/product/:id"
  element={<ProductDetails />}
/>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;