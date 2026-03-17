"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import SpaceBackground from "@/components/SpaceBackground";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) alert(error.message);
    else alert("Success! Check your email for the confirmation link.");
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#17153B] text-white font-inter relative overflow-hidden">
      <SpaceBackground />
      <Navbar />

      {/* Futuristic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#433D8B]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#C8ACD6]/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-[#2E236C]/30 backdrop-blur-2xl border border-[#433D8B] p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-space-grotesk text-4xl font-bold tracking-tight text-white mb-2">
              Create <span className="text-[#C8ACD6]">Account</span>
            </h2>
            <p className="text-[#C8ACD6]/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Start your journey to better grades
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/60 ml-2">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#17153B]/50 border border-[#433D8B] outline-none focus:border-[#C8ACD6]/50 focus:ring-1 focus:ring-[#C8ACD6]/20 transition-all placeholder:text-[#433D8B]" 
                placeholder="John Doe" 
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/60 ml-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#17153B]/50 border border-[#433D8B] outline-none focus:border-[#C8ACD6]/50 focus:ring-1 focus:ring-[#C8ACD6]/20 transition-all placeholder:text-[#433D8B]" 
                placeholder="you@student.com" 
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/60 ml-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#17153B]/50 border border-[#433D8B] outline-none focus:border-[#C8ACD6]/50 focus:ring-1 focus:ring-[#C8ACD6]/20 transition-all placeholder:text-[#433D8B]" 
                placeholder="••••••••" 
              />
            </div>

            {/* Submit Button with the Dashboard Glow */}
            <button 
              disabled={loading}
              className="w-full py-4 mt-4 bg-[#C8ACD6] text-[#17153B] rounded-2xl font-space-grotesk font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(200,172,214,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-[#C8ACD6]/40 text-xs">
            Already a member?{" "}
            <Link href="/login" className="text-[#C8ACD6] font-bold hover:underline underline-offset-4 transition-all">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}