import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useCart } from "./context/CartContext";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";

function App() {
  const { state } = useCart();
  const location = useLocation();
  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Toaster position="top-center" />

      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <UtensilsCrossed size={24} />
            </div>
            <h2 className="font-bold text-2xl tracking-tight text-slate-800">CraveCart</h2>
          </Link>

          <nav className="flex gap-6 items-center">
            <Link to="/" className="text-slate-600 font-medium hover:text-red-500 transition-colors">
              Menu
            </Link>
            <Link to="/cart" className="relative text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItems}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8 relative">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track/:id" element={<OrderTracking />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;