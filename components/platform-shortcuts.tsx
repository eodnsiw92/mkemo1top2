'use client'

import { Globe2, Heart, History as HistoryIcon, Images, ListMusic, MicVocal, type LucideIcon } from 'lucide-react'

type PlatformShortcutsProps = {
  locale: 'ar' | 'en'
  onSelectPlatform: (platform: string) => void
}

type Shortcut = {
  id: string
  label: { ar: string; en: string }
  href: string
  asset?: string
  icon?: LucideIcon
  wordmark?: string
  source?: string
  suffix?: string
}

const logo = 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons'

const shortcuts: Shortcut[] = [
  { id: 'youtube', label: { ar: 'YouTube', en: 'YouTube' }, href: 'https://www.youtube.com/', asset: `${logo}/youtube/wordmarkLight.svg`, source: 'YouTube' },
  { id: 'x', label: { ar: 'X', en: 'X' }, href: 'https://x.com/', asset: `${logo}/x/mono.svg` },
  { id: 'netflix', label: { ar: 'Netflix', en: 'Netflix' }, href: 'https://www.netflix.com/', asset: `${logo}/netflix/wordmark.svg`, source: 'Netflix' },
  { id: 'prime', label: { ar: 'Prime Video', en: 'Prime Video' }, href: 'https://www.primevideo.com/', wordmark: 'prime', source: 'Prime Video' },
  { id: 'crunchyroll', label: { ar: 'Crunchyroll', en: 'Crunchyroll' }, href: 'https://www.crunchyroll.com/', asset: `${logo}/crunchyroll/wordmarkLight.svg` },
  { id: 'tubi', label: { ar: 'Tubi', en: 'Tubi' }, href: 'https://tubitv.com/', asset: `${logo}/tubi/mono.svg` },
  { id: 'twitch', label: { ar: 'Twitch', en: 'Twitch' }, href: 'https://www.twitch.tv/', wordmark: 'twitch' },
  { id: 'youtube-live', label: { ar: 'YouTube Live', en: 'YouTube Live' }, href: 'https://www.youtube.com/live', asset: `${logo}/youtube/mono.svg`, suffix: 'LIVE', source: 'YouTube' },
  { id: 'playlist', label: { ar: 'Playlist', en: 'Playlist' }, href: 'https://www.youtube.com/feed/playlists', icon: ListMusic, wordmark: 'Playlist' },
  { id: 'drive', label: { ar: 'Google Drive', en: 'Google Drive' }, href: 'https://drive.google.com/', asset: `${logo}/google-drive/mono.svg`, wordmark: 'Drive' },
  { id: 'photos', label: { ar: 'Photos', en: 'Photos' }, href: 'https://photos.google.com/', icon: Images, wordmark: 'Photos' },
  { id: 'web', label: { ar: 'تصفح الويب', en: 'Browse the web' }, href: 'https://www.google.com/', icon: Globe2, wordmark: 'WEB' },
  { id: 'karaoke', label: { ar: 'Karaoke', en: 'Karaoke' }, href: 'https://www.youtube.com/results?search_query=karaoke', icon: MicVocal, wordmark: 'Karaoke' },
  { id: 'likes', label: { ar: 'Likes', en: 'Likes' }, href: 'https://www.youtube.com/playlist?list=LL', icon: Heart, wordmark: 'Likes' },
  { id: 'history', label: { ar: 'History', en: 'History' }, href: 'https://www.youtube.com/feed/history', icon: HistoryIcon, wordmark: 'History' },
]

export function PlatformShortcuts({ locale, onSelectPlatform }: PlatformShortcutsProps) {
  return (
    <nav className="platform-shortcuts" aria-label={locale === 'ar' ? 'اختصارات المنصات والخدمات' : 'Platform and service shortcuts'}>
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon
        return (
          <a
            key={shortcut.id}
            className={`platform-shortcut platform-shortcut-${shortcut.id}`}
            href={shortcut.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={shortcut.label[locale]}
            onClick={() => shortcut.source && onSelectPlatform(shortcut.source)}
          >
            <span className="platform-shortcut-visual" aria-hidden="true">
              {shortcut.asset && <img src={shortcut.asset} alt="" loading="lazy" referrerPolicy="no-referrer" />}
              {Icon && <Icon className="platform-shortcut-icon" strokeWidth={1.8} />}
              {shortcut.wordmark && <span className="platform-shortcut-wordmark">{shortcut.wordmark}</span>}
              {shortcut.suffix && <span className="platform-shortcut-suffix">{shortcut.suffix}</span>}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
