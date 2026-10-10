'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  AtSign,
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
import { CountryName } from '@/components/country-name'
import { splitCountryFlag } from '@/lib/country'
import { RoomDiscovery } from '@/components/room-discovery'
import { MediaSearchHub } from '@/components/media-search-hub'
import { useRoomFeed } from '@/lib/room-feed'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getPlayableSource } from '@/lib/media-url'

type Panel = 'people' | 'chat' | 'sources' | null


const services = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']
const interests = ['Indie films', 'Sci-fi', 'Soundtracks', 'Documentaries', 'Late-night playlists']

function youtubeId(value: string) {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const source = getPlayableSource(candidate)
  return source?.kind === 'youtube' ? source.id : ''
}

function videoFile(value: string) {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const source = getPlayableSource(candidate)
  return source?.kind === 'direct' ? source.url : ''
}

export function WatchRoom() {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('YouTube')
  const [videoId, setVideoId] = useState('')
  const [directVideo, setDirectVideo] = useState('')
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [panel, setPanel] = useState<Panel>(null)
  const [view, setView] = useState<'home' | 'room' | 'profile' | 'search'>('home')
  const [locale, setLocale] = useState<'ar' | 'en'>('ar')
  const [mediaSearchQuery, setMediaSearchQuery] = useState('')
  const [roomPublic, setRoomPublic] = useState(false)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [activeInviteToken, setActiveInviteToken] = useState('')
  const [pendingInvite, setPendingInvite] = useState<{ roomId: string; inviteToken: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [posts, setPosts] = useState<string[]>([])
  const [saved, setSaved] = useState(true)
  const photoInput = useRef<HTMLInputElement>(null)
  const appliedPlaybackRef = useRef('')
  const playbackUpdateTimeRef = useRef(0)
  const { data: roomFeed, mutate: refreshRoomFeed } = useRoomFeed(activeRoomId)
  const messages = roomFeed?.messages ?? []
  const members = roomFeed?.members ?? []
  const isRoomHost = Boolean(roomFeed?.members.some((member) => member.guestId === roomFeed.currentGuestId && member.isHost))

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    const url = new URL(window.location.href)
    const roomId = url.searchParams.get('room')
    if (roomId) setPendingInvite({ roomId, inviteToken: url.searchParams.get('invite') ?? '' })
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
    if (!activeRoomId || !shared?.mediaUrl) return
    const playbackKey = `${activeRoomId}:${shared.mediaUrl}:${shared.playbackUpdatedAt}`
    if (appliedPlaybackRef.current === playbackKey) return
    const playable = getPlayableSource(shared.mediaUrl)
    if (!playable) return
    if (playable.kind === 'youtube') {
      setVideoId(playable.id)
      setDirectVideo('')
      setSource('YouTube')
    } else {
      setVideoId('')
      setDirectVideo(playable.url)
      setSource('Direct video')
    }
    const elapsedSeconds = shared.isPlaying ? Math.max(0, (Date.now() - new Date(shared.playbackUpdatedAt).getTime()) / 1000) : 0
    setTime(Math.floor(shared.playbackPosition + elapsedSeconds))
    setPlaying(shared.isPlaying)
    appliedPlaybackRef.current = playbackKey
  }, [activeRoomId, roomFeed?.room.mediaUrl, roomFeed?.room.playbackPosition, roomFeed?.room.isPlaying, roomFeed?.room.playbackUpdatedAt])

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

  async function createRoom(roomSource: string, isPublic: boolean) {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: roomSource, isPublic }),
    })
    const result = await response.json()
    if (!response.ok) {
      showNotice(result.error || 'Unable to create this room.')
      return
    }
    setActiveRoomId(result.room.id)
    setActiveInviteToken(result.inviteToken)
    setRoomPublic(result.room.isPublic)
    setSource(result.room.source)
    setView('room')
    setPanel(null)
    showNotice(locale === 'ar' ? 'تم إنشاء الغرفة.' : 'Your room is ready.')
  }

  function leaveActiveRoom() {
    if (activeRoomId) void fetch(`/api/rooms/${encodeURIComponent(activeRoomId)}`, { method: 'DELETE', keepalive: true })
    setActiveRoomId(null)
    setActiveInviteToken('')
    setPanel(null)
    setView('home')
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

  function seekSharedPlayback(nextTime: number) {
    setTime(nextTime)
    if (!activeRoomId || !isRoomHost || !roomFeed?.room.mediaUrl) return
    const now = Date.now()
    if (now - playbackUpdateTimeRef.current < 2500) return
    playbackUpdateTimeRef.current = now
    void updateSharedPlayback(roomFeed.room.mediaUrl, nextTime, playing)
  }

  function openMediaSearch(initialQuery = '') {
    setMediaSearchQuery(initialQuery)
    setView('search')
  }

  function openPlatformSearch(service: string, searchQuery: string) {
    if (service === 'Likes') {
      setView('profile')
      return
    }
    const params = new URLSearchParams({ source: service })
    if (searchQuery) params.set('query', searchQuery)
    window.open(`/api/search?${params.toString()}`, '_blank', 'noopener,noreferrer')
  }

  function submitMediaSearch(searchQuery: string) {
    const params = new URLSearchParams({ source: 'YouTube', query: searchQuery })
    window.open(`/api/search?${params.toString()}`, '_blank', 'noopener,noreferrer')
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
    const id = youtubeId(value)
    const file = videoFile(value)
    if (id) {
      setVideoId(id)
      setDirectVideo('')
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource('YouTube')
      void updateSharedPlayback(value.startsWith('http') ? value : `https://${value}`, 0, false)
      showNotice(locale === 'ar' ? 'تم تحميل الفيديو ومزامنته للغرفة.' : 'Video loaded and synced to the room.')
    } else if (file) {
      setVideoId('')
      setDirectVideo(file)
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource('Direct video')
      void updateSharedPlayback(file, 0, false)
      showNotice(locale === 'ar' ? 'تم تحميل الفيديو ومزامنته للغرفة.' : 'Video loaded and synced to the room.')
    } else {
      const isAddress = /^https?:\/\//i.test(value) || /^([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value)
      if (isAddress) {
        const url = value.startsWith('http') ? value : `https://${value}`
        window.open(url, '_blank', 'noopener,noreferrer')
        showNotice('Opened in a new tab. Many sites block being embedded inside other apps.')
      } else {
        const searchSource = source === 'Direct video' ? 'YouTube' : source
        window.open(`/api/search?source=${encodeURIComponent(searchSource)}&query=${encodeURIComponent(value)}`, '_blank', 'noopener,noreferrer')
        showNotice(source === 'YouTube'
          ? (locale === 'ar' ? 'فتح البحث الآمن. الصق رابط فيديو قابلًا للتضمين لمشاهدته هنا.' : 'Safe video search opened. Paste an embeddable link to play it here.')
          : (locale === 'ar' ? `يفتح ${source} موقعه الرسمي. تبقى المشاهدة المحمية لدى المنصة.` : `${source} opens on its official site. Protected playback stays with the provider.`))
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
    if (!file.type.startsWith('image/')) {
      showNotice('Choose an image file to continue.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      setProfileImage(result)
      setPosts((items) => [result, ...items])
      setView('profile')
      showNotice('Photo added to this preview. Connect account storage to publish it for real.')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function togglePanel(next: Panel) {
    setPanel((current) => current === next ? null : next)
  }

  const roomPanel = (
    <aside className={`room-panel${panel ? ' room-panel-open' : ''}`} aria-label="Room activity">
      <div className="panel-tabs" role="tablist" aria-label="Room panels">
        <button type="button" role="tab" aria-selected={panel === 'people'} className={panel === 'people' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('people')}><UsersRound size={15} /> {locale === 'ar' ? 'الأشخاص' : 'People'} <span>{members.length}</span></button>
        <button type="button" role="tab" aria-selected={panel === 'chat'} className={panel === 'chat' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('chat')}><MessageCircle size={15} /> {locale === 'ar' ? 'الدردشة' : 'Chat'} <span>{messages.length}</span></button>
        <button className="panel-close" type="button" aria-label="Close room panel" onClick={() => setPanel(null)}><X size={16} /></button>
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

      {panel === 'sources' && <div className="sources-panel"><div className="panel-summary"><div><strong>Choose a source</strong><span>Search across your favorite places.</span></div></div>{services.map((serviceName) => <button className={`source-choice${source === serviceName ? ' chosen' : ''}`} key={serviceName} type="button" onClick={() => { setSource(serviceName); setPanel(null); showNotice(serviceName === 'YouTube' ? 'Search YouTube, then paste an embeddable link to load it here.' : `${serviceName} opens on its official site. Sign in with your own account there; protected playback is not controlled by mkemo.`) }}><span className="source-mark">{serviceName.slice(0, 1)}</span><strong>{serviceName}</strong>{source === serviceName && <Check size={16} />}</button>)}<div className="source-legal-note"><LockKeyhole size={14} /><span><strong>Bring your own subscription</strong><small>Sign in on each service’s official site. mkemo never asks for or shares your password.</small></span></div><p className="preview-caption"><ShieldCheck size={13} /> Protected playback stays with its provider.</p></div>}
    </aside>
  )

  return <main className="watch-app">
    {view !== 'home' && <header className="app-header">
      <button className="brand-mark" type="button" aria-label="mkemo home" onClick={leaveActiveRoom}><span className="brand-glyph"><Play size={14} fill="currentColor" /></span><span>mkemo<span className="brand-period">.</span></span></button>
      <nav className="header-nav" aria-label="Main navigation"><button className={view === 'room' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => { if (activeRoomId) setView('room'); else setView('home') }}><UsersRound size={15} /> {locale === 'ar' ? 'مشاهدة' : 'Watch'}</button><button className={view === 'search' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => openMediaSearch()}><Search size={15} /> {locale === 'ar' ? 'بحث' : 'Search'}</button><button className={view === 'profile' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => setView('profile')}><Heart size={15} /> {locale === 'ar' ? 'مساحتي' : 'My space'}</button></nav>
      <div className="header-actions"><button className="header-round" type="button" aria-label={locale === 'ar' ? 'فتح البحث' : 'Open search'} onClick={() => openMediaSearch()}><Search size={17} /></button><button className="header-round language-round" type="button" onClick={() => setLocale((current) => current === 'ar' ? 'en' : 'ar')} aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}><Languages size={16} /><span>{locale.toUpperCase()}</span></button><button className="account-trigger" type="button" onClick={() => setView('profile')}><span className="tiny-avatar avatar-mint">{profileImage ? <img src={profileImage} alt="" /> : 'M'}</span><span className="account-name">Morgan</span><ChevronDown size={14} /></button></div>
    </header>}

    {view === 'home' ? <RoomDiscovery locale={locale} onToggleLocale={() => setLocale((current) => current === 'ar' ? 'en' : 'ar')} onOpenProfile={() => setView('profile')} onOpenSearch={(searchQuery) => openMediaSearch(searchQuery)} onCreateRoom={createRoom} onJoinRoom={enterRoom} onAcceptInvite={() => { if (pendingInvite) void enterRoom(pendingInvite.roomId, pendingInvite.inviteToken) }} hasInvite={Boolean(pendingInvite)} /> : view === 'search' ? <MediaSearchHub locale={locale} initialQuery={mediaSearchQuery} onBack={() => setView(activeRoomId ? 'room' : 'home')} onOpenHome={() => setView('home')} onOpenRoom={() => setView(activeRoomId ? 'room' : 'home')} onOpenProfile={() => setView('profile')} onSearch={submitMediaSearch} onSelectService={openPlatformSearch} /> : view === 'room' ? <>
      <div className="room-content">
        <section className="room-titlebar"><div><div className="room-kicker"><span className="live-pulse" /> {roomPublic ? (locale === 'ar' ? 'غرفة عامة' : 'PUBLIC ROOM') : (locale === 'ar' ? 'غرفة خاصة' : 'PRIVATE ROOM')} <span className="kicker-separator">/</span> {locale === 'ar' ? 'مشاهدة الليلة' : 'TONIGHT’S WATCH'}</div><h1>{roomFeed?.room.title ?? (locale === 'ar' ? 'غرفة مشاهدة' : 'Watch together')}</h1></div><div className="room-title-actions"><button className="privacy-toggle" type="button" onClick={() => void toggleRoomVisibility()} aria-label={locale === 'ar' ? 'تغيير ظهور الغرفة' : 'Change room visibility'}>{roomPublic ? <Globe2 size={14} /> : <LockKeyhole size={14} />}{roomPublic ? (locale === 'ar' ? 'عام' : 'Public') : (locale === 'ar' ? 'خاص' : 'Private')}<ChevronDown size={13} /></button><button className="invite-button" type="button" onClick={shareRoom}>{copied ? <Check size={15} /> : <Share2 size={15} />}<span>{copied ? (locale === 'ar' ? 'تم النسخ' : 'Copied') : (locale === 'ar' ? 'دعوة' : 'Invite')}</span></button></div></section>

        <form className="room-search" onSubmit={openSearch}><Search size={17} /><input id="room-search" aria-label="Search or paste a video link" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a video or paste a link..." /><span className="duration-hint">24h</span><button type="submit" aria-label="Search videos"><Search size={16} /></button></form>
        <div className="search-footnote"><span>Search {source}</span><button type="button" onClick={() => setPanel('sources')}><Globe2 size={13} /> Browse sources <ChevronDown size={12} /></button><span className="supported-note"><ShieldCheck size={12} /> Direct video up to 24h</span></div>

        <div className="room-grid">
          <section className="watch-column" aria-label="Watch together">
            <MediaStage isPlaying={playing} isMuted={muted} controlsEnabled={isRoomHost} isFullscreen={false} currentTime={time} duration={duration} activeSource={source} videoId={videoId} directVideoUrl={directVideo} onTogglePlay={toggleSharedPlayback} onToggleMute={() => setMuted((value) => !value)} onToggleFullscreen={() => showNotice('Theater mode is available from the video player controls.')} onSeek={seekSharedPlayback} onDurationChange={setDuration} onNotice={showNotice} />
            <p className="rights-note"><ShieldCheck size={13} /> Use your own subscription. Protected movies stay in the provider&apos;s player; mkemo never shares credentials or bypasses DRM.</p>
            <div className="media-caption"><div className="media-caption-art"><img src="/cinema-still.png" alt="" /></div><div className="media-caption-copy"><span>NOW IN THE ROOM <i /> ORIGINAL PREVIEW</span><strong>{roomFeed?.room.title ?? (locale === 'ar' ? 'حمّل فيديو لعرض اسمه هنا' : 'Load a video to see its title here')}</strong><small>{source} <span>·</span> Long-form friendly</small></div><button className={`save-button${saved ? ' is-saved' : ''}`} type="button" aria-label={saved ? 'Remove from saved' : 'Save this video'} onClick={() => { setSaved((value) => !value); showNotice(saved ? 'Removed from your saved list.' : 'Saved to your mkemo space.') }}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? 'Saved' : 'Save'}</span></button></div>
            <div className="member-peek"><div className="peek-avatars">{members.slice(0, 4).map((member, index) => <span key={member.guestId} className={`peek-avatar avatar-${['lilac', 'blue', 'peach', 'mint'][index % 4]}`} title={member.displayName}>{member.displayName.slice(0, 1)}</span>)}</div><button type="button" onClick={() => setPanel('people')}><strong>{new Intl.NumberFormat(locale).format(members.length)} {locale === 'ar' ? 'أشخاص' : 'people'}</strong><span>{locale === 'ar' ? 'يشاهدون معك الآن' : 'watching with you now'}</span></button><button type="button" className="peek-more" onClick={() => setPanel('people')} aria-label={locale === 'ar' ? 'عرض الجميع' : 'Show everyone'}><MoreHorizontal size={18} /></button></div>
            <div className="control-row" aria-label={locale === 'ar' ? 'عناصر التحكم بالغرفة' : 'Room controls'}><button className="control-item" type="button" onClick={() => showNotice(locale === 'ar' ? 'المحادثة الصوتية الجماعية غير مفعلة. الميكروفون مغلق.' : 'Group voice is not enabled. Your microphone stays off.')} aria-label={locale === 'ar' ? 'الميكروفون مغلق' : 'Microphone is off'}><MicOff size={19} /><span>{locale === 'ar' ? 'الميكروفون' : 'Mic off'}</span></button><button className={panel === 'chat' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('chat')}><MessageCircle size={19} /><span>{locale === 'ar' ? 'الدردشة' : 'Chat'}</span><i className="control-count">{messages.length}</i></button><button className="control-item" type="button" onClick={() => setPanel('chat')}><ImagePlus size={19} /><span>GIF</span></button><button className={panel === 'people' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('people')}><UsersRound size={19} /><span>{locale === 'ar' ? 'الأشخاص' : 'People'}</span></button><button className="control-item" type="button" onClick={shareRoom}><Share2 size={19} /><span>{locale === 'ar' ? 'مشاركة' : 'Share'}</span></button><button className={panel === 'sources' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('sources')}><Globe2 size={19} /><span>{locale === 'ar' ? 'المنصات' : 'Browse'}</span></button></div>
            <div className="next-up"><div className="next-up-title"><div><span>THE NIGHT CONTINUES</span><strong>On the watchlist</strong></div><button type="button" onClick={() => showNotice('Paste a video link above to add it to the room queue.')}><Plus size={15} /> Add</button></div><div className="queue-tile"><img src="/cinema-still.png" alt="Futuristic city at sunset" /><div><strong>Midnight in the city</strong><span>Community pick <i>·</i> 24:00:00</span></div><button type="button" aria-label="Play next video" onClick={() => showNotice('Paste a playable video link to start watching.') }><Play size={15} fill="currentColor" /></button></div></div>
          </section>
          {roomPanel}
        </div>
      </div>
      <div className="mobile-panel-scrim" aria-hidden="true" onClick={() => setPanel(null)} />
      <footer className="room-footer"><span><span className="footer-live" /> mkemo room <b>{activeRoomId?.slice(0, 8).toUpperCase()}</b></span><span className="footer-copyright">{locale === 'ar' ? 'مساحة للحظات اللي تحبونها.' : 'A room for the things you love.'}</span><button type="button" onClick={shareRoom}><Share2 size={14} /> {locale === 'ar' ? 'مشاركة الغرفة' : 'Share room'}</button></footer>
    </> : <section className="profile-view">
      <button className="profile-back" type="button" onClick={() => setView(activeRoomId ? 'room' : 'home')}><ArrowLeft size={16} /> {locale === 'ar' ? 'رجوع' : 'Back'}</button>
      <div className="profile-hero"><div className="profile-cover"><img src="/cinema-still.png" alt="A cinematic city at sunset" /></div><div className="profile-main"><button className="profile-photo" type="button" onClick={() => photoInput.current?.click()} aria-label="Upload profile photo">{profileImage ? <img src={profileImage} alt="Morgan's profile" /> : <span>M</span>}<i><ImagePlus size={15} /></i></button><div className="profile-title"><span className="profile-handle">@morgan <span>🇨🇦</span></span><h1>Morgan Lee</h1><p>Collecting good films and better company.</p></div><button className="profile-edit" type="button" onClick={() => photoInput.current?.click()}><ImagePlus size={15} /> Add a photo</button></div><div className="profile-stats"><span><strong>04</strong> friends</span><span><strong>{posts.length.toString().padStart(2, '0')}</strong> posts</span><span><strong>08</strong> watch nights</span></div></div>
      <div className="profile-columns"><section className="profile-section interests-card"><div className="profile-section-heading"><span>YOUR TASTE</span><button type="button" onClick={() => showNotice('Interest editing will be available with account setup.')}><MoreHorizontal size={18} /></button></div><h2>Things I&apos;m into</h2><p>Good stories have a way of finding their people.</p><div className="interest-list">{interests.map((interest) => <span className="interest-chip" key={interest}>{interest}</span>)}</div><div className="interest-edit-note"><AtSign size={14} /> Meet friends who love the same things.</div></section><section className="profile-section posts-section"><div className="profile-section-heading"><div><span>YOUR CORNER</span><h2>Photos & moments</h2></div><button className="new-post" type="button" onClick={() => photoInput.current?.click()}><Plus size={15} /> Post a photo</button></div><p className="profile-preview-note">Your page, your favorites. New photos are preview-only until account storage is connected.</p><div className="photo-grid">{posts.map((post, index) => <button type="button" className="photo-post" key={`${post.slice(-14)}-${index}`} onClick={() => showNotice('Photo post preview. Connect storage to share it with your friends.')}><img src={post} alt={`Photo post ${index + 1}`} /><span><Heart size={14} /> Just added</span></button>)}{posts.length === 0 && <button className="empty-post" type="button" onClick={() => photoInput.current?.click()}><span><ImagePlus size={21} /></span><strong>Your first photo goes here</strong><small>Share a moment from your movie night.</small><em>Choose a photo <Plus size={13} /></em></button>}</div></section></div>
      <input className="visually-hidden-input" ref={photoInput} type="file" accept="image/*" onChange={selectPhoto} aria-label="Choose a profile photo to post" />
      <p className="profile-legal">© 2026 mkemo. A place to watch and share what you love.</p>
    </section>}

    {notice && <div className="notice-toast" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
  </main>
}

export default WatchRoom
