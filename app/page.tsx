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
    { id: '1', sender: 'mkemo', text: 'Bypass core online and ready.', time: '12:00' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const addTerminalLog = useCallback((txt: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${txt}`, ...prev.slice(0, 25)]);
  }, []);

  const proxyList = [
    { name: 'PythonAnywhere Core', url: 'https://ubnt72.pythonanywhere.com/proxy?url=' },
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
    addTerminalLog(`Stripping security headers & CORS...`);
    addTerminalLog(`Node: #${proxyIdx + 1} (${proxyList[proxyIdx].name})`);

    const selectedProxy = proxyList[proxyIdx];
    const finalDestination = selectedProxy.url === '' ? clean : `${selectedProxy.url}${encodeURIComponent(clean)}`;

    setTimeout(() => {
      setIframeSrc(finalDestination);
      setActiveProxy(proxyIdx);
      setLoading(false);
      addTerminalLog(`Stream active | Quality: ${quality.toUpperCase()} | FPS: ${framerate.toUpperCase()}`);
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
    <div className="bg-black text-gray-100 min-h-screen flex flex-col" dir="ltr">
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white text-base">M</div>
          <h1 className="text-base font-bold text-white">mkemo Bypass Core</h1>
        </div>
        <div className="flex items-center gap-2 bg-rose-950/50 border border-rose-800 px-3 py-1 rounded-full text-xs text-rose-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Shields Active</span>
        </div>
      </header>

      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="hidden lg:flex lg:col-span-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex-col space-y-3 h-[750px]">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Terminal Logs</h2>
          <div className="flex-1 bg-black/70 border border-zinc-800 rounded-xl p-3 overflow-y-auto space-y-1 font-mono text-[11px] text-rose-400">
            {logs.length === 0 ? (
              <p className="text-zinc-600 italic">Awaiting target link...</p>
            ) : (
              logs.map((log, idx) => <div key={idx} className="break-all border-b border-zinc-900 pb-1">{log}</div>)
            )}
          </div>
        </div>

        <div className="w-full lg:col-span-6 flex flex-col space-y-4">
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste link (e.g., https://anime3rb.com/...)" 
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-600"
            />
            <button 
              onClick={handleRunStream}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition disabled:opacity-50"
            >
              {loading ? 'Bypassing...' : 'Run Stream'}
            </button>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Quality:</span>
              <div className="flex gap-1">
                {(['1080p', '4k', 'auto'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuality(q); addTerminalLog(`Quality set to ${q}`); }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition ${quality === q ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
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
                    onClick={() => { setFramerate(f); addTerminalLog(`FPS set to ${f}`); }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition ${framerate === f ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {targetUrl && (
            <div className="bg-zinc-900/80 px-4 py-3 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-rose-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Node #{activeProxy + 1} ({proxyList[activeProxy]?.name})
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleNextProxyNode}
                  className="px-3 py-1.5 rounded-lg font-bold bg-rose-600 hover:bg-rose-500 text-white transition"
                >
                  Switch Node ⚡
                </button>
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1.5 rounded-lg font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                >
                  Open Original ↗
                </a>
              </div>
            </div>
          )}

          <div className="relative w-full aspect-video min-h-[350px] sm:min-h-[480px] bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
            {iframeSrc ? (
              <iframe 
                src={iframeSrc} 
                className="w-full h-full border-0 bg-black" 
                allowFullScreen 
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-popups"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600 space-y-3 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 text-xl font-bold">▶</div>
                <p className="text-zinc-500 text-xs">Paste your link above and click Run Stream to watch.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:col-span-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col h-[500px] lg:h-[750px] overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
            <h3 className="font-bold text-xs text-zinc-200 uppercase">Live Chat</h3>
            <span className="text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950">mkemo</span>
          </div>

          <div ref={chatBoxRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 flex flex-col">
            {messages.map(m => (
              <div key={m.id} className="bg-black/60 border border-zinc-800 p-2.5 rounded-xl text-xs text-zinc-200 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-rose-400 font-bold">
                  <span>{m.sender}</span>
                  <span className="text-zinc-600">{m.time}</span>
                </div>
                <p className="text-zinc-300">{m.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2">
            <input 
              type="text" 
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type message..." 
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-600"
            />
            <button 
              onClick={sendChatMessage}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition"
            >
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
