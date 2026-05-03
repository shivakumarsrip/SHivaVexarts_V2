import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Truck, Package, ShieldCheck } from "lucide-react";

const shippingRates: Record<string, { label: string; cost: number; region: number }> = {
  nepal_kathmandu: { label: "Nepal (Kathmandu Valley)", cost: 150, region: 1 },
  nepal_outside: { label: "Nepal (Outside Valley)", cost: 250, region: 2 },
  india: { label: "India", cost: 500, region: 3 },
  international: { label: "International", cost: 1500, region: 4 },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [orderNumber, setOrderNumber] = useState("");

  // Shipping form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [regionKey, setRegionKey] = useState("nepal_kathmandu");

  const createOrder = trpc.order.create.useMutation();

  const subtotal = getTotalPrice();
  const shippingInfo = shippingRates[regionKey] || shippingRates.nepal_outside;
  const shippingCost = shippingInfo.cost;
  const total = subtotal + shippingCost;

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = async () => {
    try {
      const result = await createOrder.mutateAsync({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingCountry: regionKey.includes("nepal") ? "Nepal" : regionKey === "india" ? "India" : "International",
        shippingRegion: shippingInfo.region,
        totalAmount: total.toString(),
        shippingCost: shippingCost.toString(),
        paymentMethod: "Khalti",
        items: items.map((item) => ({
          artworkId: item.id,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
          totalPrice: (item.price * item.quantity).toString(),
        })),
      });

      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setOrderNumber(result.orderNumber);
      clearCart();
      setStep("success");
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-20 bg-[#18181B] border border-[#27272A] rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package size={40} className="text-[#F59E0B]" />
          </div>
          <h2 className="font-display text-[32px] text-white mb-4">Your Cart is Empty</h2>
          <p className="font-body text-[#A1A1AA] mb-10 max-w-sm mx-auto">
            You haven't added any visual assets to your collection yet.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] h-14 px-8 rounded-2xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all active:scale-95"
          >
            Browse Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-20">
      <div className="container-vex max-w-4xl mx-auto px-4">
        {/* Back button */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#71717A] hover:text-[#F59E0B] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-[14px] font-bold uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <ShieldCheck size={20} className="text-[#F59E0B]/50" />
            <span className="text-[#52525B] text-[12px] font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#27272A] -z-10" />
          {[
            { id: "shipping", label: "Shipping", icon: Truck },
            { id: "payment", label: "Payment", icon: CreditCard },
            { id: "success", label: "Confirm", icon: CheckCircle },
          ].map((s, i) => {
            const currentStepIdx = step === "shipping" ? 0 : step === "payment" ? 1 : 2;
            const isActive = i <= currentStepIdx;
            const isCurrent = i === currentStepIdx;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 bg-[#09090B] px-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? "bg-[#F59E0B] text-[#09090B] shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-110"
                      : "bg-[#18181B] border border-[#27272A] text-[#52525B]"
                  }`}
                >
                  <s.icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
                </div>
                <span
                  className={`font-body text-[11px] font-bold uppercase tracking-[0.2em] ${
                    isActive ? "text-white" : "text-[#52525B]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-7">
            {step === "shipping" && (
              <div className="bg-[#18181B] rounded-3xl border border-[#27272A] p-8 shadow-2xl">
                <h2 className="font-display text-[32px] text-white mb-8">Shipping Dispatch</h2>
                <form onSubmit={handleSubmitShipping} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Full Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Recipient Name"
                        className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@email.com"
                        className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Shipping Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Landmark, Apartment"
                      className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">City</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="h-14 bg-[#09090B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Shipping Region</Label>
                      <Select value={regionKey} onValueChange={setRegionKey}>
                        <SelectTrigger className="h-14 bg-[#09090B] border-[#27272A] text-white focus:border-[#F59E0B]/50 rounded-2xl transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A] text-white rounded-xl">
                          {Object.entries(shippingRates).map(([key, info]) => (
                            <SelectItem key={key} value={key} className="focus:bg-[#F59E0B] focus:text-[#09090B] py-3">{info.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-bold h-16 rounded-2xl mt-4 shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-all active:scale-[0.98] text-[16px]"
                  >
                    Proceed to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-8">
                <div className="bg-[#18181B] rounded-3xl border border-[#27272A] p-8 shadow-2xl">
                  <h2 className="font-display text-[32px] text-white mb-8">Secure Payment</h2>
                  
                  <div className="bg-gradient-to-br from-[#5C2D91] to-[#7B3FA0] rounded-3xl p-8 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                          <CreditCard size={32} className="text-white" />
                        </div>
                        <span className="text-white/50 font-body text-[11px] font-bold tracking-[0.2em] uppercase">Khalti Integrated</span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-white/60 text-[12px] font-bold uppercase tracking-widest">Order Amount</p>
                        <p className="text-white font-mono text-[32px] font-bold">Rs. {total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Button
                      onClick={handlePayment}
                      disabled={createOrder.isPending}
                      className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-bold h-16 rounded-2xl shadow-[0_10px_30px_rgba(92,45,145,0.3)] transition-all active:scale-[0.98] text-[16px]"
                    >
                      {createOrder.isPending ? (
                        <div className="flex items-center gap-3">
                          <Loader2 size={20} className="animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CreditCard size={20} />
                          <span>Pay with Khalti</span>
                        </div>
                      )}
                    </Button>
                    
                    <button
                      onClick={() => setStep("shipping")}
                      className="w-full py-4 text-[#71717A] hover:text-white font-body text-[13px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Modify Shipping Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="bg-[#18181B] rounded-3xl border border-[#27272A] p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
                
                <div className="w-24 h-24 bg-[#16A34A]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#16A34A]/20">
                  <CheckCircle size={48} className="text-[#16A34A]" />
                </div>
                
                <h2 className="font-display text-[40px] text-white mb-4 leading-tight">Order Authenticated</h2>
                <p className="font-body text-[16px] text-[#A1A1AA] mb-8 max-w-sm mx-auto leading-relaxed">
                  Your acquisition has been processed. A confirmation receipt has been dispatched to your email.
                </p>
                
                <div className="bg-[#09090B] border border-[#27272A] rounded-2xl p-6 mb-10 inline-block min-w-[280px]">
                  <p className="text-[#52525B] text-[11px] font-bold uppercase tracking-widest mb-2">Tracking Identity</p>
                  <p className="font-mono text-[18px] text-[#F59E0B] font-bold tracking-wider">{orderNumber}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-bold h-14 px-10 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    Return to Terminal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area - Order Summary (Only visible during Shipping/Payment) */}
          {(step === "shipping" || step === "payment") && (
            <div className="lg:col-span-5">
              <div className="bg-[#18181B] rounded-3xl border border-[#27272A] p-8 shadow-2xl sticky top-32">
                <div className="flex items-center gap-3 mb-8">
                  <Package size={20} className="text-[#F59E0B]" />
                  <h3 className="font-display text-[24px] text-white">Acquisition List</h3>
                </div>
                
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-[#09090B] shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[14px] font-bold text-white truncate mb-0.5">{item.title}</p>
                        <p className="font-body text-[11px] text-[#71717A] uppercase tracking-widest">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                        <p className="font-mono text-[13px] text-[#F59E0B] font-bold mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[#27272A] space-y-4">
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span className="font-body text-[14px] font-medium uppercase tracking-widest">Asset Total</span>
                    <span className="font-mono text-[15px] text-white/80">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span className="font-body text-[14px] font-medium uppercase tracking-widest">Logistics</span>
                    <span className="font-mono text-[15px] text-white/80">Rs. {shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="pt-6 mt-2 border-t border-[#27272A] flex justify-between items-end">
                    <div>
                      <p className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Final Authorization</p>
                      <span className="font-body text-[18px] font-bold text-white uppercase">Grand Total</span>
                    </div>
                    <span className="font-mono text-[28px] text-[#F59E0B] font-bold leading-none shadow-[0_0_20px_rgba(245,158,11,0.1)]">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 bg-[#09090B] p-4 rounded-2xl border border-[#27272A]/50">
                  <ShieldCheck size={24} className="text-[#16A34A]" />
                  <div className="flex-1">
                    <p className="text-white text-[12px] font-bold uppercase tracking-wider">Purchase Protection</p>
                    <p className="text-[#52525B] text-[10px] leading-relaxed">Full refund if the visual asset does not meet technical parity.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
