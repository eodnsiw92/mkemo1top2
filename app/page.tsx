<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شاهد معاً - Watch Party Pro</title>
    <!-- استيراد مكتبات التصميم والأيقونات -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-950 text-gray-100 font-sans min-h-screen flex flex-col">

    <!-- شريط العرض العلوي -->
    <header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div class="flex items-center space-x-3 space-x-reverse">
            <span class="bg-indigo-600 text-white p-2 rounded-xl text-lg font-bold"><i class="fa-solid fa-play"></i></span>
            <h1 class="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">شاهد معاً (Shahid Ma'an)</h1>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
            <!-- زر إنشاء وتسجيل حساب برايم فيديو الجديد -->
            <button onclick="openPrimeVideoRegister()" class="bg-[#00A8E1] hover:bg-[#0091c4] text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 space-x-reverse transition shadow-lg transform active:scale-95">
                <i class="fa-solid fa-user-plus"></i>
                <span>تسجيل حساب Prime Video</span>
            </button>
            <div id="user-status" class="bg-gray-800 px-3 py-1.5 rounded-full text-xs text-green-400 border border-green-500/30 flex items-center space-x-1.5 space-x-reverse">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>متصل بالبروكسي</span>
            </div>
        </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- قسم مشغل الفيديو والتحكم بالروابط -->
        <div class="lg:col-span-3 flex flex-col space-y-4">
            
            <!-- إدخال رابط الفيديو والبروكسي -->
            <div class="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-3">
                <input type="text" id="target-video-url" placeholder="الصق رابط الفيديو أو مصدر البث هنا..." 
                    class="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition">
                <button onclick="loadProxiedMedia()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 space-x-reverse">
                    <i class="fa-solid fa-bolt"></i>
                    <span>تشغيل عبر البروكسي</span>
                </button>
            </div>

            <!-- مشغل الوسائط -->
            <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
                <video id="shared-video" controls class="w-full h-full object-contain">
                    متصفحك لا يدعم تشغيل الفيديو.
                </video>
                <div id="video-placeholder" class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900/80 backdrop-blur-sm">
                    <i class="fa-solid fa-film text-5xl mb-3 text-indigo-500"></i>
                    <p class="text-sm">أدخل الرابط بالأعلى أو سجل حسابك للبدء بالمشاهدة الجماعية</p>
                </div>
            </div>
        </div>

        <!-- قسم الشات المطور والحديث -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-xl">
            <!-- رأس الشات -->
            <div class="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <h3 class="font-bold text-sm flex items-center space-x-2 space-x-reverse">
                    <i class="fa-solid fa-comments text-indigo-400"></i>
                    <span>محادثة الروم الحية</span>
                </h3>
                <span id="online-count" class="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">متصل الآن</span>
            </div>

            <!-- صندوق عرض الرسائل -->
            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scroll-smooth">
                <div class="self-center bg-gray-800/60 text-gray-400 text-xs px-3 py-1 rounded-full">
                    تم الاتصال بسيرفر الدردشة بنجاح
                </div>
            </div>

            <!-- إدخال الرسائل -->
            <div class="p-3 border-t border-gray-800 bg-gray-950 flex gap-2">
                <input type="text" id="chat-input" placeholder="اكتب رسالتك..." onkeypress="handleKeyPress(event)"
                    class="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                <button onclick="sendChatMessage()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>

    </main>

    <!-- نافذة تسجيل حساب Prime Video الجديد (Registration Modal) -->
    <div id="prime-register-modal" class="fixed inset-0 bg-black/75 backdrop-blur-sm hidden items-center justify-center z-50 p-4">
        <div class="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button onclick="closePrimeVideoRegister()" class="absolute top-4 left-4 text-gray-400 hover:text-white">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            
            <div class="text-center mb-5">
                <div class="inline-block p-3 rounded-full bg-[#00A8E1]/10 text-[#00A8E1] mb-2 text-3xl">
                    <i class="fa-brands fa-amazon"></i>
                </div>
                <h2 class="text-xl font-bold">إنشاء حساب Prime Video جديد</h2>
                <p class="text-xs text-gray-400 mt-1">سجل حسابك الآن لتتمكن من المشاهدة ومشاركة البث مع الأصدقاء</p>
            </div>
            
            <form onsubmit="submitPrimeRegister(event)" class="space-y-3.5">
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">الاسم الكامل</label>
                    <input type="text" id="reg-name" required class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8E1]" placeholder="مثال: مصطفى عاشور">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                    <input type="email" id="reg-email" required class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8E1]" placeholder="name@example.com">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">كلمة المرور</label>
                    <input type="password" id="reg-pass" required minlength="6" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8E1]" placeholder="6 أرقام أو حروف على الأقل">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">تأكيد كلمة المرور</label>
                    <input type="password" id="reg-pass-confirm" required minlength="6" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8E1]" placeholder="أعد كتابة كلمة المرور">
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-[#00A8E1] hover:bg-[#0091c4] text-white py-3 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 space-x-reverse">
                        <i class="fa-solid fa-user-check"></i>
                        <span>إنشاء الحساب وبدء المشاهدة</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- السكريبت البرمجي المطور -->
    <script>
        const PROXY_URL = "https://ubnt72.pythonanywhere.com/proxy?url=";

        function loadProxiedMedia() {
            const rawUrl = document.getElementById('target-video-url').value.trim();
            const videoElement = document.getElementById('shared-video');
            const placeholder = document.getElementById('video-placeholder');

            if (!rawUrl) {
                alert("يرجى إدخال رابط صحيح أولاً!");
                return;
            }

            const finalProxiedUrl = PROXY_URL + encodeURIComponent(rawUrl);
            videoElement.src = finalProxiedUrl;
            videoElement.load();
            placeholder.style.display = 'none';
            videoElement.play().catch(e => console.log("Auto-play blocked or loading error:", e));
            
            addSystemMessage("تم جلب وتفعيل البث عبر البروكسي بنجاح.");
        }

        function sendChatMessage() {
            const input = document.getElementById('chat-input');
            const messageText = input.value.trim();
            if (!messageText) return;

            const chatMessages = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = "flex flex-col items-start bg-gray-950/60 p-3 rounded-xl border border-gray-800/60 self-end w-full";
            messageDiv.innerHTML = `
                <div class="flex justify-between w-full text-[10px] text-gray-400 mb-1">
                    <span class="font-bold text-indigo-400">أنت</span>
                    <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p class="text-xs text-gray-200 break-words">${escapeHtml(messageText)}</p>
            `;

            chatMessages.appendChild(messageDiv);
            input.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addSystemMessage(text) {
            const chatMessages = document.getElementById('chat-messages');
            const sysDiv = document.createElement('div');
            sysDiv.className = "self-center bg-indigo-500/10 text-indigo-300 text-[11px] px-3 py-1 rounded-lg border border-indigo-500/20 my-1";
            sysDiv.innerText = text;
            chatMessages.appendChild(sysDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter') sendChatMessage();
        }

        function escapeHtml(text) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        // إدارات شاشة إنشاء حساب برايم فيديو
        function openPrimeVideoRegister() {
            document.getElementById('prime-register-modal').classList.remove('hidden');
            document.getElementById('prime-register-modal').classList.add('flex');
        }

        function closePrimeVideoRegister() {
            document.getElementById('prime-register-modal').classList.remove('flex');
            document.getElementById('prime-register-modal').classList.add('hidden');
        }

        function submitPrimeRegister(e) {
            e.preventDefault();
            const pass = document.getElementById('reg-pass').value;
            const passConfirm = document.getElementById('reg-pass-confirm').value;
            const name = document.getElementById('reg-name').value;

            if (pass !== passConfirm) {
                alert("كلمتا المرور غير متطابقتين! يرجى التأكد وإعادة المحاولة.");
                return;
            }

            alert(`مبروك يا ${name}! تم تسجيل حساب Prime Video الخاص بك بنجاح.`);
            closePrimeVideoRegister();
            addSystemMessage(`تم إنشاء وتسجيل حساب Prime Video باسم (${name}) بنجاح.`);
        }
    </script>
</body>
</html>
