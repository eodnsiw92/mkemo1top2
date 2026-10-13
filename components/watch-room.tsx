"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface RoomStats {
  roomName: string;
  onlineCount: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

const HeadphonesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-white" }) => (
  <svg viewBox="0 0 50 50" className={className} fill="currentColor">
    <path d="M43.8,38.1c0,6.3 -2.5,7.9 -6,8.4V29.8C41.3,30.4 43.8,32 43.8,38.1z" />
    <path d="M36.8,29.3V47c0,1.1 -0.9,2 -2,2c-1.1,0 -2,-0.9 -2,-2V29.3c0,-1.1 0.9,-2 2,-2C35.9,27.3 36.8,28.2 36.8,29.3z" />
    <path d="M4.6,33.7c-0.5,0 -1,0.2 -1.5,0.4v-6.5c0.1,0 0.3,0 0.4,0h1.2v6H4.6z" />
    <path d="M47.1,36.3V40c0,0.9 -0.7,1.6 -1.6,1.6h-1c0.2,-1 0.3,-2.1 0.3,-3.4c0,-1.3 -0.1,-2.4 -0.3,-3.4h1C46.4,34.7 47.1,35.5 47.1,36.3z" />
    <path d="M47.5,21.7v3.9c0,0.6 -0.5,1.1 -1.1,1.1h-1.2c-0.6,0 -1.1,-0.5 -1.1,-1.1v-3.9c0,-9.5 -8.5,-17.2 -19.1,-17.2S5.9,12.2 5.9,21.7v3.9c0,0.6 -0.5,1.1 -1.1,1.1H3.6c-0.6,0 -1.1,-0.5 -1.1,-1.1v-3.9C2.5,10.3 12.6,1 25,1C37.4,1 47.5,10.3 47.5,21.7z" />
    <path d="M12.3,29.8v16.8c-3.5,-0.6 -6,-2.1 -6,-8.4C6.3,32 8.8,30.3 12.3,29.8z" />
    <path d="M45.5,33.7h-0.6v-6c0.1,0 0.2,0 0.3,0h1.2c0,0 0.1,0 0.1,0V34C46.2,33.8 45.8,33.7 45.5,33.7z" />
    <path d="M5.6,34.7c-0.2,1 -0.3,2.1 -0.3,3.4c0,1.3 0.1,2.5 0.3,3.4h-1C3.7,41.6 3,40.9 3,40v-3.6c0,-0.9 0.7,-1.6 1.6,-1.6H5.6z" />
    <path d="M17.2,29.3V47c0,1.1 -0.9,2 -2,2c-1.1,0 -2,-0.9 -2,-2V29.3c0,-1.1 0.9,-2 2,-2C16.3,27.3 17.2,28.2 17.2,29.3z" />
  </svg>
);

export default function WatchRoom() {
  const [stats, setStats] = useState<RoomStats>({
    roomName: "Public Watch Room",
    onlineCount: 2,
    isPlaying: true,
    currentTime: 142,
    duration: 600,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Host",
      text: "Welcome to the watch room.",
      timestamp: "03:10 PM",
      isMe: true,
    },
    {
      id: "2",
      user: "Participant",
      text: "Connection and synchronization are stable.",
      timestamp: "03:11 PM",
      isMe: false,
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: "Host",
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMsg("");
  };

  const togglePlay = () => {
    setStats((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen bg-black text-white flex flex-col justify-between overflow-hidden font-sans select-none ltr">
      
      {/* Top Header */}
      <header className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/95 via-black/50 to-transparent flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#BB00FF] to-[#FF0090] shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-black/90 rounded-full flex items-center justify-center font-extrabold text-xs tracking-wider text-white">
              MK
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-gray-100">{stats.roomName}</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping" />
              {stats.onlineCount} online now
            </p>
          </div>
        </div>

        <button className="bg-[#888888]/20 hover:bg-[#888888]/30 border-2 border-[#C4CDE0]/40 rounded-[11px] p-2 transition-all active:scale-90 shadow-lg backdrop-blur-md">
          <HeadphonesIcon className="w-5 h-5 text-purple-300" />
        </button>
      </header>

      {/* Video Player Stage */}
      <div className="relative w-full h-[52%] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-black/70 z-10 pointer-events-none" />

        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000"
          alt="Stream Preview"
          className="w-full h-full object-cover opacity-85 scale-105"
        />

        <div className="absolute z-20 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#BB00FF] to-[#FF0090] text-white flex items-center justify-center shadow-2xl shadow-purple-600/60 transition-transform active:scale-90 hover:scale-105"
          >
            {stats.isPlaying ? (
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="absolute bottom-3 inset-x-4 z-20 flex items-center gap-3">
          <span className="text-[11px] font-mono text-gray-300">{formatTime(stats.currentTime)}</span>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative">
            <div
              className="h-full bg-gradient-to-r from-[#BB00FF] to-[#FF0090] rounded-full transition-all duration-300"
              style={{ width: `${(stats.currentTime / stats.duration) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-gray-400">{formatTime(stats.duration)}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative w-full flex-1 bg-[#212121] rounded-t-[20px] z-20 flex flex-col justify-between overflow-hidden border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="w-8 h-8 rounded-[10px] bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xs text-purple-300 shadow-sm shrink-0">
                {msg.user[0]}
              </div>

              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed shadow-md ${
                  msg.isMe
                    ? "bg-gradient-to-tr from-[#BB00FF] to-[#FF0090] text-white rounded-br-none"
                    : "bg-white/10 text-gray-100 backdrop-blur-md rounded-bl-none border border-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 opacity-70 text-[9px]">
                  <span className="font-semibold">{msg.user}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="font-normal">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-black/50 backdrop-blur-md border-t border-white/5 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 text-white text-xs px-4 py-3 rounded-[12px] border border-white/10 focus:outline-none focus:border-[#FF0090] transition-colors placeholder:text-gray-500 font-medium"
          />
          <button
            type="submit"
            className="bg-gradient-to-tr from-[#BB00FF] to-[#FF0090] text-white px-5 py-3 rounded-[12px] font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/25 shrink-0"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  );
}
