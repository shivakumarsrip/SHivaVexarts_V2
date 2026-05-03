import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock, Send, MessageSquare, Terminal, ShieldCheck, Share2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const createContact = trpc.contact.create.useMutation({
    onSuccess: () => {
      alert("MESSAGE TRANSMITTED SUCCESSFULLY. WE WILL INITIALIZE UPLINK SOON.");
      setForm({ name: "", email: "", subject: "", message: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    createContact.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-24 font-mono overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F59E0B]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F59E0B]/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-vex relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full mb-6">
            <Terminal size={14} className="text-[#F59E0B]" />
            <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-[0.3em]">Comms_Channel: Open</span>
          </div>
          <h1 className="font-display text-[48px] sm:text-[64px] text-white uppercase leading-[0.9] mb-6">
            INITIALIZE <br /> <span className="text-[#F59E0B]">CONTACT</span>
          </h1>
          <p className="font-body text-[16px] text-[#A1A1AA] uppercase tracking-widest leading-relaxed">
            COMMISSION INQUIRIES, COLLABORATIONS, OR SYSTEM FEEDBACK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Info Grid */}
          <div className="lg:col-span-4 space-y-6">
            <div className="group p-8 bg-[#18181B]/50 border border-[#27272A] rounded-2xl hover:border-[#F59E0B]/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-xl bg-[#27272A] flex items-center justify-center text-[#F59E0B] mb-6 group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Direct Uplink</p>
              <p className="text-white text-[16px] font-bold tracking-tight">shivavexarts@gmail.com</p>
            </div>

            <div className="group p-8 bg-[#18181B]/50 border border-[#27272A] rounded-2xl hover:border-[#F59E0B]/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-xl bg-[#27272A] flex items-center justify-center text-[#F59E0B] mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Coordinates</p>
              <p className="text-white text-[16px] font-bold tracking-tight">HYDERABAD, TELANGANA, IN</p>
            </div>

            <div className="group p-8 bg-[#18181B]/50 border border-[#27272A] rounded-2xl hover:border-[#F59E0B]/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-xl bg-[#27272A] flex items-center justify-center text-[#F59E0B] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mb-1">Status</p>
              <p className="text-[#16A34A] text-[16px] font-bold tracking-tight">ACTIVE / ACCEPTING COMMISSIONS</p>
            </div>

            <div className="pt-8">
              <p className="text-[10px] text-[#3F3F46] font-bold uppercase tracking-[0.3em] mb-4">Social Protocols</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.open("https://instagram.com/shiva_vexarts", "_blank")}
                  className="w-12 h-12 rounded-xl border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 transition-all"
                >
                  <Share2 size={20} />
                </button>
                <button className="w-12 h-12 rounded-xl border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 transition-all">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Message Module */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest ml-1">Identity_Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ENTER FULL NAME..."
                    className="w-full h-14 bg-[#09090B] border border-[#27272A] rounded-xl px-6 text-[14px] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-0 transition-all font-mono"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest ml-1">Comms_Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ENTER EMAIL ADDRESS..."
                    type="email"
                    className="w-full h-14 bg-[#09090B] border border-[#27272A] rounded-xl px-6 text-[14px] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-0 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <label className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest ml-1">Inquiry_Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="SPECIFY INQUIRY TYPE..."
                  className="w-full h-14 bg-[#09090B] border border-[#27272A] rounded-xl px-6 text-[14px] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-0 transition-all font-mono"
                  required
                />
              </div>

              <div className="space-y-3 mb-10">
                <label className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest ml-1">Message_Payload</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="DESCRIBE YOUR REQUEST OR COLLABORATION..."
                  rows={6}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-2xl px-6 py-5 text-[14px] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-0 transition-all font-mono resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-16 bg-[#F59E0B] text-[#09090B] font-bold text-[16px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#D97706] transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createContact.isPending}
              >
                {createContact.isPending ? (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Transmitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    <span>Transmit Message</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
