'use client'

import { useMemo, useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Activity, ChevronDown, ChevronLeft, Globe2, Languages, Play, Plus, Search, ShieldCheck, UsersRound, X } from 'lucide-react'
import { PlatformShortcuts } from '@/components/platform-shortcuts'
import { RoomThumbnail } from '@/components/room-thumbnail'

type DiscoverRoom = {
  id: string
  title: string
  source: string
  isPublic: boolean
  viewers: number
  updatedAt: string
  mediaUrl: string | null
  members: { guestId: string; displayName: string }[]
}

type RoomDiscoveryProps = {
  locale: 'ar' | 'en'
  onToggleLocale: () => void
  onOpenProfile: () => void
  onOpenSearch: (query?: string) => void
  onCreateRoom: (source: string, isPublic: boolean) => Promise<void>
  onJoinRoom: (roomId: string, inviteToken?: string) => Promise<void>
  onAcceptInvite: () => void
  hasInvite: boolean
}

const platforms = ['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch']
const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Rooms could not be loaded.')
  return response.json() as Promise<{ rooms: DiscoverRoom[] }>
}

const copy = {
  ar: {
    language: 'English', tagline: 'مكانكم للأفلام والأنمي واللحظات الحلوة', headline: 'شاهدوا سوا.',     search: 'بحث',
    sourceLabel: 'مصدر المشاهدة', allPlatforms: 'كل المنصات', choosePlatform: 'اختر منصة المشاهدة', visibility: 'ظهور الغرفة', public: 'عام', private: 'خاصة',
    listTitle: 'غرف تستاهل المشاهدة', listSubtitle: 'اختاروا الليلة اللي على مزاجكم', preview: 'مباشر', startedBy: 'غرفة', watching: 'مشاهدين',
    emptyTitle: 'ما فيه غرف عامة للحين', emptyDescription: 'أنشئ غرفة وادع أصحابك عشان تبدأون المشاهدة سوا.', legal: 'كل شخص يستخدم اشتراكه الخاص. المنصات المحمية تفتح رسميًا بدون مشاركة كلمات المرور أو تجاوز DRM.',
    fps: 'سلاسة تصل إلى 120 إطار/ث عند دعم الجهاز والمتصفح ومصدر الفيديو.', create: 'إنشاء غرفة مشاهدة', invite: 'دعوة أصدقاء',
    createTitle: 'جهّزوا سهرتكم', createDescription: 'أنشئوا الغرفة، ثم حمّلوا الفيديو ليظهر عنوانه تلقائيًا.', createRoom: 'إنشاء الغرفة', close: 'إغلاق', joinInvite: 'انضم إلى الغرفة الخاصة',
  },
  en: {
    language: 'العربية', tagline: 'Movies, anime, and good nights belong together', headline: 'Watch together.',     search: 'Search',
    sourceLabel: 'WATCH FROM', allPlatforms: 'All platforms', choosePlatform: 'Choose a streaming platform', visibility: 'ROOM VISIBILITY', public: 'Public', private: 'Private',
    listTitle: 'Rooms worth watching', listSubtitle: 'Pick tonight’s mood', preview: 'LIVE ROOMS', startedBy: 'Room', watching: 'watching',
    emptyTitle: 'No public rooms yet', emptyDescription: 'Create a room and invite friends to start watching together.', legal: 'Everyone uses their own subscription. Protected services open officially; passwords are never shared and DRM is never bypassed.',
    fps: 'Up to 120 fps when supported by the device, browser, and video source.', create: 'Create a watch room', invite: 'Invite friends',
    createTitle: 'Set up your watch night', createDescription: 'Create the room, then load a video to use its title automatically.', createRoom: 'Create room', close: 'Close', joinInvite: 'Join private room',
  },
} as const

