'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [currentSrc, setCurrentSrc] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [userName, setUserName] = useState('صديق');
  const [roomCode, setRoomCode] = useState('SHAHID-77');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; type?: string }>>([
    { sender: 'النظام', text: 'أهلاً بك في غرفة المشاهدة الجماعية المتطورة!', time: 'الآن', type: 'system' }
  ]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [isSynced, setIsSynced] = useState(true);

  const PROXY_URL = "https://ubnt72.pythonanywhere.com/proxy?url=";

  // تشغيل الوسائط عبر البروكسي الخاص بك
  const loadCustomMedia = (targetUrl?: string) => {
    const urlToLoad = targetUrl || videoUrl;
    if (!urlToLoad.trim()) {
      alert("يرجى إدخال رابط فيديو صحيح أولاً!");
      return;
    }
    const finalProxiedUrl = PROXY_URL + encodeURIComponent(urlToLoad.trim());
    setCurrentSrc(finalProxiedUrl);
    setShowPlaceholder(false);
    addSystemMessage(`تم بدء بث الفيديو عبر سيرفر البروكسي بنجاح.`);
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: 'النظام', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'system' }]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: userName,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user'
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const submitPrimeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass !== regPassConfirm) {
      alert("كلمتا المرور غير متطابقتين!");
      return;
    }
    setUserName(regName);
    alert(`مبروك يا ${regName}! تم تسجيل وتفعيل حساب Prime Video الخاص بك بنجاح.`);
    setIsRegisterOpen(false);
    addSystemMessage(`انضم المستخدم (${regName}) إلى الروم عبر حساب Prime Video رسمي.`);
  };

  return (
    <div className="bg-gray-950 text-gray-100 font-sans min-h-screen flex flex-col" dir="rtl">
      
      {/* الشريط العلوي الاحترافي */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="bg-gradient-to-tr from-indigo-600 to-pink-500 text-white p-2.5 rounded-2xl text-lg font-bold shadow-md">🎬</span>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400">
              شاهد معاً | Watch Party Pro
            </h1>
            <p className="text-xs text-gray-400">غرفة رقم: <span className="text-indigo-400 font-bold">{roomCode}</span></p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* مؤشر حالة البروكسي */}
          <div className="bg-gray-950 px-3 py-1.5 rounded-full text-xs text-green-400 border border-green-500/30 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span>البروكسي مستقر (PythonAnywhere)</span>
          </div>

          {/* زر تسجيل حساب Prime Video */}
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-gradient-to-r from-[#00A8E1] to-blue-700 hover:from-[#0091c4] hover:to-blue-800 text-white px-4 py-2 rounded-xl font-semibold text-xs transition shadow-lg flex items-center gap-2 transform active:scale-95"
          >
            <span>تسجيل حساب Prime Video</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* قسم المشغل ومصادر العرض (3 أعمدة) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* إدخال الرابط والتحكم السريع */}
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-md flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="الصق رابط الفيديو أو البث (سيتم توجيهه عبر البروكسي تلقائياً)..." 
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
            <button 
              onClick={() => loadCustomMedia()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>تشغيل عبر البروكسي</span>
            </button>
          </div>

          {/* مشغل الفيديو الجماعي */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
            <video 
              src={currentSrc} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
            {showPlaceholder && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-950/90 backdrop-blur-md p-6 text-center">
                <span className="text-5xl mb-3 animate-bounce">🍿</span>
                <h3 className="text-lg font-bold text-white mb-1">جاهز للمشاهدة الجماعية</h3>
                <p className="text-xs text-gray-400 max-w-md">أدخل رابط الفيديو في الحقل بالأعلى أو اختر عرضاً من قائمة الأعمال المقترحة أدناه لبدء البث الفوري مع أصدقائك.</p>
              </div>
            )}
          </div>

          {/* شريط مزامنة الغرفة وأعمال مقترحة */}
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSynced(!isSynced)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${isSynced ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}
              >
                {isSynced ? '✔ المزامنة الجماعية نشطة' : '✖ المزامنة متوقفة'}
              </button>
              <span className="text-xs text-gray-400">المشاهدون متصلون بغرفة العرض</span>
            </div>

            <div className="flex gap-2">
              <span className="text-xs text-gray-400 self-center">قوالب سريعة:</span>
              <button onClick={() => { setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); loadCustomMedia("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); }} className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg transition">بث تجريبي 1</button>
              <button onClick={() => { setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"); loadCustomMedia("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"); }} className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg transition">بث تجريبي 2</button>
            </div>
          </div>
        </div>

        {/* قسم الشات والتفاعل الحي (عمود واحد) */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[630px] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span>💬</span>
              <span>دردشة الروم الحية</span>
            </h3>
            <span className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">متصل: {userName}</span>
          </div>

          {/* قائمة الرسائل */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scroll-smooth">
            {messages.map((msg, idx) => (
              msg.type === 'system' ? (
                <div key={idx} className="self-center bg-indigo-500/10 text-indigo-300 text-[11px] px-3 py-1 rounded-lg border border-indigo-500/20 my-1 text-center">
                  {msg.text}
                </div>
              ) : (
                <div key={idx} className="flex flex-col items-start bg-gray-950/70 p-3 rounded-xl border border-gray-800/80 self-end w-full shadow-sm">
                  <div className="flex justify-between w-full text-[10px] text-gray-400 mb-1">
                    <span className="font-bold text-indigo-400">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-200 break-words">{msg.text}</p>
                </div>
              )
            ))}
          </div>

          {/* حقل كتابة وإرسال الرسائل */}
          <div className="p-3 border-t border-gray-800 bg-gray-950 flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="اكتب رسالة للجميع..." 
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={sendChatMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              إرسال
            </button>
          </div>
        </div>
      </main>

      {/* نافذة تسجيل حساب Prime Video المنبثقة */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsRegisterOpen(false)} 
              className="absolute top-4 left-4 text-gray-400 hover:text-white bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-2xl bg-[#00A8E1]/10 text-[#00A8E1] mb-2 text-3xl">
                📺
              </div>
              <h2 className="text-xl font-bold">إنشاء حساب Prime Video</h2>
              <p className="text-xs text-gray-400 mt-1">سجل حسابك لربط بيانات المشاهدة وتوثيق هويتك في الروم</p>
            </div>

            <form onSubmit={submitPrimeRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الاسم الكامل</label>
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="مثال: مصطفى عاشور" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#00A8E1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#00A8E1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">كلمة المرور</label>
                <input type="password" required minlength={6} value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="••••••••" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#00A8E1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">تأكيد كلمة المرور</label>
                <input type="password" required minlength={6} value={regPassConfirm} onChange={e => setRegPassConfirm(e.target.value)} placeholder="••••••••" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#00A8E1] focus:outline-none" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-[#00A8E1] hover:bg-[#0091c4] text-white py-3 rounded-xl font-bold text-sm transition shadow-lg">
                  إنشاء الحساب وبدء المشاهدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
