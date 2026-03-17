"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import SpaceBackground from "@/components/SpaceBackground";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(1500); 
  const [running, setRunning] = useState(false);
  const [randomNote, setRandomNote] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); fetchNotes(); }, []);

  const fetchNotes = async () => {
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    if (data) setNotes(data);
  };

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;
    const payload = { title, content };
    const { error } = selectedId 
      ? await supabase.from("notes").update(payload).eq("id", selectedId)
      : await supabase.from("notes").insert([payload]);
    if (!error) { setTitle(""); setContent(""); setSelectedId(null); fetchNotes(); }
  };

  const deleteNote = async () => {
    if (!selectedId || !confirm("Delete this note?")) return;
    const { error } = await supabase.from("notes").delete().eq("id", selectedId);
    if (!error) { setTitle(""); setContent(""); setSelectedId(null); fetchNotes(); }
  };

  const pickRandomNote = () => {
    if (notes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * notes.length);
    setRandomNote(notes[randomIndex]);
  };

  useEffect(() => {
    let int = setInterval(() => {
      if (running && time > 0) {
        setTime(t => t - 1);
      } else if (time === 0) {
        setRunning(false);
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
          <aside className="space-y-4">
            <input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#0A0920]/40 border border-[#433D8B] text-sm outline-none focus:border-[#7C6992] transition-all placeholder:text-[#433D8B]" />
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
              {notes.filter(n => n.title?.toLowerCase().includes(search.toLowerCase())).map(n => (
                <div key={n.id} onClick={() => { setTitle(n.title); setContent(n.content); setSelectedId(n.id); }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedId === n.id ? "bg-[#7C6992] border-white shadow-lg" : "bg-[#2E236C]/10 border-[#433D8B] hover:border-[#7C6992]"}`}>
                  <p className="font-bold truncate text-xs">{n.title || "Untitled"}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* EDITOR */}
          <main className={`${glass} flex flex-col h-[760px] overflow-hidden`}>
            <div className="p-8 border-b border-[#433D8B]/30 flex flex-col md:flex-row gap-6 bg-white/5 items-center">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Lecture Title..."
                className="bg-transparent text-3xl font-black outline-none flex-1 placeholder:text-white/10 text-white tracking-tight w-full" />
              
              <div className="flex gap-3 w-full md:w-auto">
                {selectedId && (
                  <button onClick={deleteNote} className={`${btnBase} bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-8`}>
                    Delete
                  </button>
                )}
                <button onClick={saveNote} className={`${btnBase} bg-[#7C6992] border-transparent text-white hover:scale-105 shadow-xl shadow-[#7C6992]/20 px-12`}>
                  Save Note
                </button>
              </div>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start writing..."
              className="flex-1 p-10 bg-transparent outline-none resize-none text-[#E2E2F0] text-lg leading-relaxed placeholder:text-white/5" />
          </main>

          {/* RIGHT SIDE (TIMER & STATS) */}
          <aside className="space-y-6">
            <div className={`${glass} p-8 text-center`}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#B7A1CE] mb-6 font-black opacity-60">Focus Timer</h4>
              <div className="relative group">
                {/* Replace just the timer input line with this */}
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
  // Changed text-8xl to text-6xl and adjusted tracking
  className="bg-transparent text-6xl font-black text-center w-full outline-none focus:text-[#7C6992] transition-colors tabular-nums tracking-tight" 
/>
                {!running && (
                  <p className="text-[9px] text-[#433D8B] font-bold uppercase tracking-widest -mt-2 animate-pulse">
                    Set Minutes
                  </p>
                )}
              </div>

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
              <button onClick={pickRandomNote} className={`${btnBase} w-full bg-white/5 border-white/10 hover:bg-white/10`}>Surprise Revision</button>
              {randomNote && (
                <div className="p-4 bg-[#7C6992]/10 border border-[#7C6992]/30 rounded-2xl animate-in fade-in zoom-in-95 text-center">
                  <p className="text-[9px] text-[#B7A1CE] uppercase font-black mb-1">Reviewing:</p>
                  <p className="text-sm font-bold truncate text-white">{randomNote.title}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}