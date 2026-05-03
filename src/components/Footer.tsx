import { trpc } from "@/providers/trpc";

export default function Footer() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const artistName = settings?.about?.name || "Shivakumar S";

  return (
    <footer className="bg-[#09090B] border-t border-[#27272A] relative z-10">
      <div className="container-vex py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-display text-[18px] text-white tracking-tighter">
              SHIVA VEXARTS
            </p>
            <p className="font-body text-[12px] text-[#52525B] uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <button
              onClick={() => scrollTo("#gallery")}
              className="font-body text-[13px] font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
            >
              Shop Artworks
            </button>
            <span className="hidden sm:inline text-[#27272A]">/</span>
            <button
              onClick={() => scrollTo("#about")}
              className="font-body text-[13px] font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
            >
              About
            </button>
            <span className="hidden sm:inline text-[#27272A]">/</span>
            <button
              onClick={() => scrollTo("#contact")}
              className="font-body text-[13px] font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-[#F59E0B] transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="text-center md:text-right">
            <p className="font-body text-[13px] text-[#52525B] uppercase tracking-wider">
              Digital Canvas by <span className="text-[#F59E0B]/70">{artistName}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
