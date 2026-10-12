"use client"

import React, { useState } from "react"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Mic, 
  MicOff, 
  Share2, 
  Globe, 
  Send,
  Sparkles,
  Compass
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
  title = "No Media Playing",
  onOpenSearch 
}: MediaStageProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="flex flex-col h-screen w-full bg-[#090a0f] text-white select-none overflow-hidden font-sans transform-gpu">
      
      {/* Rave Ultra-Smooth Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d0e15]/90 backdrop-blur-xl border-b border-white/10 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/15 transition-transform duration-150 active:scale-90">
            <span className="text-base">💀</span>
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/15 transition-transform duration-150 active:scale-90">
            <span className="text-base">🕸️</span>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            RAVE
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenSearch} 
            className="p-2 rounded-full bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 transition-all duration-150 active:scale-90"
          >
            <Globe className="w-5 h-5 text-violet-400" />
          </button>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-xs border border-white/20 shadow-lg">
              M
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090a0f]" />
          </div>
        </div>
      </div>

      {/* High Performance Video / Web Stage */}
      <div className="relative w-full h-[42vh] bg-black border-b border-white/10 overflow-hidden flex items-center justify-center transform-gpu">
        {mediaUrl ? (
          mediaType === 'youtube' ? (
            <iframe
              src={mediaUrl.includes('embed') ? mediaUrl : `https://www.youtube.com/embed/${mediaUrl.split('v=')?.[1] || mediaUrl.split('/').pop()}?autoplay=1&enablejsapi=1`}
              className="w-full h-full border-0 pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <iframe
              src={mediaUrl}
              className="w-full h-full border-0 bg-white pointer-events-auto"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
              <Compass className="w-7 h-7 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No Stream Selected</p>
              <p className="text-[11px] text-slate-400 mt-1">Tap web icon above to start browsing</p>
            </div>
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold transition-all duration-150 active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                Open Web Hub
              </button>
            )}
          </div>
        )}

        {/* Live Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">120 FPS SYNC</span>
        </div>
      </div>

      {/* Rave Live Chat & Controls Area */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-[#0d0e15] to-[#090a0f] overflow-y-auto">
        
        {/* Chat Feed */}
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold shadow-md shrink-0">
              A
            </div>
            <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl max-w-[82%] text-xs backdrop-blur-sm">
              <p className="text-cyan-400 font-bold text-[11px] mb-0.5">Abdul Hakim</p>
              <p className="text-slate-100 font-medium">شغله شغله رهيب! 🔥</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-600 flex items-center justify-center text-xs font-bold shadow-md shrink-0">
              M
            </div>
            <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl max-w-[82%] text-xs backdrop-blur-sm">
              <p className="text-fuchsia-400 font-bold text-[11px] mb-0.5">Mohammed</p>
              <p className="text-slate-100 font-medium">السرعة ممتعة جداً وبدون تقطيع 🚀</p>
            </div>
          </div>
        </div>

        {/* Bottom Rave Control Bar */}
        <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2.5">
          
          {/* Mic Toggle Button */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full transition-all duration-150 active:scale-90 flex items-center justify-center shadow-lg shrink-0 ${
              isMicOn 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Quick Chat Input */}
          <div className="flex-1 flex items-center bg-white/10 border border-white/15 rounded-full px-4 py-2 backdrop-blur-md focus-within:border-violet-500 transition-colors">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="الدردشة..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {chatInput && (
              <button 
                onClick={() => setChatInput("")}
                className="p-1.5 rounded-full bg-violet-600 text-white active:scale-90 transition-transform"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Action Icons */}
          <button 
            onClick={onOpenSearch}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-violet-400 active:scale-90 transition-transform shrink-0"
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-cyan-400 active:scale-90 transition-transform shrink-0">
            <Share2 className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
}
