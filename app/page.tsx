'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Operative {
  id: string;
  name: string;
  role: string;
  status: string;
  ping: number;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [activeNode, setActiveNode] = useState<number>(0);
  const [targetLink, setTargetLink] = useState<string>('');
  const [qualityMode, setQualityMode] = useState<'1080p' | '4k' | 'auto'>('1080p');
  const [fpsMode, setFpsMode] = useState<'60fps' | '144fps' | 'unlimited'>('144fps');
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'mkemo', text: 'Penetration matrix online. All firewalls bypassed.', timestamp: '10:00' }
  ]);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const appendLog = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [`[${time}] ${text}`, ...prev.slice(0, 30)]);
  }, []);

  const proxyGateways = [
    { name: 'mkemo PythonAnywhere Core', url: 'https://ubnt72.pythonanywhere.com/proxy?url=' },
    { name: 'AllOrigins Raw Gateway', url: 'https://api.allorigins.win/raw?url=' },
    { name: 'CorsProxy Global', url: 'https://corsproxy.io/?' },
    { name: 'CodeTabs Shield', url: 'https://api.codetabs.com/v1/proxy?quest=' },
    { name: 'Direct Socket Matrix', url: '' }
  ];

  const executeBypass = useCallback((url: string, index: number = 0) => {
    if (!url.trim()) return;
    setIsProcessing(true);
    const cleanUrl = url.trim();
    setTargetLink(cleanUrl);

    appendLog(`INJECTING TARGET: ${cleanUrl}`);
    appendLog(`STRIPPING CORS & X-FRAME-OPTIONS HEADERS...`);
    appendLog(`DEPLOYING PROXY NODE #${index + 1} (${proxyGateways[index].name})`);

    const node = proxyGateways[index];
    const finalSource = node.url === '' ? cleanUrl : `${node.url}${encodeURIComponent(cleanUrl)}`;

    setTimeout(() => {
      setCurrentSrc(finalSource);
      setActiveNode(index);
      setIsProcessing(false);
      appendLog(`STREAM FORCED SUCCESSFULLY | QUALITY: ${qualityMode.toUpperCase()} | FPS: ${fpsMode.toUpperCase()}`);
    }, 400);
  }, [qualityMode, fpsMode, appendLog]);

  const handleHackAction = () => {
    if (!videoUrl) return;
    executeBypass(videoUrl, 0);
  };

  const cycleNextNode = () => {
    if (!targetLink) return;
    const next = (activeNode + 1) % proxyGateways.length;
    appendLog(`SHIFTING FREQUENCY TO NODE #${next + 1}...`);
    executeBypass(targetLink, next);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'mkemo',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
    setChatInput('');
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome ${regName}! Account authorized.`);
    setIsRegisterOpen(false);
  };

  const operatives: Operative[] = [
    { id: '1', name: 'mkemo', role: 'Root Admin', status: 'Active', ping: 5 },
    { id: '2', name: 'Zetsubo', role: 'Bypass Lead', status: 'Infiltrating', ping: 14 },
    { id: '3', name: 'KageNode', role: 'Proxy Warden', status: 'Routing', ping: 19 }
  ];

  return (
    <div className="bg-[#020307] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-rose-600 selection:text-white" dir="ltr">
      
      {/* Dark Cyber Header */}
      <header className="bg-[#050712]/95 border-b border-rose-500/20 px-6 py-4 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-rose-950/30">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-rose-600/40">M</div>
          <div>
            <h1 className="text-base font-black tracking-wide text-white flex items-center gap-2">
              mkemo 
              <span className="text-[10px] font-extrabold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 uppercase tracking-widest">Penetration Core</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-300 font-bold">Shields Online</span>
          </div>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-5 py-2.5 rounded-2xl font-bold text-xs transition shadow-lg backdrop-blur-md active:scale-95"
          >
            Prime Account
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Operatives & Logs */}
        <div className="hidden lg:flex lg:col-span-3 bg-[#04060e]/90 border border-white/5 rounded-3xl p-4 flex-col space-y-4 h-[800px] shadow-2xl backdrop-blur-2xl overflow-hidden">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Active Operatives</h2>
          <div className="space-y-2.5">
            {operatives.map(op => (
              <div key={op.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-rose-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-xs text-white">{op.name[0]}</div>
                  <div className="text-xs">
                    <p className="font-bold text-white">{op.name}</p>
                    <p className="text-[10px] text-rose-400 font-medium">{op.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{op.ping}ms</span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col pt-3 border-t border-white/5 overflow-hidden">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 mb-2">Penetration Terminal Logs</h3>
            <div className="flex-1 bg-black/80 border border-white/5 rounded-2xl p-3.5 overflow-y-auto space-y-1.5 font-mono text-[10px] text-rose-300/90 shadow-inner">
              {systemLogs.length === 0 ? (
                <p className="text-gray-600 italic">Awaiting target link injection...</p>
              ) : (
                systemLogs.map((log, i) => <div key={i} className="break-all border-b border-rose-500/10 pb-1">{log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Center Column: URL Input, Quality/FPS & Video Player */}
        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          
          {/* Target Input Bar */}
          <div className="bg-[#04060e]/90 p-4 rounded-3xl border border-white/5 flex flex-col sm:flex-row gap-3 shadow-2xl backdrop-blur-2xl">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste target link to break & stream (e.g., https://anime3rb.com/...)" 
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-rose-500 transition font-medium shadow-inner"
            />
            <button 
              onClick={handleHackAction}
              disabled={isProcessing}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-90 text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xl shadow-rose-600/30 shrink-0 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? 'Breaking...' : 'Force Hack & Play'}
            </button>
          </div>

          {/* Quality & FPS Matrix Suite */}
          <div className="bg-[#04060e]/90 p-4 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Quality:</span>
              <div className="flex gap-1">
                {(['1080p', '4k', 'auto'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setQualityMode(q);
                      appendLog(`Quality override set to ${q.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase transition ${qualityMode === q ? 'bg-rose-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">FPS:</span>
              <div className="flex gap-1">
                {(['60fps', '144fps', 'unlimited'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setFpsMode(f);
                      appendLog(`FPS matrix locked to ${f.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase transition ${fpsMode === f ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Proxy Node Switcher Toolbar */}
          {targetLink && (
            <div className="bg-[#04060e]/90 px-4 py-3 rounded-2xl border border-rose-500/20 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md shadow-lg">
              <span className="text-rose-400 font-black flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Node #{activeNode + 1} ({proxyGateways[activeNode]?.name})
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={cycleNextNode}
                  className="px-3.5 py-2 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg active:scale-95"
                >
                  Switch Node ⚡
                </button>
                <a 
                  href={targetLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3.5 py-2 rounded-xl font-black bg-white/10 hover:bg-white/15 text-gray-200 transition"
                >
                  Raw Target ↗
                </a>
              </div>
            </div>
          )}
