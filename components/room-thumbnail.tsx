'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { getPlayableSource } from '@/lib/media-url'

type RoomThumbnailProps = {
  mediaUrl: string | null
  title: string
  source: string
  extraViewers: number
}

export function RoomThumbnail({ mediaUrl, title, source, extraViewers }: RoomThumbnailProps) {
  const previewRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [videoUnavailable, setVideoUnavailable] = useState(false)
  const playable = mediaUrl ? getPlayableSource(mediaUrl) : null

  useEffect(() => {
    const element = previewRef.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const youtubeThumbnail = playable?.kind === 'youtube' ? `https://i.ytimg.com/vi/${playable.id}/hqdefault.jpg` : '/cinema-still.png'
  const embedUrl = playable?.kind === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${playable.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${playable.id}&playsinline=1&modestbranding=1&rel=0`
    : ''

  return (
    <span className="discovery-cover" ref={previewRef} aria-label={`${title} on ${source}`}>
      <img className="discovery-cover-poster" src={youtubeThumbnail} alt="" loading="lazy" />
      {isVisible && !videoUnavailable && playable?.kind === 'youtube' && <iframe
        className="discovery-cover-preview"
        src={embedUrl}
        title={`${title} preview`}
        loading="lazy"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />}
      {isVisible && !videoUnavailable && playable?.kind === 'direct' && <video
        className="discovery-cover-preview"
        src={playable.url}
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onError={() => setVideoUnavailable(true)}
      />}
      <span className="cover-play" aria-hidden="true"><Play size={19} fill="currentColor" /></span>
      <span className="cover-source">{source}</span>
      {extraViewers > 0 && <span className="cover-extra-viewers">+{extraViewers}</span>}
    </span>
  )
}
