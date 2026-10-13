'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export default function MkemoCore() {
  const [inputUrl, setInputUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [activeProxy, setActiveProxy] = useState(0);
  const [targetUrl, setTargetUrl] = useState('');
  const [quality, setQuality] = useState<'1080p' | '4k' | 'auto'>('1080p');
  const [framerate, setFramerate] = useState<'60fps' | '144fps' | 'unlimited'>('144fps');
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'mkemo', text: 'Stream player and bypass core online.', time: '12:00' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const addTerminalLog = useCallback((txt: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${txt}`, ...prev.slice(0, 25)]);
  }, []);

  const proxyList = [
    { name: 'mkemo PythonAnywhere', url: 'https://ubnt72.pythonanywhere.com/proxy?url=' },
    { name: 'AllOrigins Gateway', url: 'https://api.allorigins.win/raw?url=' },
    { name: 'CorsProxy Network', url: 'https://corsproxy.io/?' },
    { name: 'CodeTabs Shield', url: 'https://api.codetabs.com/v1/proxy?quest=' },
    { name: 'Direct Stream', url: '' }
  ];

  const launchStreamBypass = useCallback((urlToLoad: string, proxyIdx: number = 0) => {
    if (!urlToLoad.trim()) return;
    setLoading(true);
    const clean = urlToLoad.trim();
    setTargetUrl(clean);

    addTerminalLog(`Target: ${clean}`);
    addTerminalLog(`Bypassing CORS & X-Frame headers...`);
    addTerminalLog(`Node: #${proxyIdx + 1} (${proxyList[proxyIdx].name})`);

    const selectedProxy = proxyList[proxyIdx];
    const finalDestination = selectedProxy.url === '' ? clean : `${selectedProxy.url}${encodeURIComponent(clean)}`;

    setTimeout(() => {
      setIframeSrc(finalDestination);
      setActiveProxy(proxyIdx);
      setLoading(false);
      addTerminalLog(`Stream loaded | Quality: ${quality.toUpperCase()} | FPS: ${framerate.toUpperCase()}`);
    }, 350);
  }, [quality, framerate, addTerminalLog]);

  const handleRunStream = () => {
    if (!inputUrl) return;
    launchStreamBypass(inputUrl, 0);
  };

  const handleNextProxyNode = () => {
    if (!targetUrl) return;
    const nextIdx = (activeProxy + 1) % proxyList.length;
    addTerminalLog(`Switching to proxy node #${nextIdx + 1}...`);
    launchStreamBypass(targetUrl, nextIdx);
  };

  const sendChatMessage = () => {
    if (!chatText.trim()) return;
    const messageObj: ChatMsg = {
      id: Date.now().toString(),
      sender: 'mkemo',
      text: chatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, messageObj]);
    setChatText('');
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="bg-[#020308] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-rose-600 selection:text-white" dir="ltr">
      
      {/* Header */}
      <header className="bg-[#050714]/95 border-b border-rose-500/20 px-6 py-4 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-rose-600/40">M</div>
          <div>
            <h1 className="text-base font-black tracking-wide text-white flex items-center gap-2">
              mkemo 
              <span className="text-[10px] font-extrabold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 uppercase tracking-widest">Player Core</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 text-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-rose-300 font-bold">Engine Online</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Terminal Logs Sidebar */}
        <div className="hidden lg:flex lg:col-span-3 bg-[#04060e]/90 border border-white/5 rounded-3xl p-4 flex-col space-y-4 h-[780px] shadow-2xl backdrop-blur-2xl overflow-hidden">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">System Logs</h2>
          <div className="flex-1 bg-black/80 border border-white/5 rounded-2xl p-3.5 overflow-y-auto space-y-1.5 font-mono text-[10px] text-rose-300/90 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-gray-600 italic">Waiting for target link...</p>
            ) : (
              logs.map((log, index) => <div key={index} className="break-all border-b border-rose-500/10 pb-1">{log}</div>)
            )}
          </div>
        </div>

        {/* Center: Video Player & Controls */}
        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          
          {/* URL Input */}
          <div className="bg-[#04060e]/90 p-4 rounded-3xl border border-white/5 flex flex-col sm:flex-row gap-3 shadow-2xl backdrop-blur-2xl">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste video or site link (e.g., https://anime3rb.com/...)" 
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-rose-500 transition font-medium shadow-inner"
            />
            <button 
              onClick={handleRunStream}
              disabled={loading}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-90 text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xl shadow-rose-600/30 shrink-0 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Bypassing...' : 'Run Stream'}
            </button>
          </div>

          {/* Quality & Framerate Controller */}
          <div className="bg-[#04060e]/90 p-4 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Quality:</span>
              <div className="flex gap-1">
                {(['1080p', '4k', 'auto'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuality(q);
                      addTerminalLog(`Quality set to ${q.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase transition ${quality === q ? 'bg-rose-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
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
                      setFramerate(f);
                      addTerminalLog(`FPS set to ${f.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase transition ${framerate === f ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Proxy Switcher Toolbar */}
          {targetUrl && (
            <div className="bg-[#04060e]/90 px-4 py-3 rounded-2xl border border-rose-500/20 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md shadow-lg">
              <span className="text-rose-400 font-black flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Node #{activeProxy + 1} ({proxyList[activeProxy]?.name})
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleNextProxyNode}
                  className="px-3.5 py-2 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg active:scale-95"
                >
                  Switch Node ⚡
                </button>
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3.5 py-2 rounded-xl font-black bg-white/10 hover:bg-white/15 text-gray-200 transition"
                >
                  Open Original ↗
                </a>
              </div>
            </div>
          )}

          {/* Cinematic Video Box */}
          <div className="relative w-full aspect-video min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] bg-black rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl flex items-center justify-center group">
            {iframeSrc ? (
              <iframe 
                src={iframeSrc} 
                className="w-full h-full border-0 bg-black" 
                allowFullScreen 
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-popups"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 text-xs sm:text-sm space-y-4 p-6 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500/10 border border
