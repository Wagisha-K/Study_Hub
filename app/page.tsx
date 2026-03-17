import Link from "next/link";
import Navbar from '@/components/Navbar';
import SpaceBackground from "@/components/SpaceBackground";

export default function Home() {
  // Brand Color: #7C6992 (Deep Saturated Violet)
  // Background: #17153B (Deep Navy)
  
  return (
    <div className="min-h-screen bg-[#17153B] text-white selection:bg-[#7C6992] selection:text-white relative">
      <SpaceBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-6xl mx-auto px-6 pt-20 pb-20">
          <div className="text-center mb-24">
            {/* Tagline */}
            <span className="px-4 py-1.5 rounded-full border border-[#433D8B] text-[#7C6992] text-[10px] font-bold uppercase tracking-[0.25em] bg-[#17153B]/60 backdrop-blur-md">
              The Future of Learning
            </span>
            
            {/* Hero Title */}
            <h1 className="text-6xl md:text-7xl font-black mt-8 mb-8 tracking-tighter leading-[1.1]">
              Focus harder. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6992] via-[#A28AB0] to-[#433D8B]">
                Achieve smarter.
              </span>
            </h1>
            
            {/* Subtext */}
            <p className="text-base text-[#E2E2F0] opacity-90 max-w-lg mx-auto mb-12 font-medium leading-relaxed">
             A minimalist workspace designed to eliminate distractions and maximize your academic potential.
            </p>
            
            {/* Refined Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/dashboard"
                className="px-10 py-3 bg-[#7C6992] text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(124,105,146,0.5)] hover:bg-[#6D5D83] hover:scale-105 transition-all w-full sm:w-auto text-center"
              >
                Enter Workspace
              </Link>
              
              <Link
                href="/resources"
                className="px-10 py-3 border border-[#433D8B] bg-black/20 backdrop-blur-md rounded-full font-bold text-[11px] uppercase tracking-[0.2em] text-[#7C6992] hover:border-[#7C6992]/50 hover:bg-[#7C6992]/10 transition-all w-full sm:w-auto text-center"
              >
                View Resources
              </Link>
            </div>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 p-10 bg-[#0A0920]/40 backdrop-blur-xl rounded-[2.5rem] border border-[#433D8B] hover:border-[#7C6992]/40 transition-all group">
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#7C6992] transition-colors">Deep Work Mode</h3>
              <p className="text-[#7C6992]/70 text-sm leading-relaxed max-w-md">
                Integrated Pomodoro and site blocking to keep you in the zone. 
                Designed for long-form focus sessions.
              </p>
            </div>
            
            <div className="p-10 bg-[#0A0920]/80 backdrop-blur-xl rounded-[2.5rem] border border-[#433D8B] flex flex-col justify-end hover:border-[#7C6992]/40 transition-all">
              <h3 className="text-xl font-bold text-[#7C6992] mb-2">24/7 Access</h3>
              <p className="text-xs text-[#7C6992]/50 font-medium">
                Sync across all your devices instantly.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}