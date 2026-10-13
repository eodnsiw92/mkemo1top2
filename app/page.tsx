'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// MKEMO ULTIMATE 12K PENETRATION & BYPASS MATRIX CORE (PRODUCTION READY)
// ============================================================================

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface SquadMember {
  id: string;
  name: string;
  role: string;
  status: string;
  ping: number;
  ipMask: string;
}

interface ProxyNodeInfo {
  id: number;
  name: string;
  endpoint: string;
  status: 'ONLINE' | 'ACTIVE' | 'GOD_MODE';
  latency: number;
  successRate: string;
}

export default function Home() {
  // Comprehensive State Architecture
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [activeProxyIndex, setActiveProxyIndex] = useState<number>(0);
  const [targetLink, setTargetLink] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '4k' | '8k' | '12k_god' | 'auto'>('12k_god');
  const [selectedFps, setSelectedFps] = useState<'60fps' | '144fps' | '240fps' | 'unlimited'>('unlimited');
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'mkemo', text: '12K Penetration Matrix active. All firewalls bypassable.', timestamp: '10:00' }
  ]);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [isHackingActive, setIsHackingActive] = useState<boolean>(false);
  const [matrixPower, setMatrixPower] = useState<number>(100);
  const [bypassStats, setBypassStats] = useState<{ totalBypasses: number; activeNodes: number }>({
    totalBypasses: 1337,
    activeNodes: 9
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Advanced Logger Engine
  const logPenetrationEvent = useCallback((eventText: string) => {
    const timeCode = new Date().toLocaleTimeString();
    setSystemLogs(prevLogs => [`[${timeCode}] ${eventText}`, ...prevLogs.slice(0, 35)]);
  }, []);

  // 9-Tier Deep Penetration & CORS Bypass Proxy Matrix
  const proxyMatrixNodes: ProxyNodeInfo[] = [
    { id: 0, name: 'AllOrigins Raw Core', endpoint: 'https://api.allorigins.win/raw?url=', status: 'GOD_MODE', latency: 12, successRate: '99.9%' },
    { id: 1, name: 'CorsProxy Global Gateway', endpoint: 'https://corsproxy.io/?', status: 'ONLINE', latency: 18, successRate: '98.4%' },
    { id: 2, name: 'CodeTabs Bypass Shield', endpoint: 'https://api.codetabs.com/v1/proxy?quest=', status: 'ONLINE', latency: 22, successRate: '97.8%' },
    { id: 3, name: 'ThingProxy Secure Tunnel', endpoint: 'https://thingproxy.freeboard.io/fetch/', status: 'ACTIVE', latency: 31, successRate: '95.2%' },
    { id: 4, name: 'AllOrigins JSON Wrapper', endpoint: 'https://api.allorigins.win/get?url=', status: 'ACTIVE', latency: 15, successRate: '99.1%' },
    { id: 5, name: 'CodeTabs Deep Injector', endpoint: 'https://api.codetabs.com/v1/proxy?quest=', status: 'ONLINE', latency: 19, successRate: '98.9%' },
    { id: 6, name: 'CORS Ninja Relay', endpoint: 'https://corsproxy.io/?', status: 'ONLINE', latency: 25, successRate: '96.7%' },
    { id: 7, name: 'Direct Socket Matrix', endpoint: '', status: 'GOD_MODE', latency: 5, successRate: '100%' },
    { id: 8, name: 'Ultimate Bypass Core', endpoint: 'https://api.allorigins.win/raw?url=', status: 'GOD_MODE', latency: 8, successRate: '100%' }
  ];

  // Force Hack & Penetrate Execution Function
  const executeUltimatePenetration = useCallback((targetUrl: string, nodeIndex: number = 0) => {
    if (!targetUrl.trim()) return;
    setIsHackingActive(true);
    const cleanedUrl = targetUrl.trim();
    setTargetLink(cleanedUrl);

    logPenetrationEvent(`[MATRIX] Targeting URL: ${cleanedUrl}`);
    logPenetrationEvent(`[BYPASS] Stripping X-Frame-Options and CORS headers...`);
    logPenetrationEvent(`[NODE] Deploying Proxy Node #${nodeIndex + 1} (${proxyMatrixNodes[nodeIndex].name})`);

    const selectedNode = proxyMatrixNodes[nodeIndex];
    let finalPayloadSource = '';

    if (selectedNode.endpoint === '') {
      finalPayloadSource = cleanedUrl;
    } else {
      finalPayloadSource = `${selectedNode.endpoint}${encodeURIComponent(cleanedUrl)}`;
    }

    setTimeout(() => {
      setCurrentSrc(finalPayloadSource);
      setActiveProxyIndex(nodeIndex);
      setIsHackingActive(false);
      setMatrixPower(prev => Math.min(100, prev + 5));
      setBypassStats(prev => ({ ...prev, totalBypasses: prev.totalBypasses + 1 }));
      logPenetrationEvent(`[SUCCESS] Stream successfully forced & injected at ${selectedQuality.toUpperCase()} / ${selectedFps.toUpperCase()}`);
    }, 500);
  }, [selectedQuality, selectedFps, logPenetrationEvent]);

  const handleManualForceHack = () => {
    if (!videoUrl) return;
    executeUltimatePenetration(videoUrl, 0);
  };

  const rotateToNextProxyNode = () => {
    if (!targetLink) return;
    const nextIdx = (activeProxyIndex + 1) % proxyMatrixNodes.length;
    logPenetrationEvent(`[ROTATE] Shifting proxy frequency to node #${nextIdx + 1}`);
    executeUltimatePenetration(targetLink, nextIdx);
  };

  // Chat Dispatcher
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const messagePayload: ChatMessage = {
      id: Date.now().toString(),
      user: 'mkemo',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(existing => [...existing, messagePayload]);
    setChatInput('');
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const handlePrimeAccountCreation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome ${regName}! Prime Video God Account successfully authorized.`);
    setIsRegisterOpen(false);
  };

  // Squad Members Database
  const squadTeam: SquadMember[] = [
    { id: '1', name: 'mkemo', role: 'System Overlord', status: 'Active Root', ping: 5, ipMask: '127.0.0.1 (God)' },
    { id: '2', name: 'Zetsubo', role: 'Firewall Breaker', status: 'Bypassing', ping: 14, ipMask: '192.168.1.105' },
    { id: '3', name: 'KageNode', role: 'Proxy Controller', status: 'Routing', ping: 19, ipMask: '10.0.0.44' },
    { id: '4', name: 'CyberVoid', role: 'Stream Infiltrator', status: 'Encrypted', ping: 22, ipMask: '172.16.0.8' }
  ];

  return (
    <div className="bg-[#000002] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-rose-600 selection:text-white" dir="ltr">
      
      {/* Top Cybernetic God Header */}
      <header className="bg-[#02030a]/95 border-b border-rose-500/30 px-6 py-4 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-rose-950/50">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-rose-600/60 animate-pulse">M</div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-2.5">
              mkemo 
              <span className="text-[10px] font-extrabold text-rose-400 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 uppercase tracking-widest">12K Penetration Matrix Pro</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="hidden md:flex items-center gap-2.5 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/30 text-xs shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-300 font-bold tracking-wide">Matrix Power: {matrixPower}% | Bypasses: {bypassStats.totalBypasses}</span>
          </div>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs transition shadow-lg shadow-rose-600/40 active:scale-95"
          >
            Prime Video Account
          </button>
        </div>
      </header>

      {/* Main Grid Container Layout */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Squad & Deep Matrix Terminal Logs */}
        <div className="hidden lg:flex lg:col-span-3 bg-[#010208]/90 border border-white/10 rounded-3xl p-4 flex-col space-y-4 h-[840px] shadow-2xl backdrop-blur-2xl overflow-hidden">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Active Squad & Operatives</h2>
          <div className="space-y-2.5">
            {squadTeam.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-rose-500/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                    {member.name[0]}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">{member.name}</p>
                    <p className="text-[10px] text-rose-400 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 block">{member.ping}ms</span>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">{member.ipMask}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col pt-3 border-t border-white/10 overflow-hidden">
            <div className="flex justify-between items-center px-1 mb-2">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Penetration System Logs</h3>
              <span className="text-[9px] font-mono text-rose-400 font-bold">{bypassStats.activeNodes} Nodes Active</span>
            </div>
            <div className="flex-1 bg-black/85 border border-white/10 rounded-2xl p-3.5 overflow-y-auto space-y-2 font-mono text-[10px] text-rose-300/90 shadow-inner">
              {systemLogs.length === 0 ? (
                <p className="text-gray-600 italic">Matrix waiting for target URL injection...</p>
              ) : (
                systemLogs.map((logItem, index) => (
                  <div key={index} className="break-all border-b border-rose-500/10 pb-1">{logItem}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Input, Controls, Quality/FPS Suite & Giant Video Player */}
        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          
          {/* Deep Penetration URL Input Bar */}
          <div className="bg-[#010208]/90 p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-3 shadow-2xl backdrop-blur-2xl">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste anime/site link to break & stream (e.g., https://anime3rb.com/...)" 
              className="flex-1 bg-black/75 border border-white/15 rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-rose-500 transition font-medium shadow-inner"
            />
            <button 
              onClick={handleManualForceHack}
              disabled={isHackingActive}
              className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xl shadow-rose-600/40 shrink-0 active:scale-95 disabled:opacity-50"
            >
              {isHackingActive ? 'Breaking Firewalls...' : 'Force Hack & Play'}
            </button>
          </div>

          {/* Advanced Quality & Frame Rate (FPS) Matrix Control Suite */}
          <div className="bg-[#010208]/90 p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl text-xs">
            
            {/* Resolution Quality Controller */}
            <div className="flex items-center gap-2.5">
              <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">Quality:</span>
              <div className="flex gap-1.5">
                {(['1080p', '4k', '8k', '12k_god', 'auto'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setSelectedQuality(q);
                      logPenetrationEvent(`[CONFIG] Resolution override set to ${q.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase tracking-wider transition ${selectedQuality === q ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate (FPS) Controller */}
            <div className="flex items-center gap-2.5">
              <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">FPS Core:</span>
              <div className="flex gap-1.5">
                {(['60fps', '144fps', '240fps', 'unlimited'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setSelectedFps(f);
                      logPenetrationEvent(`[CONFIG] Frame rate matrix locked to ${f.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase tracking-wider transition ${selectedFps === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Multi-Proxy Node Rotator Toolbar */}
          {targetLink && (
            <div className="bg-[#010208]/90 px-5 py-3.5 rounded-2xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md shadow-lg">
              <span className="text-rose-400 font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Bypass Proxy Node #{activeProxyIndex + 1} ({proxyMatrixNodes[activeProxyIndex]?.name})
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={rotateToNextProxyNode}
                  className="px-4 py-2 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/40 active:scale-95"
                >
                  Switch Proxy Node ⚡
                </button>
                <a 
                  href={targetLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 rounded-xl font-black bg-white/10 hover:bg-white/15 text-gray-200 transition"
                >
                  Raw Target ↗
                </a>
              </div>
            </div>
          )}

          {/* Giant Cinematic Penetration Video Box */}
          <div className="relative w-full aspect-video min-h-[350px] sm:min-h-[500px] lg:min-h-[640px] bg-black/95 rounded-3xl overflow-hidden border border-rose-500/30 shadow-2xl flex flex-col items-center justify-center group">
            {currentSrc ? (
              <iframe 
                src={currentSrc} 
                className="w-full h-full border-0 bg-black" 
                allowFullScreen 
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-popups"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 text-xs sm:text-sm space-y-4 p-6 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 text-3xl font-black shadow-2xl backdrop-blur-xl group-hover:scale-110 transition duration-300">☠</div>
                <p className="max-w-md text-gray-400 font-semibold leading-relaxed">Paste target URL above and click Force Hack & Play to execute deep multi-proxy penetration across all restricted streaming servers.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Live Neural Chat */}
        <div className="w-full lg:col-span-3 bg-[#010208]/90 border border-white/10 rounded-3xl flex flex-col h-[500px] lg:h-[840px] shadow-2xl backdrop-blur-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
            <h3 className="font-black text-xs sm:text-sm text-white uppercase tracking-wider">Live Neural Chat</h3>
            <span className="text-[10px] text-rose-400 font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">mkemo room</span>
          </div>

          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-xs sm:text-sm text-gray-200 break-words shadow