export function RoomDiscovery({ locale, onToggleLocale, onOpenProfile, onOpenSearch, onCreateRoom, onJoinRoom, onAcceptInvite, hasInvite }: RoomDiscoveryProps) {
  const t = copy[locale]
  const { data } = useSWR<{ rooms: DiscoverRoom[] }>('/api/rooms', fetcher, { refreshInterval: 8000, revalidateOnFocus: true })
  const rooms = data?.rooms ?? []
  const [query, setQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('الكل')
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [connectMenuOpen, setConnectMenuOpen] = useState(false)

  const filteredRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar')
    return rooms.filter((room) => {
      const matchesPlatform = selectedPlatform === 'الكل' || room.source === selectedPlatform
      const matchesQuery = !normalizedQuery || `${room.title} ${room.source}`.toLocaleLowerCase(locale).includes(normalizedQuery)
      return matchesPlatform && matchesQuery
    })
  }, [locale, query, rooms, selectedPlatform])

  function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const source = selectedPlatform === 'الكل' ? 'YouTube' : selectedPlatform
    void onCreateRoom(source, isPublic)
    setCreateOpen(false)
  }

  return (
    <section className="discovery-view" dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-label={locale === 'ar' ? 'اكتشاف غرف المشاهدة' : 'Discover watch rooms'}>
      <div className="discovery-orb discovery-orb-one" aria-hidden="true" />
      <div className="discovery-orb discovery-orb-two" aria-hidden="true" />
      <div className="discovery-content">
        <header className="discovery-header">
          <button className="discovery-profile-button" type="button" onClick={onOpenProfile} aria-label={locale === 'ar' ? 'الملف الشخصي' : 'Profile'}><span>م</span></button>
          <div className="discovery-wordmark" aria-label="mkemo"><span className="discovery-mark"><Play size={19} fill="currentColor" /></span><span>mkemo<span className="discovery-period">.</span></span></div>
          <div className="discovery-header-actions"><button className="discovery-search-button" type="button" onClick={() => onOpenSearch()} aria-label={locale === 'ar' ? 'فتح البحث والمنصات' : 'Open media search'}><Search size={17} /></button><button className="discovery-language-button" type="button" onClick={onToggleLocale} aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}><Languages size={16} /><span>{t.language}</span></button><button className="discovery-invite-button" type="button" onClick={() => setCreateOpen(true)} aria-label={t.invite}><UsersRound size={19} /></button></div>
        </header>

        <h1 className="sr-only">{t.headline}</h1>
        {hasInvite && <button className="discovery-invite-card" type="button" onClick={onAcceptInvite}><UsersRound size={18} /><span>{t.joinInvite}</span><ChevronLeft size={18} /></button>}

        <form className="discovery-search" role="search" dir="ltr" onSubmit={(event) => { event.preventDefault(); const value = query.trim(); if (value) onOpenSearch(value) }}>
          <button className="discovery-search-submit" type="submit" aria-label={locale === 'ar' ? 'بحث آمن عن فيديو' : 'Search videos safely'}><Search size={34} aria-hidden="true" /></button>
          <input dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-label={locale === 'ar' ? 'ابحث عن غرفة أو فيديو' : 'Search rooms or videos'} placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} />
          {query && <button type="button" className="discovery-clear" aria-label={locale === 'ar' ? 'مسح البحث' : 'Clear search'} onClick={() => setQuery('')}><X size={18} /></button>}
        </form>

        <PlatformShortcuts locale={locale} onSelectPlatform={setSelectedPlatform} />

        <div className="discovery-connectivity">
          <button className="connectivity-trigger" type="button" aria-expanded={connectMenuOpen} aria-controls="connectivity-options" onClick={() => setConnectMenuOpen((open) => !open)}>
            <span className="connectivity-pulse"><Activity size={15} /></span>
            <span><small>{locale === 'ar' ? 'حالة الاتصال' : 'CONNECTION STATUS'}</small><strong>{locale === 'ar' ? 'ابقَ mkemo متصلاً' : 'Stay connected with mkemo'}</strong></span>
            <ChevronDown size={17} className={connectMenuOpen ? 'connectivity-chevron is-open' : 'connectivity-chevron'} />
          </button>
          {connectMenuOpen && <div className="connectivity-options" id="connectivity-options"><p>{locale === 'ar' ? 'تتحدّث الغرف العامة تلقائيًا أثناء تصفحك.' : 'Public rooms refresh while you browse.'}</p><button type="button" onClick={() => { setConnectMenuOpen(false); setCreateOpen(true) }}>{locale === 'ar' ? 'أنشئ غرفة وادع أصدقاءك' : 'Create a room and invite friends'}</button></div>}
        </div>

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

        <div className="discovery-list-heading"><div><span className="public-category"><Globe2 size={13} /> {locale === 'ar' ? 'عام' : 'PUBLIC'}</span><h2>{t.listTitle}</h2><span>{t.listSubtitle}</span></div><span className="preview-pill"><span /> {t.preview}</span></div>

        <div className="discovery-room-list" aria-live="polite">
          {filteredRooms.map((room) => <button className="discovery-room-card" type="button" key={room.id} onClick={() => { void onJoinRoom(room.id) }}>
            <RoomThumbnail mediaUrl={room.mediaUrl} title={room.title} source={room.source} extraViewers={Math.max(0, room.viewers - room.members.length)} />
            <span className="discovery-room-copy"><span className="discovery-room-meta"><span>{room.isPublic ? t.public : t.private}</span><i /></span><strong>{room.title}</strong><span className="discovery-host">{t.startedBy} · {room.source}</span><span className="discovery-room-bottom"><span className="discovery-avatars" aria-hidden="true">{room.members.map((member, index) => <i className={`avatar-dot avatar-dot-${index % 4}`} key={member.guestId} title={member.displayName}>{member.displayName.slice(0, 1).toLocaleUpperCase(locale)}</i>)}</span><span className="room-viewer-count" aria-label={`${new Intl.NumberFormat(locale).format(room.viewers)} ${t.watching}`}><UsersRound size={13} />{new Intl.NumberFormat(locale).format(room.viewers)} {t.watching}</span></span></span>
            <ChevronLeft className="room-card-arrow" size={19} />
          </button>)}
          {filteredRooms.length === 0 && <div className="discovery-empty"><Search size={22} /><strong>{t.emptyTitle}</strong><span>{t.emptyDescription}</span><button type="button" onClick={() => setCreateOpen(true)}>{t.create} <Plus size={15} /></button></div>}
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
            <span className="dialog-platform-label">{locale === 'ar' ? 'المنصة' : 'Platform'}: {selectedPlatform === 'الكل' ? 'YouTube' : selectedPlatform} · {isPublic ? t.public : t.private}</span>
            <button className="dialog-submit" type="submit">{t.createRoom} <ChevronLeft size={17} /></button>
          </form>
        </section>
      </div>}
    </section>
  )
}
