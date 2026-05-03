import { Button } from "@/components/ui/button";
import { Palette, Monitor, Clapperboard, User } from "lucide-react";
import { trpc } from "@/providers/trpc";

const iconMap: Record<string, any> = {
  Clapperboard,
  Monitor,
  Palette,
};

export default function AboutSection() {
  const { data: settings, isLoading } = trpc.settings.getAll.useQuery();

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const about = settings?.about || {
    name: "Shivakumar S",
    occupation: "Digital Artist & Movie Publicity Designer",
    bio: "Digital artist and movie publicity designer based in Hyderabad, India. With over a decade of experience in the advertising, television, and film industry, I create visual narratives that command attention.\n\nFrom gritty movie posters for Telugu cinema to social awareness campaigns, every piece is crafted with cinematic intensity and digital precision. My work has garnered over 387,000 views and 14,000+ appreciations across platforms.\n\nAvailable for commissions — movie posters, album art, social media campaigns, and custom digital illustrations.",
    tools: ["Adobe Photoshop", "Illustrator", "After Effects"],
    image: null
  };

  const experiences = settings?.experience || [
    { year: "Present", title: "Puthiya Thalaimurai TV", company: "Digital Artist & VFX Artist" },
    { year: "Previous", title: "Ocher Studios", company: "Digital Matte Artist" },
    { year: "Ongoing", title: "Freelance", company: "Movie Publicity Designer" }
  ];

  if (isLoading) {
    return (
      <section id="about" className="py-24 bg-[#09090B] border-b border-zinc-800">
        <div className="container-vex flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F59E0B]/20 border-t-[#F59E0B] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

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
              {about.name}
            </h2>

            <div className="space-y-4 mb-8">
              {about.bio.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className="font-body text-[16px] text-[#A1A1AA] leading-[1.7]">
                  {paragraph}
                </p>
              ))}
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
            <div className="relative group">
              <div className="w-full max-w-[400px] mx-auto relative">
                {about.image ? (
                  <img
                    src={about.image}
                    alt={`${about.name} - ${about.occupation}`}
                    className="w-full h-auto rounded-2xl object-cover border border-[rgba(245,158,11,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    style={{ aspectRatio: "3/4" }}
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-[#18181B] rounded-2xl flex items-center justify-center text-[#3F3F46] border border-[#27272A]">
                    <User size={80} />
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(245,158,11,0.15)] group-hover:ring-[rgba(245,158,11,0.3)] transition-all" />
              </div>
            </div>

            {/* Tools */}
            {about.tools && about.tools.length > 0 && (
              <div className="mt-8">
                <h4 className="font-body text-[16px] font-bold text-white mb-4">
                  Tools of the Trade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {about.tools.map((tool: string) => (
                    <span
                      key={tool}
                      className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-xl font-body text-[13px] font-medium text-[#A1A1AA] hover:text-white hover:border-[#F59E0B]/30 transition-all"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {experiences.map((exp: any, index: number) => {
            // Determine icon based on index or content if needed
            const Icon = index === 0 ? Clapperboard : index === 1 ? Monitor : Palette;
            
            return (
              <div
                key={index}
                className="bg-[#18181B] rounded-2xl p-6 border border-[#27272A] hover:border-[#F59E0B]/30 transition-all hover:translate-y-[-4px] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-[#F59E0B]" />
                  </div>
                  <span className="font-body text-[11px] font-bold text-[#F59E0B] uppercase tracking-[0.2em]">
                    {exp.year}
                  </span>
                </div>
                <h4 className="font-body text-[17px] font-bold text-white mb-1">{exp.title}</h4>
                <p className="font-body text-[14px] text-[#71717A] leading-relaxed">{exp.company}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
