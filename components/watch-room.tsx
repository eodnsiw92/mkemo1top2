'use client'

import { useRef, useState, type FormEvent } from 'react'
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
import { RoomDiscovery } from '@/components/room-discovery'

type ChatMessage = { id: number; name: string; initials: string; text: string; time: string; color: string; own?: boolean }
type Member = { name: string; handle: string; initials: string; country: string; flag: string; color: string; muted?: boolean; host?: boolean }
type Panel = 'people' | 'chat' | 'sources' | null

const providerSearchUrls: Record<string, (query: string) => string> = {
  YouTube: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  Netflix: (query) => `https://www.netflix.com/search?q=${encodeURIComponent(query)}`,
  'Prime Video': (query) => `https://www.primevideo.com/search?phrase=${encodeURIComponent(query)}`,
  'Disney+': (query) => `https://www.disneyplus.com/search?q=${encodeURIComponent(query)}`,
  Twitch: (query) => `https://www.twitch.tv/search?term=${encodeURIComponent(query)}`,
}

const members: Member[] = [
  { name: 'Maya', handle: '@mayawaves', initials: 'M', country: 'Iraq', flag: '🇮🇶', color: 'lilac', host: true },
  { name: 'Jordan', handle: '@jordanafterdark', initials: 'J', country: 'United States', flag: '🇺🇸', color: 'blue', muted: true },
  { name: 'Ava', handle: '@avaframes', initials: 'A', country: 'United Kingdom', flag: '🇬🇧', color: 'peach' },
  { name: 'Morgan', handle: '@morgan', initials: 'M', country: 'Canada', flag: '🇨🇦', color: 'mint', muted: true },
]

const initialMessages: ChatMessage[] = [
  { id: 1, name: 'Maya', initials: 'M', text: 'Okay, this is such a good pick.', time: '9:41', color: 'lilac' },
  { id: 2, name: 'Jordan', initials: 'J', text: 'The opening scene is unreal.', time: '9:42', color: 'blue' },
  { id: 3, name: 'Ava', initials: 'A', text: 'Wait for the next bit.', time: '9:43', color: 'peach' },
]

const services = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']
const interests = ['Indie films', 'Sci-fi', 'Soundtracks', 'Documentaries', 'Late-night playlists']

function youtubeId(value: string) {
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || ''
    if (!url.hostname.endsWith('youtube.com')) return ''
    return url.searchParams.get('v') || url.pathname.match(/\/(?:embed|live|shorts)\/([^/?]+)/)?.[1] || ''
  } catch {
    return ''
  }
}

