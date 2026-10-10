'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ChevronDown, ChevronLeft, Globe2, Languages, Play, Plus, Search, ShieldCheck, Sparkles, UsersRound, X } from 'lucide-react'

type DiscoverRoom = {
  id: string
  title: string
  genre: string
  source: string
  image: string
  host: string
  titleEn: string
  genreEn: string
  hostEn: string
  viewers: number
  avatars: string[]
}

type RoomDiscoveryProps = {
  locale: 'ar' | 'en'
  onToggleLocale: () => void
  onOpenProfile: () => void
  onJoinRoom: (title: string, source: string, isPublic: boolean) => void
  onNotice: (message: string) => void
}

const platforms = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']
const rooms: DiscoverRoom[] = [
  { id: 'night-city', title: 'ليلة على سطح المدينة', titleEn: 'Rooftop city night', genre: 'خيال علمي', genreEn: 'Sci-fi', source: 'YouTube', image: '/discovery-night.png', host: 'ليان', hostEn: 'Layan', viewers: 4, avatars: ['ل', 'م', 'س', 'ر'] },
  { id: 'moon-tale', title: 'حكاية ضوء القمر', titleEn: 'A moonlit story', genre: 'أنمي · مغامرة', genreEn: 'Anime · Adventure', source: 'Netflix', image: '/discovery-anime.png', host: 'سامي', hostEn: 'Sami', viewers: 5, avatars: ['س', 'ه', 'ع', 'ن', 'م'] },
  { id: 'little-fox', title: 'رحلة الثعلب الصغير', titleEn: 'The little fox expedition', genre: 'كرتون · عائلي', genreEn: 'Animation · Family', source: 'Disney+', image: '/discovery-cartoon.png', host: 'نور', hostEn: 'Noor', viewers: 3, avatars: ['ن', 'ي', 'ل'] },
  { id: 'after-hours', title: 'سهرة بعد منتصف الليل', titleEn: 'After midnight', genre: 'دراما · حلقات', genreEn: 'Drama · Series', source: 'Prime Video', image: '/cinema-still.png', host: 'عمر', hostEn: 'Omar', viewers: 6, avatars: ['ع', 'ج', 'د', 'م', 'ل'] },
  { id: 'open-screen', title: 'اختيارات المجتمع', titleEn: 'Community picks', genre: 'مقاطع مختارة', genreEn: 'Curated videos', source: 'YouTube', image: '/discovery-night.png', host: 'ريم', hostEn: 'Reem', viewers: 2, avatars: ['ر', 'أ'] },
]

const avatarColors = ['avatar-lilac', 'avatar-blue', 'avatar-peach', 'avatar-mint', 'avatar-violet']

const copy = {
  ar: {
    language: 'English', tagline: 'مكانكم للأفلام والأنمي واللحظات الحلوة', headline: 'شاهدوا سوا.', search: 'ابحث عن غرفة، فيلم، مسلسل...',
    sourceLabel: 'مصدر المشاهدة', allPlatforms: 'كل المنصات', choosePlatform: 'اختر منصة المشاهدة', visibility: 'ظهور الغرفة', public: 'عام', private: 'خاصة',
    listTitle: 'غرف تستاهل المشاهدة', listSubtitle: 'اختاروا الليلة اللي على مزاجكم', preview: 'معاينة', startedBy: 'بدأها', watching: 'مشاهدين',
    emptyTitle: 'ما لقينا غرف بهالبحث', emptyDescription: 'جرّب اسم ثاني أو اختار كل المنصات.', legal: 'كل شخص يستخدم اشتراكه الخاص. Netflix والمنصات المحمية تفتح رسميًا بدون مشاركة كلمات المرور أو تجاوز DRM.',
    fps: 'سلاسة تصل إلى 120 إطار/ث عند دعم الجهاز والمتصفح ومصدر الفيديو.', create: 'إنشاء غرفة مشاهدة', invite: 'دعوة أصدقاء', roomPlaceholder: 'مثلاً: سهرة الأنمي', roomName: 'اسم الغرفة',
    createTitle: 'جهّزوا سهرتكم', createDescription: 'سمّ الغرفة، اختاروا منصة، وشاركوا الرابط مع أصحابكم.', createRoom: 'إنشاء غرفة معاينة', close: 'إغلاق',
    previewNotice: 'الغرفة معروضة كمعاينة. مزامنة الأصدقاء تحتاج خدمة غرف مشتركة.', joinedNotice: 'معاينة الغرفة جاهزة. المحتوى المحمي يفتح في منصة المشاهدة الرسمية.', shareNotice: 'شارك الغرفة بعد ربط خدمة الدعوات والحسابات.',
  },
  en: {
    language: 'العربية', tagline: 'Movies, anime, and good nights belong together', headline: 'Watch together.', search: 'Search rooms, movies, shows...',
    sourceLabel: 'WATCH FROM', allPlatforms: 'All platforms', choosePlatform: 'Choose a streaming platform', visibility: 'ROOM VISIBILITY', public: 'Public', private: 'Private',
    listTitle: 'Rooms worth watching', listSubtitle: 'Pick tonight’s mood', preview: 'PREVIEW', startedBy: 'Started by', watching: 'watching',
    emptyTitle: 'No rooms found', emptyDescription: 'Try another search or choose all platforms.', legal: 'Everyone uses their own subscription. Netflix and protected services open officially; passwords are never shared and DRM is never bypassed.',
    fps: 'Up to 120 fps when supported by the device, browser, and video source.', create: 'Create a watch room', invite: 'Invite friends', roomPlaceholder: 'e.g. Anime night', roomName: 'Room name',
    createTitle: 'Set up your watch night', createDescription: 'Name the room, choose a source, and share the invite.', createRoom: 'Create preview room', close: 'Close',
    previewNotice: 'This room is a preview. Shared playback needs a live room service.', joinedNotice: 'Room preview is ready. Protected media opens in its official player.', shareNotice: 'Room invites will be available when account and invite services are connected.',
  },
} as const

