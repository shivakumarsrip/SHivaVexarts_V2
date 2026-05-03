import { Routes, Route } from "react-router";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ArtworkDetail from "./pages/ArtworkDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./hooks/useCart";
import { Toaster } from "sonner";

export default function App() {
  return (
    <CartProvider>
      <Toaster richColors position="top-right" theme="dark" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/artwork/:slug" element={<ArtworkDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </CartProvider>
  );
}
