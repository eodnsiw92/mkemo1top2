"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export default function WatchRoom() {
  const [streamType, setStreamType] = useState<"embed" | "direct">("embed");
  const [videoSource, setVideoSource] = useState(
    "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1"
  );
  const [inputUrl, setInputUrl] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      sender: "System",
      content: "MKEMO WatchParty Engine initialized with active anti-block proxy layer.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: true,
    },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatLog((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "Host",
        content: inputMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputMessage("");
  };

  const handleUrlLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    let rawUrl = inputUrl.trim();

    // 1. YouTube Watch Links
    if (rawUrl.includes("youtube.com/watch?v=")) {
      const id = rawUrl.split("v=")[1]?.split("&")[0];
      setStreamType("embed");
      setVideoSource(`https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`);
    } 
    // 2. YouTube Short Links
    else if (rawUrl.includes("youtu.be/")) {
      const id = rawUrl.split("youtu.be/")[1]?.split("?")[0];
      setStreamType("embed");
      setVideoSource(`https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`);
    } 
    // 3. Direct Video Stream Files (.mp4, .m3u8, webm)
    else if (rawUrl.endsWith(".mp4") || rawUrl.endsWith(".m3u8") || rawUrl.endsWith(".webm")) {
      setStreamType("direct");
      setVideoSource(rawUrl);
    } 
    // 4. Default Embed Fallback
    else {
      setStreamType("embed");
      setVideoSource(rawUrl);
    }

    setChatLog((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "System",
        content: "Media source updated successfully.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      },
    ]);

    setInputUrl("");
    setIsSearchOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-[#050811] text-white flex flex-col justify-between overflow-hidden font-sans select-none ltr">
      
      {/* Dark Blue Minimal Header */}
      <header className="absolute top-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-b from-[#02040a]/95 via-[#081026]/80 to-transparent flex items-center justify-between backdrop-blur-md border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
          MKEMO
        </h1>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-blue-300">Sync Active</span>
        </div>
      </header>

      {/* URL Injector Modal */}
      {isSearchOpen && (
        <div className="absolute top-16 inset-x-4 z-50 bg-[#0a1224]/95 border border-blue-500/40 p-3.5 rounded-2xl backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <form onSubmit={handleUrlLoad} className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste YouTube or Direct MP4/Stream URL..."
              className="flex-1 bg-black/60 text-white text-xs px-3.5 py-2.5 rounded-xl border border-blue-500/30 focus:outline-none focus:border-blue-400 font-medium"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform"
            >
              Play
            </button>
          </form>
        </div>
      )}

      {/* Dynamic Video Stage (Dual Mode Engine) */}
      <div className="relative w-full h-[52%] bg-black mt-12 flex items-center justify-center z-10 border-b border-blue-900/30">
        {streamType === "embed" ? (
          <iframe
            src={videoSource}
            title="MKEMO Video Player"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSource}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Dark Blue Chat Area */}
      <div className="relative w-full flex-1 bg-[#091021] rounded-t-[24px] z-20 flex flex-col justify-between overflow-hidden border-t border-blue-800/20 shadow-[0_-15px_30px_rgba(0,0,0,0.9)]">
        
        {/* Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none flex flex-col justify-end">
          {chatLog.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isSystem ? "justify-center" : "flex-row"}`}
            >
              {msg.isSystem ? (
                <div className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[10px] text-blue-300 font-medium">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-[#121c33] text-gray-100 border border-blue-500/20 shadow-md">
                  <div className="flex items-center justify-between gap-3 mb-0.5 opacity-60 text-[9px]">
                    <span className="font-bold text-blue-400">{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-normal">{msg.content}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={chatScrollRef} />
        </div>

        {/* Message Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-[#050a17] backdrop-blur-xl border-t border-blue-900/30 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-black/40 text-white text-xs px-4 py-3 rounded-xl border border-blue-900/40 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500 font-medium"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-blue-900/30 shrink-0"
          >
            Send
          </button>
        </form>

      </div>

    </div>
  );
}
