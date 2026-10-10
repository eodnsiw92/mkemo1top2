'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Globe2,
  Heart,
  ImagePlus,
  Link2,
  LockKeyhole,
  Languages,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Smile,
  UsersRound,
  Volume2,
  X,
} from 'lucide-react'
import { MediaStage } from '@/components/media-stage'
import { RoomChatPanel } from '@/components/room-chat-panel'
import { ProfilePanel } from '@/components/profile-panel'
import { CountryName } from '@/components/country-name'
import { splitCountryFlag } from '@/lib/country'
import { RoomDiscovery } from '@/components/room-discovery'
import { MediaSearchHub } from '@/components/media-search-hub'
import { YouTubeSearchBrowser, type YouTubeSearchResult } from '@/components/youtube-search-browser'
import { useRoomFeed } from '@/lib/room-feed'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getPlayableSource } from '@/lib/media-url'

type Panel = 'people' | 'chat' | 'sources' | null


const services = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']

export function WatchRoom() {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('YouTube')
  const [mediaUrl, setMediaUrl] = useState('')
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [panel, setPanel] = useState<Panel>(null)
  const [view, setView] = useState<'home' | 'room' | 'profile' | 'search' | 'youtube-browser'>('search')
  const [locale, setLocale] = useState<'ar' | 'en'>('ar')
  const [mediaSearchQuery, setMediaSearchQuery] = useState('')
  const [mediaTitle, setMediaTitle] = useState<{ url: string; title: string } | null>(null)
  const [roomPublic, setRoomPublic] = useState(false)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [activeInviteToken, setActiveInviteToken] = useState('')
  const [pendingInvite, setPendingInvite] = useState<{ roomId: string; inviteToken: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [posts, setPosts] = useState<string[]>([])
  const [saved, setSaved] = useState(true)
  const appliedPlaybackRef = useRef('')
  const playbackUpdateTimeRef = useRef(0)
  const initialInviteHandledRef = useRef(false)
  const { data: roomFeed, mutate: refreshRoomFeed } = useRoomFeed(activeRoomId)
  const messages = roomFeed?.messages ?? []
  const members = roomFeed?.members ?? []
  const isRoomHost = Boolean(roomFeed?.members.some((member) => member.guestId === roomFeed.currentGuestId && member.isHost))
  const roomTitle = roomFeed?.room.title && roomFeed.room.title !== 'Watch together'
    ? roomFeed.room.title
    : locale === 'ar' ? 'غرفة مشاهدة' : 'Watch together'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    const url = new URL(window.location.href)
    const roomId = url.searchParams.get('room')
    if (roomId) {
      setPendingInvite({ roomId, inviteToken: url.searchParams.get('invite') ?? '' })
      if (!initialInviteHandledRef.current) {
        initialInviteHandledRef.current = true
        setView('home')
      }
    }
    const searchState = url.searchParams.get('search')
    if (searchState === 'blocked') setNotice(locale === 'ar' ? 'البحث عن المحتوى الإباحي غير مسموح.' : 'Pornographic searches are not allowed.')
    if (searchState === 'invalid') setNotice(locale === 'ar' ? 'اكتب عنوان فيديو صحيحًا.' : 'Enter a valid video title.')
    if (searchState) {
      url.searchParams.delete('search')
      window.history.replaceState({}, '', url)
    }
  }, [locale])

  useEffect(() => {
    if (!activeRoomId) return
    const leaveRoom = () => { void fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, { method: 'DELETE', keepalive: true }) }
    window.addEventListener('pagehide', leaveRoom)
    return () => window.removeEventListener('pagehide', leaveRoom)
  }, [activeRoomId])

  useEffect(() => {
    const shared = roomFeed?.room
    if (!activeRoomId || !shared) return
    if (!shared.mediaUrl) {
      const emptyPlaybackKey = `${activeRoomId}:empty:${shared.playbackUpdatedAt}`
      if (appliedPlaybackRef.current === emptyPlaybackKey) return
      setMediaUrl('')
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource(shared.source)
      appliedPlaybackRef.current = emptyPlaybackKey
      return
    }
    const playbackKey = `${activeRoomId}:${shared.mediaUrl}:${shared.playbackUpdatedAt}`
    if (appliedPlaybackRef.current === playbackKey) return
    const playable = getPlayableSource(shared.mediaUrl)
    if (!playable) return
    setMediaUrl(playable.url)
    setSource(playable.label)
    const elapsedSeconds = shared.isPlaying ? Math.max(0, (Date.now() - new Date(shared.playbackUpdatedAt).getTime()) / 1000) : 0
    setTime(Math.floor(shared.playbackPosition + elapsedSeconds))
    setPlaying(shared.isPlaying)
    appliedPlaybackRef.current = playbackKey
  }, [activeRoomId, roomFeed?.room.mediaUrl, roomFeed?.room.source, roomFeed?.room.playbackPosition, roomFeed?.room.isPlaying, roomFeed?.room.playbackUpdatedAt])

  function showNotice(text: string) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 3200)
  }

  async function enterRoom(roomId: string, inviteToken = '') {
    const response = await fetch(`/api/rooms/${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteToken }),
    })
    const result = await response.json()
    if (!response.ok) {
      showNotice(result.error || 'Unable to join this room.')
      return
    }
    if (activeRoomId && activeRoomId !== roomId) await fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, { method: 'DELETE' })
    setActiveRoomId(roomId)
    setActiveInviteToken(inviteToken)
    setRoomPublic(result.room.isPublic)
    setSource(result.room.source)
    setView('room')
    setPanel(null)
    setPendingInvite(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('room')
    url.searchParams.delete('invite')
    window.history.replaceState({}, '', url)
    showNotice(locale === 'ar' ? 'انضممت إلى الغرفة.' : 'You joined the room.')
  }

  async function createRoom(roomSource: string, isPublic: boolean): Promise<string | null> {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: roomSource, isPublic }),
    })
    const result = await response.json()
    if (!response.ok) {
      showNotice(result.error || 'Unable to create this room.')
      return null
    }
    setActiveRoomId(result.room.id)
    setActiveInviteToken(result.inviteToken)
    setRoomPublic(result.room.isPublic)
    setSource(result.room.source)
    setView('room')
    setPanel(null)
    showNotice(locale === 'ar' ? 'تم إنشاء الغرفة.' : 'Your room is ready.')
    return result.room.id as string
  }

  function leaveActiveRoom() {
    if (activeRoomId) void fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, { method: 'DELETE', keepalive: true })
    setActiveRoomId(null)
    setActiveInviteToken('')
    setPanel(null)
    setView('search')
  }

  async function toggleRoomVisibility() {
    if (!activeRoomId || !roomFeed?.members.some((member) => member.guestId === roomFeed.currentGuestId && member.isHost)) {
      showNotice(locale === 'ar' ? 'يمكن لمضيف الغرفة فقط تغيير ظهورها.' : 'Only the room host can change its visibility.')
      return
    }
    const nextValue = !roomPublic
    const response = await fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: nextValue }),
    })
    const result = await response.json()
    if (!response.ok) {
      showNotice(result.error || 'Room settings could not be updated.')
      return
    }
    setRoomPublic(nextValue)
    await refreshRoomFeed()
    showNotice(nextValue ? (locale === 'ar' ? 'أصبحت الغرفة عامة.' : 'Room is now public.') : (locale === 'ar' ? 'أصبحت الغرفة خاصة.' : 'Room is now private.'))
  }

  async function updateSharedPlayback(mediaUrl: string | null, position: number, isPlaying: boolean) {
    if (!activeRoomId || !isRoomHost) return
    const response = await fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playback: { mediaUrl, position, isPlaying } }),
    })
    if (!response.ok) {
      const result = await response.json()
      showNotice(result.error || 'Shared playback could not be updated.')
      return
    }
    await refreshRoomFeed()
  }

  function toggleSharedPlayback() {
    if (!isRoomHost) {
      showNotice(locale === 'ar' ? 'مضيف الغرفة فقط يتحكم بالتشغيل.' : 'Only the room host can control playback.')
      return
    }
    if (!roomFeed?.room.mediaUrl) {
      showNotice(locale === 'ar' ? 'ابحث عن رابط فيديو قابل للتضمين أولًا.' : 'Load a supported video link first.')
      return
    }
    const nextPlaying = !playing
    setPlaying(nextPlaying)
    void updateSharedPlayback(roomFeed.room.mediaUrl, time, nextPlaying)
  }

  function handlePlayerPlaybackStateChange(nextPlaying: boolean) {
    if (playing === nextPlaying) return
    setPlaying(nextPlaying)
    if (isRoomHost && roomFeed?.room.mediaUrl) void updateSharedPlayback(roomFeed.room.mediaUrl, time, nextPlaying)
  }

  function seekSharedPlayback(nextTime: number) {
    setTime(nextTime)
    if (!activeRoomId || !isRoomHost || !roomFeed?.room.mediaUrl) return
    const now = Date.now()
    if (now - playbackUpdateTimeRef.current < 2500) return
    playbackUpdateTimeRef.current = now
    void updateSharedPlayback(roomFeed.room.mediaUrl, nextTime, playing)
  }

  function commitSharedSeek(nextTime: number) {
    setTime(nextTime)
    if (!activeRoomId || !isRoomHost || !roomFeed?.room.mediaUrl) return
    playbackUpdateTimeRef.current = Date.now()
    void updateSharedPlayback(roomFeed.room.mediaUrl, nextTime, playing)
  }

  function openMediaSearch(initialQuery = '') {
    setMediaSearchQuery(initialQuery)
    setView('search')
  }

  function openYouTubeSearch(searchQuery = '') {
    const value = searchQuery.trim()
    if (value && containsProhibitedSearch(value)) {
      showNotice(locale === 'ar' ? 'البحث عن هذا المحتوى غير مسموح.' : 'This search is not allowed.')
      return
    }
    setMediaSearchQuery(value)
    setView('youtube-browser')
  }

  function openPlatformSearch(service: string, searchQuery: string) {
    if (service === 'Likes') {
      setView('profile')
      return
    }
    if (service === 'YouTube') {
      openYouTubeSearch(searchQuery)
      return
    }
    const params = new URLSearchParams({ source: service })
    if (searchQuery) params.set('query', searchQuery)
    window.open(`/api/search?${params.toString()}`, '_blank', 'noopener,noreferrer')
  }

  function submitMediaSearch(searchQuery: string) {
    openYouTubeSearch(searchQuery)
  }

  async function selectYouTubeResult(video: YouTubeSearchResult) {
    const playable = getPlayableSource(`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`)
    if (!playable || playable.kind !== 'youtube') {
      showNotice(locale === 'ar' ? 'تعذّر تشغيل هذا الفيديو.' : 'This video could not be played.')
      return
    }
    if (activeRoomId && !isRoomHost) {
      showNotice(locale === 'ar' ? 'مضيف الغرفة فقط يستطيع اختيار فيديو جديد.' : 'Only the room host can choose a new video.')
      return
    }

    const isCreatingRoom = !activeRoomId
    try {
      const roomId = activeRoomId ?? await createRoom('YouTube', false)
      if (!roomId) return

      setMediaUrl(playable.url)
      setMediaTitle({ url: playable.url, title: video.title })
      setTime(0)
      setDuration(0)
      setPlaying(true)
      setSource('YouTube')
      setQuery('')
      setView('room')

      const response = await fetch(`/api/rooms/${encodeURIComponent(roomId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playback: { mediaUrl: playable.url, position: 0, isPlaying: true } }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setPlaying(false)
        showNotice(result.error || 'Shared playback could not be updated.')
        return
      }
      if (!isCreatingRoom) await refreshRoomFeed()
      showNotice(locale === 'ar' ? 'يتم الآن تشغيل الفيديو داخل الغرفة.' : 'The video is now playing in your room.')
    } catch {
      setPlaying(false)
      showNotice(locale === 'ar' ? 'تعذّر تحميل الفيديو في الغرفة. حاول مرة أخرى.' : 'The video could not be loaded into the room. Try again.')
    }
  }

  function openSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    if (containsProhibitedSearch(value)) {
      showNotice(locale === 'ar' ? 'البحث أو الروابط الإباحية غير مسموحة.' : 'Pornographic searches and links are not allowed.')
      setQuery('')
      return
    }

    const isAddress = /^https?:\/\//i.test(value) || /^([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value)
    if (isAddress) {
      const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
      const playable = getPlayableSource(candidate)
      if (!playable) {
        showNotice(locale === 'ar' ? 'استخدم رابط HTTPS صالحًا لمنصة أو ملف وسائط عام.' : 'Use a valid HTTPS link to a public media file or platform.')
        return
      }
      setMediaUrl(playable.url)
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource(playable.label)
      void updateSharedPlayback(playable.url, 0, false)
      showNotice(locale === 'ar' ? 'تم تحميل الوسائط ومزامنتها للغرفة.' : 'Media loaded and synced to the room.')
    } else {
      const searchSource = source === 'Direct media' || source === 'External site' ? 'YouTube' : source
      if (searchSource === 'YouTube') {
        openYouTubeSearch(value)
      } else {
        window.open(`/api/search?source=${encodeURIComponent(searchSource)}&query=${encodeURIComponent(value)}`, '_blank', 'noopener,noreferrer')
        showNotice(locale === 'ar'
          ? `يفتح ${searchSource} موقعه الرسمي. تبقى المشاهدة المحمية لدى المنصة.`
          : `${searchSource} opens on its official site. Protected playback stays with the provider.`)
      }
    }
    setQuery('')
  }

  async function shareRoom() {
    if (!activeRoomId) {
      showNotice(locale === 'ar' ? 'أنشئ غرفة أولًا لإرسال الدعوة.' : 'Create or join a room before sharing an invite.')
      return
    }
    let inviteToken = activeInviteToken
    if (!roomPublic && !inviteToken) {
      const response = await fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}/invite`, { method: 'POST' })
      const result = await response.json()
      if (!response.ok) {
        showNotice(result.error || 'Unable to create an invite link.')
        return
      }
      inviteToken = result.inviteToken
      setActiveInviteToken(inviteToken)
    }
    const inviteUrl = new URL('/', window.location.origin)
    inviteUrl.searchParams.set('room', activeRoomId)
    if (!roomPublic && inviteToken) inviteUrl.searchParams.set('invite', inviteToken)
    try {
      await navigator.clipboard.writeText(inviteUrl.toString())
      setCopied(true)
      showNotice(locale === 'ar' ? 'تم نسخ رابط الدعوة.' : 'Room invite link copied.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      showNotice(locale === 'ar' ? `رمز الغرفة: ${activeRoomId.slice(0, 8).toUpperCase()}` : `Room code: ${activeRoomId.slice(0, 8).toUpperCase()}`)
    }
  }

  function selectPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!supportedTypes.includes(file.type)) {
      showNotice(locale === 'ar' ? 'اختار صورة بصيغة JPG أو PNG أو GIF.' : 'Choose a JPG, PNG, WebP, or GIF image.')
      event.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotice(locale === 'ar' ? 'حجم الصورة لازم يكون أقل من 10 ميجابايت.' : 'Choose an image smaller than 10 MB.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setProfileImage(reader.result)
      setPosts((items) => [reader.result as string, ...items])
      setView('profile')
      showNotice(locale === 'ar' ? 'اتضافت صورتك للمعاينة. صور GIF المتحركة مدعومة.' : 'Your photo was added to the preview. Animated GIFs are supported.')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function togglePanel(next: Panel) {
    setPanel((current) => current === next ? null : next)
  }

  const roomPanel = (
    <aside className={`room-panel${panel ? ' room-panel-open' : ''}`} aria-label={locale === 'ar' ? 'نشاط الغرفة' : 'Room activity'}>
      <div className="panel-tabs" role="tablist" aria-label={locale === 'ar' ? 'لوحات الغرفة' : 'Room panels'}>
        <button type="button" role="tab" aria-selected={panel === 'people'} className={panel === 'people' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('people')}><UsersRound size={15} /> {locale === 'ar' ? 'الأشخاص' : 'People'} <span>{members.length}</span></button>
        <button type="button" role="tab" aria-selected={panel === 'chat'} className={panel === 'chat' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('chat')}><MessageCircle size={15} /> {locale === 'ar' ? 'الدردشة' : 'Chat'} <span>{messages.length}</span></button>
        <button className="panel-close" type="button" aria-label={locale === 'ar' ? 'إغلاق لوحة الغرفة' : 'Close room panel'} onClick={() => setPanel(null)}><X size={16} /></button>
      </div>

      {(panel === 'people' || panel === null) && <div className="people-panel">
        <div className="panel-summary"><div><strong>{locale === 'ar' ? 'الموجودون في الغرفة' : 'In the room'}</strong><span>{locale === 'ar' ? 'شاهدوا وتحدثوا سوا.' : 'Watch and chat together.'}</span></div><button type="button" className="panel-add" aria-label={locale === 'ar' ? 'دعوة صديق' : 'Invite a friend'} onClick={shareRoom}><Plus size={17} /></button></div>
        <div className="member-list">{members.map((member, index) => <article className="member-row" key={member.guestId}>
          <span className={`member-avatar avatar-${['lilac', 'blue', 'peach', 'mint'][index % 4]}`}>{splitCountryFlag(member.displayName).displayName.slice(0, 1)}<i><UsersRound size={9} /></i></span>
          <span className="member-details"><strong><CountryName name={member.displayName} />{member.isHost && <span className="host-tag">{locale === 'ar' ? 'المضيف' : 'HOST'}</span>}</strong><small>{locale === 'ar' ? 'عضو في الغرفة' : 'Room member'}</small><small className="member-state"><UsersRound size={12} /> {locale === 'ar' ? 'متصل الآن' : 'Here now'}</small></span>
          <span className="member-online" aria-label={locale === 'ar' ? 'متصل' : 'Online'} />
        </article>)}</div>
        <button className="invite-wide" type="button" onClick={shareRoom}><Link2 size={15} /> {locale === 'ar' ? 'ادعوا أصحابكم' : 'Invite friends'} <span>{activeRoomId?.slice(0, 8).toUpperCase()}</span></button>
        <p className="preview-caption"><ShieldCheck size={13} /> {locale === 'ar' ? 'ظهورك كضيف. رابط الغرفة الخاصة متاح فقط لمن يحمل الدعوة.' : 'You appear as a guest. Private rooms are available only through their invite link.'}</p>
      </div>}

      {panel === 'chat' && activeRoomId && <RoomChatPanel roomId={activeRoomId} locale={locale} feed={roomFeed} onRefresh={() => { void refreshRoomFeed() }} onNotice={showNotice} />}

      {panel === 'sources' && <div className="sources-panel"><div className="panel-summary"><div><strong>{locale === 'ar' ? 'اختر منصة' : 'Choose a source'}</strong><span>{locale === 'ar' ? 'ابحث في منصاتك المفضلة.' : 'Search across your favorite places.'}</span></div></div>{services.map((serviceName) => <button className={`source-choice${source === serviceName ? ' chosen' : ''}`} key={serviceName} type="button" onClick={() => { setSource(serviceName); setPanel(null); showNotice(serviceName === 'YouTube' ? (locale === 'ar' ? 'ابحث في YouTube ثم الصق رابطًا قابلًا للتضمين لفتحه هنا.' : 'Search YouTube, then paste an embeddable link to load it here.') : (locale === 'ar' ? `يفتح ${serviceName} موقعه الرسمي. سجّل الدخول بحسابك هناك؛ لا يتحكم mkemo في المشاهدة المحمية.` : `${serviceName} opens on its official site. Sign in with your own account there; protected playback is not controlled by mkemo.`)) }}><span className="source-mark">{serviceName.slice(0, 1)}</span><strong>{serviceName}</strong>{source === serviceName && <Check size={16} />}</button>)}<div className="source-legal-note"><LockKeyhole size={14} /><span><strong>{locale === 'ar' ? 'استخدم اشتراكك الخاص' : 'Bring your own subscription'}</strong><small>{locale === 'ar' ? 'سجّل الدخول في الموقع الرسمي لكل منصة. mkemo لا يطلب كلمة مرورك ولا يشاركها.' : 'Sign in on each service’s official site. mkemo never asks for or shares your password.'}</small></span></div><p className="preview-caption"><ShieldCheck size={13} /> {locale === 'ar' ? 'المشاهدة المحمية تبقى لدى المنصة الأصلية.' : 'Protected playback stays with its provider.'}</p></div>}
    </aside>
  )

  return <main className="watch-app">
    {view !== 'home' && <header className="app-header">
      <button className="brand-mark" type="button" aria-label={locale === 'ar' ? 'الرئيسية mkemo' : 'mkemo home'} onClick={leaveActiveRoom}><span className="brand-glyph"><Play size={14} fill="currentColor" /></span><span>mkemo</span></button>
      <nav className="header-nav" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}><button className={view === 'room' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => { if (activeRoomId) setView('room'); else setView('home') }}><UsersRound size={15} /> {locale === 'ar' ? 'مشاهدة' : 'Watch'}</button><button className={view === 'search' || view === 'youtube-browser' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => openMediaSearch()}><Search size={15} /> {locale === 'ar' ? 'بحث' : 'Search'}</button><button className={view === 'profile' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => setView('profile')}><Heart size={15} /> {locale === 'ar' ? 'مساحتي' : 'My space'}</button></nav>
      <div className="header-actions"><button className="header-round" type="button" aria-label={locale === 'ar' ? 'فتح البحث' : 'Open search'} onClick={() => openMediaSearch()}><Search size={17} /></button><button className="header-round language-round" type="button" onClick={() => setLocale((current) => current === 'ar' ? 'en' : 'ar')} aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'} aria-pressed={locale === 'en'} title={locale === 'ar' ? 'English' : 'العربية'}><Languages size={16} /><span>{locale.toUpperCase()}</span></button><button className="account-trigger" type="button" onClick={() => setView('profile')} aria-label={locale === 'ar' ? 'افتح الملف الشخصي' : 'Open profile'}><span className="tiny-avatar avatar-mint">{profileImage ? <img src={profileImage} alt="" /> : 'M'}</span><span className="account-name">Morgan</span><ChevronDown size={14} /></button></div>
    </header>}

    {view === 'home' ? <RoomDiscovery locale={locale} onToggleLocale={() => setLocale((current) => current === 'ar' ? 'en' : 'ar')} onOpenProfile={() => setView('profile')} onOpenSearch={(searchQuery) => openMediaSearch(searchQuery)} onCreateRoom={(roomSource, isPublic) => createRoom(roomSource, isPublic).then(() => undefined)} onJoinRoom={enterRoom} onAcceptInvite={() => { if (pendingInvite) void enterRoom(pendingInvite.roomId, pendingInvite.inviteToken) }} hasInvite={Boolean(pendingInvite)} /> : view === 'search' ? <MediaSearchHub locale={locale} initialQuery={mediaSearchQuery} onBack={() => setView(activeRoomId ? 'room' : 'home')} onOpenHome={() => setView('home')} onOpenRoom={() => setView(activeRoomId ? 'room' : 'home')} onOpenProfile={() => setView('profile')} onSearch={submitMediaSearch} onSelectService={openPlatformSearch} /> : view === 'youtube-browser' ? <YouTubeSearchBrowser locale={locale} initialQuery={mediaSearchQuery} onBack={() => setView('search')} onPlay={(video) => void selectYouTubeResult(video)} /> : view === 'room' ? <>
      <div className="room-content">
        <section className="room-titlebar"><div><div className="room-kicker"><span className="live-pulse" /> {roomPublic ? (locale === 'ar' ? 'غرفة عامة' : 'PUBLIC ROOM') : (locale === 'ar' ? 'غرفة خاصة' : 'PRIVATE ROOM')} <span className="kicker-separator">/</span> {locale === 'ar' ? 'مشاهدة الليلة' : 'TONIGHT’S WATCH'}</div><h1>{roomTitle}</h1></div><div className="room-title-actions"><button className="privacy-toggle" type="button" onClick={() => void toggleRoomVisibility()} aria-label={locale === 'ar' ? 'تغيير ظهور الغرفة' : 'Change room visibility'}>{roomPublic ? <Globe2 size={14} /> : <LockKeyhole size={14} />}{roomPublic ? (locale === 'ar' ? 'عام' : 'Public') : (locale === 'ar' ? 'خاص' : 'Private')}<ChevronDown size={13} /></button><button className="invite-button" type="button" onClick={shareRoom}>{copied ? <Check size={15} /> : <Share2 size={15} />}<span>{copied ? (locale === 'ar' ? 'تم النسخ' : 'Copied') : (locale === 'ar' ? 'دعوة' : 'Invite')}</span></button></div></section>

        <form className="room-search" onSubmit={openSearch}><Search size={17} /><input id="room-search" aria-label={locale === 'ar' ? 'ابحث أو الصق رابط فيديو' : 'Search or paste a video link'} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === 'ar' ? 'ابحث عن فيديو أو الصق رابطه...' : 'Search a video or paste a link...'} /><span className="duration-hint">24h</span><button type="submit" aria-label={locale === 'ar' ? 'ابحث عن فيديوهات' : 'Search videos'}><Search size={16} /></button></form>
        <div className="search-footnote"><span>{locale === 'ar' ? `بحث ${source}` : `Search ${source}`}</span><button type="button" onClick={() => setPanel('sources')}><Globe2 size={13} /> {locale === 'ar' ? 'تصفح المنصات' : 'Browse sources'} <ChevronDown size={12} /></button><span className="supported-note"><ShieldCheck size={12} /> {locale === 'ar' ? '4K / 240fps عند الدعم · 24 ساعة' : '4K / 240fps when available · 24h'}</span></div>

        <div className="room-grid">
          <section className="watch-column" aria-label={locale === 'ar' ? 'مشاهدة معًا' : 'Watch together'}>
            <MediaStage isPlaying={playing} isMuted={muted} controlsEnabled={isRoomHost} currentTime={time} duration={duration} activeSource={source} mediaUrl={mediaUrl} locale={locale} onTogglePlay={toggleSharedPlayback} onToggleMute={() => setMuted((value) => !value)} onPlaybackStateChange={handlePlayerPlaybackStateChange} onSeek={setTime} onCommitSeek={commitSharedSeek} onProgress={seekSharedPlayback} onDurationChange={setDuration} onNotice={showNotice} />
            <p className="rights-note"><ShieldCheck size={13} /> {locale === 'ar' ? 'استخدم اشتراكك الخاص. تبقى الأفلام المحمية في مشغل المنصة؛ لا يشارك mkemo بيانات الدخول ولا يتجاوز DRM.' : "Use your own subscription. Protected movies stay in the provider's player; mkemo never shares credentials or bypasses DRM."}</p>
            <div className="media-caption"><div className="media-caption-art"><img src="/cinema-still.png" alt="" /></div><div className="media-caption-copy"><span>{locale === 'ar' ? 'يُعرض في الغرفة' : 'NOW IN THE ROOM'} <i /> {locale === 'ar' ? 'معاينة أصلية' : 'ORIGINAL PREVIEW'}</span><strong>{mediaUrl ? (mediaTitle?.url === mediaUrl ? mediaTitle.title : roomTitle) : (locale === 'ar' ? 'حمّل فيديو لعرض اسمه هنا' : 'Load a video to see its title here')}</strong><small>{source} <span>·</span> {locale === 'ar' ? 'مناسب للمشاهدة الطويلة' : 'Long-form friendly'}</small></div><button className={`save-button${saved ? ' is-saved' : ''}`} type="button" aria-label={saved ? (locale === 'ar' ? 'إزالة من المحفوظات' : 'Remove from saved') : (locale === 'ar' ? 'حفظ هذا الفيديو' : 'Save this video')} onClick={() => { setSaved((value) => !value); showNotice(saved ? (locale === 'ar' ? 'أُزيل من محفوظاتك.' : 'Removed from your saved list.') : (locale === 'ar' ? 'حُفظ في مساحتك على mkemo.' : 'Saved to your mkemo space.')) }}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? (locale === 'ar' ? 'محفوظ' : 'Saved') : (locale === 'ar' ? 'حفظ' : 'Save')}</span></button></div>
            <div className="member-peek"><div className="peek-avatars">{members.slice(0, 4).map((member, index) => <span key={member.guestId} className={`peek-avatar avatar-${['lilac', 'blue', 'peach', 'mint'][index % 4]}`} title={member.displayName}>{member.displayName.slice(0, 1)}</span>)}</div><button type="button" onClick={() => setPanel('people')}><strong>{new Intl.NumberFormat(locale).format(members.length)} {locale === 'ar' ? 'أشخاص' : 'people'}</strong><span>{locale === 'ar' ? 'يشاهدون معك الآن' : 'watching with you now'}</span></button><button type="button" className="peek-more" onClick={() => setPanel('people')} aria-label={locale === 'ar' ? 'عرض الجميع' : 'Show everyone'}><MoreHorizontal size={18} /></button></div>
            <div className="control-row" aria-label={locale === 'ar' ? 'عناصر التحكم بالغرفة' : 'Room controls'}><button className="control-item" type="button" onClick={() => showNotice(locale === 'ar' ? 'المحادثة الصوتية الجماعية غير مفعلة. الميكروفون مغلق.' : 'Group voice is not enabled. Your microphone stays off.')} aria-label={locale === 'ar' ? 'الميكروفون مغلق' : 'Microphone is off'}><MicOff size={19} /><span>{locale === 'ar' ? 'الميكروفون مغلق' : 'Mic off'}</span></button><button className={panel === 'chat' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('chat')} aria-label={locale === 'ar' ? 'فتح دردشة الغرفة' : 'Open room chat'}><MessageCircle size={19} /><span>{locale === 'ar' ? 'الدردشة' : 'Chat'}</span><i className="control-count">{messages.length}</i></button><button className="control-item" type="button" onClick={() => setPanel('chat')} aria-label={locale === 'ar' ? 'إرفاق GIF' : 'Attach a GIF'}><ImagePlus size={19} /><span>GIF</span></button><button className={panel === 'people' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('people')}><UsersRound size={19} /><span>{locale === 'ar' ? 'الأشخاص' : 'People'}</span></button><button className="control-item" type="button" onClick={shareRoom}><Share2 size={19} /><span>{locale === 'ar' ? 'مشاركة' : 'Share'}</span></button><button className={panel === 'sources' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('sources')}><Globe2 size={19} /><span>{locale === 'ar' ? 'المنصات' : 'Browse'}</span></button></div>
            <div className="next-up"><div className="next-up-title"><div><span>{locale === 'ar' ? 'الليلة مستمرة' : 'THE NIGHT CONTINUES'}</span><strong>{locale === 'ar' ? 'قائمة المشاهدة' : 'On the watchlist'}</strong></div><button type="button" onClick={() => showNotice(locale === 'ar' ? 'الصق رابط فيديو بالأعلى لإضافته إلى قائمة الغرفة.' : 'Paste a video link above to add it to the room queue.')}><Plus size={15} /> {locale === 'ar' ? 'أضف' : 'Add'}</button></div><div className="queue-tile"><img src="/cinema-still.png" alt={locale === 'ar' ? 'مدينة مستقبلية عند الغروب' : 'Futuristic city at sunset'} /><div><strong>{locale === 'ar' ? 'منتصف الليل في المدينة' : 'Midnight in the city'}</strong><span>{locale === 'ar' ? 'اختيار المجتمع' : 'Community pick'} <i>·</i> 24:00:00</span></div><button type="button" aria-label={locale === 'ar' ? 'تشغيل الفيديو التالي' : 'Play next video'} onClick={() => showNotice(locale === 'ar' ? 'الصق رابط فيديو قابلًا للتشغيل لبدء المشاهدة.' : 'Paste a playable video link to start watching.')}><Play size={15} fill="currentColor" /></button></div></div>
          </section>
          {roomPanel}
        </div>
      </div>
      <div className="mobile-panel-scrim" aria-hidden="true" onClick={() => setPanel(null)} />
      <footer className="room-footer"><span><span className="footer-live" /> {locale === 'ar' ? 'غرفة mkemo' : 'mkemo room'} <b>{activeRoomId?.slice(0, 8).toUpperCase()}</b></span><span className="footer-copyright">{locale === 'ar' ? 'مساحة للحظات اللي تحبونها.' : 'A room for the things you love.'}</span><button type="button" onClick={shareRoom}><Share2 size={14} /> {locale === 'ar' ? 'مشاركة الغرفة' : 'Share room'}</button></footer>
    </> : <ProfilePanel locale={locale} profileImage={profileImage} posts={posts} onBack={() => setView(activeRoomId ? 'room' : 'search')} onNotice={showNotice} onPhotoChange={selectPhoto} />}


    {notice && <div className="notice-toast" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label={locale === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}><X size={15} /></button></div>}
  </main>
}

export default WatchRoom
