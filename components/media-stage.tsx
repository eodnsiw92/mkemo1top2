'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import ReactPlayer from 'react-player/lazy'
import {
  Check,
  ChevronDown,
  Expand,
  ExternalLink,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { getPlayableSource } from '@/lib/media-url'

type MediaStageProps = {
  isPlaying: boolean
  isMuted: boolean
  controlsEnabled: boolean
  currentTime: number
  duration: number
  activeSource: string
  mediaUrl: string
  locale: 'ar' | 'en'
  onTogglePlay: () => void
  onToggleMute: () => void
  onPlaybackStateChange: (isPlaying: boolean) => void
  onSeek: (time: number) => void
  onCommitSeek: (time: number) => void
  onProgress: (time: number) => void
  onDurationChange: (duration: number) => void
  onNotice: (message: string) => void
}

type QualityPlayer = {
  getAvailableQualityLevels?: () => string[]
  setPlaybackQuality?: (quality: string) => void
}

type HlsLevel = {
  height?: number
  bitrate?: number
}

type HlsQualityPlayer = {
  levels?: HlsLevel[]
  currentLevel?: number
}

type NativeVideoElement = HTMLVideoElement & { webkitDecodedFrameCount?: number }
type PlaybackStats = { width: number; height: number; fps: number }

const qualityLabels: Record<string, string> = {
  highres: '8K',
  hd4320: '8K',
  hd2160: '4K',
  hd1440: '1440p',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
}

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const remainingSeconds = safe % 60
  return hours > 0
    ? [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, '0')).join(':')
    : `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function readFrameCount(video: NativeVideoElement) {
  if (typeof video.getVideoPlaybackQuality === 'function') return video.getVideoPlaybackQuality().totalVideoFrames
  return video.webkitDecodedFrameCount ?? 0
}

function resolutionLabel(height: number) {
  if (height >= 4320) return '8K'
  if (height >= 2160) return '4K'
  if (height >= 1440) return '1440p'
  if (height >= 1080) return '1080p'
  if (height >= 720) return '720p'
  return `${height}p`
}

export function MediaStage({
  isPlaying,
  isMuted,
  controlsEnabled,
  currentTime,
  duration,
  activeSource,
  mediaUrl,
  locale,
  onTogglePlay,
  onToggleMute,
  onPlaybackStateChange,
  onSeek,
  onCommitSeek,
  onProgress,
  onDurationChange,
  onNotice,
}: MediaStageProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const stageRef = useRef<HTMLElement>(null)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [qualityLevels, setQualityLevels] = useState<string[]>([])
  const [hlsLevels, setHlsLevels] = useState<HlsLevel[]>([])
  const [selectedQuality, setSelectedQuality] = useState('default')
  const [playbackStats, setPlaybackStats] = useState<PlaybackStats | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [playerError, setPlayerError] = useState(false)
  const isArabic = locale === 'ar'
  const labels = isArabic
    ? {
        player: 'مشغل الوسائط المشترك',
        live: 'الغرفة مباشرة',
        preview: 'معاينة الغرفة',
        play: 'تشغيل',
        pause: 'إيقاف مؤقت',
        rewind: 'رجوع 10 ثوانٍ',
        forward: 'تقديم 10 ثوانٍ',
        mute: 'كتم الصوت',
        unmute: 'تشغيل الصوت',
        volume: 'مستوى الصوت',
        fullscreen: 'ملء الشاشة',
        settings: 'إعدادات التشغيل',
        close: 'إغلاق الإعدادات',
        speed: 'سرعة التشغيل',
        quality: 'جودة الفيديو',
        automatic: 'تلقائي',
        sourceQuality: 'حسب جودة المصدر',
        openSource: 'فتح المصدر',
        unsupported: 'يعرض هذا المصدر عناصر التحكم الخاصة به وقد لا تتم مزامنته مع الغرفة.',
        buffering: 'جارٍ تحميل الفيديو…',
        loadError: 'تعذّر تشغيل هذا المصدر. افتحه من زر المصدر.',
        frameRateNote: 'تتوفر 4K/240fps فقط عندما يدعمها المصدر والجهاز والشاشة؛ وتعتمد جودة الصوت على المصدر والجهاز.',
        position: 'موضع التشغيل',
      }
    : {
        player: 'Shared media player',
        live: 'ROOM LIVE',
        preview: 'ROOM PREVIEW',
        play: 'Play',
        pause: 'Pause',
        rewind: 'Rewind 10 seconds',
        forward: 'Skip forward 10 seconds',
        mute: 'Mute',
        unmute: 'Unmute',
        volume: 'Volume',
        fullscreen: 'Enter fullscreen',
        settings: 'Playback settings',
        close: 'Close settings',
        speed: 'Playback speed',
        quality: 'Video quality',
        automatic: 'Auto',
        sourceQuality: 'Set by the source',
        openSource: 'Open source',
        unsupported: 'This source uses its own controls and may not sync with the room.',
        buffering: 'Loading video…',
        loadError: 'This source could not be played here. Open it from the source button.',
        frameRateNote: '4K/240fps is available only when the source, device, and display support it; audio quality depends on the source and device.',
        position: 'Playback position',
      }
  const sourceInfo = mediaUrl ? getPlayableSource(mediaUrl) : null
  const hasPlayableSource = Boolean(sourceInfo)
  const canUseSharedPlayer = Boolean(sourceInfo && ReactPlayer.canPlay(sourceInfo.url))
  const isExternalEmbed = Boolean(sourceInfo && !canUseSharedPlayer)
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  function qualityOptionLabel(quality: string) {
    if (quality.startsWith('hls:')) {
      const level = hlsLevels[Number(quality.slice(4))]
      return level?.height ? resolutionLabel(level.height) : labels.sourceQuality
    }
    return qualityLabels[quality] ?? quality
  }

  const selectedQualityLabel = selectedQuality === 'default' ? labels.automatic : qualityOptionLabel(selectedQuality)

  useEffect(() => {
    setQualityLevels([])
    setHlsLevels([])
    setSelectedQuality('default')
    setPlaybackStats(null)
    setPlayerError(false)
    setBuffering(Boolean(mediaUrl))
    setSettingsOpen(false)
  }, [mediaUrl])

  useEffect(() => {
    if (!mediaUrl || !playerRef.current || !Number.isFinite(currentTime)) return
    const playerTime = playerRef.current.getCurrentTime()
    if (typeof playerTime === 'number' && Math.abs(playerTime - currentTime) > 2) {
      playerRef.current.seekTo(currentTime, 'seconds')
    }
  }, [currentTime, mediaUrl])

  useEffect(() => {
    if (!mediaUrl || !canUseSharedPlayer || buffering) return
    const video = playerRef.current?.getInternalPlayer() as NativeVideoElement | null | undefined
    if (!video || typeof video.videoWidth !== 'number') return

    let previousFrameCount = readFrameCount(video)
    let previousSampleTime = performance.now()
    const samplePlayback = () => {
      const sampleTime = performance.now()
      const frameCount = readFrameCount(video)
      const elapsed = Math.max(1, sampleTime - previousSampleTime)
      const fps = Math.max(0, Math.round(((frameCount - previousFrameCount) * 1000) / elapsed))
      setPlaybackStats({ width: video.videoWidth, height: video.videoHeight, fps })
      previousFrameCount = frameCount
      previousSampleTime = sampleTime
    }

    samplePlayback()
    const intervalId = window.setInterval(samplePlayback, 1000)
    return () => window.clearInterval(intervalId)
  }, [buffering, canUseSharedPlayer, mediaUrl])

  useEffect(() => {
    if (!settingsOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSettingsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [settingsOpen])

  function handlePlayerReady() {
    setBuffering(false)
    setPlayerError(false)
    const hlsPlayer = playerRef.current?.getInternalPlayer('hls') as HlsQualityPlayer | null | undefined
    const levels = hlsPlayer?.levels ?? []
    if (levels.length) {
      setHlsLevels(levels)
      const distinctHeights = levels
        .map((level, index) => ({ level, index }))
        .filter(({ level }) => Number(level.height) > 0)
        .sort((a, b) => (b.level.height ?? 0) - (a.level.height ?? 0) || (b.level.bitrate ?? 0) - (a.level.bitrate ?? 0))
        .filter((entry, index, options) => options.findIndex((option) => option.level.height === entry.level.height) === index)
      setQualityLevels(distinctHeights.map(({ index }) => `hls:${index}`))
      return
    }

    const internalPlayer = playerRef.current?.getInternalPlayer() as QualityPlayer | null | undefined
    const availableLevels = internalPlayer?.getAvailableQualityLevels?.()
    if (availableLevels?.length) {
      setQualityLevels(Array.from(new Set(availableLevels)).filter((quality) => quality !== 'default'))
    }
  }

  function handleQualityChange(quality: string) {
    setSelectedQuality(quality)
    const hlsPlayer = playerRef.current?.getInternalPlayer('hls') as HlsQualityPlayer | null | undefined
    if (quality === 'default') {
      if (hlsPlayer) hlsPlayer.currentLevel = -1
      else {
        const internalPlayer = playerRef.current?.getInternalPlayer() as QualityPlayer | null | undefined
        internalPlayer?.setPlaybackQuality?.('default')
      }
      return
    }
    if (quality.startsWith('hls:')) {
      const levelIndex = Number(quality.slice(4))
      if (Number.isInteger(levelIndex) && hlsPlayer?.levels?.[levelIndex]) hlsPlayer.currentLevel = levelIndex
      return
    }
    const internalPlayer = playerRef.current?.getInternalPlayer() as QualityPlayer | null | undefined
    internalPlayer?.setPlaybackQuality?.(quality)
  }

  function updateVolume(value: number) {
    const nextVolume = Math.min(1, Math.max(0, value))
    setVolume(nextVolume)
    if (nextVolume === 0 && !isMuted) onToggleMute()
    if (nextVolume > 0 && isMuted) onToggleMute()
  }

  function toggleMute() {
    if (!isMuted && volume === 0) setVolume(1)
    onToggleMute()
  }

  function toggleFullscreen() {
    if (!stageRef.current) return
    if (!document.fullscreenElement) {
      void stageRef.current.requestFullscreen?.().catch(() => {
        onNotice(isArabic ? 'ملء الشاشة غير متاح في هذا المتصفح.' : 'Fullscreen is not available in this browser.')
      })
    } else {
      void document.exitFullscreen?.()
    }
  }

  function seekTo(time: number) {
    const nextTime = Math.max(0, Math.min(duration || time, time))
    playerRef.current?.seekTo(nextTime, 'seconds')
    onCommitSeek(nextTime)
  }

  function seekBy(seconds: number) {
    seekTo(currentTime + seconds)
  }

  function handlePlayerError() {
    setBuffering(false)
    setPlayerError(true)
    onNotice(isArabic ? labels.loadError : labels.loadError)
  }

  return (
    <section className={`media-stage${isExternalEmbed ? ' media-stage-embed' : ''}`} aria-label={labels.player} ref={stageRef}>
      {canUseSharedPlayer && sourceInfo ? (
        <ReactPlayer
          ref={playerRef}
          className="stage-react-player"
          url={sourceInfo.url}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={false}
          muted={isMuted || volume === 0}
          volume={volume}
          playbackRate={playbackRate}
          playsinline
          progressInterval={250}
          stopOnUnmount
          config={{ file: { attributes: { preload: 'auto' } } }}
          fallback={<div className="stage-player-loading">{isArabic ? 'جارٍ تجهيز المشغل…' : 'Preparing player…'}</div>}
          onReady={handlePlayerReady}
          onProgress={(state) => {
            setBuffering(false)
            onProgress(state.playedSeconds)
          }}
          onDuration={onDurationChange}
          onPlay={() => {
            setBuffering(false)
            onPlaybackStateChange(true)
          }}
          onPause={() => onPlaybackStateChange(false)}
          onEnded={() => onPlaybackStateChange(false)}
          onBuffer={() => setBuffering(true)}
          onBufferEnd={() => setBuffering(false)}
          onError={handlePlayerError}
        />
      ) : isExternalEmbed && sourceInfo ? (
        <>
          <iframe
            className="stage-embed-frame"
            src={sourceInfo.url}
            title={`${sourceInfo.label} embedded player`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-forms allow-presentation"
            allowFullScreen
          />
          <div className="stage-embed-tools">
            <span>{labels.unsupported}</span>
            <a href={sourceInfo.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13} /> {labels.openSource}
            </a>
          </div>
        </>
      ) : (
        <>
          <img className="stage-backdrop" src="/cinema-still.png" alt={isArabic ? 'مسافر يطل على مدينة عند الغروب' : 'A traveler looking over a city at sunset'} />
          <div className="stage-tint" />
          <div className="stage-film-info"><span>{isArabic ? 'اختيار الليلة' : "TONIGHT'S PICK"} <i /> {isArabic ? 'معاينة أصلية' : 'ORIGINAL PREVIEW'}</span><h2>{isArabic ? 'المدينة الأخيرة' : 'The Last City'}</h2><p>{isArabic ? 'حين تنطفئ الأنوار، تبدأ حكايتهم.' : 'When the lights go out, their story begins.'}</p><div className="film-tags"><span>{isArabic ? 'خيال علمي' : 'Sci-fi'}</span><span>{isArabic ? 'سهرة مشاهدة' : 'Movie night'}</span><span className="rating">★ 8.7</span></div></div>
          <button className="stage-play-button" type="button" disabled={!controlsEnabled} onClick={() => onNotice(isArabic ? 'ألصق رابط فيديو آمنًا لبدء المشاهدة.' : 'Paste a secure video link above to start watching.')} aria-label={isArabic ? 'ابدأ المشاهدة' : 'Start watching'}><Play size={24} fill="currentColor" /></button>
        </>
      )}

      <div className="stage-topbar">
        <span className="stage-live"><i /> {labels.live}</span>
        <div className="stage-topbar-actions">
          <span className="stage-source-chip">{hasPlayableSource ? activeSource : labels.preview}</span>
          {playbackStats && playbackStats.height > 0 && <span className="stage-performance-badge" aria-label={isArabic ? `${resolutionLabel(playbackStats.height)}، ${playbackStats.fps} إطار في الثانية` : `${resolutionLabel(playbackStats.height)}, ${playbackStats.fps} frames per second`}>{resolutionLabel(playbackStats.height)} · {playbackStats.fps > 0 ? `${playbackStats.fps} FPS` : '-- FPS'}</span>}
          {isExternalEmbed && sourceInfo && <a className="stage-quality" href={sourceInfo.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> {labels.openSource}</a>}
        </div>
      </div>

      {!isExternalEmbed && (
        <>
          {buffering && hasPlayableSource && <div className="stage-buffering" role="status"><LoaderCircle size={22} className="stage-spinner" /><span>{labels.buffering}</span></div>}
          {playerError && mediaUrl && <div className="stage-player-error" role="alert"><span>{labels.loadError}</span><a href={mediaUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> {labels.openSource}</a></div>}
          <div className="stage-controls" dir="ltr">
            <div className="stage-control-group stage-control-main">
              <button className="stage-play-control" type="button" onClick={onTogglePlay} disabled={!controlsEnabled || !hasPlayableSource} aria-label={isPlaying ? labels.pause : labels.play}>
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
              <button className="stage-skip-control" type="button" onClick={() => seekBy(-10)} disabled={!controlsEnabled || !hasPlayableSource} aria-label={labels.rewind}><RotateCcw size={15} /></button>
              <button className="stage-skip-control" type="button" onClick={() => seekBy(10)} disabled={!controlsEnabled || !hasPlayableSource} aria-label={labels.forward}><RotateCw size={15} /></button>
              <div className="stage-volume-control">
                <button type="button" onClick={toggleMute} aria-label={isMuted || volume === 0 ? labels.unmute : labels.mute}>
                  {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <input className="stage-volume-slider" type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} aria-label={labels.volume} aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)}%`} onChange={(event) => updateVolume(Number(event.target.value))} />
              </div>
              <span className="stage-time">{formatTime(currentTime)} <i>/ {duration > 0 ? formatTime(duration) : '--:--'}</i></span>
            </div>
            <div className="stage-control-group stage-control-actions">
              <button type="button" className="stage-settings-toggle" onClick={() => setSettingsOpen((open) => !open)} aria-label={labels.settings} aria-expanded={settingsOpen} aria-haspopup="dialog" aria-controls="stage-settings-panel">
                <Settings2 size={17} />
              </button>
              <button type="button" className="fullscreen-button" onClick={toggleFullscreen} aria-label={labels.fullscreen}><Expand size={16} /></button>
            </div>
          </div>
          <input
            className="stage-progress"
            aria-label={labels.position}
            type="range"
            min={0}
            max={Math.max(duration, 1)}
            step={0.25}
            value={Math.min(currentTime, Math.max(duration, 1))}
            style={{ '--progress': `${progress}%` } as CSSProperties}
            onChange={(event) => {
              const nextTime = Number(event.target.value)
              playerRef.current?.seekTo(nextTime, 'seconds')
              onSeek(nextTime)
            }}
            onPointerUp={(event) => onCommitSeek(Number(event.currentTarget.value))}
            onKeyUp={(event) => onCommitSeek(Number(event.currentTarget.value))}
            disabled={!controlsEnabled || !hasPlayableSource}
          />
          {settingsOpen && (
            <div className="stage-settings-panel" id="stage-settings-panel" role="dialog" aria-label={labels.settings}>
              <div className="stage-settings-heading">
                <div><strong>{labels.settings}</strong><span>{hasPlayableSource ? activeSource : labels.preview}{selectedQuality !== 'default' ? ` · ${selectedQualityLabel}` : ''}</span></div>
                <button type="button" onClick={() => setSettingsOpen(false)} aria-label={labels.close}><X size={15} /></button>
              </div>
              <label className="stage-settings-row">
                <span>{labels.speed}</span>
                <span className="stage-select-wrap"><select aria-label={labels.speed} value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}>{playbackSpeeds.map((speed) => <option key={speed} value={speed}>{speed}×</option>)}</select><ChevronDown size={13} /></span>
              </label>
              <label className="stage-settings-row">
                <span>{labels.quality}</span>
                {qualityLevels.length > 0 ? (
                  <span className="stage-select-wrap"><select aria-label={labels.quality} value={selectedQuality} onChange={(event) => handleQualityChange(event.target.value)}><option value="default">{labels.automatic}</option>{qualityLevels.map((quality) => <option key={quality} value={quality}>{qualityOptionLabel(quality)}</option>)}</select><ChevronDown size={13} /></span>
                ) : <span className="stage-setting-static">{canUseSharedPlayer ? labels.automatic : labels.sourceQuality}</span>}
              </label>
              <label className="stage-settings-row stage-settings-volume">
                <span>{labels.volume}</span>
                <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} aria-label={labels.volume} onChange={(event) => updateVolume(Number(event.target.value))} />
              </label>
              <p className="stage-settings-note">{labels.frameRateNote}</p>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default MediaStage
