"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Mic, 
  MicOff, 
  Share2, 
  Send, 
  Users, 
  Compass, 
  ExternalLink,
  X,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Lock,
  Tv,
  Film
} from "lucide-react"

interface MediaStageProps {
  mediaUrl?: string;
  mediaType?: 'youtube' | 'web' | 'video';
  title?: string;
  onOpenSearch?: () => void;
}

export function MediaStage({ 
  mediaUrl = "", 
  mediaType = 'web', 
  title = "MKEMO Virtual Browser",
  onOpenSearch 
}: MediaStageProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [currentUrl, setCurrentUrl] = useState(mediaUrl || "https://www.google.com");
  
  const [messages, setMessages] = useState([
    { id: 1, user: "Mustafa", text: "Virtual Browser Engine activated! 🚀", color: "from-violet-600 to-indigo-600" },
    { id: 2, user: "MKEMO System", text: "Bypassing iframe restrictions via Virtual OS Tunnel.", color: "from-cyan-500 to-blue-600" }
  ]);

  const members = [
    { name: "Mustafa (Host)", role: "Developer / Admin", avatar: "M", color: "from-violet-600 to-fuchsia-600" },
    { name: "MKEMO Guest", role: "Viewer", avatar: "G", color: "from-cyan-500 to-blue-600" },
  ];

  const triggerReaction = (emoji: string) => {
    const id = Date.now();
    const x = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user: "Mustafa", text: chatInput, color: "from-violet-600 to-indigo-600" }]);
    setChatInput("");
  };

  // Format URL for Virtual Browser Display & Embedding
  const getProcessedUrl = (url: string) => {
    if (!url) return "https://www.google.com";
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('spotify.com')) {
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    return url;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#05060a] text-white select-none overflow-hidden font-sans transform-gpu">
      
      {/* MKEMO Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0b10]/95 backdrop-blur-xl border-b border-white/10 z-30 shadow-xl">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-transform active:scale-90 text-sm shadow-md">
            <Globe className="w-4 h-4 text-cyan-400" />
          </button>
          <button 
            onClick={() => setShowMembers(!showMembers)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-transform active:scale-90 text-sm shadow-md relative flex items-center gap-1.5 px-3"
          >
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-bold">2</span>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            MKEMO
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenSearch} 
            className="p-2.5 rounded-full bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 transition-all active:scale-90 text-violet-400 shadow-lg animate-pulse"
          >
            <Compass className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-xs border border-white/20 shadow-lg">
              M
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#05060a]" />
          </div>
        </div>
      </div>

      {/* Members Drawer */}
      {showMembers && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-950 border border-white/15 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" /> MKEMO Room Members
              </h3>
              <button 
                onClick={() => setShowMembers(false)}
                className="p-1 rounded-full bg-white/10 text-xs hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-xs shadow-md`}>
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-violet-400">{m.role}</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Virtual Browser Stage Container */}
      <div className="relative w-full h-[48vh] bg-[#0b0c14] border-b border-white/10 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Virtual Browser Toolbar (Address Bar) */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0e1017] border-b border-white/10 text-xs z-10">
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ArrowLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ArrowRight className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>

          <div className="flex-1 flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-300 shadow-inner">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{mediaUrl || "https://mkemo-virtual-os.vercel.app"}</span>
          </div>

          {mediaUrl && (
            <a 
              href={mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 transition-all flex items-center gap-1 text-[10px] font-bold"
            >
              <span>Open Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Browser Viewport / Screen */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
          
          {/* Floating Reactions */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {floatingEmojis.map(item => (
              <div 
                key={item.id} 
                className="absolute bottom-4 text-2xl animate-in fade-in slide-in-from-bottom-20 duration-1000"
                style={{ left: `${item.x}%` }}
              >
                {item.emoji}
              </div>
            ))}
          </div>

          {mediaUrl ? (
            <iframe
              src={getProcessedUrl(mediaUrl)}
              className="w-full h-full border-0 bg-white pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600/25 to-fuchsia-600/25 border border-violet-500/40 flex items-center justify-center shadow-inner">
                <Globe className="w-7 h-7 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Virtual Browser Ready</p>
                <p className="text-[11px] text-slate-400 mt-1">Select a platform or enter URL from Web OS Hub</p>
              </div>
              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/30"
                >
                  Open Web OS Hub
                </button>
              )}
            </div>
          )}

          {/* Live FPS Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono flex items-center gap-1.5 pointer-events-none shadow-lg z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">120 FPS BROWSER</span>
          </div>

          {/* Reactions Bar */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg z-10">
            <button onClick={() => triggerReaction('🔥')} className="hover:scale-125 transition-transform p-1 text-sm">🔥</button>
            <button onClick={() => triggerReaction('❤️')} className="hover:scale-125 transition-transform p-1 text-sm">❤️</button>
            <button onClick={() => triggerReaction('🚀')} className="hover:scale-125 transition-transform p-1 text-sm">🚀</button>
            <button onClick={() => triggerReaction('✨')} className="hover:scale-125 transition-transform p-1 text-sm">✨</button>
          </div>
        </div>
      </div>

      {/* Chat & Control Bar */}
      <div className="flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#0a0b10] to-[#05060a] overflow-y-auto">
        
        {/* Chat Feed */}
        <div className="space-y-3 py-1 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5 animate-in fade-in duration-200">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${msg.color} flex items-center justify-center text-xs font-bold shadow-md shrink-0`}>
                {msg.user[0]}
              </div>
              <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl max-w-[82%] text-xs backdrop-blur-sm shadow-sm">
                <p className="text-violet-400 font-bold text-[11px] mb-0.5">{msg.user}</p>
                <p className="text-slate-100 font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <form onSubmit={handleSendMessage} className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full transition-all active:scale-90 flex items-center justify-center shadow-lg shrink-0 relative ${
              isMicOn 
                ? 'bg-emerald-500 text-white shadow-emerald-500/40 animate-pulse' 
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <div className="flex-1 flex items-center bg-white/10 border border-white/15 rounded-full px-4 py-2 backdrop-blur-md focus-within:border-violet-500 transition-colors shadow-inner">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message in MKEMO..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {chatInput && (
              <button 
                type="submit"
                className="p-1.5 rounded-full bg-violet-600 text-white active:scale-90 transition-transform shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button 
            type="button"
            onClick={onOpenSearch}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-violet-400 active:scale-90 transition-transform shrink-0 shadow-md"
          >
            <Compass className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-cyan-400 active:scale-90 transition-transform shrink-0 shadow-md"
          >
            <Share2 className="w-5 h-5" />
          </button>

        </form>
      </div>
    </div>
  );
}
