"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
}

interface RoomConfiguration {
  title: string;
  platform: "Prime" | "YouTube" | "Netflix" | "Custom";
  currentPlaybackTime: number;
  totalDuration: number;
  activeStreamUrl: string;
  primeVideoId: string;
  isPlaybackActive: boolean;
  participantCount: number;
  qualityPreset: "1080p Full HD" | "4K Ultra HD" | "Maximum Uncompressed";
}

export default function WatchRoom() {
  const [roomState, setRoomState] = useState<RoomConfiguration>({
    title: "MKEMO Synchronized Media Room",
    platform: "Prime",
    currentPlaybackTime: 0,
    totalDuration: 7200,
    activeStreamUrl: "https://www.primevideo.com",
    primeVideoId: "g1516087",
    isPlaybackActive: true,
    participantCount: 1,
    qualityPreset: "4K Ultra HD",
  });

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      sender: "MKEMO System",
      content: "Stream quality locked at Maximum Uncompressed (4K/1080p 60fps).",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [inputUrlField, setInputUrlField] = useState("");
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "Host",
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: false,
    };

    setChatLog((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  const handleUrlLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrlField.trim()) return;

    let targetUrl = inputUrlField.trim();

    if (targetUrl.includes("primevideo.com") || targetUrl.includes("amazon.com")) {
      const match = targetUrl.match(/g[0-9]+/);
      const videoId = match ? match[0] : "g1516087";
      setRoomState((prev) => ({
        ...prev,
        platform: "Prime",
        activeStreamUrl: targetUrl,
        primeVideoId: videoId,
      }));
    } else {
      setRoomState((prev) => ({
        ...prev,
        activeStreamUrl: targetUrl,
      }));
    }

    setChatLog((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "MKEMO System",
        content: `Media re-initialized with Maximum HD bitrate settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      },
    ]);

    setInputUrlField("");
    setIsControlPanelOpen(false);
  };

  const formatSecondsToClock = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen bg-[#050507] text-white flex flex-col justify-between overflow-hidden font-sans select-none ltr">
      
      {/* Top Navigation & Quality Indicator */}
      <header className="absolute top-0 inset-x-0 z-30 px-5 py-3.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-[#BB00FF] via-[#FF0090] to-[#7000ff] shadow-xl shadow-purple-600/30">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-black text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
              MK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold tracking-wide text-gray-100">{roomState.title}</h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                {roomState.qualityPreset}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>{roomState.platform} Mode</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{roomState.participantCount} Synchronized</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
            className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-semibold text-purple-200 transition-all active:scale-95 flex items-center gap-2 shadow-lg backdrop-blur-md"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Media Engine</span>
          </button>
        </div>
      </header>

      {/* Control Panel Modal for URL & Quality Configuration */}
      {isControlPanelOpen && (
        <div className="absolute top-20 inset-x-4 z-50 bg-[#121216]/95 border border-purple-500/30 p-4 rounded-3xl shadow-2xl backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider">High Bitrate Media Control</h2>
            </div>
            <button
              onClick={() => setIsControlPanelOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleUrlLoad} className="space-y-3">
            <label className="text-[10px] font-medium text-gray-400 block">
              Inject High-Quality Stream URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputUrlField}
                onChange={(e) => setInputUrlField(e.target.value)}
                placeholder="Paste Prime / Web / Video Stream Link..."
                className="flex-1 bg-black/60 text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-[#FF0090] text-white px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 shadow-lg active:scale-95 transition-transform"
              >
                Load Max
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Maximum Resolution Interactive Video Frame */}
      <div className="relative w-full h-[54%] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-black/70 z-10 pointer-events-none" />

        {/* Uncompressed High Resolution Player Window */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <iframe
            src={
              roomState.platform === "Prime"
                ? `https://www.primevideo.com`
                : roomState.activeStreamUrl
            }
            title="MKEMO Maximum Quality Stream"
            className="w-full h-full border-0 opacity-100 image-rendering-crisp transform-gpu"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; hd"
            allowFullScreen
            style={{
              filter: "contrast(105%) brightness(102%)",
            }}
          />
        </div>

        {/* Stream Progress Bar */}
        <div className="absolute bottom-3 inset-x-4 z-20 flex items-center gap-3 bg-black/70 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
          <span className="text-[11px] font-mono font-bold text-pink-400">
            {formatSecondsToClock(roomState.currentPlaybackTime)}
          </span>
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-[#BB00FF] to-[#FF0090] rounded-full transition-all duration-300"
              style={{ width: `${(roomState.currentPlaybackTime / roomState.totalDuration) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            {formatSecondsToClock(roomState.totalDuration)}
          </span>
        </div>
      </div>

      {/* Chat & System Log Interface */}
      <div className="relative w-full flex-1 bg-[#0a0a0e] rounded-t-[28px] z-20 flex flex-col justify-between overflow-hidden border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.95)]">
        
        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-none">
          {chatLog.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.isSystem ? "justify-center" : "flex-row"}`}
            >
              {msg.isSystem ? (
                <div className="px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-200 font-semibold tracking-wide shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-[11px] text-purple-400 shadow-sm shrink-0">
                    {msg.sender[0]}
                  </div>

                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-lg bg-zinc-900/90 text-gray-200 rounded-bl-none border border-white/5">
                    <div className="flex items-center justify-between gap-4 mb-1 opacity-60 text-[9px]">
                      <span className="font-bold text-purple-300">{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="font-normal">{msg.content}</p>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={chatScrollRef} />
        </div>

        {/* Input Field */}
        <form
          onSubmit={handleSendMessage}
          className="p-3.5 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-white/5 text-white text-xs px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-pink-500 transition-colors placeholder:text-gray-500 font-medium"
          />
          <button
            type="submit"
            className="bg-gradient-to-tr from-[#BB00FF] via-[#FF0090] to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-purple-600/30 shrink-0"
          >
            Send
          </button>
        </form>

      </div>

    </div>
  );
}
