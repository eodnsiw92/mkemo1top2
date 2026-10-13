'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [activeMediaUrl, setActiveMediaUrl] = useState('');

  // Active Pinggy Tunnel URL
  const PROXY_TUNNEL_URL = "https://nlwgo-37-239-156-8.free.pinggy.net";

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
    <main className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col items-center justify-between font-sans selection:bg-pink-600 selection:text-white">
      {/* Top Navigation Bar - Rave Style */}
      <header className="w-full bg-[#12141c]/80 border-b border-zinc-800/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-3xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent drop-shadow-md">
              mK<span className="text-pink-500 italic">E</span>mO
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse ml-0.5" />
          </div>
          <span className="hidden sm:inline-block bg-zinc-800/50 text-zinc-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-zinc-700/30">
            Watch Party
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800/80 px-3.5 py-1.5 rounded-full text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-zinc-300 font-mono text-[11px] font-bold tracking-wide">PROXY ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Cinematic Video Player Area */}
      <section className="w-full max-w-6xl flex-1 flex flex-col justify-center items-center p-4 md:p-6 my-auto">
        <div className="w-full aspect-video bg-[#12141c] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative flex items-center justify-center group transition-all duration-300">
          {activeMediaUrl ? (
            <iframe
              src={getProxiedUrl(activeMediaUrl)}
              className="w-full h-full border-0 rounded-3xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center space-y-5 p-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-full flex items-center justify-center mx-auto text-pink-500 shadow-2xl group-hover:scale-105 transition duration-300">
                <svg className="w-12 h-12 ml-1 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-white tracking-wide uppercase">Ready for Streaming</h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto font-medium leading-relaxed">
                  Paste any media URL below to instantly stream it securely through the local proxy tunnel.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Control & URL Input Bar */}
      <footer className="w-full max-w-4xl p-4 md:p-6 mb-4">
        <form onSubmit={handlePlayMedia} className="flex gap-3 bg-[#12141c]/90 p-2.5 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
          <div className="relative flex-1 flex items-center">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste media link here (YouTube, Direct Stream, MP4...)"
              className="w-full bg-transparent px-4 py-3 text-white placeholder-zinc-500 focus:outline-none text-sm font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-white hover:bg-zinc-200 text-black font-extrabold px-7 py-3.5 rounded-xl transition duration-200 active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>Play</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </button>
        </form>
      </footer>
    </main>
  );
}

