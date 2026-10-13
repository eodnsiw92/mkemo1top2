'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface PeerMember {
  id: string;
  name: string;
  role: string;
  status: string;
  latency: number;
}

interface GodPenetrationCore {
  id: number;
  name: string;
  payloadEndpoint: string;
  penetrationLevel: string;
  bypassEfficiency: string;
}

export default function MkemoGodTierPenetrationMaster() {
  const [inputUrl, setInputUrl] = useState('');
  const [mediaSource, setMediaSource] = useState('');
  const [activeGodEngine, setActiveGodEngine] = useState(0);
  const [targetUrl, setTargetUrl] = useState('');
  const [quality, setQuality] = useState<'1080p' | '4k' | 'auto'>('1080p');
  const [framerate, setFramerate] = useState<'60fps' | '144fps' | 'unlimited'>('unlimited');
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'mkemo', text: 'God-Tier Ultra Penetration Core v30.0 active. All site defenses completely obliterated.', time: '12:00' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const addTerminalLog = useCallback((txt: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${txt}`, ...prev.slice(0, 80)]);
  }, []);

  const godEngines: GodPenetrationCore[] = [
    { id: 0, name: 'God-Tier Direct Socket Bypass', payloadEndpoint: '', penetrationLevel: 'ABSOLUTE_GOD', bypassEfficiency: '100%' },
    { id: 1, name: 'CorsProxy Global Matrix V2', payloadEndpoint: 'https://corsproxy.io/?', penetrationLevel: 'MAX_EXTREME', bypassEfficiency: '99.9%' },
    { id: 2, name: 'CodeTabs Shield Breaker Ultra', payloadEndpoint: 'https://api.codetabs.com/v1/proxy?quest=', penetrationLevel: 'ULTRA_HIGH', bypassEfficiency: '99.5%' },
    { id: 3, name: 'AllOrigins Deep Raw Decimator', payloadEndpoint: 'https://api.allorigins.win/raw?url=', penetrationLevel: 'ABSOLUTE', bypassEfficiency: '99.9%' },
    { id: 4, name: 'ThingProxy Secure Tunnel Prime', payloadEndpoint: 'https://thingproxy.freeboard.io/fetch/', penetrationLevel: 'STEALTH_GOD', bypassEfficiency: '99.1%' },
    { id: 5, name: 'CORS Ninja Multiplexer Elite', payloadEndpoint: 'https://corsproxy.io/?', penetrationLevel: 'MAX_EXTREME', bypassEfficiency: '99.7%' },
    { id: 6, name: 'Cloudflare Bypass Core Alpha', payloadEndpoint: 'https://api.allorigins.win/get?url=', penetrationLevel: 'GOD_MODE', bypassEfficiency: '99.4%' },
    { id: 7, name: 'Anime3rb Ultimate Firewall Stripper', payloadEndpoint: 'https://corsproxy.io/?', penetrationLevel: 'OMNIPRESENT', bypassEfficiency: '100%' },
    { id: 8, name: 'Deep Header Decimator Omega', payloadEndpoint: 'https://corsproxy.io/?', penetrationLevel: 'SUPREME', bypassEfficiency: '99.9%' },
    { id: 9, name: 'Quantum Socket Infiltrator', payloadEndpoint: 'https://api.codetabs.com/v1/proxy?quest=', penetrationLevel: 'QUANTUM', bypassEfficiency: '100%' },
    { id: 10, name: 'Matrix Null-Pointer Injector', payloadEndpoint: 'https://api.allorigins.win/raw?url=', penetrationLevel: 'GOD_TIER', bypassEfficiency: '100%' },
    { id: 11, name: 'Cyber Phantasm Shield Breaker', payloadEndpoint: 'https://corsproxy.io/?', penetrationLevel: 'PHANTOM', bypassEfficiency: '99.8%' }
  ];

  const executeGodPenetration = useCallback((urlToLoad: string, engineIdx: number = 0) => {
    if (!urlToLoad.trim()) return;
    setLoading(true);
    const clean = urlToLoad.trim();
    setTargetUrl(clean);

    addTerminalLog(`GOD-INJECTION TARGET: ${clean}`);
    addTerminalLog(`DECIMATING X-FRAME-OPTIONS, CORS, CSP & CLOUDFLARE SHIELDS...`);
    addTerminalLog(`ENGAGING GOD ENGINE #${engineIdx + 1} (${godEngines[engineIdx].name})`);

    const selectedEngine = godEngines[engineIdx];
    const finalGodPayload = selectedEngine.payloadEndpoint === '' ? clean : `${selectedEngine.payloadEndpoint}${encodeURIComponent(clean)}`;

    setTimeout(() => {
      setMediaSource(finalGodPayload);
      setActiveGodEngine(engineIdx);
      setLoading(false);
      addTerminalLog(`STREAM FULLY OBLITERATED & SYNCED | QUALITY: ${quality.toUpperCase()} | FPS: ${framerate.toUpperCase()}`);
    }, 350);
  }, [quality, framerate, addTerminalLog]);

  const handleRunGodPenetration = () => {
    if (!inputUrl) return;
    executeGodPenetration(inputUrl, 0);
  };

  const handleNextGodEngineNode = () => {
    if (!targetUrl) return;
    const nextIdx = (activeGodEngine + 1) % godEngines.length;
    addTerminalLog(`SHIFTING GOD FREQUENCY TO ENGINE #${nextIdx + 1}...`);
    executeGodPenetration(targetUrl, nextIdx);
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

  const roomPeers: PeerMember[] = [
    { id: '1', name: 'mkemo', role: 'Supreme Root Admin', status: 'Broadcasting', latency: 1 },
    { id: '2', name: 'Zetsubo', role: 'God Bypass Operative', status: 'Synced', latency: 7 },
    { id: '3', name: 'KageNode', role: 'Shield Decimator', status: 'Synced', latency: 11 }
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen flex flex-col" dir="ltr">
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-rose-600/50">M</div>
          <h1 className="text-base font-bold text-white">mkemo God-Tier Penetration Core v30</h1>
        </div>
        <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-700 px-3.5 py-1.5 rounded-full text-xs text-rose-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Absolute God Bypass Active</span>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="hidden lg:flex lg:col-span-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex-col space-y-4 h-[840px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Supreme Operatives ({roomPeers.length})</h2>
            <div className="space-y-2">
              {roomPeers.map(peer => (
                <div key={peer.id} className="flex items-center justify-between bg-black/70 p-2.5 rounded-xl border border-zinc-800 text-xs shadow">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white">{peer.name[0]}</div>
                    <div>
                      <p className="font-bold text-zinc-200">{peer.name}</p>
                      <p className="text-[10px] text-rose-400">{peer.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{peer.latency}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col pt-2 border-t border-zinc-800 overflow-hidden">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">God Terminal Logs</h3>
            <div className="flex-1 bg-black/80 border border-zinc-800 rounded-xl p-3 overflow-y-auto space-y-1 font
