"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Gamepad2, 
  Tv, 
  Zap, 
  Cpu, 
  Sparkles, 
  Youtube, 
  Play, 
  RotateCcw, 
  X, 
  Flame, 
  ExternalLink,
  Lock,
  Wifi,
  Terminal,
  Activity
} from "lucide-react"

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

    let ytUrl = ytQuery.trim();
    onSelectMedia({
      type: 'youtube',
      url: ytUrl,
      title: 'YouTube Live Stream'
    });
  };

  const virtualShortcuts = [
    { name: 'Google OS', url: 'https://www.google.com', icon: Globe, color: 'from-blue-600 via-indigo-600 to-cyan-500', desc: 'Virtual Search', badge: 'OS Engine' },
    { name: 'Poki Arcade', url: 'https://poki.com', icon: Gamepad2, color: 'from-fuchsia-600 via-pink-600 to-rose-500', desc: 'Cloud Games', badge: '120FPS' },
    { name: 'CrazyGames', url: 'https://www.crazygames.com', icon: Zap, color: 'from-amber-500 via-orange-600 to-yellow-500', desc: 'HD Gaming', badge: 'Popular' },
    { name: 'Bing Web', url: 'https://www.bing.com', icon: Tv, color: 'from-emerald-500 via-teal-600 to-cyan-600', desc: 'Web Portal', badge: 'Fast Hub' },
    { name: 'Twitch TV', url: 'https://www.twitch.tv', icon: Flame, color: 'from-purple-600 via-violet-600 to-indigo-600', desc: 'Live Stream', badge: 'Media' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: Terminal, color: 'from-slate-600 via-slate-700 to-slate-900', desc: 'Knowledge', badge: 'Global' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-2 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[2.5rem] shadow-[0_0_60px_rgba(124,58,237,0.25)] backdrop-blur-2xl transform-gpu transition-all duration-300">
      <div className="w-full bg-[#08090e]/95 rounded-[2.3rem] p-5 md:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/30 rounded-2xl border border-violet-500/40 shadow-inner">
              <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ULTRA BROWSER V2
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-emerald-400 animate-ping" />
                  120 FPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Virtual Web OS & Multi-Source Sync Engine</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shadow-inner w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('web')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
                activeTab === 'web'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web OS</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
                activeTab === 'youtube'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </button>

            <button
              onClick={() => setActiveTab('quick')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
                activeTab === 'quick'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hub</span>
            </button>
          </div>
        </div>

        {/* Tab 1: WEB BROWSER OS */}
        {activeTab === 'web' && (
          <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
            
            {/* Status Bar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 rounded-xl border border-white/10 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE PROXY TUNNEL ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span>LATENCY: 1ms</span>
              </div>
            </div>

            {/* Main Web Form */}
            <form onSubmit={handleWebLaunch} className="space-y-3">
              <div className="relative flex items-center bg-slate-900/90 border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl focus-within:border-violet-500 transition-colors">
                <Search className="absolute left-4 w-4 h-4 text-violet-400" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Enter website link (e.g. google.com, poki.com) or search term..."
                  className="w-full bg-transparent py-3.5 pl-11 pr-10 text-xs md:text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl("")}
                    className="absolute right-3 p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>LAUNCH VIRTUAL BROWSER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Cards Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Recommended Quick Launch Sites
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {virtualShortcuts.slice(0, 6).map((site, index) => {
                  const Icon = site.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setInputUrl(site.url);
                        onSelectMedia({ type: 'web', url: site.url, title: site.name });
                      }}
                      className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-violet-500/50 cursor-pointer transition-all duration-300 flex items-center gap-3 group shadow-md"
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${site.color} text-white shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-violet-300 truncate">{site.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400">{site.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: YOUTUBE ENGINE */}
        {activeTab === 'youtube' && (
          <div className="space-y-5 relative z-10 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-red-600/5 blur-3xl pointer-events-none" />
              <Youtube className="w-12 h-12 text-red-500 mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg font-black text-white mb-1">YouTube HD Live Stream</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                Paste any YouTube video link or search term to stream directly inside the room.
              </p>

              <form onSubmit={handleYoutubeLaunch} className="flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Paste YouTube Link or ID..."
                  value={ytQuery}
                  onChange={(e) => setYtQuery(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/15 rounded-2xl py-3 px-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Stream</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: HUB OVERVIEW */}
        {activeTab === 'quick' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 animate-in fade-in duration-200">
            {virtualShortcuts.map((site, index) => {
              const Icon = site.icon;
              return (
                <div
                  key={index}
                  onClick={() => {
                    onSelectMedia({ type: 'web', url: site.url, title: site.name });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 flex items-center justify-between group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${site.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{site.name}</h4>
                      <p className="text-xs text-slate-400">{site.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
