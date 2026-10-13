'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [activeMediaUrl, setActiveMediaUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Welcome to mKEmO Watch Party! Enjoy streaming together.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Active Cloudflare Tunnel URL (أدخل الرابط الكامل هنا)
  const PROXY_TUNNEL_URL = "https://ethernet-YOUR-LINK.trycloudflare.com";

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setMessages([...messages, { sender: 'You', text: chatInput.trim() }]);
      setChatInput('');
    }
  };

  return (
    <main className="min-h-screen bg-[#030407] text-white flex flex-col justify-between font-sans relative overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Rave-style Ambient Glow FX */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[180px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none animate-pulse duration-1000" />

      {/* Top Rave Navigation Bar */}
      <header className="w-full bg-[#080a10]/80 border-b border-white/10 backdrop-blur-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <span className="text-3xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
              mK<span className="text-pink-500 italic drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]">E</span>mO
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] animate-ping ml-1" />
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Rave Cinematic Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/10 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{isChatOpen ? 'Hide Chat' : 'Show Chat'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout (Player + Rave Chat Sidebar) */}
      <div className="w-full max-w-[1600px] mx-auto flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 z-10 items-center">
        
        {/* Large Cinematic Player Section */}
        <div className="w-full flex-1 flex flex-col justify-center items-center">
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full h-[75vh] min-h-[500px] bg-[#070910]/95 rounded-3xl overflow-hidden border transition-all duration-500 relative flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
              isHovered ? 'border-pink-500/50 shadow-[0_0_80px_rgba(236,72,153,0.2)]' : 'border-white/10'
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
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 rounded-full flex items-center justify-center text-pink-500 shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer">
                    <svg className="w-12 h-12 ml-1 drop-shadow-[0_0_12px_#ec4899]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-wider uppercase italic">Cinema Room Ready</h2>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                    Paste any video URL below to stream in sync
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rave Live Chat Sidebar Panel */}
        {isChatOpen && (
          <aside className="w-full lg:w-80 h-[400px] lg:h-[75vh] bg-[#070910]/90 border border-white/10 rounded-3xl backdrop-blur-2xl flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Party Chat
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Synced</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-medium text-xs">
              {messages.map((msg, index) => (
                <div key={index} className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-pink-400 font-bold block mb-1">{msg.sender}</span>
                  <p className="text-zinc-300">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
              />
              <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs">
                Send
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Control Input Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 mb-3 z-10">
        <form onSubmit={handlePlayMedia} className="flex gap-3 bg-[#070910]/95 p-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl focus-within:border-pink-500/60 transition duration-300">
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
