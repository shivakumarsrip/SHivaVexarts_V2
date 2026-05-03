import { useState, useMemo } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Search, Filter, X, LayoutGrid, List, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtworkCard from "@/components/ArtworkCard";

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: artworksData, isLoading } = trpc.artwork.list.useQuery({
    category: selectedCategory,
    collection: selectedCollection,
    search: search || undefined,
    limit: 50,
  });

  const { data: categories } = trpc.artwork.categories.useQuery();
  const { data: collections } = trpc.artwork.collections.useQuery();

  const hasFilters = selectedCategory || selectedCollection || search;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(undefined);
    setSelectedCollection(undefined);
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#F59E0B]">
              <div className="w-8 h-[1px] bg-[#F59E0B]" />
              <span className="font-body text-[12px] font-bold tracking-[0.2em] uppercase">Archive</span>
            </div>
            <h1 className="font-display text-[48px] sm:text-[64px] text-white uppercase leading-[0.9]">
              The Full <br />
              <span className="text-[#F59E0B]">Collection</span>
            </h1>
            <p className="font-body text-[16px] text-[#A1A1AA] max-w-lg leading-relaxed">
              Browse through our complete database of premium digital artworks, movie posters, and conceptual illustrations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#18181B] border border-[#27272A] p-2 rounded-2xl shadow-2xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-[#F59E0B] text-[#09090B]" : "text-[#71717A] hover:text-white"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${viewMode === "list" ? "bg-[#F59E0B] text-[#09090B]" : "text-[#71717A] hover:text-white"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-24 z-30 bg-[#09090B]/80 backdrop-blur-md border border-[#27272A] rounded-2xl p-4 mb-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] group-focus-within:text-[#F59E0B] transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title, year, or keywords..."
                className="w-full bg-[#18181B] border border-[#27272A] rounded-xl pl-12 pr-10 py-3 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F59E0B]/50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 h-11 bg-[#18181B] border border-[#27272A] rounded-xl text-[#71717A]">
                <SlidersHorizontal size={14} />
                <span className="text-[12px] font-bold uppercase tracking-wider">Refine</span>
              </div>

              <select
                value={selectedCategory ?? ""}
                onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                className="h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#F59E0B]/50 appearance-none min-w-[160px] cursor-pointer"
              >
                <option value="" className="bg-[#18181B]">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#18181B]">{cat}</option>
                ))}
              </select>

              <select
                value={selectedCollection ?? ""}
                onChange={(e) => setSelectedCollection(e.target.value || undefined)}
                className="h-11 bg-[#18181B] border border-[#27272A] rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#F59E0B]/50 appearance-none min-w-[160px] cursor-pointer"
              >
                <option value="" className="bg-[#18181B]">All Collections</option>
                {collections?.filter((col): col is string => !!col).map((col) => (
                  <option key={col} value={col} className="bg-[#18181B]">{col.replace(/_/g, " ")}</option>
                ))}
              </select>

              {hasFilters && (
                <button 
                  onClick={clearFilters}
                  className="h-11 px-6 flex items-center gap-2 text-[#71717A] hover:text-white transition-colors text-[12px] font-bold uppercase tracking-widest"
                >
                  <X size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-[#18181B] animate-pulse border border-[#27272A]" />
            ))}
          </div>
        ) : artworksData?.items.length === 0 ? (
          <div className="text-center py-32 bg-[#18181B] rounded-3xl border border-[#27272A] border-dashed">
            <div className="w-16 h-16 bg-[#09090B] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={24} className="text-[#3F3F46]" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No artworks found</h3>
            <p className="text-[#71717A] mb-8">Try adjusting your filters or search terms.</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-[#27272A] text-white hover:bg-white/5 h-12 px-8 rounded-xl"
            >
              Clear All Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworksData?.items.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork as any} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {artworksData?.items.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.slug}`}
                className="group flex items-center gap-6 p-4 bg-[#18181B] border border-[#27272A] rounded-2xl hover:border-[#F59E0B]/50 transition-all"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#09090B]">
                  <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg group-hover:text-[#F59E0B] transition-colors">{artwork.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[#71717A] text-xs uppercase tracking-widest">{artwork.collection}</span>
                    <div className="w-1 h-1 bg-[#3F3F46] rounded-full" />
                    <span className="text-[#71717A] text-xs uppercase tracking-widest">{artwork.category}</span>
                  </div>
                </div>
                <div className="text-right pr-4">
                  <span className="text-[#F59E0B] font-mono text-lg font-bold">Rs. {artwork.basePrice}</span>
                  <div className="flex items-center justify-end gap-1 text-[#52525B] mt-1 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
