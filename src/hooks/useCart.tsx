import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface CartItem {
  artworkId: number;
  slug: string;
  title: string;
  imageUrl: string;
  basePrice: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: number, size: string) => void;
  updateQuantity: (artworkId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("aura_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aura_cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.artworkId === item.artworkId && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.artworkId === item.artworkId && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((artworkId: number, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.artworkId === artworkId && i.selectedSize === size))
    );
  }, []);

  const updateQuantity = useCallback((artworkId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => !(i.artworkId === artworkId && i.selectedSize === size))
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.artworkId === artworkId && i.selectedSize === size ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