export function RoomDiscovery({ locale, onToggleLocale, onOpenProfile, onJoinRoom, onNotice }: RoomDiscoveryProps) {
  const t = copy[locale]
  const [query, setQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('الكل')
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newRoomTitle, setNewRoomTitle] = useState('')

  const filteredRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar')
    return rooms.filter((room) => {
      const matchesPlatform = selectedPlatform === 'الكل' || room.source === selectedPlatform
      const matchesQuery = !normalizedQuery || `${room.title} ${room.genre} ${room.source} ${room.host} ${room.titleEn} ${room.genreEn} ${room.hostEn}`.toLocaleLowerCase(locale).includes(normalizedQuery)
      return matchesPlatform && matchesQuery
    })
  }, [locale, query, selectedPlatform])

  function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newRoomTitle.trim()
    if (!title) return
    const source = selectedPlatform === 'الكل' ? 'YouTube' : selectedPlatform
    setCreateOpen(false)
    setNewRoomTitle('')
    onJoinRoom(title, source, isPublic)
    onNotice(t.previewNotice)
  }

  return (
    <section className="discovery-view" dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-label={locale === 'ar' ? 'اكتشاف غرف المشاهدة' : 'Discover watch rooms'}>
      <div className="discovery-orb discovery-orb-one" aria-hidden="true" />
      <div className="discovery-orb discovery-orb-two" aria-hidden="true" />
      <div className="discovery-content">
        <header className="discovery-header">
          <button className="discovery-profile-button" type="button" onClick={onOpenProfile} aria-label={locale === 'ar' ? 'الملف الشخصي' : 'Profile'}><span>م</span></button>
          <div className="discovery-wordmark" aria-label="mkemo"><span className="discovery-mark"><Play size={19} fill="currentColor" /></span><span>mkemo<span className="discovery-period">.</span></span></div>
          <div className="discovery-header-actions"><button className="discovery-language-button" type="button" onClick={onToggleLocale} aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}><Languages size={16} /><span>{t.language}</span></button><button className="discovery-invite-button" type="button" onClick={() => onNotice(t.shareNotice)} aria-label={t.invite}><UsersRound size={19} /></button></div>
        </header>

        <div className="discovery-intro"><span><Sparkles size={13} /> {t.tagline}</span><h1>{t.headline}</h1></div>

        <form className="discovery-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <Search size={27} aria-hidden="true" />
          <input aria-label={locale === 'ar' ? 'ابحث عن غرفة أو فيلم أو مسلسل' : 'Search rooms, movies, or shows'} placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" className="discovery-clear" aria-label={locale === 'ar' ? 'مسح البحث' : 'Clear search'} onClick={() => setQuery('')}><X size={18} /></button>}
        </form>

        <div className="discovery-selects">
          <div className="platform-picker-wrap">
            <button className="platform-picker" type="button" aria-expanded={platformMenuOpen} aria-controls="platform-options" onClick={() => setPlatformMenuOpen((open) => !open)}>
              <span className="platform-picker-icon"><Play size={18} fill="currentColor" /></span>
              <span className="platform-picker-copy"><small>{t.sourceLabel}</small><strong>{selectedPlatform === 'الكل' ? t.allPlatforms : selectedPlatform}</strong></span>
              <ChevronDown size={24} className={platformMenuOpen ? 'picker-chevron is-open' : 'picker-chevron'} />
            </button>
            {platformMenuOpen && <div className="platform-options" id="platform-options" role="group" aria-label={t.choosePlatform}>
              <button type="button" className={selectedPlatform === 'الكل' ? 'platform-option selected' : 'platform-option'} onClick={() => { setSelectedPlatform('الكل'); setPlatformMenuOpen(false) }}>{t.allPlatforms}</button>
              {platforms.map((platform) => <button type="button" className={selectedPlatform === platform ? 'platform-option selected' : 'platform-option'} key={platform} onClick={() => { setSelectedPlatform(platform); setPlatformMenuOpen(false) }}><span className={`platform-dot platform-dot-${platform.toLowerCase().replace(/[^a-z]/g, '')}`} />{platform}</button>)}
            </div>}
          </div>
          <button className={isPublic ? 'visibility-picker' : 'visibility-picker visibility-private'} type="button" aria-pressed={isPublic} onClick={() => setIsPublic((value) => !value)}><Globe2 size={22} /><span><small>{t.visibility}</small><strong>{isPublic ? t.public : t.private}</strong></span><ChevronDown size={18} /></button>
        </div>

        <div className="discovery-list-heading"><div><h2>{t.listTitle}</h2><span>{t.listSubtitle}</span></div><span className="preview-pill"><span /> {t.preview}</span></div>

        <div className="discovery-room-list" aria-live="polite">
          {filteredRooms.map((room) => <button className="discovery-room-card" type="button" key={room.id} onClick={() => { onJoinRoom(room.title, room.source, isPublic); onNotice(t.joinedNotice) }}>
            <span className="discovery-cover"><img src={room.image} alt="" /><span className="cover-play"><Play size={19} fill="currentColor" /></span><span className="cover-source">{room.source}</span></span>
            <span className="discovery-room-copy"><span className="discovery-room-meta"><span>{locale === 'ar' ? room.genre : room.genreEn}</span><i /></span><strong>{locale === 'ar' ? room.title : room.titleEn}</strong><span className="discovery-host">{t.startedBy} {locale === 'ar' ? room.host : room.hostEn}</span><span className="discovery-room-bottom"><span className="discovery-avatars" aria-label={`${new Intl.NumberFormat(locale).format(room.viewers)} ${t.watching}, preview data`}>{room.avatars.map((avatar, index) => <i className={avatarColors[index % avatarColors.length]} key={`${room.id}-${index}`}>{locale === 'ar' ? avatar : room.avatars[index]}</i>)}</span><span className="room-viewer-count"><UsersRound size={13} />{new Intl.NumberFormat(locale).format(room.viewers)} {t.watching}</span></span></span>
            <ChevronLeft className="room-card-arrow" size={19} />
          </button>)}
          {filteredRooms.length === 0 && <div className="discovery-empty"><Search size={22} /><strong>{t.emptyTitle}</strong><span>{t.emptyDescription}</span></div>}
        </div>

        <p className="discovery-rights"><ShieldCheck size={14} /> {t.legal}</p>
        <p className="discovery-fps">{t.fps}</p>
      </div>

      <button className="discovery-create-button" type="button" onClick={() => setCreateOpen(true)} aria-label={t.create}><Plus size={32} /></button>

      {createOpen && <div className="discovery-dialog-backdrop" onClick={() => setCreateOpen(false)}>
        <section className="discovery-create-dialog" role="dialog" aria-modal="true" aria-labelledby="create-room-title" onClick={(event) => event.stopPropagation()}>
          <button className="dialog-close" type="button" onClick={() => setCreateOpen(false)} aria-label={t.close}><X size={18} /></button>
          <span className="dialog-icon"><UsersRound size={20} /></span>
          <h2 id="create-room-title">{t.createTitle}</h2>
          <p>{t.createDescription}</p>
          <form onSubmit={createRoom}>
            <label htmlFor="new-room-title">{t.roomName}</label>
            <input id="new-room-title" autoFocus maxLength={60} placeholder={t.roomPlaceholder} value={newRoomTitle} onChange={(event) => setNewRoomTitle(event.target.value)} required />
            <span className="dialog-platform-label">{locale === 'ar' ? 'المنصة' : 'Platform'}: {selectedPlatform === 'الكل' ? 'YouTube' : selectedPlatform} · {isPublic ? t.public : t.private}</span>
            <button className="dialog-submit" type="submit">{t.createRoom} <ChevronLeft size={17} /></button>
          </form>
        </section>
      </div>}
    </section>
  )
}
