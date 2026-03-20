"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpaceBackground from "@/components/SpaceBackground";
import confetti from "canvas-confetti";
import ActivityChart from "@/components/ActivityChart";

export default function Dashboard() {
  const router = useRouter();
  
  // --- STATE ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [randomNote, setRandomNote] = useState<any | null>(null);
  
  // POMODORO STATE
  const [isBreak, setIsBreak] = useState(false); 
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(1500); 
  const [initialTime, setInitialTime] = useState(1500); 
  const [running, setRunning] = useState(false);

  // --- 1. INITIAL LOAD & AUTH ---
  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        fetchNotes();
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

  // --- 2. NOTE FUNCTIONS ---
  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setNotes(data);
    }
  };

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

  const pickRevisionNote = () => {
    if (notes.length === 0) return;
    const sorted = [...notes].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const pool = sorted.slice(0, Math.floor(sorted.length / 2) || 1);
    setRandomNote(pool[Math.floor(Math.random() * pool.length)]);
  };

  // --- 3. STREAK & CELEBRATION LOGIC ---
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  };

  const skipBreak = () => {
    setIsBreak(false);
    setRunning(false);
    setTime(1500); // Reset to 25 mins
    setInitialTime(1500);
  };

  const updateStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!isBreak) {
      const minutesStudied = Math.floor(initialTime / 60);
      await supabase.from('study_logs').insert([
        { user_id: user.id, minutes_spent: minutesStudied }
      ]);

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak, last_study_date')
        .eq('id', user.id)
        .single();

      const today = new Date().toISOString().split('T')[0];
      const lastDate = profile?.last_study_date;
      let newStreak = profile?.current_streak || 0;

      if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          newStreak = (lastDate === yesterdayStr) ? newStreak + 1 : 1;

          await supabase.from('profiles').upsert({ 
            id: user.id, 
            current_streak: newStreak, 
            last_study_date: today,
            updated_at: new Date().toISOString()
          });
          setStreak(newStreak);
      }
      triggerConfetti();
      
      setIsBreak(true);
      setTime(300); // 5 minutes
      setInitialTime(300);
      setRunning(true);
    } else {
      skipBreak();
    }
  };

  // --- 4. TIMER FUNCTIONS ---
  const startTimer = () => {
    if (time > 0) {
      setInitialTime(time);
      setRunning(true);
    }
  };

  useEffect(() => {
    let int = setInterval(() => {
      if (running && time > 0) {
        setTime(t => t - 1);
      } else if (time === 0 && running) {
        setRunning(false);
        updateStreak(); 
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
  const btnBase = "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border flex items-center justify-center text-center";

  return (
    <div className="min-h-screen bg-[#17153B] text-white relative font-inter overflow-x-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-8">
          
          <aside className="flex flex-col lg:h-[760px] gap-4">
            <input 
              placeholder="Search notes..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#0A0920]/40 border border-[#433D8B] text-sm outline-none focus:border-[#7C6992] transition-all placeholder:text-white/20" 
            />

            <div className="lg:hidden relative">
              <select 
                className="w-full p-4 rounded-2xl bg-[#2E236C]/30 border border-[#433D8B] text-white text-sm outline-none appearance-none cursor-pointer"
                value={selectedId || ""}
                onChange={(e) => {
                  const n = notes.find(note => note.id === Number(e.target.value));
                  if (n) { setTitle(n.title); setContent(n.content); setSelectedId(n.id); }
                }}
              >
                <option value="" disabled className="bg-[#17153B]">--- Select a Note ---</option>
                {notes.filter(n => n.title?.toLowerCase().includes(search.toLowerCase())).map(n => (
                  <option key={n.id} value={n.id} className="bg-[#17153B]">{n.title || "Untitled"}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">▼</div>
            </div>

            <div className="hidden lg:block space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
          </aside>

          <main className={`${glass} flex flex-col h-[600px] lg:h-[760px] overflow-hidden`}>
            <div className="p-8 border-b border-[#433D8B]/30 flex flex-col md:flex-row gap-6 bg-white/5 items-center">
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Lecture Title..."
                className="bg-transparent text-3xl font-black outline-none flex-1 text-white tracking-tight w-full placeholder:text-white/10" 
              />
              <div className="flex gap-3 w-full md:w-auto">
                {selectedId && <button onClick={deleteNote} className={`${btnBase} bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white`}>Delete</button>}
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

          <aside className="space-y-6">
            <div className={`${glass} p-6 flex items-center border-orange-500/20 bg-orange-500/5`}>
               <div className="flex items-center gap-4">
                  <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🔥</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-black">Daily Streak</p>
                    <p className="text-2xl font-black text-white">{streak} Days</p>
                  </div>
               </div>
            </div>

            <div className={`${glass} p-8 text-center flex flex-col items-center`}>
              <h4 className={`text-[10px] uppercase tracking-[0.3em] mb-6 font-black ${isBreak ? 'text-emerald-400' : 'text-[#B7A1CE] opacity-60'}`}>
                {isBreak ? "♨️ Break Time" : "🚀 Focus Timer"}
              </h4>
              
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#433D8B" strokeWidth="8" strokeOpacity="0.2" fill="transparent" />
                  <circle 
                    cx="96" cy="96" r="88" 
                    stroke={isBreak ? "#10b981" : "#7C6992"} 
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={553} 
                    strokeDashoffset={553 - (553 * (time / initialTime))}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-linear ${isBreak ? 'shadow-[0_0_15px_#10b981]' : 'shadow-[0_0_15px_#7C6992]'}`}
                  />
                </svg>
                <input 
                  type="text" 
                  value={running ? formatTime(time) : Math.floor(time / 60)} 
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    if (!isNaN(m)) { setTime(m * 60); setInitialTime(m * 60); }
                  }} 
                  disabled={running}
                  className="bg-transparent text-4xl font-black text-center w-24 outline-none tabular-nums z-10" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button onClick={startTimer} className={`${btnBase} bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white`}>Start</button>
                <button onClick={() => setRunning(false)} className={`${btnBase} bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white`}>Pause</button>
                
                {/* Condition-based Skip/Reset button */}
                {isBreak ? (
                   <button 
                   onClick={skipBreak} 
                   className={`${btnBase} col-span-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white font-black`}
                 >
                   ⏭️ Skip Break
                 </button>
                ) : (
                  <button 
                    onClick={() => {setRunning(false); setTime(1500); setInitialTime(1500);}} 
                    className={`${btnBase} col-span-2 bg-white/5 border-white/10`}
                  >
                    Reset to 25m
                  </button>
                )}
              </div>
            </div>

            <div className={`${glass} p-6 space-y-4`}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B7A1CE] font-black opacity-60">Weekly Activity</h4>
              <ActivityChart />
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#B7A1CE] pt-4 border-t border-[#433D8B]/20">
                <span>Words: {content.trim() ? content.split(/\s+/).length : 0}</span>
                <span>Chars: {content.length}</span>
              </div>
              <button onClick={pickRevisionNote} className={`${btnBase} w-full bg-[#7C6992]/20 border-[#7C6992]/40`}>Revise Old Note</button>
              
              {randomNote && (
                 <div className="p-4 bg-[#7C6992]/10 border border-[#7C6992]/30 rounded-2xl animate-in fade-in zoom-in">
                    <p className="text-[9px] text-[#B7A1CE] uppercase font-black mb-1">Revision Pick</p>
                    <p className="text-xs font-bold text-white mb-2 truncate">{randomNote.title}</p>
                    <button 
                      onClick={() => { setTitle(randomNote.title); setContent(randomNote.content); setSelectedId(randomNote.id); }}
                      className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-[#7C6992] hover:bg-[#8d7aa8]"
                    >
                      Open
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