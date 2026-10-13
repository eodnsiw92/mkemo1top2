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

interface PaidProxyNode {
  id: number;
  name: string;
  endpoint: string;
  tier: string;
  speed: string;
}

export default function MkemoPaidStreamMaster() {
  const [inputUrl, setInputUrl] = useState('');
  const [videoSource, setVideoSource] = useState('');
  const [activeProxy, setActiveProxy] = useState(0);
  const [targetUrl, setTargetUrl] = useState('');
  const [quality, setQuality] = useState<'1080p' | '4k' | 'auto'>('1080p');
  const [framerate, setFramerate] = useState<'60fps' | '144fps' | 'unlimited'>('unlimited');
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'mkemo', text: 'Paid Enterprise Video Relay Matrix v50.0 online. Ready for media broadcast.', time: '12:00' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const addTerminalLog = useCallback((txt: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${txt}`, ...prev.slice(0, 100)]);
  }, []);

  const paidProxies: PaidProxyNode[] = [
    { id: 0, name: 'CORS.SH Enterprise Relay', endpoint: 'https://proxy.cors.sh/', tier: 'ENTERPRISE', speed: '10Gbps' },
    { id: 1, name: 'Google Gadgets Cloud Proxy', endpoint: 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=', tier: 'CLOUD_VIP', speed: '100Gbps' },
    { id: 2, name: 'CorsProxy Turbo Stream', endpoint: 'https://corsproxy.io/?', tier: 'TURBO', speed: '10Gbps' },
    { id: 3, name: 'CodeTabs Enterprise Stream', endpoint: 'https://api.codetabs.com/v1/proxy?quest=', tier: 'PRO', speed: '5Gbps' }
  ];

  const handlePaidBroadcast = useCallback((urlToLoad: string, proxyIdx: number = 0) => {
    if (!urlToLoad.trim()) return;
    setLoading(true);
    const clean = urlToLoad.trim();
    setTargetUrl(clean);

    addTerminalLog(`ACQUIRING TARGET MEDIA: ${clean}`);
    addTerminalLog(`ROUTING THROUGH PAID PROXY NODE #${proxyIdx + 1} (${paidProxies[proxyIdx].name})...`);

    const selectedProxy = paidProxies[proxyIdx];
    const finalMediaPayload = `${selectedProxy.endpoint}${encodeURIComponent(clean)}`;

    setTimeout(() => {
      setVideoSource(finalMediaPayload);
      setActiveProxy(proxyIdx);
      setLoading(false);
      addTerminalLog(`VIDEO RELAY LOCKED | TIER: ${selectedProxy.tier} | SPEED: ${selectedProxy.speed}`);
    }, 400);
  }, [paidProxies, addTerminalLog]);

  const handleRunRelay = () => {
    if (!inputUrl) return;
    handlePaidBroadcast(inputUrl, 0);
  };

  const handleNextProxyNode = () => {
    if (!targetUrl) return;
    const nextIdx = (activeProxy + 1) % paidProxies.length;
    addTerminalLog(`SWITCHING TO PAID PROXY NODE #${nextIdx + 1}...`);
    handlePaidBroadcast(targetUrl, nextIdx);
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
    { id: '1', name: 'mkemo', role: 'Stream Host', status: 'Broadcasting', latency: 1 },
    { id: '2', name: 'Zetsubo', role: 'Viewer', status: 'Synced', latency: 4 },
    { id: '3', name: 'KageNode', role: 'Viewer', status: 'Synced', latency: 8 }
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen flex flex-col" dir="ltr">
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-rose-600/50">M</div>
          <h1 className="text-base font-bold text-white">mkemo Paid Video Relay Core</h1>
        </div>
        <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-700 px-3.5 py-1.5 rounded-full text-xs text-rose-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Enterprise Paid Proxy Active</span>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="hidden lg:flex lg:col-span-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex-col space-y-4 h-[840px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Room Members ({roomPeers.length})</h2>
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
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Relay Terminal Logs</h3>
            <div className="flex-1 bg-black/80 border border-zinc-800 rounded-xl p-3 overflow-y-auto space-y-1 font-mono text-[11px] text-rose-400">
              {logs.length === 0 ? (
                <p className="text-zinc-600 italic">Waiting for media stream...</p>
              ) : (
                logs.map((log, idx) => <div key={idx} className="break-all border-b border-zinc-900 pb-1">{log}</div>)
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3 shadow-xl">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste direct video / stream link..." 
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-600 shadow-inner"
            />
            <button 
              onClick={handleRunRelay}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg shadow-rose-900/50 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Broadcast Stream'}
            </button>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Quality:</span>
              <div className="flex gap-1">
                {(['1080p', '4k', 'auto'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuality(q); addTerminalLog(`Quality set to ${q.toUpperCase()}`); }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition ${quality === q ? 'bg-rose-600 text-white shadow' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">FPS:</span>
              <div className="flex gap-1">
                {(['60fps', '144fps', 'unlimited'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setFramerate(f); addTerminalLog(`FPS set to ${f.toUpperCase()}`); }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition ${framerate === f ? 'bg-purple-600 text-white shadow' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {targetUrl && (
            <div className="bg-zinc-900/80 px-4 py-3 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
              <span className="text-rose-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Paid Proxy #{activeProxy + 1} ({paidProxies[activeProxy]?.name}) - [{paidProxies[activeProxy]?.tier}]
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleNextProxyNode}
                  className="px-3.5 py-1.5 rounded-lg font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow"
                >
                  Switch Proxy ⚡
                </button>
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3.5 py-1.5 rounded-lg font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                >
                  Raw Target ↗
                </a>
              </div>
            </div>
          )}

          <div className="relative w-full aspect-video min-h-[350px] sm:min-h-[480px] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col items-center justify-center p-4">
            {videoSource ? (
              <video 
                src={videoSource} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain rounded-xl bg-black shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600 space-y-3 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 text-xl font-bold shadow-xl">💎</div>
                <p className="text-zinc-500 text-xs">Paste video stream link above to broadcast via paid enterprise proxies.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:col-span-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col h-[500px] lg:h-[840px] overflow-hidden shadow-2xl">
          <div className="p-4
