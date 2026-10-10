'use client'

import { useState, type FormEvent } from 'react'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  ExternalLink,
  Link2,
  LockKeyhole,
  Maximize2,
  Mic,
  MicOff,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Smile,
  UsersRound,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

type Message = { name: string; text: string; time: string; own?: boolean }

const initialMessages: Message[] = [
  { name: 'سارة', text: 'جاهزين؟ الفيلم شكله رهيب!', time: '9:41' },
  { name: 'أنت', text: 'دقيقة وأبدأ العرض', time: '9:42', own: true },
  { name: 'خالد', text: 'الصوت واضح عندكم؟', time: '9:42' },
]

const members = [
  { initials: 'أ', color: 'coral', name: 'أنت' },
  { initials: 'س', color: 'violet', name: 'سارة' },
  { initials: 'خ', color: 'blue', name: 'خالد' },
  { initials: 'ل', color: 'green', name: 'ليان' },
]

export function WatchRoom() {
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState('cinema.club/watch-together')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [canControl, setCanControl] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [roomCode, setRoomCode] = useState('NIGHT-2048')
  const [fullscreen, setFullscreen] = useState(false)

  function navigate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    const looksLikeAddress = /^(https?:\/\/)?(([\w-]+\.)+[\w-]{2,})/i.test(value)
    const nextAddress = looksLikeAddress
      ? value.replace(/^https?:\/\//i, '')
      : `google.com/search?q=${encodeURIComponent(value)}`
    setAddress(nextAddress)
    setNotice(looksLikeAddress
      ? 'قد يمنع هذا الموقع عرضه داخل الغرفة. افتحه في تبويب جديد إذا لم يظهر.'
      : 'البحث يفتح نتائج Google في تبويب جديد؛ مشاركة صفحة النتائج تحتاج دعمًا من الموقع.')
    setQuery('')
  }

  function openAddress() {
    const href = /^https?:\/\//i.test(address) ? address : `https://${address}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setNotice('رمز الغرفة: ' + roomCode)
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [...current, { name: 'أنت', text, time: 'الآن', own: true }])
    setDraft('')
  }

  function createRoom() {
    const nextCode = `NIGHT-${Math.floor(1000 + Math.random() * 9000)}`
    setRoomCode(nextCode)
    setNotice(`تم إنشاء غرفة مشاهدة جديدة: ${nextCode}`)
  }

  return (
    <main className="watch-app" dir="rtl">
      <header className="topbar">
        <a href="#home" className="brand" aria-label="سينما، الصفحة الرئيسية">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>سِينما<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-links">
          <a href="#rooms">الغرف</a>
          <a href="#how-it-works">كيف تعمل؟</a>
        </div>
        <button className="profile-button" aria-label="الملف الشخصي">أ</button>
      </header>

      <div className="page-wrap">
        <div className="room-heading">
          <div className="room-title-group">
            <a className="back-link" href="#rooms" aria-label="العودة إلى الغرف"><ArrowRight size={18} /></a>
            <div>
              <div className="eyebrow"><span className="live-dot" /> غرفة مشاهدة مباشرة</div>
              <h1>ليلة سينما مع الأصدقاء</h1>
            </div>
          </div>
          <div className="room-actions">
            <div className="people-stack" aria-label="4 أعضاء في الغرفة">
              {members.slice(0, 3).map((member) => (
                <span key={member.name} className={`avatar avatar-${member.color}`} title={member.name}>{member.initials}</span>
              ))}
              <span className="avatar avatar-count">+1</span>
            </div>
            <span className="member-count"><UsersRound size={15} /> 4</span>
            <button className="share-button" onClick={copyRoomCode}>
              {copied ? <Check size={15} /> : <Link2 size={15} />}
              {copied ? 'تم النسخ' : 'دعوة صديق'}
            </button>
            <button className="icon-button desktop-only" aria-label="إعدادات الغرفة"><MoreHorizontal size={19} /></button>
          </div>
        </div>

        <div className="room-layout">
          <section className={`watch-column ${fullscreen ? 'is-fullscreen' : ''}`} aria-label="مشغل المشاهدة">
            <div className="browser-shell">
              <div className="browser-topline">
                <div className="browser-dots" aria-hidden="true"><i /><i /><i /></div>
                <form className="address-form" onSubmit={navigate}>
                  <button className="address-open" type="button" onClick={openAddress} aria-label="فتح الموقع في تبويب جديد"><ExternalLink size={14} /></button>
                  <input aria-label="ابحث أو أدخل رابطًا" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن فيلم أو أدخل رابط موقع..." />
                  <button className="address-search" type="submit" aria-label="بحث"><Search size={16} /></button>
                </form>
                <button className="browser-settings" aria-label="إعدادات التصفح"><MoreHorizontal size={19} /></button>
              </div>
              <div className="browser-toolbar">
                <button aria-label="السابق" className="toolbar-icon"><ArrowRight size={15} /></button>
                <button aria-label="التالي" className="toolbar-icon disabled"><ArrowLeft size={15} /></button>
                <button aria-label="تحديث الصفحة" className="toolbar-icon" onClick={() => setNotice('تمت إعادة تحميل الصفحة المشتركة.') }><span className="refresh-glyph">↻</span></button>
                <div className="current-url"><LockKeyhole size={12} /> <span>{address}</span></div>
                <div className="sync-pill"><span className="sync-dot" /> متزامن</div>
              </div>

              <div className="cinema-stage">
                <div className="stage-image" />
                <div className="stage-shade" />
                <div className="stage-topline">
                  <span className="stage-label"><span className="stage-live" /> بث الغرفة</span>
                  <span className="stage-quality">HD <span>•</span> 1080p</span>
                </div>
                <div className="film-info">
                  <span className="film-kicker">عرض الليلة · 2025</span>
                  <h2>ما وراء الأفق</h2>
                  <p>حين ينطفئ العالم، تبدأ الحكاية.</p>
                  <div className="film-meta"><span>خيال علمي</span><span>١ ساعة و٤٨ دقيقة</span><span className="rating">★ ٨٫٧</span></div>
                </div>
                <button className="big-play" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل العرض'}>
                  {isPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
                </button>
                <button className="stage-fullscreen" onClick={() => setFullscreen((value) => !value)} aria-label={fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}><Maximize2 size={16} /></button>
                <div className="stage-bottom">
                  <div className="video-controls">
                    <button onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}>{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
                    <button aria-label="الرجوع 10 ثوانٍ"><SkipBack size={16} /></button>
                    <button aria-label="التقدم 10 ثوانٍ"><SkipForward size={16} /></button>
                    <button onClick={() => setIsMuted((muted) => !muted)} aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
                    <span className="timecode">{isPlaying ? '00:01' : '00:00'} <span>/ 1:48:32</span></span>
                  </div>
                  <span className="playback-sync"><span className="sync-dot" /> تحكم المضيف</span>
                </div>
                <div className="progress-track"><span className={isPlaying ? 'progress-fill playing' : 'progress-fill'} /></div>
              </div>

              <div className="browser-footnote">
                <ShieldCheck size={14} />
                <span>المزامنة الحقيقية تعمل مع مشغلات الفيديو المعتمدة، وليست مع أي صفحة ويب عشوائية.</span>
                <button onClick={() => setNotice('لا تسمح المتصفحات للمواقع بقراءة أو التحكم بفيديو داخل نطاق آخر. استخدم مشغلًا معتمدًا أو رابط فيديو مباشر.') } aria-label="معلومات حول توافق الفيديو"><CircleHelp size={15} /></button>
              </div>
            </div>

            <div className="below-stage">
              <div className="now-playing">
                <div className="mini-poster" />
                <div><span className="muted-label">يشاهده الجميع الآن</span><strong>ما وراء الأفق <span className="playing-indicator">●</span></strong></div>
              </div>
              <div className="control-permission">
                <span className="muted-label">صلاحية التصفح</span>
                <button className="permission-select" onClick={() => setCanControl((value) => !value)}>
                  {canControl ? <UsersRound size={14} /> : <LockKeyhole size={14} />}
                  {canControl ? 'الجميع' : 'المضيف فقط'}
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </section>

          <aside className="chat-panel" aria-label="دردشة الغرفة">
            <div className="chat-header">
              <div><h2>الدردشة</h2><span className="chat-online"><span className="live-dot" /> 4 متصلين</span></div>
              <button className="icon-button" aria-label="إعدادات الدردشة"><Settings2 size={17} /></button>
            </div>
            <div className="voice-card">
              <div className="voice-card-top"><div className="voice-icon"><Mic size={16} /></div><div><strong>المحادثة الصوتية</strong><span>تحدثوا أثناء المشاهدة</span></div><span className="voice-status">تجريبي</span></div>
              <button className={`voice-join ${isMicOn ? 'voice-active' : ''}`} onClick={() => setIsMicOn((value) => !value)}>
                {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
                {isMicOn ? 'الميكروفون مفعّل محليًا' : 'تفعيل الميكروفون'}
              </button>
              <span className="voice-caption">الاتصال الصوتي الفعلي يحتاج إعداد WebRTC.</span>
            </div>
            <div className="chat-divider"><span>الآن</span></div>
            <div className="messages-list" aria-live="polite">
              {messages.map((message, index) => (
                <div className={`message-row ${message.own ? 'own-message' : ''}`} key={`${message.name}-${index}`}>
                  {!message.own && <span className={`message-avatar avatar-${message.name === 'سارة' ? 'violet' : 'blue'}`}>{message.name.slice(0, 1)}</span>}
                  <div className="message-content"><div className="message-meta"><strong>{message.own ? 'أنت' : message.name}</strong><time>{message.time}</time></div><p>{message.text}</p></div>
                </div>
              ))}
              <div className="typing-state"><span><i /><i /><i /></span> ليان تكتب...</div>
            </div>
            <form className="chat-composer" onSubmit={sendMessage}>
              <input aria-label="اكتب رسالة" placeholder="اكتب رسالة..." value={draft} onChange={(event) => setDraft(event.target.value)} />
              <button type="button" className="emoji-button" aria-label="إضافة تعبير" onClick={() => setDraft((value) => `${value} ✨`)}><Smile size={17} /></button>
              <button type="submit" className="send-button" aria-label="إرسال الرسالة"><Send size={15} /></button>
            </form>
            <div className="chat-foot"><LockKeyhole size={12} /> رسائل الغرفة للأعضاء فقط</div>
          </aside>
        </div>

        <div className="room-footer">
          <div className="room-code"><span className="code-icon"><LockKeyhole size={14} /></span><span><small>رمز الغرفة</small><strong>{roomCode}</strong></span><button onClick={copyRoomCode} aria-label="نسخ رمز الغرفة">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
          <div className="footer-note"><span className="footer-pulse" /> كل ثانية أجمل معًا</div>
          <button className="create-room" onClick={createRoom}><Plus size={15} /> غرفة جديدة</button>
        </div>
      </div>

      {notice && <div className="notice" role="status"><span>{notice}</span><button aria-label="إغلاق التنبيه" onClick={() => setNotice('')}><X size={15} /></button></div>}
      <span className="sr-only"><ArrowDownToLine /> واجهة تجريبية لغرفة مشاهدة متزامنة</span>
    </main>
  )
}

export default WatchRoom
