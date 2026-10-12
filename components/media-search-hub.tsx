"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Search, 
  Youtube, 
  Play, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Gamepad2,
  Tv,
  Zap,
  Terminal
} from "lucide-react"

interface MediaSearchHubProps {
  onSelectMedia: (media: { type: 'youtube' | 'web' | 'video'; url: string; title: string }) => void;
}

export function MediaSearchHub({ onSelectMedia }: MediaSearchHubProps) {
  const [activeTab, setActiveTab] = useState<'web' | 'youtube'>('web');
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
    { name: 'Google Engine', category: 'Search', url: 'https://www.google.com', icon: Globe, color: 'from-blue-500 to-cyan-400', badge: 'Search Engine' },
    { name: 'Poki Arcade', category: 'Games', url: 'https://poki.com', icon: Gamepad2, color: 'from-fuchsia-600 to-pink-500', badge: 'Online Games' },
    { name: 'CrazyGames', category: 'Games', url: 'https://www.crazygames.com', icon: Zap, color: 'from-amber-500 to-orange-500', badge: 'HD Games' },
    { name: 'Web Portal', category: 'Media', url: 'https://www.bing.com', icon: Tv, color: 'from-emerald-500 to-teal-400', badge: 'Browse Portal' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-[2.5rem] shadow-[0_0_50px_rgba(124,58,237,0.15)] backdrop-blur-2xl transition-all duration-500">
      <div className="w-full bg-slate-950/80 rounded-[2.4rem] p-6 md:p-8 border border-white/10 relative overflow-hidden">
        
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative p-3.5 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center">
                <Globe className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  WEB ENGINE OS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
                  v2.5 Next
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">High speed virtual browser for live sync session</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab('web')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'web'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Web Browser</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'youtube'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube HD</span>
            </button>
          </div>
        </div>

        {activeTab === 'web' && (
          <div className="mt-8 space-y-8 relative z-10 animate-in fade-in duration-300">
            
            <form onSubmit={handleWebLaunch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 rounded-3xl blur-md opacity-25 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-3 bg-slate-900/90 border border-white/15 p-2 md:p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl">
                
                <div className="flex items-center gap-2 px-3 py-2 text-slate-400 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto justify-between md:justify-start">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-mono text-emerald-400/90 uppercase tracking-wider">SECURE HTTPS</span>
                  </div>
                </div>

                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter website URL (e.g. example.com) or search term..."
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => setInputUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white px-2 py-1 rounded-md bg-white/5"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Launch Web</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Quick Launch Platforms
                </h3>
                <span className="text-[11px] text-slate-500">Click to open instantly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLaunchSites.map((site, index) => {
                  const Icon = site.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setInputUrl(site.url);
                        onSelectMedia({ type: 'web', url: site.url, title: site.name });
                      }}
                      className="group relative p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-violet-500/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-violet-500/10"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${site.color} opacity-10 group-hover:opacity-20 rounded-bl-full transition-all duration-500`} />
                      
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${site.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          {site.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors flex items-center justify-between">
                          <span>{site.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate font-mono">{site.url}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-violet-400" />
                <p className="text-xs text-violet-200/80">
                  You can browse any web page supporting iframe embedding or use search queries directly online.
                </p>
              </div>
              <span className="text-[11px] font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20 whitespace-nowrap">
                100% Live Sync
              </span>
            </div>

          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-red-600/5 blur-3xl" />
              <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-black text-white mb-2">Live YouTube Streamer</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Paste any YouTube video link or ID to stream and sync playback inside the room.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Paste YouTube link here..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/15 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition-all"
                />
                <button
                  onClick={() => {
                    if (inputUrl.trim()) {
                      onSelectMedia({ type: 'youtube', url: inputUrl, title: 'YouTube Video' });
                    }
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
