'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  ArrowLeft,
  Globe2,
  Heart,
  History,
  Home,
  Images,
  ListMusic,
  Mic2,
  Radio,
  Search,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'

type MediaService = {
  name: string
  icon: LucideIcon
  brand?: string
  logo?: string
  tone: string
}

type MediaSearchHubProps = {
  locale: 'ar' | 'en'
  initialQuery: string
  onBack: () => void
  onOpenHome: () => void
  onOpenRoom: () => void
  onOpenProfile: () => void
  onSearch: (query: string) => void
  onSelectService: (service: string, query: string) => void
}

const leftServices: MediaService[] = [
  { name: 'YouTube', icon: Radio, logo: 'youtube/default', tone: 'youtube' },
  { name: 'NETFLIX', icon: Radio, logo: 'netflix/wordmark', tone: 'netflix' },
  { name: 'Crunchyroll', icon: Radio, logo: 'crunchyroll/default', tone: 'crunchyroll' },
  { name: 'twitch', icon: Radio, logo: 'twitch/default', tone: 'twitch' },
  { name: 'Playlist', icon: ListMusic, tone: 'playlist' },
  { name: 'Photos', icon: Images, logo: 'google-photos/default', tone: 'photos' },
  { name: 'Likes', icon: Heart, tone: 'likes' },
]

const rightServices: MediaService[] = [
  { name: 'X', icon: Radio, logo: 'x/mono', tone: 'x' },
  { name: 'Prime Video', icon: Radio, logo: 'prime-video/default', tone: 'prime' },
  { name: 'tubi', icon: Radio, logo: 'tubi/default', tone: 'tubi' },
  { name: 'YouTube Live', icon: Radio, logo: 'youtube/default', tone: 'youtube-live' },
  { name: 'Drive', icon: Images, logo: 'google-drive/default', tone: 'drive' },
  { name: 'WEB', icon: Globe2, tone: 'web' },
  { name: 'Karaoke', icon: Mic2, tone: 'karaoke' },
  { name: 'History', icon: History, tone: 'history' },
]

const brandAssetUrl = (asset: string) => `https://thesvg.org/icons/${asset}.svg`

export function MediaSearchHub({ locale, initialQuery, onBack, onOpenHome, onOpenRoom, onOpenProfile, onSearch, onSelectService }: MediaSearchHubProps) {
  const [query, setQuery] = useState(initialQuery)
  const isArabic = locale === 'ar'

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (value) onSearch(value)
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function renderService(service: MediaService) {
    const Icon = service.icon
    return (
      <button className={`media-service media-service-${service.tone}`} type="button" key={service.name} onClick={() => onSelectService(service.name, query.trim())}>
        <span className="media-service-mark" aria-hidden="true">
          {service.logo ? <img src={brandAssetUrl(service.logo)} alt="" loading="lazy" /> : <Icon size={22} strokeWidth={1.8} />}
        </span>
        <span className="media-service-name">{service.name}</span>
        <span className="media-service-action" aria-hidden="true"><ArrowLeft size={14} /></span>
      </button>
    )
  }

  return (
    <section className="media-hub" dir={isArabic ? 'rtl' : 'ltr'} aria-label={isArabic ? 'البحث والمنصات' : 'Search and media platforms'}>
      <div className="media-hub-glow media-hub-glow-one" aria-hidden="true" />
      <div className="media-hub-glow media-hub-glow-two" aria-hidden="true" />
      <div className="media-hub-content">
        <div className="media-hub-heading">
          <button className="media-hub-back" type="button" onClick={onBack} aria-label={isArabic ? 'رجوع' : 'Back'}><ArrowLeft size={18} /></button>
          <div><span>{isArabic ? 'كل ما تحب، في مكان واحد' : 'YOUR ENTERTAINMENT, CONNECTED'}</span><h1>{isArabic ? 'ابحث واكتشف' : 'Search & explore'}</h1></div>
        </div>

        <form className="media-hub-search" role="search" onSubmit={submitSearch}>
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={isArabic ? 'بحث' : 'Search movies, shows, and more'}
            aria-label={isArabic ? 'بحث عن محتوى' : 'Search for media'}
            autoComplete="off"
          />
          <button type="submit" aria-label={isArabic ? 'بحث' : 'Search'}><Search size={17} /></button>
        </form>

        <div className="media-hub-section-heading">
          <div><h2>{isArabic ? 'منصاتك واختصاراتك' : 'Your platforms & shortcuts'}</h2><p>{isArabic ? 'اختر وجهتك لفتح البحث الرسمي' : 'Choose a destination to open its official search'}</p></div>
          <span>{isArabic ? '١٥ وجهة' : '15 DESTINATIONS'}</span>
        </div>

        <div className="media-service-grid" aria-label={isArabic ? 'منصات الوسائط' : 'Media services'}>
          {[...leftServices, ...rightServices].map(renderService)}
        </div>

        <p className="media-hub-note">{isArabic ? 'سيُفتح المحتوى على موقع الخدمة الرسمي. استخدم اشتراكك وحسابك الخاص.' : 'Services open on their official websites. Use your own account and subscription.'}</p>
      </div>

      <nav className="media-mobile-nav" aria-label={isArabic ? 'التنقل' : 'Navigation'}>
        <button type="button" onClick={onOpenHome}><Home size={19} /><span>{isArabic ? 'الرئيسية' : 'Home'}</span></button>
        <button className="is-current" type="button" aria-current="page"><Search size={19} /><span>{isArabic ? 'بحث' : 'Search'}</span></button>
        <button type="button" onClick={onOpenRoom}><UsersRound size={19} /><span>{isArabic ? 'مشاهدة' : 'Watch'}</span></button>
        <button type="button" onClick={onOpenProfile}><Heart size={19} /><span>{isArabic ? 'مساحتي' : 'My space'}</span></button>
      </nav>
    </section>
  )
}

export default MediaSearchHub
