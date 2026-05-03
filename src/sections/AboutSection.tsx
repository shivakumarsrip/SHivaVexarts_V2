import { Button } from "@/components/ui/button";
import { Palette, Monitor, Clapperboard } from "lucide-react";
import { assetUrl } from "@/lib/assets";

const experiences = [
  {
    icon: Clapperboard,
    title: "Puthiya Thalaimurai TV",
    role: "Digital Artist & VFX Artist",
    period: "Present",
  },
  {
    icon: Monitor,
    title: "Ocher Studios",
    role: "Digital Matte Artist",
    period: "Previous",
  },
  {
    icon: Palette,
    title: "Freelance",
    role: "Movie Publicity Designer",
    period: "Ongoing",
  },
];

const tools = ["Adobe Photoshop", "Illustrator", "After Effects"];

export default function AboutSection() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#09090B] border-b border-zinc-800 overflow-hidden">
      {/* Decorative Scanline & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      <div className="container-vex relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 mb-16">
          {/* Left Content - 60% */}
          <div className="lg:col-span-3">
            <span className="font-body text-[14px] font-medium text-[#F59E0B] tracking-wider">
              ABOUT THE ARTIST
            </span>
            <h2 className="font-display text-[40px] sm:text-[48px] text-white mt-2 mb-6">
              Shivakumar S
            </h2>

            <div className="space-y-4 mb-8">
              <p className="font-body text-[16px] text-[#A1A1AA] leading-[1.7]">
                Digital artist and movie publicity designer based in Hyderabad, India. With over a
                decade of experience in the advertising, television, and film industry, I create
                visual narratives that command attention.
              </p>
              <p className="font-body text-[16px] text-[#A1A1AA] leading-[1.7]">
                From gritty movie posters for Telugu cinema to social awareness campaigns, every
                piece is crafted with cinematic intensity and digital precision. My work has
                garnered over 387,000 views and 14,000+ appreciations across platforms.
              </p>
              <p className="font-body text-[16px] text-[#A1A1AA] leading-[1.7]">
                Available for commissions — movie posters, album art, social media campaigns, and
                custom digital illustrations.
              </p>
            </div>

            <Button
              onClick={scrollToContact}
              className="bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706] font-body font-semibold rounded-lg px-6 py-3 text-[14px]"
            >
              Commission Work
            </Button>
          </div>

          {/* Right Content - 40% */}
          <div className="lg:col-span-2">
            <div className="relative">
              <img
                src={assetUrl("hero-portrait.jpg")}
                alt="Shivakumar S - Digital Artist"
                className="w-full max-w-[400px] mx-auto rounded-2xl object-cover border border-[rgba(245,158,11,0.15)]"
                style={{ aspectRatio: "3/4" }}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(245,158,11,0.15)]" />
            </div>

            {/* Tools */}
            <div className="mt-6">
              <h4 className="font-body text-[16px] font-bold text-white mb-3">
                Tools of the Trade
              </h4>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-[#27272A] rounded-full font-body text-[13px] font-medium text-[#A1A1AA]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className="bg-[#18181B] rounded-xl p-6 border border-[#27272A] hover:border-[#F59E0B]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F59E0B]/15 rounded-lg flex items-center justify-center">
                  <exp.icon size={18} className="text-[#F59E0B]" />
                </div>
                <span className="font-body text-[11px] font-medium text-[#F59E0B] uppercase tracking-wider">
                  {exp.period}
                </span>
              </div>
              <h4 className="font-body text-[16px] font-bold text-white mb-1">{exp.title}</h4>
              <p className="font-body text-[14px] text-[#A1A1AA]">{exp.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
