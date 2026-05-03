import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { COLLECTIONS, CATEGORIES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield, ShoppingBag, MessageSquare, ArrowLeft, Image as ImageIcon, Edit2, LayoutDashboard, Plus, Upload, X, CheckCircle2, LayoutGrid, List, Search, Settings, User, Globe, Cpu, Instagram, Palette, Monitor, Clapperboard, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { getArtworkImageFallback } from "@/lib/artwork-images";
import { Textarea } from "@/components/ui/textarea";

const statusColors = {
  pending: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20",
  paid: "bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20",
  processing: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  delivered: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
  cancelled: "bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20",
} as const;
type OrderStatus = keyof typeof statusColors;

const DEFAULT_SETTINGS = {
  about: {
    name: "Shivakumar S",
    occupation: "Digital Artist & Movie Publicity Designer",
    bio: "Digital artist and movie publicity designer based in Hyderabad, India. With over a decade of experience in the advertising, television, and film industry, I create visual narratives that command attention.\n\nFrom gritty movie posters for Telugu cinema to social awareness campaigns, every piece is crafted with cinematic intensity and digital precision. My work has garnered over 387,000 views and 14,000+ appreciations across platforms.\n\nAvailable for commissions — movie posters, album art, social media campaigns, and custom digital illustrations.",
    tools: ["Adobe Photoshop", "Illustrator", "After Effects"],
    image: null
  },
  experience: [
    { year: "Present", title: "Puthiya Thalaimurai TV", company: "Digital Artist & VFX Artist" },
    { year: "Previous", title: "Ocher Studios", company: "Digital Matte Artist" },
    { year: "Ongoing", title: "Freelance", company: "Movie Publicity Designer" }
  ],
  socials: {
    instagram: "https://www.instagram.com/shiva_vexarts",
    behance: "https://www.behance.net/Sivadigitalart",
    location: "Hyderabad, Telangana, India"
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [editingArtwork, setEditingArtwork] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isAddingNewCollection, setIsAddingNewCollection] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");
  const [settingsForm, setSettingsForm] = useState<any>(DEFAULT_SETTINGS);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const { data: artworksData, isLoading: artworksLoading } = trpc.artwork.list.useQuery({ limit: 1000 }, {
    enabled: isAdmin,
  });

  const { data: ordersData, isLoading: ordersLoading } = trpc.order.list.useQuery({ limit: 1000 }, {
    enabled: isAdmin,
  });

  const { data: contactsData, isLoading: contactsLoading } = trpc.contact.list.useQuery({ limit: 1000 }, {
    enabled: isAdmin,
  });

  const { data: settingsData, isLoading: settingsLoading } = trpc.settings.getAll.useQuery(undefined, {
    enabled: isAdmin,
  });

  useEffect(() => {
    if (settingsData) {
      setSettingsForm({
        ...DEFAULT_SETTINGS,
        ...settingsData,
        about: { ...DEFAULT_SETTINGS.about, ...(settingsData.about || {}) },
        socials: { ...DEFAULT_SETTINGS.socials, ...(settingsData.socials || {}) },
        experience: settingsData.experience || DEFAULT_SETTINGS.experience
      });
    }
  }, [settingsData]);

  const updateSettingMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.getAll.invalidate();
    },
  });

  const allArtworks = artworksData?.items || [];
  const allOrders = ordersData?.items || [];
  const allContacts = contactsData?.items || [];

  // ── Search Filtering Logic ──
  const filteredArtworks = useMemo(() => {
    if (!searchQuery) return allArtworks;
    const q = searchQuery.toLowerCase();
    return allArtworks.filter((a: any) => 
      a.title?.toLowerCase().includes(q) || 
      a.collection?.toLowerCase().includes(q) || 
      a.category?.toLowerCase().includes(q)
    );
  }, [allArtworks, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return allOrders;
    const q = searchQuery.toLowerCase();
    return allOrders.filter((o: any) => 
      o.customerName?.toLowerCase().includes(q) || 
      o.customerEmail?.toLowerCase().includes(q) || 
      o.orderNumber?.toLowerCase().includes(q)
    );
  }, [allOrders, searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return allContacts;
    const q = searchQuery.toLowerCase();
    return allContacts.filter((c: any) => 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) || 
      c.subject?.toLowerCase().includes(q) || 
      c.message?.toLowerCase().includes(q)
    );
  }, [allContacts, searchQuery]);

  const existingCollections: string[] = useMemo(() => {
    const fromData = allArtworks?.map((a: any) => a.collection).filter(Boolean) || [];
    const fromConstants = COLLECTIONS.map(c => c.id);
    return Array.from(new Set<string>([...fromData, ...fromConstants]));
  }, [allArtworks]);

  const createArtwork = trpc.artwork.create.useMutation({
    onSuccess: () => {
      utils.artwork.list.invalidate();
      resetForm();
    },
  });

  const updateArtwork = trpc.artwork.update.useMutation({
    onSuccess: () => {
      utils.artwork.list.invalidate();
      setEditingArtwork(null);
    },
  });

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.list.invalidate();
    },
  });

  const handleSaveSetting = (key: string, value: any) => {
    updateSettingMutation.mutate({ key, value }, {
      onSuccess: () => {
        toast.success(`Updated ${key} successfully!`, {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        });
      },
      onError: (err) => {
        toast.error(`Failed to update ${key}: ${err.message}`);
      }
    });
  };

  const saveAllSettings = () => {
    Object.entries(settingsForm).forEach(([key, value]) => {
      updateSettingMutation.mutate({ key, value });
    });
    toast.success("All settings saved successfully!", {
      description: "Your site content has been updated.",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    });
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        const currentAbout = settingsForm.about || {};
        const updatedAbout = { ...currentAbout, image: data.url };
        handleSaveSetting("about", updatedAbout);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setIsAddingNew(false);
    setEditingArtwork(null);
    setEditForm({});
    setUploadFile(null);
    setUploadPreview(null);
    setUploading(false);
    setIsAddingNewCollection(false);
    setIsAddingNewCategory(false);
    setNewCollectionName("");
    setNewCategoryName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAndSave = async () => {
    if (!uploadFile && !editForm.imageUrl) return; // Need a file or existing image
    if (!editForm.title || !editForm.category) return;
    
    setUploading(true);
    const finalCollection = isAddingNewCollection ? newCollectionName : editForm.collection;
    const finalCategory = isAddingNewCategory ? newCategoryName : editForm.category;

    if (!finalCollection || !finalCategory) {
      alert("PLEASE SPECIFY COLLECTION AND CATEGORY.");
      setUploading(false);
      return;
    }

    try {
      let imageUrl = editForm.imageUrl;
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");
        const json = await response.json();
        imageUrl = json.url;
      }

      const basePayload = {
        title: editForm.title,
        category: finalCategory,
        collection: finalCollection,
        imageUrl: imageUrl!,
        basePrice: (editForm.basePrice || 2000).toString(),
        description: editForm.description || "",
        slug: editForm.slug || editForm.title.toLowerCase().replace(/\s+/g, '-'),
      };

      if (editingArtwork) {
        await updateArtwork.mutateAsync({
          id: editingArtwork.id,
          ...basePayload,
        });
      } else {
        await createArtwork.mutateAsync(basePayload);
      }

      utils.artwork.list.invalidate();
      resetForm();
    } catch (error) {
      console.error("Transmission error:", error);
      alert("FAILURE IN TRANSMITTING DATA. CHECK CONSOLE.");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <Loader2 size={32} className="text-[#F59E0B] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#09090B] pt-24 pb-16">
      <div className="container-vex max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Shield size={18} />
                <span className="font-body text-[12px] font-bold tracking-widest uppercase">Admin Terminal</span>
              </div>
              <h1 className="font-display text-[32px] md:text-[40px] text-white">Command Center</h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-[320px] group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#71717A] group-focus-within:text-[#F59E0B] transition-colors">
                <Search size={18} />
              </div>
              <Input 
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-10 bg-[#18181B] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#F59E0B]/50 focus:ring-[#F59E0B]/10 rounded-2xl transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-[#71717A] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button 
              onClick={() => setIsAddingNew(true)}
              className="w-full sm:w-auto bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-bold h-14 px-8 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              Import Art
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex items-center justify-between w-full">
            <TabsList className="bg-[#18181B] border border-[#27272A] p-1.5 h-14 rounded-xl inline-flex items-center">
              <TabsTrigger 
                value="inventory" 
                className="px-6 h-full rounded-lg font-body font-bold text-[14px] text-[#A1A1AA] hover:text-white data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#09090B] transition-all"
              >
                <ImageIcon size={16} className="mr-2" />
                Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="px-6 h-full rounded-lg font-body font-bold text-[14px] text-[#A1A1AA] hover:text-white data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#09090B] transition-all"
              >
                <ShoppingBag size={16} className="mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="px-6 h-full rounded-lg font-body font-bold text-[14px] text-[#A1A1AA] hover:text-white data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#09090B] transition-all"
              >
                <MessageSquare size={16} className="mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="px-6 h-full rounded-lg font-body font-bold text-[14px] text-[#A1A1AA] hover:text-white data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#09090B] transition-all"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 flex justify-end">
              {activeTab === "inventory" && (
                <div className="flex bg-[#18181B] border border-[#27272A] p-1.5 rounded-xl h-14 w-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex-1 flex items-center justify-center rounded-lg transition-all ${viewMode === "list" ? "bg-[#27272A] text-[#F59E0B] shadow-inner" : "text-[#52525B] hover:text-white"}`}
                  >
                    <List size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 flex items-center justify-center rounded-lg transition-all ${viewMode === "grid" ? "bg-[#27272A] text-[#F59E0B] shadow-inner" : "text-[#52525B] hover:text-white"}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="inventory" className="focus-visible:outline-none m-0">
            {artworksLoading ? (
              <div className="flex items-center justify-center py-32 bg-[#18181B] rounded-2xl border border-[#27272A]">
                <Loader2 size={32} className="text-[#F59E0B] animate-spin" />
              </div>
            ) : viewMode === "list" ? (
              <div className="bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#09090B]">
                      <TableRow className="border-[#27272A] hover:bg-transparent h-16">
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider pl-8">Preview</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Title</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Collection</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Category</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Price</TableHead>
                        <TableHead className="text-right pr-8 text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredArtworks?.map((artwork: any) => (
                        <TableRow key={artwork.id} className="border-[#27272A] hover:bg-[#27272A]/40 transition-colors h-20 group">
                          <TableCell className="pl-8">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5 group-hover:border-[#F59E0B]/30 transition-colors">
                              <img
                                src={artwork.imageUrl}
                                className="w-full h-full object-cover"
                                alt=""
                                onError={(event) => {
                                  event.currentTarget.src = getArtworkImageFallback(artwork.imageUrl);
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-body text-[14px] text-white font-bold">{artwork.title}</TableCell>
                          <TableCell>
                            <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-body text-[11px] capitalize px-3 py-1">
                              {artwork.collection?.replace(/_/g, " ") || "Solo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-body text-[14px] text-[#A1A1AA]">{artwork.category}</TableCell>
                          <TableCell className="font-mono text-[14px] text-white font-bold">Rs. {artwork.basePrice}</TableCell>
                          <TableCell className="text-right pr-8">
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingArtwork(artwork);
                                setEditForm({ ...artwork, basePrice: parseInt(artwork.basePrice) });
                              }}
                              className="text-[#52525B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all rounded-xl"
                            >
                              <Edit2 size={18} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredArtworks?.map((artwork: any) => (
                  <div 
                    key={artwork.id} 
                    className="group bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden hover:border-[#F59E0B] transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:-translate-y-2 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#18181B]">
                      <img 
                        src={artwork.imageUrl} 
                        className="w-full h-full object-cover scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform transform-gpu" 
                        alt={artwork.title} 
                        onError={(event) => {
                          event.currentTarget.src = getArtworkImageFallback(artwork.imageUrl);
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-[#09090B]/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                      
                      <button 
                        onClick={() => {
                          setEditingArtwork(artwork);
                          setEditForm({ ...artwork, basePrice: parseInt(artwork.basePrice) });
                        }}
                        className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl bg-[#F59E0B] text-[#09090B] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 shadow-[0_10px_20px_rgba(245,158,11,0.3)] active:scale-90 z-20"
                      >
                        <Edit2 size={22} strokeWidth={2.5} />
                      </button>

                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="outline" className="bg-[#09090B]/80 backdrop-blur-md text-[#F59E0B] border-[#F59E0B]/30 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full group-hover:bg-[#F59E0B] group-hover:text-[#09090B] transition-colors duration-500">
                          {artwork.collection?.split("_")[0] || "Solo"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-[#18181B] relative z-10 -mt-0.5 pt-6.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-white font-bold text-[17px] leading-tight group-hover:text-[#F59E0B] transition-colors duration-300">{artwork.title}</h3>
                          <p className="text-[#71717A] text-[12px] font-medium uppercase tracking-wider">{artwork.category}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[#F59E0B] font-mono text-[16px] font-bold block">₹{artwork.basePrice}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex items-center gap-2">
                        <div className="h-px flex-1 bg-[#27272A] group-hover:bg-[#F59E0B]/20 transition-colors" />
                        <LayoutDashboard size={14} className="text-[#3F3F46] group-hover:text-[#F59E0B]/40 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!artworksLoading && filteredArtworks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-[#18181B] rounded-2xl border border-[#27272A]">
                <Search size={48} className="text-[#27272A] mb-4" />
                <p className="text-[#71717A] font-body text-[16px]">No results found for "<span className="text-white">{searchQuery}</span>"</p>
              </div>
            )}
          </TabsContent>

          {/* Tab contents for Orders and Messages */}
          <TabsContent value="orders" className="focus-visible:outline-none m-0">
            <div className="bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden shadow-2xl">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={32} className="text-[#F59E0B] animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#09090B]">
                      <TableRow className="border-[#27272A] hover:bg-transparent h-16">
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider pl-8">Order ID</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Customer</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Amount</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Status</TableHead>
                        <TableHead className="text-right pr-8 text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders?.map((order: any) => (
                        <TableRow key={order.id} className="border-[#27272A] hover:bg-[#27272A]/40 transition-colors h-20">
                          <TableCell className="pl-8 font-mono text-[13px] text-white font-bold">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-[14px]">{order.customerName}</span>
                              <span className="text-[#71717A] text-[12px]">{order.customerEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-[14px] text-white">Rs. {order.totalAmount}</TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[order.status as OrderStatus] || ""} capitalize px-3 py-1 font-body text-[11px]`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(val) => updateStatus.mutate({ id: order.id, status: val as OrderStatus })}
                            >
                              <SelectTrigger className="w-[140px] h-10 bg-[#09090B] border-[#27272A] text-white rounded-xl focus:ring-[#F59E0B]/20 ml-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#18181B] border-[#27272A] text-white">
                                {Object.keys(statusColors).map(status => (
                                  <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            {!ordersLoading && filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-[#18181B] rounded-2xl border border-[#27272A]">
                <Search size={48} className="text-[#27272A] mb-4" />
                <p className="text-[#71717A] font-body text-[16px]">No orders found for "<span className="text-white">{searchQuery}</span>"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="focus-visible:outline-none m-0">
            <div className="bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden shadow-2xl">
              {contactsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={32} className="text-[#F59E0B] animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#09090B]">
                      <TableRow className="border-[#27272A] hover:bg-transparent h-16">
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider pl-8">Date</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">From</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider">Subject</TableHead>
                        <TableHead className="text-[#71717A] font-body font-bold text-[12px] uppercase tracking-wider pr-8">Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts?.map((contact: any) => (
                        <TableRow key={contact.id} className="border-[#27272A] hover:bg-[#27272A]/40 transition-colors align-top">
                          <TableCell className="pl-8 py-6 text-[#71717A] text-[12px] font-mono">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-[14px]">{contact.name}</span>
                              <span className="text-[#71717A] text-[12px]">{contact.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 text-white font-bold text-[14px]">{contact.subject}</TableCell>
                          <TableCell className="py-6 pr-8 text-[#A1A1AA] text-[13px] leading-relaxed max-w-md">
                            {contact.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            {!contactsLoading && filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-[#18181B] rounded-2xl border border-[#27272A]">
                <Search size={48} className="text-[#27272A] mb-4" />
                <p className="text-[#71717A] font-body text-[16px]">No messages found for "<span className="text-white">{searchQuery}</span>"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            {settingsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-[#F59E0B]/20 border-t-[#F59E0B] rounded-full animate-spin" />
                <p className="text-[#71717A] font-body text-[14px]">Loading system settings...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#18181B] border border-[#27272A] p-6 rounded-2xl shadow-xl">
                  <div>
                    <h2 className="font-display text-[24px] text-white">Site Settings</h2>
                    <p className="text-[#71717A] text-[13px]">Manage profile, social presence and experience timeline</p>
                  </div>
                  <Button 
                    onClick={saveAllSettings}
                    disabled={updateSettingMutation.isPending}
                    className="bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-body font-bold rounded-xl h-12 px-8 shadow-lg shadow-[#F59E0B]/10"
                  >
                    {updateSettingMutation.isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                    Save All Changes
                  </Button>
                </div>

                {/* About Management */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                      
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[20px] text-white">About Profile</h3>
                          <p className="text-[#71717A] text-[13px]">Manage your personal bio and public profile photo</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Full Name</Label>
                            <Input 
                              value={settingsForm.about?.name || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, about: { ...settingsForm.about, name: e.target.value }})}
                              onBlur={() => handleSaveSetting("about", settingsForm.about)}
                              placeholder="Artist Name"
                              className="bg-[#09090B] border-[#27272A] text-white h-12 rounded-xl focus:ring-[#F59E0B]/20 focus:border-[#F59E0B]"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Occupation</Label>
                            <Input 
                              value={settingsForm.about?.occupation || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, about: { ...settingsForm.about, occupation: e.target.value }})}
                              onBlur={() => handleSaveSetting("about", settingsForm.about)}
                              placeholder="Digital Artist"
                              className="bg-[#09090B] border-[#27272A] text-white h-12 rounded-xl focus:ring-[#F59E0B]/20 focus:border-[#F59E0B]"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Bio / Introduction</Label>
                          <Textarea 
                            value={settingsForm.about?.bio || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, about: { ...settingsForm.about, bio: e.target.value }})}
                            onBlur={() => handleSaveSetting("about", settingsForm.about)}
                            placeholder="Tell the world about yourself..."
                            className="bg-[#09090B] border-[#27272A] text-white min-h-[150px] rounded-xl focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] resize-none py-4"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tools Management */}
                    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                      
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                          <Cpu size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[20px] text-white">Design Stack</h3>
                          <p className="text-[#71717A] text-[13px]">List the software and tools you use (comma separated)</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Tools & Software</Label>
                          <Textarea 
                            value={settingsForm.about?.tools?.join(", ") || ""}
                            onChange={(e) => {
                              const tools = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                              setSettingsForm({ ...settingsForm, about: { ...settingsForm.about, tools }});
                            }}
                            onBlur={() => handleSaveSetting("about", settingsForm.about)}
                            placeholder="Photoshop, Illustrator, Blender..."
                            className="bg-[#09090B] border-[#27272A] text-white rounded-xl focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] resize-none h-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Profile Image */}
                    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 flex flex-col items-center text-center">
                      <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider mb-6 block w-full text-left pl-1">Profile Photo</Label>
                      
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#27272A] bg-[#09090B] relative transition-all group-hover:border-[#F59E0B]/30">
                          {settingsForm.about?.image ? (
                            <img src={settingsForm.about.image} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#3F3F46]">
                              <User size={64} />
                            </div>
                          )}
                          
                          <div 
                            onClick={() => profileImageInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all gap-2"
                          >
                            <Upload size={24} className="text-white" />
                            <span className="text-white text-[11px] font-bold uppercase tracking-widest">Replace</span>
                          </div>
                        </div>
                        
                        {uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                            <Loader2 size={32} className="text-[#F59E0B] animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      <input 
                        type="file" 
                        ref={profileImageInputRef} 
                        onChange={handleProfileImageUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                      
                      <p className="mt-6 text-[#71717A] text-[13px] px-4 italic leading-relaxed">
                        This image appears on your About section and public profile.
                      </p>
                    </div>

                    {/* Socials & Location */}
                    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                          <Globe size={20} />
                        </div>
                        <h3 className="font-display text-[20px] text-white">Social Presence</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-1">
                            <Instagram size={14} className="text-[#E1306C]" />
                            <span>Instagram</span>
                          </div>
                          <Input 
                            value={settingsForm.socials?.instagram || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socials: { ...settingsForm.socials, instagram: e.target.value }})}
                            onBlur={() => handleSaveSetting("socials", settingsForm.socials)}
                            placeholder="@username"
                            className="bg-[#09090B] border-[#27272A] text-white h-11 rounded-xl focus:ring-[#F59E0B]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-1">
                            <Palette size={14} className="text-[#053EFF]" />
                            <span>Behance</span>
                          </div>
                          <Input 
                            value={settingsForm.socials?.behance || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socials: { ...settingsForm.socials, behance: e.target.value }})}
                            onBlur={() => handleSaveSetting("socials", settingsForm.socials)}
                            placeholder="behance.net/username"
                            className="bg-[#09090B] border-[#27272A] text-white h-11 rounded-xl focus:ring-[#F59E0B]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider mb-1">
                            <Globe size={14} className="text-[#F59E0B]" />
                            <span>Location</span>
                          </div>
                          <Input 
                            value={settingsForm.socials?.location || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socials: { ...settingsForm.socials, location: e.target.value }})}
                            onBlur={() => handleSaveSetting("socials", settingsForm.socials)}
                            placeholder="City, Country"
                            className="bg-[#09090B] border-[#27272A] text-white h-11 rounded-xl focus:ring-[#F59E0B]/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Management */}
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                        <Clapperboard size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-[22px] text-white">Professional Journey</h3>
                        <p className="text-[#71717A] text-[13px]">Track and showcase your career milestones</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        const experience = [...(settingsForm.experience || []), { year: "", title: "", company: "" }];
                        setSettingsForm({ ...settingsForm, experience });
                      }}
                      className="bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#09090B] border-none rounded-xl px-6"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Milestone
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(settingsForm.experience || []).map((exp: any, index: number) => (
                      <div key={index} className="bg-[#09090B] border border-[#27272A] rounded-2xl p-6 relative group transition-all hover:border-[#F59E0B]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                        <button 
                          onClick={() => {
                            const experience = settingsForm.experience.filter((_: any, i: number) => i !== index);
                            setSettingsForm({ ...settingsForm, experience });
                            handleSaveSetting("experience", experience);
                          }}
                          className="absolute top-4 right-4 text-[#3F3F46] hover:text-[#DC2626] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[#71717A] text-[10px] font-bold uppercase tracking-widest">Year</Label>
                            <Input 
                              value={exp.year}
                              onChange={(e) => {
                                const experience = [...settingsForm.experience];
                                experience[index].year = e.target.value;
                                setSettingsForm({ ...settingsForm, experience });
                              }}
                              onBlur={() => handleSaveSetting("experience", settingsForm.experience)}
                              placeholder="2023"
                              className="bg-[#18181B] border-[#27272A] text-white h-10 rounded-lg text-[13px] font-bold"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[#71717A] text-[10px] font-bold uppercase tracking-widest">Title</Label>
                            <Input 
                              value={exp.title}
                              onChange={(e) => {
                                const experience = [...settingsForm.experience];
                                experience[index].title = e.target.value;
                                setSettingsForm({ ...settingsForm, experience });
                              }}
                              onBlur={() => handleSaveSetting("experience", settingsForm.experience)}
                              placeholder="Senior Artist"
                              className="bg-[#18181B] border-[#27272A] text-white h-10 rounded-lg text-[13px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[#71717A] text-[10px] font-bold uppercase tracking-widest">Organization</Label>
                            <Input 
                              value={exp.company}
                              onChange={(e) => {
                                const experience = [...settingsForm.experience];
                                experience[index].company = e.target.value;
                                setSettingsForm({ ...settingsForm, experience });
                              }}
                              onBlur={() => handleSaveSetting("experience", settingsForm.experience)}
                              placeholder="Studio Name"
                              className="bg-[#18181B] border-[#27272A] text-white h-10 rounded-lg text-[13px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editingArtwork || isAddingNew} onOpenChange={resetForm}>
        <DialogContent className="bg-[#18181B] border border-[#3F3F46] text-white sm:max-w-[600px] p-0 overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="bg-gradient-to-br from-[#18181B] to-[#09090B] p-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 text-[#F59E0B] mb-2">
                {editingArtwork ? <Edit2 size={16} /> : <Upload size={16} />}
                <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase">
                  {editingArtwork ? "Modify Artwork" : "Add to Gallery"}
                </span>
              </div>
              <DialogTitle className="font-display text-[32px] text-white leading-tight">
                {editingArtwork ? "Edit Details" : "Import Artwork"}
              </DialogTitle>
              {editingArtwork && (
                <DialogDescription className="text-[#71717A] font-body text-[14px] mt-2">
                  Updating: <span className="text-white font-bold">"{editingArtwork?.title}"</span>
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* File Upload Area */}
              <div className="space-y-4">
                <Label className="text-[#A1A1AA] text-[12px] font-bold uppercase tracking-wider pl-1">Image File</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    uploadPreview || editForm.imageUrl ? "border-[#F59E0B]/50 bg-[#F59E0B]/5" : "border-[#27272A] hover:border-[#3F3F46] bg-[#09090B]"
                  }`}
                >
                  {uploadPreview || editForm.imageUrl ? (
                    <img src={uploadPreview || editForm.imageUrl} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                  ) : (
                    <>
                      <ImageIcon size={40} className="text-[#3F3F46] mb-3" />
                      <p className="text-[#71717A] text-[13px] font-medium text-center px-4">Click or drag to upload image</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                {uploadFile && (
                  <div className="flex items-center gap-2 text-[#16A34A] text-[12px] font-bold bg-[#16A34A]/10 p-2 rounded-lg border border-[#16A34A]/20">
                    <CheckCircle2 size={14} />
                    <span className="truncate">{uploadFile.name}</span>
                  </div>
                )}
                </div>
                          {/* Form Data Area */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider pl-1">Title</Label>
                  <Input
                    placeholder="E.g. The Dark Knight"
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="h-11 bg-[#09090B] border-zinc-800 rounded-xl focus:border-amber-500 text-zinc-100 font-mono uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider">Collection</Label>
                    <button 
                      type="button"
                      onClick={() => setIsAddingNewCollection(!isAddingNewCollection)}
                      className="text-amber-500 text-[10px] font-bold uppercase hover:underline"
                    >
                      {isAddingNewCollection ? "USE EXISTING" : "+ NEW"}
                    </button>
                  </div>
                  {isAddingNewCollection ? (
                    <Input
                      placeholder="NEW COLLECTION ID (e.g. movie_posters)"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="h-11 bg-[#09090B] border-amber-500/50 rounded-xl text-zinc-100 font-mono uppercase"
                    />
                  ) : (
                    <Select value={editForm.collection} onValueChange={(val) => setEditForm({...editForm, collection: val})}>
                      <SelectTrigger className="h-11 bg-[#09090B] border-zinc-800 rounded-xl text-zinc-100 font-mono uppercase">
                        <SelectValue placeholder="SELECT COLLECTION" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-zinc-800 text-zinc-100">
                        {existingCollections.map(col => (
                          <SelectItem key={col} value={col} className="uppercase font-mono">
                            {col.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider">Category</Label>
                    <button 
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-amber-500 text-[10px] font-bold uppercase hover:underline"
                    >
                      {isAddingNewCategory ? "USE PREDEFINED" : "+ CUSTOM"}
                    </button>
                  </div>
                  {isAddingNewCategory ? (
                    <Input
                      placeholder="ENTER CUSTOM CATEGORY"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="h-11 bg-[#09090B] border-amber-500/50 rounded-xl text-zinc-100 font-mono uppercase"
                    />
                  ) : (
                    <Select value={editForm.category} onValueChange={(val) => setEditForm({...editForm, category: val})}>
                      <SelectTrigger className="h-11 bg-[#09090B] border-zinc-800 rounded-xl text-zinc-100 font-mono uppercase">
                        <SelectValue placeholder="SELECT CATEGORY" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-zinc-800 text-zinc-100">
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat} className="uppercase font-mono">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider pl-1">Price (Rs.)</Label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={editForm.basePrice || ""}
                    onChange={(e) => setEditForm({ ...editForm, basePrice: parseInt(e.target.value) })}
                    className="h-11 bg-[#09090B] border-zinc-800 rounded-xl focus:border-amber-500 text-zinc-100 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider pl-1">Description</Label>
                  <textarea
                    placeholder="ENTER ARTWORK DESCRIPTION..."
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full h-24 bg-[#09090B] border-zinc-800 rounded-xl focus:border-amber-500 p-3 text-zinc-100 text-sm font-mono uppercase resize-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 border-t border-zinc-800 pt-6">
              <Button 
                variant="outline" 
                onClick={resetForm}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl font-mono uppercase"
              >
                Abort
              </Button>
              <Button 
                onClick={handleUploadAndSave}
                disabled={uploading || (!uploadFile && !editForm.imageUrl) || !editForm.title || !editForm.category}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 rounded-xl font-mono uppercase"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span>{editingArtwork ? "Saving..." : "Uploading..."}</span>
                  </div>
                ) : editingArtwork ? "Save Changes" : "Import & Launch"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
