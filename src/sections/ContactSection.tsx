import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Instagram, Globe, MapPin, Mail, CheckCircle, Loader2, Palette } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: settings } = trpc.settings.getAll.useQuery();

  const contactMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    contactMutation.mutate({ name, email, subject, message });
  };

  const socials = settings?.socials || {
    instagram: "https://www.instagram.com/shiva_vexarts",
    behance: "https://www.behance.net/Sivadigitalart",
    location: "Hyderabad, Telangana, India"
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#09090B] border-t border-zinc-800 overflow-hidden">
      {/* Decorative Scanline & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <div className="container-vex relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Contact Form */}
          <div>
            <h2 className="font-display text-[32px] sm:text-[40px] text-white mb-2">
              GET IN TOUCH
            </h2>
            <p className="font-body text-[16px] text-[#A1A1AA] mb-8">
              For commissions, collaborations, or custom artwork inquiries.
            </p>

            {submitted ? (
              <div className="bg-[#18181B] rounded-xl p-8 border border-[#16A34A]/30 text-center">
                <CheckCircle size={48} className="text-[#16A34A] mx-auto mb-4" />
                <h3 className="font-body text-[20px] font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="font-body text-[14px] text-[#A1A1AA]">
                  Thank you for reaching out. I will get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="font-body text-[13px] text-[#A1A1AA] mb-1.5 block">
                    Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 h-12 rounded-xl transition-all"
                    required
                  />
                </div>

                <div>
                  <Label className="font-body text-[13px] text-[#A1A1AA] mb-1.5 block">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 h-12 rounded-xl transition-all"
                    required
                  />
                </div>

                <div>
                  <Label className="font-body text-[13px] text-[#A1A1AA] mb-1.5 block">
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="bg-[#18181B] border-[#27272A] text-white focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 h-12 rounded-xl transition-all">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181B] border-[#27272A] text-white">
                      <SelectItem value="Commission">Commission</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Custom Art">Custom Art</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-body text-[13px] text-[#A1A1AA] mb-1.5 block">
                    Message
                  </Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#3F3F46] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 rounded-xl resize-none py-4 transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-body font-bold rounded-xl h-14 text-[15px] shadow-[0_8px_20px_rgba(245,158,11,0.2)] transition-all active:scale-[0.98]"
                >
                  {contactMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : null}
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Right - Info */}
          <div className="lg:pl-8 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center flex-shrink-0 text-[#E1306C]">
                  <Instagram size={22} />
                </div>
                <div>
                  <h4 className="font-body text-[14px] font-bold text-white mb-1 uppercase tracking-wider">Instagram</h4>
                  <a
                    href={socials.instagram.startsWith('@') ? `https://instagram.com/${socials.instagram.substring(1)}` : socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[15px] text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
                  >
                    {socials.instagram.includes('/') ? socials.instagram.split('/').pop() : socials.instagram}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center flex-shrink-0 text-[#053EFF]">
                  <Palette size={22} />
                </div>
                <div>
                  <h4 className="font-body text-[14px] font-bold text-white mb-1 uppercase tracking-wider">Behance</h4>
                  <a
                    href={socials.behance.startsWith('http') ? socials.behance : `https://${socials.behance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[15px] text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
                  >
                    {socials.behance.replace('https://', '').replace('www.', '')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center flex-shrink-0 text-[#F59E0B]">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-body text-[14px] font-bold text-white mb-1 uppercase tracking-wider">Location</h4>
                  <p className="font-body text-[15px] text-[#A1A1AA]">
                    {socials.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center flex-shrink-0 text-amber-500">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-body text-[14px] font-bold text-white mb-1 uppercase tracking-wider">Email</h4>
                  <p className="font-body text-[15px] text-[#A1A1AA]">
                    Available on request via contact form
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#18181B]/50 border border-[#27272A] rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full blur-2xl -mr-12 -mt-12" />
              <p className="font-body text-[14px] text-[#A1A1AA] leading-relaxed relative z-10">
                I typically respond within <span className="text-[#F59E0B] font-bold">24-48 hours</span>.
                For urgent inquiries, please reach out via Instagram direct message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
