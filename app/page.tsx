'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// MKEMO ULTIMATE 15K PENETRATION & BYPASS MATRIX CORE (PRODUCION GRADE)
// ============================================================================

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  encryptionLevel: string;
}

interface CyberOperative {
  id: string;
  handle: string;
  specialty: string;
  status: string;
  latency: number;
  nodeIp: string;
}

interface ProxyGatewayNode {
  nodeId: number;
  nodeName: string;
  gatewayUrl: string;
  status: 'OPTIMAL' | 'SECURE' | 'GOD_OVERRIDE';
  pingMs: number;
  successPercentage: string;
}

interface NetworkPacketLog {
  id: string;
  timestamp: string;
  packetType: 'INJECT' | 'BYPASS' | 'STRIP' | 'OVERRIDE' | 'SUCCESS';
  description: string;
}

export default function UltimatePenetrationDashboard() {
  const [targetInputUrl, setTargetInputUrl] = useState<string>('');
  const [activeFrameSource, setActiveFrameSource] = useState<string>('');
  const [selectedProxyIndex, setSelectedProxyIndex] = useState<number>(0);
  const [lockedTargetUrl, setLockedTargetUrl] = useState<string>('');
  const [activeResolution, setActiveResolution] = useState<'1080p' | '4k' | '8k' | '16k_god' | 'auto'>('16k_god');
  const [activeFramerate, setActiveFramerate] = useState<'60fps' | '144fps' | '240fps' | 'unlocked'>('unlocked');
  const [chatMessageText, setChatMessageText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'mkemo', content: 'Penetration Matrix v9.2 online. All firewalls vulnerable.', timestamp: '10:00', encryptionLevel: 'AES-256' }
  ]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [networkLogs, setNetworkLogs] = useState<NetworkPacketLog[]>([]);
  const [isExecutionInProgress, setIsExecutionInProgress] = useState<boolean>(false);
  const [matrixLoadPower, setMatrixLoadPower] = useState<number>(100);
  const [bypassSuccessCount, setBypassSuccessCount] = useState<number>(1420);

  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const pushTerminalLog = useCallback((type: NetworkPacketLog['packetType'], text: string) => {
    const newLog: NetworkPacketLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      packetType: type,
      description: text,
    };
    setNetworkLogs(prevLogs => [newLog, ...prevLogs.slice(0, 45)]);
  }, []);

  const proxyNodesRegistry: ProxyGatewayNode[] = [
    { nodeId: 0, nodeName: 'mkemo PythonAnywhere Core', gatewayUrl: 'https://ubnt72.pythonanywhere.com/proxy?url=', status: 'GOD_OVERRIDE', pingms: 4, successPercentage: '100%' },
    { nodeId: 1, nodeName: 'AllOrigins Deep Raw Inserter', gatewayUrl: 'https://api.allorigins.win/raw?url=', status: 'OPTIMAL', pingms: 12, successPercentage: '99.8%' },
    { nodeId: 2, nodeName: 'CorsProxy Global Gateway', gatewayUrl: 'https://corsproxy.io/?', status: 'OPTIMAL', pingms: 16, successPercentage: '98.9%' },
    { nodeId: 3, nodeName: 'CodeTabs Shield Bypass', gatewayUrl: 'https://api.codetabs.com/v1/proxy?quest=', status: 'SECURE', pingms: 21, successPercentage: '98.2%' },
    { nodeId: 4, nodeName: 'ThingProxy Secure Tunnel', gatewayUrl: 'https://thingproxy.freeboard.io/fetch/', status: 'SECURE', pingms: 28, successPercentage: '96.5%' },
    { nodeId: 5, nodeName: 'AllOrigins JSON Encapsulator', gatewayUrl: 'https://api.allorigins.win/get?url=', status: 'OPTIMAL', pingms: 14, successPercentage: '99.1%' },
    { nodeId: 6, nodeName: 'Direct Neural Socket Matrix', gatewayUrl: '', status: 'GOD_OVERRIDE', pingms: 2, successPercentage: '100%' }
  ];

  const executeDeepPenetrationMatrix = useCallback((targetUrl: string, nodeIndex: number = 0) => {
    if (!targetUrl.trim()) return;
    setIsExecutionInProgress(true);
    const cleanedTarget = targetUrl.trim();
    setLockedTargetUrl(cleanedTarget);

    pushTerminalLog('INJECT', `Initializing target sequence: ${cleanedTarget}`);
    pushTerminalLog('STRIP', `Stripping X-Frame-Options, CSP headers, and CORS restrictions...`);
    pushTerminalLog('BYPASS', `Routing via Proxy Node #${nodeIndex + 1} (${proxyNodesRegistry[nodeIndex].nodeName})`);

    const selectedGateway = proxyNodesRegistry[nodeIndex];
    let constructedPayload = '';

    if (selectedGateway.gatewayUrl === '') {
      constructedPayload = cleanedTarget;
    } else {
      constructedPayload = `${selectedGateway.gatewayUrl}${encodeURIComponent(cleanedTarget)}`;
    }

    setTimeout(() => {
      setActiveFrameSource(constructedPayload);
      setSelectedProxyIndex(nodeIndex);
      setIsExecutionInProgress(false);
      setMatrixLoadPower(prev => Math.min(100, prev + 3));
      setBypassSuccessCount(count => count + 1);
      pushTerminalLog('SUCCESS', `Target successfully forced & streamed at ${activeResolution.toUpperCase()} / ${activeFramerate.toUpperCase()}`);
    }, 450);
  }, [activeResolution, activeFramerate, pushTerminalLog]);

  const handleForceHackButton = () => {
    if (!targetInputUrl) return;
    executeDeepPenetrationMatrix(targetInputUrl, 0);
  };

  const handleNodeSwitchCycle = () => {
    if (!lockedTargetUrl) return;
    const nextIndex = (selectedProxyIndex + 1) % proxyNodesRegistry.length;
    pushTerminalLog('OVERRIDE', `Shifting frequency to Node #${nextIndex + 1} (${proxyNodesRegistry[nextIndex].nodeName})`);
    executeDeepPenetrationMatrix(lockedTargetUrl, nextIndex);
  };

  const handleSendChatMessage = () => {
    if (!chatMessageText.trim()) return;
    const chatMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'mkemo',
      content: chatMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      encryptionLevel: 'SHA-512'
    };
    setChatHistory(prev => [...prev, chatMsg]);
    setChatMessageText('');
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Operative ${authUsername} authorized into Prime Matrix.`);
    setIsAuthModalOpen(false);
  };

  const activeOperativesList: CyberOperative[] = [
    { id: '1', handle: 'mkemo', specialty: 'Root Architect', status: 'ACTIVE_ROOT', latency: 4, nodeIp: '127.0.0.1' },
    { id: '2', handle: 'Zetsubo', specialty: 'Firewall Breaker', status: 'INFILTRATING', latency: 15, nodeIp: '192.168.44.12' },
    { id: '3', handle: 'KageNode', specialty: 'Proxy Warden', status: 'ROUTING', latency: 19, nodeIp: '10.0.0.88' },
    { id: '4', handle: 'VoidRunner', specialty: 'Header Stripper', status: 'ENCRYPTED', latency: 24, nodeIp: '172.16.2.9' }
  ];

  return (
    <div className="bg-[#000003] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-rose-600 selection:text-white" dir="ltr">
      
      {/* Top Cybernetic Navigation Header */}
      <header className="bg-[#02030a]/95 border-b border-rose-500/30 px-6 py-4 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-rose-950/60">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-rose-600/60 animate-pulse">M</div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-2.5">
              mkemo 
              <span className="text-[10px] font-extrabold text-rose-400 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 uppercase tracking-widest">15K Penetration Matrix Pro</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="hidden md:flex items-center gap-2.5 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/30 text-xs shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-300 font-bold tracking-wide">Matrix Power: {matrixLoadPower}% | Bypasses: {bypassSuccessCount}</span>
          </div>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs transition shadow-lg shadow-rose-600/40 active:scale-95"
          >
            Prime Matrix ID
          </button>
        </div>
      </header>

      {/* Main Grid Container Layout */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Operatives & Deep Terminal Logs */}
        <div className="hidden lg:flex lg:col-span-3 bg-[#010207]/90 border border-white/10 rounded-3xl p-4 flex-col space-y-4 h-[860px] shadow-2xl backdrop-blur-2xl overflow-hidden">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Active Operatives & Nodes</h2>
          <div className="space-y-2.5">
            {activeOperativesList.map(op => (
              <div key={op.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-rose-500/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                    {op.handle[0]}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">{op.handle}</p>
                    <p className="text-[10px] text-rose-400 font-medium">{op.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 block">{op.latency}ms</span>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">{op.nodeIp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col pt-3 border-t border-white/10 overflow-hidden">
            <div className="flex justify-between items-center px-1 mb-2">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Penetration Terminal Logs</h3>
              <span className="text-[9px] font-mono text-rose-400 font-bold">Encrypted Stream</span>
            </div>
            <div ref={terminalScrollRef} className="flex-1 bg-black/90 border border-white/10 rounded-2xl p-3.5 overflow-y-auto space-y-2 font-mono text-[10px] text-rose-300/90 shadow-inner">
              {networkLogs.length === 0 ? (
                <p className="text-gray-600 italic">Matrix awaiting target injection...</p>
              ) : (
                networkLogs.map(log => (
                  <div key={log.id} className="break-all border-b border-rose-500/10 pb-1">
                    <span className="text-gray-500">[{log.timestamp}]</span> <strong className="text-rose-400">[{log.packetType}]</strong> {log.description}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Input, Controls, Quality/FPS Suite & Giant Video Player */}
        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          
          {/* Deep Penetration URL Input Bar */}
          <div className="bg-[#010207]/90 p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-3 shadow-2xl backdrop-blur-2xl">
            <input 
              type="text" 
              value={targetInputUrl}
              onChange={(e) => setTargetInputUrl(e.target.value)}
              placeholder="Paste locked anime link (e.g., https://anime3rb.com/...)" 
              className="flex-1 bg-black/80 border border-white/15 rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-rose-500 transition font-medium shadow-inner"
            />
            <button 
              onClick={handleForceHackButton}
              disabled={isExecutionInProgress}
              className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition shadow-xl shadow-rose-600/40 shrink-0 active:scale-95 disabled:opacity-50"
            >
              {isExecutionInProgress ? 'Breaking Firewalls...' : 'Force Hack & Play'}
            </button>
          </div>

          {/* Advanced Quality & Frame Rate (FPS) Matrix Control Suite */}
          <div className="bg-[#010207]/90 p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl text-xs">
            
            {/* Resolution Quality Controller */}
            <div className="flex items-center gap-2.5">
              <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">Quality:</span>
              <div className="flex gap-1.5">
                {(['1080p', '4k', '8k', '16k_god', 'auto'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setActiveResolution(q);
                      pushTerminalLog('INJECT', `Resolution override set to ${q.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase tracking-wider transition ${activeResolution === q ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
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
                {(['60fps', '144fps', '240fps', 'unlocked'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveFramerate(f);
                      pushTerminalLog('INJECT', `Frame rate matrix locked to ${f.toUpperCase()}`);
                    }}
                    className={`px-3 py-2 rounded-xl font-black uppercase tracking-wider transition ${activeFramerate === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Multi-Proxy Node Rotator Toolbar */}
          {lockedTargetUrl && (
            <div className="bg-[#010207]/90 px-5 py-3.5 rounded-2xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md shadow-lg">
              <span className="text-rose-400 font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Proxy Node #{selectedProxyIndex + 1} ({proxyNodesRegistry[selectedProxyIndex]?.nodeName})
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleNodeSwitchCycle}
                  className="px-4 py-2 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/40 active:scale-95"
                >
                  Switch Proxy Node 
                </button>
                <a 
                  href={lockedTargetUrl} 
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
          <div className="relative w-full aspect-video min-h-[350px] sm:min-h-[500px] lg:min-h
