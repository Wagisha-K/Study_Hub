"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Resources", href: "/resources" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-[#17153B]/80 backdrop-blur-md border-b border-[#433D8B] sticky top-0 z-50">
      <div className="font-space-grotesk text-2xl font-bold tracking-tighter text-white">
        STUDY<span className="text-[#C8ACD6]">HUB</span>
      </div>

      <div className="hidden md:flex items-center gap-4 font-inter text-[11px] font-bold uppercase tracking-[0.2em]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
              pathname === link.href
                ? "bg-[#C8ACD6]/10 border-[#C8ACD6] text-white"
                : "bg-transparent border-transparent text-[#C8ACD6]/60 hover:text-[#C8ACD6] hover:bg-white/5"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {!user ? (
          <Link href="/login" className="ml-2 text-white bg-[#433D8B] hover:bg-[#2E236C] px-6 py-2.5 rounded-xl border border-[#C8ACD6]/20">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <span className="text-[#C8ACD6]/50 lowercase font-medium">{user.email?.split('@')[0]}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}