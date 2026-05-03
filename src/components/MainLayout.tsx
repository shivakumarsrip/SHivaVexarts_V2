import { type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import ChatbotWidget from "./ChatbotWidget";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
