'use client';

import React, { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [currentSrc, setCurrentSrc] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  // سيرفر البروكسي الخاص بك على PythonAnywhere
  const PROXY_URL = "https://ubnt72.pythonanywhere.com/proxy?url=";

  const loadMedia = () => {
    if (!videoUrl.trim()) return;
    const proxied = PROXY_URL + encodeURIComponent(videoUrl.trim());
    setCurrentSrc(proxied);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, chatInput]);
    setChatInput('');
  };

  const submitPrimeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome ${regName}! Account created successfully.`);
    setIsRegisterOpen(false);
  };

  return (
    <div className="bg-[#07090f] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white" dir="ltr">
      
      {/* Top Header - mkemo Brand */}
      <header className="bg-[#0e131f]/90 border-b border-gray-800/80 px-6 py-4 flex justify-between items-center shadow-2xl backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-600/30">M</div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white flex items-center gap-2">
              mkemo 
              <span className="text-[10px] font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 uppercase tracking-widest">Watch Party Ultra</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#151c2e] px-4 py-1.5 rounded-full border border-gray-800 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-300 font-semibold">Proxy Node Active</span>
          </div>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-[#00A8E1] hover:bg-[#0091c4] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg shadow-sky-500/20 active:scale-95"
          >
            Prime Video Account
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Room Members */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#0e131f] border border-gray-800/80 rounded-3xl p-4 flex-col space-y-4 h-[720px] shadow-2xl">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Participants</h2>
          <div className="space-y-2.5 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 bg-[#151c2e] p-3 rounded-2xl border border-gray-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">M</div>
              <div className="text-xs">
                <p className="font-bold text-white">mkemo (Host)</p>
                <p className="text-[10px] text-emerald-400 font-medium">Streaming Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Modern Cinematic Player & URL Box */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* URL Input Bar */}
          <div className="bg-[#0e131f] p-4 rounded-3xl border border-gray-800/80 flex gap-3 shadow-2xl backdrop-blur-md">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste anime link (e.g., https://anime3rb.com/episode/berserk/1)..." 
              className="flex-1 bg-[#151c2e] border border-gray-800 rounded-2xl px-4.5 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition font-medium"
            />
            <button 
              onClick={loadMedia}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-xs transition shadow-lg shadow-indigo-600/30 shrink-0"
            >
              Stream via Proxy
            </button>
          </div>

          {/* Ultra Modern Cinematic Video Box */}
          <div className="relative w-full aspect-video bg-[#090d16] rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl flex items-center justify-center group">
            {currentSrc ? (
              <iframe 
                src={currentSrc} 
                className="w-full h-full border-0 bg-black" 
                allowFullScreen 
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 text-xs space-y-3 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#151c2e] border border-gray-800 flex items-center justify-center text-indigo-400 text-xl font-bold shadow-inner group-hover:scale-105 transition duration-300">▶</div>
                <p className="max-w-xs text-gray-400 font-medium">Paste your anime link above and click Stream via Proxy to watch Berserk and other episodes together.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Clean Modern Chat */}
        <div className="lg:col-span-3 bg-[#0e131f] border border-gray-800/80 rounded-3xl flex flex-col h-[720px] shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800/80 bg-[#151c2e]/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Live Chat</h3>
            <span className="text-[10px] text-gray-400 font-medium">mkemo room</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-[#151c2e] border border-gray-800 p-3 rounded-2xl text-xs text-gray-200 break-words shadow-md">
                {msg}
              </div>
            ))}
          </div>

          <div className="p-3.5 border-t border-gray-800/80 bg-[#0e131f] flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type a message..." 
              className="flex-1 bg-[#151c2e] border border-gray-800 rounded-2xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition"
            />
            <button 
              onClick={sendChatMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              Send
            </button>
          </div>
        </div>

      </main>

      {/* Prime Video Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e131f] border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsRegisterOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#151c2e] border border-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-xs transition hover:bg-gray-800"
            >
              ✕
            </button>
            
            <h2 className="text-base font-bold text-center mb-5 text-white">Create Prime Video Account</h2>
            <form onSubmit={submitPrimeRegister} className="space-y-3.5">
              <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Full Name" className="w-full bg-[#151c2e] border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#151c2e] border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <input type="password" required minLength={6} value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Password" className="w-full bg-[#151c2e] border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00A8E1]" />
              <button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#0091c4] text-white py-3 rounded-2xl font-bold text-xs transition shadow-lg shadow-sky-500/20 mt-2">Register Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
