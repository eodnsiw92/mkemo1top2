"use client"

import React, { useState } from "react"
import { Globe, Search, ArrowRight, Sparkles, ExternalLink, ShieldCheck, Gamepad2, Tv, Zap, Terminal } from "lucide-react"

interface MediaSearchHubProps {
  onSelectMedia: (media: { type: 'youtube' | 'web' | 'video'; url: string; title: string }) => void;
}

export function MediaSearchHub({ onSelectMedia }: MediaSearchHubProps) {
  const [inputUrl, setInputUrl] = useState("");

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

  const quickLaunchSites = [
    { name: 'Google Engine', url: 'https://www.google.com', icon: Globe, color: 'from-blue-500 to-cyan-400', badge: 'Search' },
    { name: 'Poki Arcade', url: 'https://poki.com', icon: Gamepad2, color: 'from-fuchsia-600 to-pink-500', badge: 'Games' },
    { name: 'CrazyGames', url: 'https://www.crazygames.com', icon: Zap, color: 'from-amber-500 to-orange-500', badge: 'HD Games' },
    { name: 'Web Portal', url: 'https://www.bing.com', icon: Tv, color: 'from-emerald-500 to-teal-400', badge: 'Browser' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-[2.5rem] shadow-2xl backdrop-blur-2xl">
      <div className="w-full bg-slate-950/90 rounded-[2.4rem] p-6 md:p-8 border border-white/10 relative overflow-hidden">
        
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-2xl border border-white/10">
              <Globe className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">WEB BROWSER OS</h2>
              <p className="text-xs text-slate-400">Browse any website, game or link live in room</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleWebLaunch} className="relative group mb-6">
          <div className="relative flex flex-col md:flex-row items-center gap-3 bg-slate-900 border border-white/20 p-2 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 px-3 py-2 text-slate-400 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-400">SECURE WEB</span>
            </div>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter website link (e.g. netflix.com, roblox.com) or search..."
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <span>Go to Site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLaunchSites.map((site, index) => {
            const Icon = site.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  setInputUrl(site.url);
                  onSelectMedia({ type: 'web', url: site.url, title: site.name });
                }}
                className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 cursor-pointer transition-all flex items-center gap-3 group"
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${site.color} text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-300">{site.name}</h4>
                  <p className="text-[10px] text-slate-500">{site.badge}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
