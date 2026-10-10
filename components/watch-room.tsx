'use client'

import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  ExternalLink,
  Film,
  Globe2,
  Heart,
  Link2,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { MediaStage } from '@/components/media-stage'
import { RoomChat, type RoomMessage } from '@/components/room-chat'

type LibraryItem = {
  title: string
  source: string
  duration: string
  category: string
}

const initialMessages: RoomMessage[] = [
  { id: 'm1', name: 'Maya', text: 'Everyone ready? This one looks so good.', time: '9:41', tone: 'violet' },
  { id: 'm2', name: 'You', text: 'Just grabbed the snacks. Let’s go!', time: '9:42', tone: 'coral', own: true },
  { id: 'm3', name: 'Jordan', text: 'The city shots are unreal.', time: '9:43', tone: 'blue' },
  { id: 'm4', name: 'Ava', text: 'That sunset, wow.', time: '9:43', tone: 'green' },
]

const roomMembers = [
  { name: 'You', initials: 'M', tone: 'coral' },
  { name: 'Maya', initials: 'M', tone: 'violet' },
  { name: 'Jordan', initials: 'J', tone: 'blue' },
  { name: 'Ava', initials: 'A', tone: 'green' },
]

const startingLibrary: LibraryItem[] = [
  { title: 'The Last City', source: 'YouTube', duration: '24:00:00', category: 'Live marathon' },
  { title: 'Midnight Drive', source: 'YouTube', duration: '02:18:45', category: 'Music mix' },
  { title: 'Planet Earth, Together', source: 'Prime Video', duration: '00:52:18', category: 'Documentary' },
]

const sources = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']
const LONG_VIDEO_DURATION = 24 * 60 * 60

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, '0')).join(':')
}

function getYouTubeId(value: string) {
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] ?? null
    if (!url.hostname.endsWith('youtube.com')) return null
    return url.searchParams.get('v') ?? url.pathname.match(/\/(?:embed|live|shorts)\/([^/?]+)/)?.[1] ?? null
  } catch {
    return null
  }
}

function getDirectVideoUrl(value: string) {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return null
    return /\.(mp4|webm|ogg)(?:$|\?)/i.test(url.href) ? url.href : null
  } catch {
    return null
  }
}

function searchUrl(source: string, query: string) {
  const encoded = encodeURIComponent(query)
  switch (source) {
    case 'Netflix': return `https://www.netflix.com/search?q=${encoded}`
    case 'Prime Video': return `https://www.amazon.com/s?k=${encoded}`
    case 'Disney+': return `https://www.disneyplus.com/search?q=${encoded}`
    case 'Twitch': return `https://www.twitch.tv/search?term=${encoded}`
    default: return `https://www.youtube.com/results?search_query=${encoded}`
  }
}

