"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpaceBackground from "@/components/SpaceBackground";

export default function Dashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(1500); 
  const [running, setRunning] = useState(false);
  const [randomNote, setRandomNote] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // 🔥 NEW: Streak State
  const [streak, setStreak] = useState(0);

  // 1. Fetch Notes
  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) console.error("Error fetching notes:", error.message);
      if (data) setNotes(data);
    }
  };

  // 🔥 NEW: Streak Update Logic
  const updateStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, last_study_date')
      .eq('id', user.id)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile?.last_study_date;
    let newStreak = profile?.current_streak || 0;

    if (lastDate === today) return; // Already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // Reset if they missed a day
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        current_streak: newStreak, 
        last_study_date: today,
        updated_at: new Date().toISOString()
      });

    if (!error) setStreak(newStreak);
  };

  // 2. Session Guard & Initial Fetch
  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        fetchNotes();
        // Fetch streak on load
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_streak')
          .eq('id', user.id)
          .single();
        if (profile) setStreak(profile.current_streak);
      }
    };
    checkUser();
  }, [router]);

  // 3. Save Note
  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = { title, content, user_id: user.id };
    const { error } = selectedId 
      ? await supabase.from("notes").update(payload).eq("id", selectedId)
      : await supabase.from("notes").insert([payload]);

    if (!error) {
      setTitle(""); setContent(""); setSelectedId(null); fetchNotes(); 
    }
  };

  const deleteNote = async () => {
    if (!selectedId || !confirm("Delete this note?")) return;
    const { error } = await supabase.from("notes").delete().eq("id", selectedId);
    if (!error) { setTitle(""); setContent(""); setSelectedId(null); fetchNotes(); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const pickRevisionNote = () => {
    if (notes.length === 0) return;
    const sorted = [...notes].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const pool = sorted.slice(0, Math.floor(sorted.length / 2) || 1);
    setRandomNote(pool[Math.floor(Math.random() * pool.length)]);
  };

  // 🔥 Updated Timer Logic with Streak Trigger
  useEffect(() => {
    let int = setInterval(() => {
      if (running && time > 0) {
        setTime(t => t - 1);
      } else if (time === 0 && running) {
        setRunning(false);
        updateStreak(); // Update fire streak when timer hits 0
        alert("Great job! Your study streak has been updated. 🔥");
      }
    }, 1000);
    return () => clearInterval(int);
  }, [running, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  const glass = "bg-[#2E236C]/15 backdrop-blur-2xl border border-[#433D8B]/40 rounded-[2.5rem] shadow-2xl";
  const btnBase = "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border flex items-center justify-center text-center whitespace-nowrap";

  return (
    <div className="min-h-screen bg-[#17153B] text-white relative font-inter">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-8">
          
          {/* SIDEBAR */}
          <aside className="flex flex-col h-[760px]">
            <input 
              placeholder="Search notes..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full p-4 mb-4 rounded-2xl bg-[#0A0920]/40 border border-[#433D8B] text-sm outline-none focus:border-[#7C6992] transition-all placeholder:text-[#433D8B]" 
            />
            <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {notes.filter(n => n.title?.toLowerCase().includes(search.toLowerCase())).map(n => (
                <div 
                  key={n.id} 
                  onClick={() => { setTitle(n.title); setContent(n.content); setSelectedId(n.id); }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedId === n.id ? "bg-[#7C6992] border-white shadow-lg" : "bg-[#2E236C]/10 border-[#433D8B] hover:border-[#7C6992]"}`}
                >
                  <p className="font-bold truncate text-xs">{n.title || "Untitled"}</p>
                </div>
              ))}
            </div>
            <button onClick={handleLogout} className="mt-4 text-[9px] font-bold text-white/20 hover:text-red-400 transition-colors tracking-[0.2em] uppercase py-2">
              Sign Out Session
            </button>
          </aside>

          {/* EDITOR */}
          <main className={`${glass} flex flex-col h-[760px] overflow-hidden`}>
            <div className="p-8 border-b border-[#433D8B]/30 flex flex-col md:flex-row gap-6 bg-white/5 items-center">
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Lecture Title..."
                className="bg-transparent text-3xl font-black outline-none flex-1 placeholder:text-white/10 text-white tracking-tight w-full" 
              />
              <div className="flex gap-3 w-full md:w-auto">
                {selectedId && (
                  <button onClick={deleteNote} className={`${btnBase} bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-8`}>Delete</button>
                )}
                <button onClick={saveNote} className={`${btnBase} bg-[#7C6992] border-transparent text-white hover:scale-105 shadow-xl shadow-[#7C6992]/20 px-12`}>Save Note</button>
              </div>
            </div>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Start writing..."
              className="flex-1 p-10 bg-transparent outline-none resize-none text-[#E2E2F0] text-lg leading-relaxed placeholder:text-white/5" 
            />
          </main>

          {/* RIGHT SIDE (TIMER & STREAK) */}
          <aside className="space-y-6">
            {/* 🔥 NEW: STREAK WIDGET */}
            <div className={`${glass} p-6 flex items-center justify-between border-orange-500/20 bg-orange-500/5`}>
               <div className="flex items-center gap-4">
                  <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🔥</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-black">Daily Streak</p>
                    <p className="text-2xl font-black text-white">{streak} Days</p>
                  </div>
               </div>
            </div>

            <div className={`${glass} p-8 text-center`}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B7A1CE] mb-6 font-black opacity-60">Focus Timer</h4>
              <input 
                type="text" 
                value={running ? formatTime(time) : Math.floor(time / 60)} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes(':')) {
                    const [m, s] = val.split(':');
                    if (!isNaN(Number(m))) setTime(Number(m) * 60 + (Number(s) || 0));
                  } else {
                    const m = Number(val);
                    if (!isNaN(m)) setTime(m * 60);
                  }
                }} 
                disabled={running}
                className="bg-transparent text-6xl font-black text-center w-full outline-none focus:text-[#7C6992] transition-colors tabular-nums tracking-tight" 
              />
              <div className="grid grid-cols-2 gap-2 mt-8">
                <button onClick={() => setRunning(true)} className={`${btnBase} bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white`}>Start</button>
                <button onClick={() => setRunning(false)} className={`${btnBase} bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white`}>Pause</button>
                <button onClick={() => {setRunning(false); setTime(1500)}} className={`${btnBase} col-span-2 bg-[#7C6992]/10 border-[#7C6992]/30 text-[#B7A1CE] hover:bg-[#7C6992] hover:text-white`}>Reset to 25:00</button>
              </div>
            </div>

            <div className={`${glass} p-8 space-y-6`}>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-[#433D8B]/30 text-center">
                  <p className="text-[9px] text-[#B7A1CE] opacity-60 uppercase font-black">Words</p>
                  <p className="text-2xl font-black">{content.trim() ? content.split(/\s+/).length : 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-[#433D8B]/30 text-center">
                  <p className="text-[9px] text-[#B7A1CE] opacity-60 uppercase font-black">Chars</p>
                  <p className="text-2xl font-black">{content.length}</p>
                </div>
              </div>
              <button onClick={pickRevisionNote} className={`${btnBase} w-full bg-white/5 border-white/10 hover:bg-white/10`}>Revise Now!</button>
              {randomNote && (
                 <div className="p-5 bg-[#7C6992]/10 border border-[#7C6992]/30 rounded-2xl">
                    <p className="text-[9px] text-[#B7A1CE] uppercase font-black mb-2">Revision Pick</p>
                    <p className="text-sm font-bold text-white mb-2 truncate">{randomNote.title}</p>
                    <button 
                      onClick={() => { setTitle(randomNote.title); setContent(randomNote.content); setSelectedId(randomNote.id); }}
                      className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-[#7C6992] hover:scale-105 transition"
                    >
                      Open Note
                    </button>
                 </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}