'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [activeMediaUrl, setActiveMediaUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Active Serveo Tunnel URL
  const PROXY_TUNNEL_URL = "https://e35bc9f5m.serveo.net";

  const getProxiedUrl = (url: string) => {
    if (!url) return '';
    return `${PROXY_TUNNEL_URL}/?url=${encodeURIComponent(url)}`;
  };

  const handlePlayMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setActiveMediaUrl(inputUrl.trim());
    }
  };

  return (
    <main className="min-h-screen bg-[#040508] text-white flex flex-col justify-between font-sans relative overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Dynamic Background Glow FX */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-1000" />

      {/* Top Navigation Bar - Minimalist Rave UI */}
      <header className="w-full bg-[#0a0c14]/70 border-b border-white/10 backdrop-blur-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 group cursor-pointer">
            <span className="text-3xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
              mK<span className="text-pink-500 italic drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]">E</span>mO
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] animate-ping ml-1" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Party
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-black/50 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          <span className="tracking-wider text-[11px] font-bold">LIVE STREAM</span>
        </div>
      </header>

      {/* Main Screen Player Section */}
      <section className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-center p-4 md:p-6 my-auto z-10">
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full aspect-video bg-[#090b12]/90 rounded-3xl overflow-hidden border transition-all duration-500 relative flex items-center justify-center shadow-2xl ${
            isHovered ? 'border-pink-500/50 shadow-[0_0_60px_rgba(236,72,153,0.2)]' : 'border-white/10 shadow-black'
          }`}
        >
          {activeMediaUrl ? (
            <iframe
              src={getProxiedUrl(activeMediaUrl)}
              className="w-full h-full border-0 rounded-3xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center space-y-6 p-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 rounded-full flex items-center justify-center text-pink-500 shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <svg className="w-10 h-10 ml-1 drop-shadow-[0_0_12px_#ec4899]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-white tracking-wider uppercase italic">Ready to Stream</h2>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                  Paste video URL below to start playback
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Control Input Footer */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:p-6 mb-3 z-10">
        <form onSubmit={handlePlayMedia} className="flex gap-2 bg-[#090b12]/90 p-2.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl focus-within:border-pink-500/60 transition duration-300">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste media link here (YouTube, Direct Stream, MP4...)"
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-600 focus:outline-none text-sm font-medium tracking-wide"
            required
          />
          <button
            type="submit"
            className="bg-white hover:bg-pink-500 hover:text-white text-black font-black px-8 py-3.5 rounded-xl transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>Play</span>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </button>
        </form>
      </footer>
    </main>
  );
}