export function WatchRoom() {
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState('mkemo.app/room/after-hours')
  const [history, setHistory] = useState(['mkemo.app/room/after-hours'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [activeSource, setActiveSource] = useState('YouTube')
  const [videoId, setVideoId] = useState('')
  const [directVideoUrl, setDirectVideoUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [canControl, setCanControl] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [roomCode, setRoomCode] = useState('MKEMO-2048')
  const [fullscreen, setFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeView, setActiveView] = useState<'room' | 'library'>('room')
  const [library, setLibrary] = useState(startingLibrary)
  const [savedCurrentMedia, setSavedCurrentMedia] = useState(true)

  useEffect(() => {
    if (!isPlaying || videoId || directVideoUrl) return
    const timer = window.setInterval(() => {
      setCurrentTime((time) => Math.min(time + 1, LONG_VIDEO_DURATION))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [directVideoUrl, isPlaying, videoId])

  function showNotice(message: string) {
    setNotice(message)
  }

  function pushAddress(nextAddress: string) {
    const nextHistory = [...history.slice(0, historyIndex + 1), nextAddress]
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
    setAddress(nextAddress)
  }

  function navigate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return

    const youtubeId = getYouTubeId(value)
    const directUrl = getDirectVideoUrl(value)
    if (youtubeId) {
      setVideoId(youtubeId)
      setDirectVideoUrl('')
      setIsPlaying(false)
      setCurrentTime(0)
      pushAddress(`youtube.com/watch?v=${youtubeId}`)
      showNotice('YouTube video loaded. Use its player controls to watch; the video owner may disable embedding.')
      setQuery('')
      return
    }

    if (directUrl) {
      setVideoId('')
      setDirectVideoUrl(directUrl)
      setIsPlaying(false)
      setCurrentTime(0)
      pushAddress(new URL(directUrl).host + new URL(directUrl).pathname)
      showNotice('Direct video loaded. Its own controls and duration are provided by the video file.')
      setQuery('')
      return
    }

    if (/^https?:\/\//i.test(value) || /^([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value)) {
      const url = value.startsWith('http') ? value : `https://${value}`
      window.open(url, '_blank', 'noopener,noreferrer')
      pushAddress(url.replace(/^https?:\/\//i, ''))
      showNotice('This site opened in a new tab. Most websites block being displayed inside another app.')
      setQuery('')
      return
    }

    window.open(searchUrl(activeSource, value), '_blank', 'noopener,noreferrer')
    showNotice(`Search results opened in a new tab. Paste a supported video link here to load it in mkemo.`)
    setQuery('')
  }

  function goBack() {
    if (historyIndex <= 0) return
    const nextIndex = historyIndex - 1
    setHistoryIndex(nextIndex)
    setAddress(history[nextIndex])
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    setHistoryIndex(nextIndex)
    setAddress(history[nextIndex])
  }

  function reloadPage() {
    setIsPlaying(false)
    showNotice('The room preview refreshed. Playback state stays local in this demo.')
  }

  async function copyInviteLink() {
    const inviteUrl = new URL(window.location.href)
    inviteUrl.searchParams.set('room', roomCode)
    try {
      await navigator.clipboard.writeText(inviteUrl.toString())
      setCopied(true)
      showNotice('Room invite link copied to your clipboard.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      showNotice(`Invite code: ${roomCode}`)
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [...current, {
      id: `message-${Date.now()}`,
      name: 'You',
      text,
      time: 'Now',
      tone: 'coral',
      own: true,
    }])
    setDraft('')
  }

  function createRoom() {
    const nextCode = `MKEMO-${Math.floor(1000 + Math.random() * 9000)}`
    setRoomCode(nextCode)
    showNotice(`Your new room is ready. Invite code: ${nextCode}`)
  }

  function openSearch(source: string) {
    setActiveSource(source)
    setNotice(`${source} selected. Search it above to open its video results.`)
  }

  function toggleSavedMedia() {
    if (savedCurrentMedia) {
      setLibrary((items) => items.filter((item) => item.title !== 'The Last City'))
      setSavedCurrentMedia(false)
      showNotice('Removed from your library.')
      return
    }
    setLibrary((items) => [{ title: 'The Last City', source: activeSource, duration: '24:00:00', category: 'Live marathon' }, ...items])
    setSavedCurrentMedia(true)
    showNotice('Saved to your mkemo library.')
  }

  function openLibraryItem(item: LibraryItem) {
    setActiveView('room')
    setVideoId('')
    setDirectVideoUrl('')
    setCurrentTime(0)
    setIsPlaying(false)
    showNotice(`${item.title} is in your library. Connect a supported media source to play it here.`)
  }

  const visibleAddress = address || history[historyIndex]

  return (
    <main className="watch-app">
      <header className="topbar">
        <a href="#home" className="brand" aria-label="mkemo home">
          <span className="brand-mark"><Play size={15} fill="currentColor" /></span>
          <span>mkemo<span className="brand-dot">.</span></span>
        </a>
        <nav className="topbar-links" aria-label="Main navigation">
          <button className={activeView === 'room' ? 'nav-link nav-link-active' : 'nav-link'} type="button" onClick={() => setActiveView('room')}>
            <UsersRound size={15} /> Watch together
          </button>
          <button className={activeView === 'library' ? 'nav-link nav-link-active' : 'nav-link'} type="button" onClick={() => setActiveView('library')}>
            <Film size={15} /> My library
          </button>
        </nav>
        <button className="profile-button" type="button" onClick={() => setActiveView('library')} aria-label="Open your mkemo profile">
          <span className="profile-avatar">M</span><span className="profile-name">Morgan</span><ChevronDown size={14} />
        </button>
      </header>

      <div className="page-wrap">
        {activeView === 'room' ? (
          <>
            <section className="room-heading">
              <div className="room-title-group">
                <button className="back-link" type="button" aria-label="Back to rooms" onClick={() => showNotice('You are already in your current room.')}><ArrowLeft size={18} /></button>
                <div>
                  <div className="eyebrow"><span className="live-dot" /> PRIVATE WATCH ROOM</div>
                  <h1>After hours</h1>
                  <p className="room-subtitle">Movie night, but make it together.</p>
                </div>
              </div>
              <div className="room-actions">
                <div className="people-stack" aria-label="4 members in the room">
                  {roomMembers.slice(0, 3).map((member) => <span key={member.name} className={`avatar avatar-${member.tone}`} title={member.name}>{member.initials}</span>)}
                  <span className="avatar avatar-count">+1</span>
                </div>
                <span className="member-count"><UsersRound size={15} /> 4</span>
                <button className="share-button" type="button" onClick={copyInviteLink}>
                  {copied ? <Check size={15} /> : <Link2 size={15} />}
                  {copied ? 'Link copied' : 'Invite friends'}
                </button>
                <button className="icon-button desktop-only" type="button" onClick={() => showNotice('Room settings are managed by the host.')} aria-label="Room settings"><MoreHorizontal size={19} /></button>
              </div>
            </section>

            <form className="search-bar" onSubmit={navigate}>
              <span className="search-icon"><Search size={18} /></span>
              <input aria-label="Search videos or paste a video link" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search videos or paste a link..." />
              <span className="duration-note"><span className="duration-indicator" /> Supports videos up to 24 hours</span>
              <button className="search-submit" type="submit" aria-label="Search selected service"><Search size={17} /><span>Search</span></button>
            </form>

            <div className="service-row" aria-label="Choose a media service">
              <span className="service-label"><Globe2 size={14} /> Browse a service</span>
              <div className="service-list">
                {sources.map((source) => <button type="button" key={source} className={`service-chip${activeSource === source ? ' service-chip-active' : ''}`} onClick={() => openSearch(source)}>{source}</button>)}
              </div>
              <span className="provider-note"><ShieldCheck size={13} /> Your own subscriptions stay yours</span>
            </div>

            <div className="browser-toolbar">
              <div className="browser-actions">
                <button type="button" className="toolbar-icon" aria-label="Go back" disabled={historyIndex === 0} onClick={goBack}><ArrowLeft size={15} /></button>
                <button type="button" className="toolbar-icon" aria-label="Go forward" disabled={historyIndex >= history.length - 1} onClick={goForward}><ArrowRight size={15} /></button>
                <button type="button" className="toolbar-icon" aria-label="Reload preview" onClick={reloadPage}><span className="refresh-glyph">↻</span></button>
              </div>
              <div className="current-url"><LockKeyhole size={13} /><span>{visibleAddress}</span></div>
              <div className="sync-pill"><span className="sync-dot" /> ROOM PREVIEW</div>
              <button type="button" className="toolbar-icon toolbar-external" aria-label="Open current address in a new tab" onClick={() => window.open(`https://${visibleAddress}`, '_blank', 'noopener,noreferrer')}><ExternalLink size={14} /></button>
            </div>

            <div className="room-layout">
              <section className={`watch-column${fullscreen ? ' is-fullscreen' : ''}`} aria-label="Watch room media">
                <MediaStage
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  isFullscreen={fullscreen}
                  currentTime={currentTime}
                  duration={LONG_VIDEO_DURATION}
                  activeSource={activeSource}
                  videoId={videoId}
                  directVideoUrl={directVideoUrl}
                  onTogglePlay={() => setIsPlaying((playing) => !playing)}
                  onToggleMute={() => setIsMuted((muted) => !muted)}
                  onToggleFullscreen={() => setFullscreen((value) => !value)}
                  onSeek={setCurrentTime}
                  onNotice={showNotice}
                />
                <div className="below-stage">
                  <div className="now-playing">
                    <div className="mini-poster" aria-hidden="true" />
                    <div><span className="muted-label">NOW IN THE ROOM</span><strong>The Last City <span className="playing-indicator">●</span></strong></div>
                  </div>
                  <div className="stage-actions">
                    <button className={`save-media${savedCurrentMedia ? ' is-saved' : ''}`} type="button" onClick={toggleSavedMedia} aria-label={savedCurrentMedia ? 'Remove from your library' : 'Save to your library'}>
                      <Heart size={15} fill={savedCurrentMedia ? 'currentColor' : 'none'} /> {savedCurrentMedia ? 'Saved' : 'Save to library'}
                    </button>
                    <div className="control-permission">
                      <span className="muted-label">CONTROL</span>
                      <button className="permission-select" type="button" onClick={() => setCanControl((value) => !value)}>
                        {canControl ? <UsersRound size={14} /> : <LockKeyhole size={14} />}
                        {canControl ? 'Everyone' : 'Host only'}
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <RoomChat
                messages={messages}
                draft={draft}
                micEnabled={isMicOn}
                onDraftChange={setDraft}
                onSend={sendMessage}
                onMicToggle={() => {
                  setIsMicOn((enabled) => !enabled)
                  showNotice('Microphone button updated in the preview. Live voice chat is not connected yet.')
                }}
                onNotice={showNotice}
              />
            </div>

            <section className="queue-strip" aria-label="Watch queue">
              <div className="queue-title"><div><span className="muted-label">UP NEXT</span><h2>Keep the night going</h2></div><button type="button" onClick={() => showNotice('Add a video link above to queue it for the room.')}><Plus size={15} /> Add video</button></div>
              <div className="queue-card-row">
                {library.slice(0, 3).map((item) => (
                  <button className="queue-card" type="button" key={item.title} onClick={() => openLibraryItem(item)}>
                    <span className="queue-art"><Film size={19} /><span>{item.duration}</span></span>
                    <span className="queue-card-copy"><strong>{item.title}</strong><small>{item.source} · {item.category}</small></span>
                  </button>
                ))}
              </div>
            </section>

            <footer className="room-footer">
              <div className="room-code"><span className="code-icon"><LockKeyhole size={14} /></span><span><small>ROOM CODE</small><strong>{roomCode}</strong></span><button type="button" onClick={copyInviteLink} aria-label="Copy room invite code">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
              <div className="footer-note"><span className="footer-pulse" /> Better together, one frame at a time.</div>
              <button className="create-room" type="button" onClick={createRoom}><Plus size={15} /> New room</button>
            </footer>
          </>
        ) : (
          <section className="library-view">
            <div className="library-heading">
              <div><div className="eyebrow"><span className="live-dot" /> YOUR MKEMO SPACE</div><h1>Your library</h1><p>Everything you want to watch, all in one place.</p></div>
              <div className="account-card"><span className="profile-avatar profile-avatar-large">M</span><span><strong>Morgan</strong><small>@mkemo · Personal library</small></span><ChevronDown size={15} /></div>
            </div>
            <div className="library-toolbar"><div><Film size={17} /><strong>Saved for later</strong><span>{library.length} titles</span></div><button type="button" onClick={() => setActiveView('room')}><Search size={15} /> Find something to watch</button></div>
            {library.length ? (
              <div className="library-grid">
                {library.map((item) => (
                  <article className="library-card" key={item.title}>
                    <button className="library-art" type="button" aria-label={`Watch ${item.title}`} onClick={() => openLibraryItem(item)}>
                      <span className="library-art-icon"><Film size={24} /></span><span className="library-duration">{item.duration}</span><span className="library-play"><Play size={17} fill="currentColor" /></span>
                    </button>
                    <div className="library-item-details"><div><span className="muted-label">{item.source} · {item.category}</span><h2>{item.title}</h2></div><button className="icon-button" type="button" aria-label={`Remove ${item.title} from your library`} onClick={() => setLibrary((items) => items.filter((saved) => saved.title !== item.title))}><X size={16} /></button></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="library-empty"><Film size={26} /><h2>Your list is taking a breather</h2><p>Save videos in a room and they’ll show up here.</p><button type="button" onClick={() => setActiveView('room')}><MessageCircle size={15} /> Back to the room</button></div>
            )}
            <footer className="library-footer"><span>© 2026 mkemo. All rights reserved.</span><span>Privacy · Terms · Your media stays yours.</span></footer>
          </section>
        )}
      </div>

      {notice && <div className="notice" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
      <span className="sr-only"><CircleHelp /> A mkemo watch-room preview with local playback and chat interactions.</span>
    </main>
  )
}

export default WatchRoom


