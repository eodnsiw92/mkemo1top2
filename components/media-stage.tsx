'use client'

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
  isFullscreen: boolean
  currentTime: number
  duration: number
  activeSource: string
  onTogglePlay: () => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSeek: (time: number) => void
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export function MediaStage({
  isPlaying,
  isMuted,
  isFullscreen,
  currentTime,
  duration,
  activeSource,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
}: MediaStageProps) {
  const progress = Math.min((currentTime / duration) * 100, 100)

  return (
    <section className={`media-stage${isFullscreen ? ' media-stage-fullscreen' : ''}`} aria-label="Shared media player">
      <div className="stage-image" role="img" aria-label="A cinematic view of a futuristic city at dusk" />
      <div className="stage-scrim" />
      <div className="stage-topline">
        <span className="stage-live"><span className="live-dot" /> LIVE ROOM</span>
        <span className="stage-quality">HD <span aria-hidden="true">·</span> 1080p</span>
      </div>
      <div className="film-info">
        <span className="film-kicker">TONIGHT&apos;S PICK <span>·</span> 2026</span>
        <h2>The Last City</h2>
        <p>When the lights go out, their story begins.</p>
        <div className="film-meta"><span>Sci-fi</span><span>1h 48m</span><span className="rating">★ 8.7</span></div>
      </div>
      <button className="big-play" type="button" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause playback' : 'Start playback'}>
        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
      </button>
      <button className="stage-expand" type="button" onClick={onToggleFullscreen} aria-label={isFullscreen ? 'Exit theater mode' : 'Enter theater mode'}>
        <Expand size={16} />
      </button>
      <div className="stage-bottom">
        <div className="video-controls">
          <button type="button" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button type="button" onClick={() => onSeek(Math.max(0, currentTime - 10))} aria-label="Rewind 10 seconds"><RotateCcw size={15} /></button>
          <button type="button" onClick={() => onSeek(Math.min(duration, currentTime + 10))} aria-label="Skip forward 10 seconds"><RotateCw size={15} /></button>
          <button type="button" onClick={onToggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="timecode">{formatTime(currentTime)} <span>/ {formatTime(duration)}</span></span>
        </div>
        <span className="playback-mode"><LockKeyhole size={12} /> Host controls</span>
      </div>
      <input
        className="progress-slider"
        aria-label="Playback position"
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
        onChange={(event) => onSeek(Number(event.target.value))}
      />
      <div className="stage-source"><span className="source-dot" /> Playing from <strong>{activeSource}</strong></div>
    </section>
  )
}

export default MediaStage


