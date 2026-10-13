"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  isHost?: boolean;
}

export default function WatchRoom() {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1");
  const [inputUrl, setInputUrl] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "A~:",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      content: "Welcome to MKEMO Watch Room!",
      isHost: true,
    },
    {
      id: "2",
      sender: "System",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
      content: "Stream synchronized successfully.",
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "User",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        content: inputMessage.trim(),
      },
    ]);
    setInputMessage("");
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    let formatted = inputUrl.trim();
    if (formatted.includes("youtube.com/watch?v=")) {
      const id = formatted.split("v=")[1]?.split("&")[0];
      formatted = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (formatted.includes("youtu.be/")) {
      const id = formatted.split("youtu.be/")[1]?.split("?")[0];
      formatted = `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    setVideoUrl(formatted);
    setInputUrl("");
    setIsSearchOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white flex flex-col justify-between overflow-hidden font-sans select-none ltr">
      
      {/* 1. Rave Top Blue Bar */}
      <header className="absolute top-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-r from-[#0088ff] via-[#0055ff] to-[#0099ff] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:opacity-80 active:scale-90 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* MKEMO Brand */}
        <h1 className="text-2xl font-black tracking-tighter italic text-white drop-shadow-md">
          MKEMO
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </header>

      {/* Media Search Modal Overlay */}
      {isSearchOpen && (
        <div className="absolute top-14 inset-x-3 z-50 bg-black/90 border border-blue-500/40 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste Video / YouTube Link..."
              className="flex-1 bg-zinc-900 text-white text-xs px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold text-xs active:scale-95 transition-transform"
            >
              Play
            </button>
          </form>
        </div>
      )}

      {/* 2. Video Stage Section */}
      <div className="relative w-full h-[38%] bg-black mt-12 flex items-center justify-center z-10 shadow-xl">
        <iframe
          src={videoUrl}
          title="MKEMO Stream"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 3. Rave Ambient Chat & Background Container */}
      <div className="relative w-full flex-1 bg-gradient-to-b from-[#2a1b18] via-[#8d4229] to-[#d36b37] flex flex-col justify-between overflow-hidden">
        
        {/* Floating Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none flex flex-col justify-end">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="relative shrink-0">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-10 h-10 rounded-full border-2 border-white/30 object-cover shadow-md"
                />
                {msg.isHost && (
                  <span className="absolute -top-1.5 -right-1 text-xs">👑</span>
                )}
              </div>
              <div className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="mr-2 text-white/90">{msg.sender}:</span>
                <span className="font-normal text-white">{msg.content}</span>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* 4. Rave Bottom Toolbar with Mic Button */}
        <div className="p-3 bg-black/20 backdrop-blur-md flex items-center justify-between gap-2 border-t border-white/10">
          
          {/* Microphone Circular Button */}
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0 ${
              isMicActive ? "bg-red-600 text-white animate-pulse" : "bg-white text-black"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {/* Chat Field */}
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Chat..."
              className="w-full bg-white/20 text-white text-xs px-4 py-3 rounded-full border border-white/20 focus:outline-none placeholder:text-white/70 backdrop-blur-md font-medium"
            />
          </form>

          {/* Action Tools */}
          <div className="flex items-center gap-2 text-white/80 shrink-0">
            <button className="p-2 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
