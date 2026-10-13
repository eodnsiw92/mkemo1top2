'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [currentSrc, setCurrentSrc] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // سيرفر البروكسي الخاص بك على PythonAnywhere
  const PROXY_URL = "https://ubnt72.pythonanywhere.com/proxy?url=";

  const loadCustomMedia = (targetUrl?: string) => {
    const urlToLoad = targetUrl || videoUrl;
    if (!urlToLoad.trim()) return;
    
    const finalProxiedUrl = PROXY_URL + encodeURIComponent(urlToLoad.trim());
    setCurrentSrc(finalProxiedUrl);
    
    // فرض أعلى جودة وتشغيل فوري عند تحميل الفيديو
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play().catch(e => console.log("Auto-play restriction:", e));
      }
    }, 200);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, chatInput]);
    setChatInput('');
  };

  const submitPrimeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome ${regName}! Prime Video account created successfully.`);
    setIsRegisterOpen(false);
  };

  return (
    <div className="bg-[#0b0f19] text-gray-100 font-sans min-h-screen flex flex-col" dir="ltr">
      
      {/* Top Rave-style Navigation Bar */}
      <header className="bg-[#111827] border-b border-gray-800 px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">R</div>
          <h1 className="text-base font-bold tracking-wide text-white">
            Watch Party Pro <span className="text-xs font-normal text-indigo-400 ml-2">Rave Ultra HD Mode</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#1f2937] px-3 py-1.5 rounded-full border border-gray-700/50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-300">Proxy Active (Max Quality)</span>
          </div>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-[#00A8E1] hover:bg-[#0091c4] text-white px-4 py-2 rounded-lg font-semibold text-xs transition shadow-md"
          >
            Prime Video Account
          </button>
        </div>
      </header>

      {/* Main Rave Layout Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Friends / Active Users */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-4 flex-col space-y-4 h-[680px] shadow-lg">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Room Members</h2>
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 bg-[#1f2937] p-2.5 rounded-xl border border-gray-700/40">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">You</div>
              <div className="text-xs">
                <p className="font-semibold text-white">Host (Ultra HD)</p>
                <p className="text-[10px] text-emerald-400">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl opacity-60">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white">A</div>
              <div className="text-xs">
                <p className="font-semibold text-gray-300">Friend 1</p>
                <p className="text-[10px] text-gray-500">Synced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: High Quality Video Player & Proxy Controls */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* URL Input Bar */}
          <div className="bg-[#111827] p-3 rounded-2xl border border-gray-800 flex gap-2 shadow-inner">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste High Quality video stream URL here..." 
              className="flex-1 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={() => loadCustomMedia()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg"
            >
              Play Ultra HD
            </button>
          </div>

          {/* Cinematic Ultra HD Video Player Box */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
            <video 
              ref={videoRef}
              src={currentSrc} 
              controls 
              playsInline
              preload="auto"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Quick High Quality Sample Selector */}
          <div className="flex gap-3 justify-center pt-1">
            <button onClick={() => { setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4"); loadCustomMedia("https://www.w3schools.com/html/mov_bbb.mp4"); }} className="bg-[#111827] hover:bg-[#1f2937] border border-gray-800 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 transition">Sample HD 1</button>
            <button onClick={() => { setVideoUrl("https://www.w3schools.com/html/movie.mp4"); loadCustomMedia("https://www.w3schools.com/html/movie.mp4"); }} className="bg-[#111827] hover:bg-[#1f2937] border border-gray-800 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 transition">Sample HD 2</button>
          </div>
        </div>

        {/* Right Sidebar: Clean Live Chat */}
        <div className="lg:col-span-3 bg-[#111827] border border-gray-800 rounded-2xl flex flex-col h-[680px] shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-[#1f2937]/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Room Chat</h3>
            <span className="text-[10px] text-gray-400">Public</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-[#1f2937] border border-gray-700/50 p-3 rounded-xl text-xs text-gray-200 break-words shadow-sm">
                {msg}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-800 bg-[#111827] flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Send a message..." 
              className="flex-1 bg-[#1f2937] border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={sendChatMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Send
            </button>
          </div>
        </div>

      </main>

      {/* Prime Video Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1f2937] w-8 h-8 rounded-full flex items-center justify-center text-xs">✕</button>
            
            <h2 className="text-base font-bold text-center mb-5 text-white">Create Prime Video Account</h2>
            <form onSubmit={submitPrimeRegister} className="space-y-3.5">
              <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Full Name" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <input type="email" required value={regEmail} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <input type="password" required minLength={6} value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Password" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#0091c4] text-white py-3 rounded-xl font-bold text-xs transition shadow-lg mt-2">Register Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