function videoFile(value: string) {
  try {
    const url = new URL(value)
    return /^https?:$/.test(url.protocol) && /\.(mp4|webm|ogg)(?:$|\?)/i.test(url.href) ? url.href : ''
  } catch {
    return ''
  }
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
  const [view, setView] = useState<'home' | 'room' | 'profile'>('home')
  const [roomName, setRoomName] = useState('سهرتنا سوا')
  const [roomPublic, setRoomPublic] = useState(false)
  const [isInRoom, setIsInRoom] = useState(false)
  const [roomEvents, setRoomEvents] = useState<Array<{ id: number; name: string; action: 'joined' | 'left'; time: string }>>([])
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [profileImage, setProfileImage] = useState('')
  const [posts, setPosts] = useState<string[]>([])
  const [saved, setSaved] = useState(true)
  const photoInput = useRef<HTMLInputElement>(null)

  function showNotice(text: string) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 3200)
  }

  function openSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    const id = youtubeId(value)
    const file = videoFile(value)
    if (id) {
      setVideoId(id)
      setDirectVideo('')
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource('YouTube')
      showNotice('Video loaded. YouTube embedding and playback controls depend on the video owner.')
    } else if (file) {
      setVideoId('')
      setDirectVideo(file)
      setTime(0)
      setDuration(0)
      setPlaying(false)
      setSource('Direct video')
      showNotice('Direct video loaded. Long videos, including 24-hour streams, are supported by the browser player.')
    } else {
      const isAddress = /^https?:\/\//i.test(value) || /^([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value)
      if (isAddress) {
        const url = value.startsWith('http') ? value : `https://${value}`
        window.open(url, '_blank', 'noopener,noreferrer')
        showNotice('Opened in a new tab. Many sites block being embedded inside other apps.')
      } else {
        window.open(providerSearchUrls[source](value), '_blank', 'noopener,noreferrer')
        showNotice(source === 'YouTube'
          ? 'YouTube search opened. Paste an embeddable video link here to watch it in the room.'
          : `${source} opened on its official site. Protected streams stay in the provider’s own player.`)
      }
    }
    setQuery('')
  }

  async function shareRoom() {
    const invite = `${window.location.origin}/?room=MK-2048`
    try {
      await navigator.clipboard.writeText(invite)
      setCopied(true)
      showNotice('Room invite link copied.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      showNotice('Room code: MK-2048')
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((items) => [...items, { id: Date.now(), name: 'You', initials: 'M', text, time: 'Now', color: 'mint', own: true }])
    setDraft('')
    showNotice('Message added to this preview. Live room chat needs a shared room service.')
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
        <button type="button" role="tab" aria-selected={panel === 'people'} className={panel === 'people' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('people')}><UsersRound size={15} /> People <span>4</span></button>
        <button type="button" role="tab" aria-selected={panel === 'chat'} className={panel === 'chat' ? 'panel-tab active' : 'panel-tab'} onClick={() => setPanel('chat')}><MessageCircle size={15} /> Chat <span>{messages.length}</span></button>
        <button className="panel-close" type="button" aria-label="Close room panel" onClick={() => setPanel(null)}><X size={16} /></button>
      </div>

      {(panel === 'people' || panel === null) && <div className="people-panel">
        <div className="panel-summary"><div><strong>In the room</strong><span>Good company, better movies.</span></div><button type="button" className="panel-add" aria-label="Invite a friend" onClick={shareRoom}><Plus size={17} /></button></div>
        <div className="member-list">{members.map((member) => <article className="member-row" key={member.handle}>
          <span className={`member-avatar avatar-${member.color}`}>{member.initials}<i>{member.flag}</i></span>
          <span className="member-details"><strong>{member.name}{member.host && <span className="host-tag">HOST</span>}</strong><small>{member.handle}</small><small className="member-state">{member.muted ? <MicOff size={12} /> : <Mic size={12} />} {member.muted ? 'Mic off' : 'Listening'} <span>{member.flag} {member.country}</span></small></span>
          <button className="member-follow" type="button" aria-label={`Follow ${member.name}`} onClick={() => showNotice(`Follow requests for ${member.name} are a preview only.`)}><Plus size={16} /></button>
        </article>)}</div>
        <button className="invite-wide" type="button" onClick={shareRoom}><Link2 size={15} /> Invite friends <span>MK-2048</span></button>
        <p className="preview-caption"><ShieldCheck size={13} /> Profiles and country flags are sample preview data.</p>
      </div>}

      {panel === 'chat' && <div className="chat-panel-content">
        <div className="chat-day">TONIGHT <span /> ROOM CHAT</div>
        <div className="chat-messages" role="log" aria-label="Room chat messages" aria-live="polite">{messages.map((message) => <article className={`chat-message${message.own ? ' own' : ''}`} key={message.id}>
          {!message.own && <span className={`chat-avatar avatar-${message.color}`}>{message.initials}</span>}
          <div className="chat-bubble-wrap"><div className="chat-meta"><strong>{message.own ? 'You' : message.name}</strong><time>{message.time}</time></div><p>{message.text}</p></div>
        </article>)}</div>
        <form className="chat-compose" onSubmit={sendMessage}><input aria-label="Write a message" placeholder="Say something nice..." value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} /><button type="button" aria-label="Add a smile" onClick={() => setDraft((text) => `${text} :)`)}><Smile size={17} /></button><button className="send-message" type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={15} /></button></form>
        <p className="preview-caption"><MessageCircle size={13} /> Messages in this preview are not shared with other devices.</p>
      </div>}

      {panel === 'sources' && <div className="sources-panel"><div className="panel-summary"><div><strong>Choose a source</strong><span>Search across your favorite places.</span></div></div>{services.map((serviceName) => <button className={`source-choice${source === serviceName ? ' chosen' : ''}`} key={serviceName} type="button" onClick={() => { setSource(serviceName); setPanel(null); showNotice(serviceName === 'YouTube' ? 'Search YouTube, then paste an embeddable link to load it here.' : `${serviceName} opens on its official site. Sign in with your own account there; protected playback is not controlled by mkemo.`) }}><span className="source-mark">{serviceName.slice(0, 1)}</span><strong>{serviceName}</strong>{source === serviceName && <Check size={16} />}</button>)}<div className="source-legal-note"><LockKeyhole size={14} /><span><strong>Bring your own subscription</strong><small>Sign in on each service’s official site. mkemo never asks for or shares your password.</small></span></div><p className="preview-caption"><ShieldCheck size={13} /> Protected playback stays with its provider.</p></div>}
    </aside>
  )

  return <main className="watch-app">
    <header className="app-header">
      <button className="brand-mark" type="button" aria-label="mkemo home" onClick={() => { setView('room'); setPanel(null) }}><span className="brand-glyph"><Play size={14} fill="currentColor" /></span><span>mkemo<span className="brand-period">.</span></span></button>
      <nav className="header-nav" aria-label="Main navigation"><button className={view === 'room' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => setView('room')}><UsersRound size={15} /> Watch</button><button className={view === 'profile' ? 'nav-item nav-current' : 'nav-item'} type="button" onClick={() => setView('profile')}><Heart size={15} /> My space</button></nav>
      <div className="header-actions"><button className="header-round" type="button" aria-label="Search video" onClick={() => document.getElementById('room-search')?.focus()}><Search size={17} /></button><button className="account-trigger" type="button" onClick={() => setView('profile')}><span className="tiny-avatar avatar-mint">{profileImage ? <img src={profileImage} alt="" /> : 'M'}</span><span className="account-name">Morgan</span><ChevronDown size={14} /></button></div>
    </header>

    {view === 'room' ? <>
      <div className="room-content">
        <section className="room-titlebar"><div><div className="room-kicker"><span className="live-pulse" /> PRIVATE ROOM <span className="kicker-separator">/</span> TONIGHT&apos;S WATCH</div><h1>After hours</h1></div><div className="room-title-actions"><button className="privacy-toggle" type="button" onClick={() => { setRoomPublic((current) => !current); showNotice(roomPublic ? 'Room set to private.' : 'Room set to public in this preview.') }}>{roomPublic ? <Globe2 size={14} /> : <LockKeyhole size={14} />}{roomPublic ? 'Public' : 'Private'}<ChevronDown size={13} /></button><button className="invite-button" type="button" onClick={shareRoom}>{copied ? <Check size={15} /> : <Share2 size={15} />}<span>{copied ? 'Copied' : 'Invite'}</span></button></div></section>

        <form className="room-search" onSubmit={openSearch}><Search size={17} /><input id="room-search" aria-label="Search or paste a video link" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a video or paste a link..." /><span className="duration-hint">24h</span><button type="submit" aria-label="Search videos"><Search size={16} /></button></form>
        <div className="search-footnote"><span>Search {source}</span><button type="button" onClick={() => setPanel('sources')}><Globe2 size={13} /> Browse sources <ChevronDown size={12} /></button><span className="supported-note"><ShieldCheck size={12} /> Direct video up to 24h</span></div>

        <div className="room-grid">
          <section className="watch-column" aria-label="Watch together">
            <MediaStage isPlaying={playing} isMuted={muted} isFullscreen={false} currentTime={time} duration={duration} activeSource={source} videoId={videoId} directVideoUrl={directVideo} onTogglePlay={() => setPlaying((value) => !value)} onToggleMute={() => setMuted((value) => !value)} onToggleFullscreen={() => showNotice('Theater mode is available from the video player controls.')} onSeek={setTime} onDurationChange={setDuration} onNotice={showNotice} />
            <p className="rights-note"><ShieldCheck size={13} /> Use your own subscription. Protected movies stay in the provider&apos;s player; mkemo never shares credentials or bypasses DRM.</p>
            <div className="media-caption"><div className="media-caption-art"><img src="/cinema-still.png" alt="" /></div><div className="media-caption-copy"><span>NOW IN THE ROOM <i /> ORIGINAL PREVIEW</span><strong>{videoId || directVideo ? 'Your video is loaded' : 'The Last City'}</strong><small>{source} <span>·</span> Long-form friendly</small></div><button className={`save-button${saved ? ' is-saved' : ''}`} type="button" aria-label={saved ? 'Remove from saved' : 'Save this video'} onClick={() => { setSaved((value) => !value); showNotice(saved ? 'Removed from your saved list.' : 'Saved to your mkemo space.') }}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? 'Saved' : 'Save'}</span></button></div>
            <div className="member-peek"><div className="peek-avatars">{members.slice(0, 4).map((member) => <span key={member.handle} className={`peek-avatar avatar-${member.color}`} title={`${member.name} · ${member.country}`}>{member.initials}</span>)}</div><button type="button" onClick={() => setPanel('people')}><strong>4 friends</strong><span>watching together <i>•</i> {members[0].flag} {members[0].country}</span></button><button type="button" className="peek-more" onClick={() => setPanel('people')} aria-label="Show everyone"><MoreHorizontal size={18} /></button></div>
            <div className="control-row" aria-label="Room controls"><button className="control-item" type="button" onClick={() => showNotice('Live group voice needs a connected voice service. Your microphone stays off in this preview.')} aria-label="Microphone is off"><MicOff size={19} /><span>Mic off</span></button><button className={panel === 'chat' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('chat')}><MessageCircle size={19} /><span>Chat</span><i className="control-count">3</i></button><button className="control-item" type="button" onClick={() => photoInput.current?.click()}><ImagePlus size={19} /><span>Photo</span></button><button className={panel === 'people' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('people')}><UsersRound size={19} /><span>People</span></button><button className="control-item" type="button" onClick={shareRoom}><Share2 size={19} /><span>Share</span></button><button className={panel === 'sources' ? 'control-item control-active' : 'control-item'} type="button" onClick={() => togglePanel('sources')}><Globe2 size={19} /><span>Browse</span></button></div>
            <input className="visually-hidden-input" ref={photoInput} type="file" accept="image/*" onChange={selectPhoto} aria-label="Choose a profile photo to post" />
            <div className="next-up"><div className="next-up-title"><div><span>THE NIGHT CONTINUES</span><strong>On the watchlist</strong></div><button type="button" onClick={() => showNotice('Paste a video link above to add it to the room queue.')}><Plus size={15} /> Add</button></div><div className="queue-tile"><img src="/cinema-still.png" alt="Futuristic city at sunset" /><div><strong>Midnight in the city</strong><span>Community pick <i>·</i> 24:00:00</span></div><button type="button" aria-label="Play next video" onClick={() => showNotice('Paste a playable video link to start watching.') }><Play size={15} fill="currentColor" /></button></div></div>
          </section>
          {roomPanel}
        </div>
      </div>
      <div className="mobile-panel-scrim" aria-hidden="true" onClick={() => setPanel(null)} />
      <footer className="room-footer"><span><span className="footer-live" /> mkemo room <b>MK-2048</b></span><span className="footer-copyright">A room for the things you love.</span><button type="button" onClick={shareRoom}><Share2 size={14} /> Share room</button></footer>
    </> : <section className="profile-view">
      <button className="profile-back" type="button" onClick={() => setView('room')}><ArrowLeft size={16} /> Back to the room</button>
      <div className="profile-hero"><div className="profile-cover"><img src="/cinema-still.png" alt="A cinematic city at sunset" /></div><div className="profile-main"><button className="profile-photo" type="button" onClick={() => photoInput.current?.click()} aria-label="Upload profile photo">{profileImage ? <img src={profileImage} alt="Morgan's profile" /> : <span>M</span>}<i><ImagePlus size={15} /></i></button><div className="profile-title"><span className="profile-handle">@morgan <span>🇨🇦</span></span><h1>Morgan Lee</h1><p>Collecting good films and better company.</p></div><button className="profile-edit" type="button" onClick={() => photoInput.current?.click()}><ImagePlus size={15} /> Add a photo</button></div><div className="profile-stats"><span><strong>04</strong> friends</span><span><strong>{posts.length.toString().padStart(2, '0')}</strong> posts</span><span><strong>08</strong> watch nights</span></div></div>
      <div className="profile-columns"><section className="profile-section interests-card"><div className="profile-section-heading"><span>YOUR TASTE</span><button type="button" onClick={() => showNotice('Interest editing will be available with account setup.')}><MoreHorizontal size={18} /></button></div><h2>Things I&apos;m into</h2><p>Good stories have a way of finding their people.</p><div className="interest-list">{interests.map((interest) => <span className="interest-chip" key={interest}>{interest}</span>)}</div><div className="interest-edit-note"><AtSign size={14} /> Meet friends who love the same things.</div></section><section className="profile-section posts-section"><div className="profile-section-heading"><div><span>YOUR CORNER</span><h2>Photos & moments</h2></div><button className="new-post" type="button" onClick={() => photoInput.current?.click()}><Plus size={15} /> Post a photo</button></div><p className="profile-preview-note">Your page, your favorites. New photos are preview-only until account storage is connected.</p><div className="photo-grid">{posts.map((post, index) => <button type="button" className="photo-post" key={`${post.slice(-14)}-${index}`} onClick={() => showNotice('Photo post preview. Connect storage to share it with your friends.')}><img src={post} alt={`Photo post ${index + 1}`} /><span><Heart size={14} /> Just added</span></button>)}{posts.length === 0 && <button className="empty-post" type="button" onClick={() => photoInput.current?.click()}><span><ImagePlus size={21} /></span><strong>Your first photo goes here</strong><small>Share a moment from your movie night.</small><em>Choose a photo <Plus size={13} /></em></button>}</div></section></div>
      <input className="visually-hidden-input" ref={photoInput} type="file" accept="image/*" onChange={selectPhoto} aria-label="Choose a profile photo to post" />
      <p className="profile-legal">© 2026 mkemo. A place to watch and share what you love.</p>
    </section>}

    {notice && <div className="notice-toast" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
  </main>
}

export default WatchRoom
