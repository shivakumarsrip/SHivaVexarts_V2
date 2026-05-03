import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const BOT_RESPONSES: Record<string, string> = {
  price: "Our artworks range from Rs. 9,800 to Rs. 18,900 for base prints. Pricing varies by size: A4 (1.0x), A3 (1.5x), A2 (2.5x), and Digital Downloads (0.6x base price).",
  shipping: "We ship worldwide! Local City: Rs. 150 | National: Rs. 250 | Neighboring Country: Rs. 500 | International: Rs. 1,500. Delivery typically takes 3-10 business days depending on your region.",
  size: "Available print sizes are A4 (21x29.7cm), A3 (29.7x42cm), and A2 (42x59.4cm). We also offer Digital Downloads at 0.6x the base price.",
  artist: "AURA Gallery showcases curated digital artworks from emerging and established digital artists. Each piece is a unique exploration of technology, nature, and human emotion.",
  payment: "We accept all major credit/debit cards. Our checkout is secured with industry-standard encryption. You can also pay via our simulated payment gateway for demonstration.",
  contact: "You can reach us via the contact form on our website, or email us directly at studio@aura.gallery. We typically respond within 24 hours.",
  return: "Due to the nature of art prints and digital downloads, all sales are final. However, if your print arrives damaged, please contact us within 48 hours with photos for a replacement.",
  default: "I'm here to help with questions about pricing, sizes, shipping, the artist, payment methods, or returns. What would you like to know?",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) return BOT_RESPONSES.price;
  if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("ship")) return BOT_RESPONSES.shipping;
  if (lower.includes("size") || lower.includes("dimension") || lower.includes("a4") || lower.includes("a3") || lower.includes("a2")) return BOT_RESPONSES.size;
  if (lower.includes("artist") || lower.includes("about") || lower.includes("who")) return BOT_RESPONSES.artist;
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("card")) return BOT_RESPONSES.payment;
  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach")) return BOT_RESPONSES.contact;
  if (lower.includes("return") || lower.includes("refund") || lower.includes("exchange")) return BOT_RESPONSES.return;
  return BOT_RESPONSES.default;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Welcome to AURA Gallery! I can help with pricing, sizes, shipping, and more. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const response = getBotResponse(userMsg);
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] rounded-2xl glass-dark flex flex-col overflow-hidden shadow-2xl border border-white/10">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Bot className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white">AURA Assistant</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-white/10" : "bg-white/20"}`}>
                  {msg.role === "bot" ? <Bot className="w-3.5 h-3.5 text-white/60" /> : <User className="w-3.5 h-3.5 text-white/60" />}
                </div>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[80%] ${msg.role === "bot" ? "bg-white/5 text-white/80" : "bg-white/15 text-white"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about pricing, shipping..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <Button size="icon" onClick={handleSend} className="bg-white text-black hover:bg-white/90 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
