"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Resources", href: "/resources" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-[#17153B]/80 backdrop-blur-md border-b border-[#433D8B] sticky top-0 z-50">
      
      {/* Brand */}
      <div className="font-space-grotesk text-2xl font-bold tracking-tighter text-white">
        STUDY<span className="text-[#C8ACD6]">HUB</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-4 font-inter text-[11px] font-bold uppercase tracking-[0.2em]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-[#C8ACD6]/10 border-[#C8ACD6] text-white shadow-[0_0_15px_rgba(200,172,214,0.2)]"
                  : "bg-transparent border-transparent text-[#C8ACD6]/60 hover:text-[#C8ACD6] hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        <Link
          href="/signup"
          className={`ml-4 font-inter text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg border ${
            pathname === "/signup"
              ? "bg-[#C8ACD6] text-[#17153B] border-white"
              : "text-white bg-[#433D8B] hover:bg-[#2E236C] border-[#C8ACD6]/20"
          }`}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}