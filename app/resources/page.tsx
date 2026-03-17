"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import SpaceBackground from "@/components/SpaceBackground";
export default function Resources() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [resources, setResources] = useState<any[]>([]);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setResources(data || []);
  };

  const addResource = async () => {
    if (!title.trim() || !link.trim()) {
      alert("Please enter title and link");
      return;
    }

    const { error } = await supabase.from("resources").insert([
      { title, link, type: "link" }
    ]);

    if (error) {
      alert("Error saving resource");
    } else {
      setTitle("");
      setLink("");
      fetchResources();
    }
  };

  const deleteResource = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) alert("Error deleting");
    else fetchResources();
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-[#17153B] text-white font-inter">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-space-grotesk text-4xl font-bold tracking-tight mb-2">
            Study <span className="text-[#C8ACD6]">Resources</span>
          </h1>
          <p className="text-[#C8ACD6]/40 text-sm tracking-widest uppercase font-bold">
            Curate your digital library
          </p>
        </div>

        {/* Add Resource Glassmorphism Form */}
        <div className="bg-[#2E236C]/40 backdrop-blur-md border border-[#433D8B] p-8 rounded-[2rem] mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/40 ml-2">Title</label>
              <input
                placeholder="E.g., Quantum Physics Lecture"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#17153B]/50 border border-[#433D8B] outline-none focus:border-[#C8ACD6]/50 transition-all placeholder:text-[#433D8B]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#C8ACD6]/40 ml-2">URL Link</label>
              <input
                placeholder="Paste YouTube or PDF link..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#17153B]/50 border border-[#433D8B] outline-none focus:border-[#C8ACD6]/50 transition-all placeholder:text-[#433D8B]"
              />
            </div>
          </div>

          <button
            onClick={addResource}
            className="w-full md:w-auto px-10 py-4 bg-[#C8ACD6] text-[#17153B] rounded-2xl font-space-grotesk font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(200,172,214,0.3)]"
          >
            Add to Library
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-[#433D8B] rounded-[2rem]">
              <p className="text-[#C8ACD6]/20 font-space-grotesk text-xl uppercase tracking-tighter">Your library is empty</p>
            </div>
          )}

          {resources.map((r) => (
            <div
              key={r.id}
              className="group relative p-6 rounded-[2rem] bg-[#2E236C]/30 border border-[#433D8B] hover:border-[#C8ACD6]/40 hover:bg-[#2E236C]/50 transition-all duration-300"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#17153B] text-[#C8ACD6] text-[10px] font-bold uppercase tracking-widest border border-[#433D8B]">
                      {r.link.includes('youtube') ? '📺 Video' : r.link.includes('pdf') ? '📄 PDF' : '🔗 Link'}
                    </span>
                    
                    {/* Delete Button with Red Glow */}
                    <button
                      onClick={() => deleteResource(r.id)}
                      className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>

                  <h3 className="font-space-grotesk text-xl font-bold text-[#C8ACD6] mb-2 leading-tight group-hover:text-white transition-colors">
                    {r.title}
                  </h3>
                </div>

                <a
                  href={r.link}
                  target="_blank"
                  className="mt-6 flex items-center justify-center w-full py-3 rounded-xl bg-[#17153B] border border-[#433D8B] text-xs font-bold uppercase tracking-[0.2em] text-[#C8ACD6]/60 hover:text-[#C8ACD6] hover:border-[#C8ACD6]/50 transition-all"
                >
                  Open Resource
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}