'use client'

import { useEffect, useRef } from 'react'
import {
  Expand,
  LockKeyhole,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react'

type MediaStageProps = {
  isPlaying: boolean
  isMuted: boolean
  controlsEnabled: boolean
  isFullscreen: boolean
  currentTime: number
  duration: number
  activeSource: string
  videoId: string
  directVideoUrl: string
  onTogglePlay: () => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSeek: (time: number) => void
  onDurationChange: (duration: number) => void
  onNotice: (message: string) => void
}

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const remainingSeconds = safe % 60
  return hours > 0
    ? [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, '0')).join(':')
    : `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export function MediaStage({
  isPlaying,
  isMuted,
  controlsEnabled,
  isFullscreen,
  currentTime,
  duration,
  activeSource,
  videoId,
  directVideoUrl,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
  onDurationChange,
  onNotice,
}: MediaStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const youtubeFrameRef = useRef<HTMLIFrameElement>(null)
  const stageRef = useRef<HTMLElement>(null)
  const hasPlayableSource = Boolean(videoId || directVideoUrl)
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        void video.play().catch(() => onNotice('Press play on the video to begin playback.'))
      } else {
        video.pause()
      }
    }
    if (videoId) {
      youtubeFrameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: isPlaying ? 'playVideo' : 'pauseVideo', args: [] }),
        'https://www.youtube-nocookie.com',
      )
    }
  }, [isPlaying, directVideoUrl, videoId, onNotice])

  useEffect(() => {
    if (videoId) {
      youtubeFrameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: [] }),
        'https://www.youtube-nocookie.com',
      )
    }
  }, [isMuted, videoId])

  useEffect(() => {
    if (videoId && currentTime > 0) {
      youtubeFrameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [currentTime, true] }),
        'https://www.youtube-nocookie.com',
      )
    }
  }, [currentTime, videoId])

  useEffect(() => {
    const video = videoRef.current
    if (video && directVideoUrl && video.readyState > 0 && Math.abs(video.currentTime - currentTime) > 2) {
      video.currentTime = currentTime
    }
  }, [currentTime, directVideoUrl])

  function toggleFullscreen() {
    if (!stageRef.current) return
    if (!document.fullscreenElement) {
      void stageRef.current.requestFullscreen?.().catch(() => onNotice('Theater mode is not available in this browser.'))
    } else {
      void document.exitFullscreen?.()
    }
    onToggleFullscreen()
  }

  function seekBy(seconds: number) {
    onSeek(Math.max(0, Math.min(duration, currentTime + seconds)))
  }

  return (
    <section className={`media-stage${isFullscreen ? ' media-stage-fullscreen' : ''}${videoId ? ' media-stage-youtube' : ''}`} aria-label="Shared media player" ref={stageRef}>
      {directVideoUrl ? (
        <video
          ref={videoRef}
          className="stage-video"
          src={directVideoUrl}
          playsInline
          muted={isMuted}
          onTimeUpdate={(event) => onSeek(Math.floor(event.currentTarget.currentTime))}
          onDurationChange={(event) => {
            const nextDuration = event.currentTarget.duration
            if (Number.isFinite(nextDuration) && nextDuration > 0) onDurationChange(Math.floor(nextDuration))
          }}
          onPlay={() => { if (!isPlaying) onTogglePlay() }}
          onPause={() => { if (isPlaying) onTogglePlay() }}
        />
      ) : videoId ? (
        <iframe
          ref={youtubeFrameRef}
          className="stage-video"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?controls=0&rel=0&enablejsapi=1&origin=${encodeURIComponent(typeof window === 'undefined' ? '' : window.location.origin)}`}
          title="YouTube video in mkemo room"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          <img className="stage-backdrop" src="/cinema-still.png" alt="A traveler looking over a city at sunset" />
          <div className="stage-tint" />
          <div className="stage-film-info"><span>TONIGHT&apos;S PICK <i /> ORIGINAL PREVIEW</span><h2>The Last City</h2><p>When the lights go out, their story begins.</p><div className="film-tags"><span>Sci-fi</span><span>Movie night</span><span className="rating">★ 8.7</span></div></div>
          <button className="stage-play-button" type="button" disabled={!controlsEnabled} onClick={() => onNotice('Paste a YouTube or direct video link above to start watching.')} aria-label="Start watching"><Play size={24} fill="currentColor" /></button>
          
        </>
      )}
      <div className="stage-topbar"><span className="stage-live"><i /> LIVE ROOM</span><button type="button" className="stage-quality" onClick={() => onNotice('Video quality is selected by the source player.')}><span>{hasPlayableSource ? activeSource : 'ROOM PREVIEW'}</span><LockKeyhole size={12} /></button></div>
      <div className="stage-controls">
        <div className="stage-control-group"><button type="button" onClick={onTogglePlay} disabled={!controlsEnabled} aria-label={isPlaying ? 'Pause playback' : 'Play playback'}>{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button><button type="button" onClick={() => seekBy(-10)} disabled={!controlsEnabled} aria-label="Rewind 10 seconds"><RotateCcw size={15} /></button><button type="button" onClick={() => seekBy(10)} disabled={!controlsEnabled} aria-label="Skip forward 10 seconds"><RotateCw size={15} /></button><button type="button" onClick={onToggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button><span className="stage-time">{formatTime(currentTime)} <i>/ {duration > 0 ? formatTime(duration) : '--:--'}</i></span></div>
        <button type="button" className="fullscreen-button" onClick={toggleFullscreen} aria-label="Toggle theater mode"><Expand size={15} /></button>
      </div>
      <input className="stage-progress" aria-label="Playback position" type="range" min={0} max={Math.max(duration, 1)} value={Math.min(currentTime, Math.max(duration, 1))} style={{ '--progress': `${progress}%` } as React.CSSProperties} onChange={(event) => onSeek(Number(event.target.value))} disabled={!controlsEnabled} />
    </section>
  )
}

export default MediaStage
