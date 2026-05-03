import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Check, Minus, Plus, Share2, Info, Maximize2, ShieldCheck } from "lucide-react";
import { calculatePrice, SIZE_MULTIPLIERS, formatPrice } from "@/lib/pricing";

export default function ArtworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: artwork, isLoading } = trpc.artwork.bySlug.useQuery({ slug: slug! }, { enabled: !!slug });
  const [selectedSize, setSelectedSize] = useState("A4 Print");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#F59E0B]/20 border-t-[#F59E0B] rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-[#F59E0B] tracking-[0.3em] uppercase">Syncing Data...</span>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#09090B] pt-32 px-4 text-center">
        <h2 className="font-display text-[32px] text-white uppercase mb-4">Artwork Not Found</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate("/gallery")}
          className="border-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-white/5 h-12 px-8 rounded-xl"
        >
          Return to Gallery
        </Button>
      </div>
    );
  }

  const unitPrice = calculatePrice(artwork.basePrice, selectedSize);

  const handleAddToCart = () => {
    addItem({
      artworkId: artwork.id,
      slug: artwork.slug,
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      basePrice: artwork.basePrice,
      selectedSize,
      quantity,
      unitPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-24">
      <div className="container-vex max-w-7xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[#71717A] hover:text-[#F59E0B] transition-all mb-12"
        >
          <div className="w-10 h-10 rounded-full border border-[#27272A] flex items-center justify-center group-hover:border-[#F59E0B]/50 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-body text-[13px] font-bold uppercase tracking-widest">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Left: Image Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#18181B] border border-[#27272A] shadow-2xl group">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/40 to-transparent pointer-events-none" />
              <button className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-[#09090B]/80 backdrop-blur-md border border-[#27272A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-[#F59E0B]/50">
                <Maximize2 size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#18181B]/50 border border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <Info size={20} className="text-[#F59E0B] mb-3" />
                <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Authenticity</span>
                <span className="text-white text-[13px] font-medium">Digital Signature</span>
              </div>
              <div className="bg-[#18181B]/50 border border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <ShieldCheck size={20} className="text-[#F59E0B] mb-3" />
                <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Quality</span>
                <span className="text-white text-[13px] font-medium">Museum Grade</span>
              </div>
              <div className="bg-[#18181B]/50 border border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <Share2 size={20} className="text-[#F59E0B] mb-3" />
                <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Share</span>
                <span className="text-white text-[13px] font-medium">Collector's Item</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Specs & Purchase */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-2">
              <span className="font-body text-[12px] font-bold text-[#F59E0B] tracking-[0.25em] uppercase px-3 py-1 bg-[#F59E0B]/10 rounded-full border border-[#F59E0B]/20">
                {artwork.category}
              </span>
            </div>
            <h1 className="font-display text-[48px] sm:text-[56px] text-white uppercase leading-[0.9] mt-4 mb-2">
              {artwork.title}
            </h1>
            <p className="font-body text-[16px] text-[#A1A1AA] uppercase tracking-widest mb-8">
              Part of {artwork.collection?.replace(/_/g, " ")} Series
            </p>

            <div className="h-px bg-gradient-to-r from-[#27272A] to-transparent mb-8" />

            <p className="font-body text-[16px] text-[#A1A1AA] leading-relaxed mb-10 opacity-80">
              {artwork.description || "A meticulously crafted digital masterpiece representing the pinnacle of vector illustration and cinematic design."}
            </p>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-px bg-[#27272A] border border-[#27272A] rounded-2xl overflow-hidden mb-12">
              <div className="bg-[#18181B] p-5">
                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-2">Release Year</p>
                <p className="text-white font-mono text-[14px]">{artwork.year || "2024"}</p>
              </div>
              <div className="bg-[#18181B] p-5">
                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-2">Print Format</p>
                <p className="text-white font-mono text-[14px]">High-Res Inkjet</p>
              </div>
              <div className="bg-[#18181B] p-5">
                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-2">Base Price</p>
                <p className="text-[#F59E0B] font-mono text-[14px]">Rs. {parseFloat(artwork.basePrice).toLocaleString()}</p>
              </div>
              <div className="bg-[#18181B] p-5">
                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-2">Availability</p>
                <p className="text-[#16A34A] font-mono text-[14px]">Ready to Dispatch</p>
              </div>
            </div>

            {/* Selection Logic */}
            <div className="space-y-8">
              <div>
                <Label className="text-[#71717A] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block">1. Dimension Profile</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(SIZE_MULTIPLIERS).map((size) => {
                    const price = calculatePrice(artwork.basePrice, size);
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                          isActive
                            ? "border-[#F59E0B] bg-[#F59E0B]/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                            : "border-[#27272A] bg-[#18181B] hover:border-[#3F3F46]"
                        }`}
                      >
                        <p className={`text-[13px] font-bold uppercase tracking-wider ${isActive ? "text-[#F59E0B]" : "text-white"}`}>
                          {size}
                        </p>
                        <p className="text-[11px] text-[#71717A] mt-1 font-mono">{formatPrice(price)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-[#71717A] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block">2. Quantity Control</Label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-[#18181B] border border-[#27272A] rounded-xl p-1.5 h-14">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center text-[#71717A] hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-mono text-[16px] w-10 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center text-[#71717A] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Estimated Total</p>
                    <p className="text-[32px] font-mono font-bold text-white leading-none tracking-tight">
                      {formatPrice(unitPrice * quantity)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full h-16 rounded-2xl font-bold text-[16px] uppercase tracking-widest transition-all duration-500 shadow-2xl active:scale-95 ${
                    added 
                      ? "bg-[#16A34A] text-white shadow-[0_0_30px_rgba(22,163,74,0.3)]" 
                      : "bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                  }`}
                >
                  {added ? (
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5" strokeWidth={3} />
                      <span>Secured to Cart</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5" strokeWidth={3} />
                      <span>Acquire Artwork</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={className}>{children}</span>
);
