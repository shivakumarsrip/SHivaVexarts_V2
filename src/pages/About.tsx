import { Palette, Globe, Award, Heart, Cpu, Layers, Zap, Star } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-24 font-mono overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      <div className="container-vex relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full mb-6">
            <Cpu size={14} className="text-[#F59E0B]" />
            <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-[0.3em]">Module: Profile_Data</span>
          </div>
          <h1 className="font-display text-[48px] sm:text-[72px] md:text-[96px] text-white uppercase leading-none tracking-tight mb-6">
            SHIVA VEXARTS
          </h1>
          <p className="font-body text-[16px] sm:text-[18px] text-[#A1A1AA] max-w-2xl leading-relaxed opacity-80">
            CINEMATIC VISUAL DESIGNER AND DIGITAL ARTIST WITH OVER 10 YEARS OF EXPERIENCE IN MOVIE PUBLICITY DESIGN AND VECTOR ILLUSTRATION.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#F59E0B]/10 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#27272A] shadow-2xl bg-[#18181B]">
                <img 
                  src="/images/studio-preview.jpg" 
                  alt="Studio work" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#09090B]">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-[14px] uppercase tracking-wider">Est. 2014</p>
                    <p className="text-[#A1A1AA] text-[12px] uppercase tracking-widest">Industry Professional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#F59E0B]" />
              <h2 className="font-display text-[32px] text-white uppercase tracking-wider">The Artistic Journey</h2>
            </div>
            <div className="space-y-6 font-body text-[15px] leading-relaxed text-[#A1A1AA]">
              <p>
                BASED IN HYDERABAD, TELANGANA, I BEGAN MY CAREER AS A SENIOR DESIGNER AT PUTHIYA THALAIMURAI TV AND LATER WORKED AS A PUBLICITY DESIGNER AT OCHER STUDIOS.
              </p>
              <p>
                MY BACKGROUND IN MASS COMMUNICATION AND JOURNALISM HAS INFLUENCED MY APPROACH TO VISUAL STORYTELLING, ALLOWING ME TO BLEND NARRATIVE DEPTH WITH TECHNICAL PRECISION.
              </p>
              <p className="text-white border-l-2 border-[#27272A] pl-6 italic">
                "I SPECIALIZE IN MOVIE PUBLICITY DESIGN, DIGITAL PORTRAITS, AND VECTOR ART. MY WORK IS NOT JUST ABOUT VISUALS; IT'S ABOUT CREATING AN EMOTIONAL CONNECTION."
              </p>
            </div>
          </div>
        </div>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {[
            { icon: Palette, title: "Movie Publicity", desc: "CRAFTING ICONIC VISUALS AND POSTERS FOR THE CINEMATIC INDUSTRY." },
            { icon: Globe, title: "Vector Art", desc: "PRECISION-DRIVEN ILLUSTRATIONS THAT STAY SHARP AT ANY SCALE." },
            { icon: Award, title: "Digital Portraits", desc: "CAPTURING THE ESSENCE OF INDIVIDUALS WITH A MODERN, DIGITAL EDGE." },
            { icon: Heart, title: "Cinematic Style", desc: "INFUSING EVERY PIECE WITH THE DRAMA AND SCALE OF THE BIG SCREEN." },
          ].map((item, idx) => (
            <div key={item.title} className="group p-8 bg-[#18181B]/50 border border-[#27272A] rounded-2xl hover:border-[#F59E0B]/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon size={80} />
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#27272A] flex items-center justify-center text-[#A1A1AA] group-hover:bg-[#F59E0B] group-hover:text-[#09090B] transition-all duration-500 mb-6">
                <item.icon size={24} />
              </div>
              <h3 className="text-white font-display text-[20px] uppercase tracking-wider mb-3">{item.title}</h3>
              <p className="text-[#71717A] font-body text-[13px] leading-relaxed tracking-wide uppercase">{item.desc}</p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] text-[#3F3F46] font-bold tracking-[0.2em]">LVL_0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-[32px] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-[40px] text-white uppercase leading-none mb-8">Ready to Start Your Collection?</h2>
              <p className="font-body text-[16px] text-[#A1A1AA] mb-10 leading-relaxed uppercase tracking-wider">
                BROWSE OUR CURATED GALLERY AND DISCOVER THE PIECE THAT SPEAKS TO YOU. EVERY ARTWORK TELLS A STORY—FIND YOURS.
              </p>
              <a href="/gallery">
                <button className="h-16 px-10 bg-[#F59E0B] text-[#09090B] font-bold text-[14px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#D97706] transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  Access Gallery Archive
                </button>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Appreciations", value: "14K+", icon: Heart },
                { label: "Project Views", value: "387K+", icon: Globe },
                { label: "Design Tools", value: "VECTOR", icon: Layers },
                { label: "Rating", value: "5.0", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#09090B]/50 border border-[#27272A] p-6 rounded-2xl flex flex-col items-center text-center">
                  <stat.icon size={20} className="text-[#F59E0B]/50 mb-3" />
                  <p className="font-mono text-[24px] font-bold text-white mb-1">{stat.value}</p>
                  <p className="font-body text-[10px] text-[#71717A] uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
