import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot, User, Loader2, Sparkles, Terminal, Shield } from "lucide-react";
import { useNavigate } from "react-router";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `SYSTEM READY. HELLO! I'M THE SHIVA VEXARTS AI ASSISTANT.

I HAVE ACCESS TO THE FOLLOWING MODULES:
- [01] GALLERY ARCHIVE & INVENTORY
- [02] PRICING STRUCTURES & DIMENSIONS
- [03] CUSTOM COMMISSIONS & DESIGN SERVICES
- [04] LOGISTICS & ORDER STATUS
- [05] ARTIST PORTFOLIO DATA

HOW CAN I ASSIST YOUR CREATIVE PROTOCOLS TODAY?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const RESPONSES: Record<string, string> = {
  price: "PRICING CONFIGURATION:\n• BASE PRINTS (A4): Rs. 1,200 - 2,500\n• A3 SCALE: 1.5x Base\n• A2 SCALE: 2.5x Base\n• DIGITAL SOURCE: 0.6x Base\n\nSHIPPING: RS. 150 (VALLEY) / RS. 250 (OUTSIDE).",
  size: "DIMENSION SPECIFICATIONS:\n• A4 PRINT: 210 x 297 mm\n• A3 PRINT: 297 x 420 mm\n• A2 PRINT: 420 x 594 mm\n• DIGITAL: HIGH-RES 300DPI PNG SOURCE.",
  commission: "COMMISSION PROTOCOL: OPEN.\nSHIVAKUMAR ACCEPTS CUSTOM INQUIRIES FOR:\n• CINEMATIC POSTERS\n• BRAND IDENTITY\n• CUSTOM ILLUSTRATIONS\n\nCONTACT: VIA SITE FORM OR @SHIVA_VEXARTS.",
  shipping: "LOGISTICS DATA:\n• KATHMANDU: 2-3 DAYS (RS. 150)\n• NEPAL (WIDER): 3-5 DAYS (RS. 250)\n• INDIA: 7-10 DAYS (RS. 500)\n• INTERNATIONAL: 10-15 DAYS (RS. 1,500).",
  payment: "TRANSACTION SECURITY: ACTIVE.\nGATEWAY: KHALTI (SECURE/ENCRYPTED).\nPAYMENT IS PROCESSED AT CHECKOUT FINALIZATION.",
  artist: "ARTIST PROFILE: SHIVAKUMAR S.\nEXPERIENCE: 10+ YEARS IN PUBLICITY DESIGN.\nLOCATION: HYDERABAD, INDIA.\nMETRICS: 387K+ GLOBAL VIEWS | 14K+ APPRECIATIONS.",
  gallery: "DATABASE STATUS:\n• MOVIE POSTERS: 8 ITEMS\n• SOCIAL AWARENESS: 4 ITEMS\n• DIGITAL ILLUSTRATIONS: 2 ITEMS\n\nNAVIGATE TO /GALLERY TO VIEW FULL ARCHIVE.",
  default: "COMMAND UNRECOGNIZED. PLEASE SPECIFY:\n- PRICING OR SIZES\n- COMMISSIONS\n- SHIPPING STATUS\n- ARTIST DATA\n- GALLERY INQUIRIES",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) return RESPONSES.price;
  if (lower.includes("size") || lower.includes("dimension")) return RESPONSES.size;
  if (lower.includes("commission") || lower.includes("custom") || lower.includes("hire")) return RESPONSES.commission;
  if (lower.includes("shipping") || lower.includes("delivery")) return RESPONSES.shipping;
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("khalti")) return RESPONSES.payment;
  if (lower.includes("artist") || lower.includes("shivakumar") || lower.includes("about")) return RESPONSES.artist;
  if (lower.includes("gallery") || lower.includes("artwork") || lower.includes("poster")) return RESPONSES.gallery;
  return RESPONSES.default;
}

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = getResponse(userMessage.content);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-20 flex flex-col font-mono">
      {/* Terminal Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#F59E0B]" />
                <h1 className="text-[14px] font-bold text-white uppercase tracking-widest">Command Assistant v2.0</h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-[10px] text-[#16A34A] uppercase tracking-widest font-bold">Uplink Active</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[10px] text-[#52525B] uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-[#F59E0B]/50" />
              <span>Encrypted Session</span>
            </div>
            <span>ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-[calc(100vh-160px)]" ref={scrollRef}>
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Column */}
                <div className="flex-shrink-0 mt-1">
                  {msg.role === "assistant" ? (
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                      <Sparkles size={18} className="text-[#F59E0B]" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#27272A] border border-[#3F3F46] flex items-center justify-center">
                      <User size={18} className="text-[#A1A1AA]" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[70%]`}>
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                      {msg.role === "assistant" ? "System_Core" : "Authorized_User"}
                    </span>
                    <span className="text-[10px] text-[#3F3F46]">{msg.timestamp}</span>
                  </div>
                  
                  <div
                    className={`rounded-2xl px-6 py-4 border transition-all duration-300 ${
                      msg.role === "user"
                        ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                        : "bg-[#18181B] text-white border-[#27272A] shadow-xl"
                    }`}
                  >
                    <p className={`text-[14px] leading-relaxed whitespace-pre-line ${msg.role === "assistant" ? "font-mono" : "font-body font-medium"}`}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                  <Bot size={18} className="text-[#F59E0B]" />
                </div>
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl px-6 py-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>

      {/* Input Module */}
      <div className="border-t border-[#27272A] bg-[#09090B]/95 backdrop-blur-xl p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F59E0B]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
            <div className="relative flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="INPUT COMMAND OR INQUIRY..."
                className="h-16 bg-[#18181B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B]/50 focus:ring-0 rounded-2xl px-6 text-[14px] font-mono tracking-wider"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`h-16 w-16 sm:w-24 rounded-2xl transition-all duration-300 ${
                  input.trim() && !isTyping 
                    ? "bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                    : "bg-[#27272A] text-[#52525B] border border-[#3F3F46]"
                }`}
              >
                {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </Button>
            </div>
          </div>
          <div className="mt-3 flex justify-between px-2">
            <span className="text-[9px] text-[#3F3F46] uppercase tracking-[0.3em]">Ready for input...</span>
            <span className="text-[9px] text-[#3F3F46] uppercase tracking-[0.3em]">Shift + Enter for multiline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
