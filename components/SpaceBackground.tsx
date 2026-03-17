"use client";

import { useState, useEffect } from "react";

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

export default function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#17153B]">
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Primary Purple Glow */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, #433D8B 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Secondary Lavender Glow */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, #C8ACD6 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
              animation: `twinkle ${star.duration}s infinite ease-in-out`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Technical Grid */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{ 
          backgroundImage: `linear-gradient(#C8ACD6 1px, transparent 1px), linear-gradient(90deg, #C8ACD6 1px, transparent 1px)`, 
          backgroundSize: '80px 80px' 
        }}
      />
    </div>
  );
}