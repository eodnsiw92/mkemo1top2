"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Mic, 
  MicOff, 
  Share2, 
  Send, 
  Users, 
  ExternalLink,
  X,
  Play,
  Server,
  Zap,
  Radio,
  Tv
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
  title = "MKEMO Rave Stage",
  onOpenSearch 
}: MediaStageProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [useTermuxProxy, setUseTermuxProxy] = useState(true);

  // Termux Localhost / Tunnel Server Endpoint
  const termuxProxyUrl = "http://localhost:8080/proxy?url=";

  const [messages, setMessages] = useState([
    { id: 1, user: "Mustafa", text: "Termux Virtual Engine Linked! 🚀", color: "bg-purple-600" },
    { id: 2, user: "MKEMO Bot", text: "Rave Interface & Proxy Tunnel active.", color: "bg-pink-600" }
  ]);

  const members = [
    { name: "Mustafa (Host)", role: "Room Master", avatar: "M", color: "from-purple-600 to-pink-600" },
    { name: "MKEMO Bot", role: "Termux Proxy Node", avatar: "B", color: "from-blue-500 to-cyan-500" },
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
    setMessages(prev => [...prev, { id: Date.now(), user: "Mustafa", text: chatInput, color: "bg-purple-600" }]);
    setChatInput("");
  };

  const getMediaSource = (url: string) => {
    if (!url) return null;
    
    // YouTube Embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`;
    }

    // Pass through Termux Proxy Server if active
    if (useTermuxProxy && !url.includes('embed')) {
      return `${termuxProxyUrl}${encodeURIComponent(url)}`;
    }

    return url;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0c0517] text-white select-none overflow-hidden font-sans">
      
      {/* Rave Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#150a2a] border-b border-purple-900/40 z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setUseTermuxProxy(!useTermuxProxy)}
            className={`p-2 rounded-full border transition-all ${
              useTermuxProxy 
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/50' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title="Termux Proxy Toggle"
          >
            <Server className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5 px-3 text-xs font-bold"
          >
            <Users className="w-4 h-4 text-purple-300" />
            <span>2</span>
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-pink-500 animate-pulse" />
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 italic">
            RAVE
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSearch} 
            className="p-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/40 transition-transform active:scale-90"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Members Modal */}
      {showMembers && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#180c33] border border-purple-500/30 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" /> Room Participants
              </h3>
              <button onClick={() => setShowMembers(false)} className="p-1 rounded-full bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-xs`}>
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-purple-300">{m.role}</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rave Video Stage Viewport */}
      <div className="relative w-full h-[46vh] bg-black border-b border-purple-900/30 overflow-hidden flex items-center justify-center shadow-2xl">
        
        {/* Floating Emoji Reactions Layer */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {floatingEmojis.map(item => (
            <div 
              key={item.id} 
              className="absolute bottom-4 text-3xl animate-in fade-in slide-in-from-bottom-20 duration-1000"
              style={{ left: `${item.x}%` }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {mediaUrl ? (
          <iframe
            src={getMediaSource(mediaUrl) || ''}
            className="w-full h-full border-0 bg-black pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/40 animate-pulse">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">MKEMO Rave Stage Ready</p>
              <p className="text-[11px] text-purple-300 mt-1">Select media from Web OS or Termux Server</p>
            </div>
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-pink-500/30"
              >
                Open Media Browser
              </button>
            )}
          </div>
        )}

        {/* Live FPS Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-purple-500/30 text-[10px] font-mono flex items-center gap-1.5 z-10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">120 FPS SYNC</span>
        </div>

        {/* Rave Floating Reaction Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-purple-500/30 shadow-xl z-10">
          <button onClick={() => triggerReaction('🔥')} className="hover:scale-125 transition-transform p-1 text-base">🔥</button>
          <button onClick={() => triggerReaction('❤️')} className="hover:scale-125 transition-transform p-1 text-base">❤️</button>
          <button onClick={() => triggerReaction('🚀')} className="hover:scale-125 transition-transform p-1 text-base">🚀</button>
          <button onClick={() => triggerReaction('✨')} className="hover:scale-125 transition-transform p-1 text-base">✨</button>
        </div>
      </div>

      {/* Rave Bottom Chat Area */}
      <div className="flex-1 flex flex-col justify-between p-3.5 bg-[#0e061c]">
        
        {/* Messages Feed */}
        <div className="space-y-3 py-1 overflow-y-auto max-h-[30vh]">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-xs font-bold shadow-md shrink-0`}>
                {msg.user[0]}
              </div>
              <div className="bg-purple-950/40 border border-purple-800/30 px-3.5 py-2 rounded-2xl max-w-[85%] text-xs backdrop-blur-sm">
                <p className="text-pink-400 font-bold text-[11px] mb-0.5">{msg.user}</p>
                <p className="text-slate-100 font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Control & Input Dock */}
        <form onSubmit={handleSendMessage} className="mt-auto pt-3 border-t border-purple-900/30 flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full transition-all active:scale-90 flex items-center justify-center shadow-lg shrink-0 ${
              isMicOn 
                ? 'bg-emerald-500 text-white shadow-emerald-500/40 animate-pulse' 
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <div className="flex-1 flex items-center bg-purple-950/50 border border-purple-800/40 rounded-full px-4 py-2 focus-within:border-pink-500 transition-colors shadow-inner">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Chat in MKEMO Rave..."
              className="w-full bg-transparent text-xs text-white placeholder-purple-300/50 focus:outline-none"
            />
            {chatInput && (
              <button 
                type="submit"
                className="p-1.5 rounded-full bg-pink-600 text-white active:scale-90 transition-transform shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button 
            type="button"
            onClick={onOpenSearch}
            className="p-3 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-pink-300 active:scale-90 transition-transform shrink-0"
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-cyan-400 active:scale-90 transition-transform shrink-0"
          >
            <Share2 className="w-5 h-5" />
          </button>

        </form>
      </div>
    </div>
  );
}
