"use client"

import React, { useState } from "react"
import { Globe, Search, ArrowRight, ShieldCheck, Gamepad2, Tv, Zap, Cpu, Sparkles, Video, Play, ExternalLink, Lock, Wifi, Terminal, Activity, X } from "lucide-react"

interface MediaSearchHubProps {
  onSelectMedia: (media: { type: 'youtube' | 'web' | 'video'; url: string; title: string }) => void;
}

export function MediaSearchHub({ onSelectMedia }: MediaSearchHubProps) {
  const [activeTab, setActiveTab] = useState<'web' | 'youtube' | 'quick'>('web');
  const [inputUrl, setInputUrl] = useState("");
  const [ytQuery, setYtQuery] = useState("");

  const handleWebLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    let targetUrl = inputUrl.trim();
    const isUrl = targetUrl.includes('.') && !targetUrl.includes(' ');
    
    if (!isUrl) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    onSelectMedia({
      type: 'web',
      url: targetUrl,
      title: inputUrl
    });
  };

  const handleYoutubeLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ytQuery.trim()) return;

    onSelectMedia({
      type: 'youtube',
      url: ytQuery.trim(),
      title: 'YouTube Stream'
    });
  };

  const virtualShortcuts = [
    { name: 'Google OS', url: 'https://www.google.com', icon: Globe, color: 'from-blue-600 to-cyan-500', desc: 'Virtual Search' },
    { name: 'Poki Arcade', url: 'https://poki.com', icon: Gamepad2, color: 'from-fuchsia-600 to-pink-600', desc: '120FPS Games' },
    { name: 'CrazyGames', url: 'https://www.crazygames.com', icon: Zap, color: 'from-amber-500 to-orange-600', desc: 'HD Gaming' },
    { name: 'Bing Web', url: 'https://www.bing.com', icon: Tv, color: 'from-emerald-500 to-teal-600', desc: 'Web Portal' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-2 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[2.5rem] shadow-2xl backdrop-blur-2xl">
      <div className="w-full bg-[#08090e]/95 rounded-[2.3rem] p-5 md:p-8 border border-white/15 relative overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wider">VIRTUAL WEB OS</h2>
              <p className="text-[11px] text-slate-400">GPU Accelerated Browser Core</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleWebLaunch} className="space-y-3 mb-6">
          <div className="relative flex items-center bg-slate-900 border border-white/20 rounded-2xl p-2 shadow-xl">
            <Search className="absolute left-4 w-4 h-4 text-violet-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL (e.g. google.com) or search..."
              className="w-full bg-transparent py-3.5 pl-11 pr-3 text-xs md:text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LAUNCH VIRTUAL BROWSER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {virtualShortcuts.map((site, index) => {
            const Icon = site.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  setInputUrl(site.url);
                  onSelectMedia({ type: 'web', url: site.url, title: site.name });
                }}
                className="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-white/10 cursor-pointer transition-all flex items-center gap-2.5"
              >
                <div className={`p-2 rounded-xl bg-gradient-to-br ${site.color} text-white shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{site.name}</h4>
                  <p className="text-[10px] text-slate-400">{site.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
