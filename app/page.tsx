'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [activeMediaUrl, setActiveMediaUrl] = useState('');
  
  // رابط النفق الخاص بك المربوط بـ Termux
  const PROXY_TUNNEL_URL = "https://khaki-lands-kiss.loca.lt";

  // دالة تحويل الرابط ليمر عبر البروكسي وتجاوز قيود الـ iframe
  const getProxiedUrl = (url: string) => {
    if (!url) return '';
    return `${PROXY_TUNNEL_URL}/?url=${encodeURIComponent(url)}`;
  };

  const handlePlayMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setActiveMediaUrl(inputUrl.trim());
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 md:p-8">
      {/* الهيدر والرأسية */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
              MKEMO Watch Party
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              منصة العرض الجماعي المجهزة ببروكسي تجاوز القيود لـ Termux
            </p>
          </div>
          
          {/* مؤشر حالة اتصال البروكسي */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-mono">Termux Proxy: Active</span>
          </div>
        </div>

        {/* نموذج إدخال الرابط */}
        <form onSubmit={handlePlayMedia} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="أدخل رابط الفيديو أو المنصة (YouTube, Dailymotion, Prime...)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition duration-200"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition duration-200 shadow-lg shadow-sky-500/10 active:scale-95"
          >
            تشغيل العرض
          </button>
        </form>
      </div>

      {/* مشغل الفيديو والشاشة الرئيسية */}
      <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative flex items-center justify-center">
        {activeMediaUrl ? (
          <iframe
            src={getProxiedUrl(activeMediaUrl)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-sky-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300">جاهز لبث الفيديو</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              ضع أي رابط ميديا في الشريط أعلاه ليتم معالجته وتمريره فوراً عبر السيرفر المحلي بدون حظر.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
