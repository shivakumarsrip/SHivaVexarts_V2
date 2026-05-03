import { useCart } from "@/hooks/useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { formatPrice } from "@/lib/pricing";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-[#0a0a0a] border-white/10 flex flex-col">
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Collection
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/40">
            <ShoppingBag className="w-12 h-12" />
            <p className="text-sm">Your cart is empty</p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
              Continue Browsing
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.artworkId}-${item.selectedSize}`} className="flex gap-3 p-3 rounded-lg bg-white/5">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                    <p className="text-xs text-white/50 mt-0.5">{item.selectedSize}</p>
                    <p className="text-sm font-semibold text-white mt-1">{formatPrice(item.unitPrice)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.artworkId, item.selectedSize, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.artworkId, item.selectedSize, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.artworkId, item.selectedSize)}
                        className="ml-auto p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Subtotal</span>
                <span className="text-lg font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-white/30">Shipping calculated at checkout</p>
              <Link to="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
