"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import SpaceBackground from "@/components/SpaceBackground";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative font-inter overflow-hidden">
      {/* Reusable Background Component */}
      <SpaceBackground />

      {/* Navbar stays on top */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Login Content Area */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100-navbar-height)] px-4 py-20">
        <div className="w-full max-w-md bg-[#2E236C]/40 backdrop-blur-3xl border border-[#433D8B] p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-2">
              Welcome <span className="text-[#C8ACD6]">Back</span>
            </h2>
            <p className="text-[#C8ACD6]/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Resume your deep work session
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/60 ml-2">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-5 py-4 rounded-2xl bg-[#17153B]/60 border border-[#433D8B] text-white outline-none focus:border-[#C8ACD6] transition-all placeholder:text-[#433D8B]" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/60 ml-2">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] uppercase font-bold text-[#C8ACD6]/40 hover:text-[#C8ACD6] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl bg-[#17153B]/60 border border-[#433D8B] text-white outline-none focus:border-[#C8ACD6] transition-all placeholder:text-[#433D8B]" 
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 mt-4 bg-[#C8ACD6] text-[#17153B] rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-[#C8ACD6]/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="mt-10 text-center text-[#C8ACD6]/40 text-xs">
            Not a member yet?{" "}
            <Link href="/signup" className="text-[#C8ACD6] font-bold hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}