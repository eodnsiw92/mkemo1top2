'use client'

import { useRef, useState, type ChangeEventHandler } from 'react'
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Film,
  ImagePlus,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { CountryName } from '@/components/country-name'

type ProfilePanelProps = {
  locale: 'ar' | 'en'
  profileImage: string
  posts: string[]
  onBack: () => void
  onNotice: (message: string) => void
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
}

const profileInterests = [
  { ar: 'أفلام مستقلة', en: 'Indie films' },
  { ar: 'خيال علمي', en: 'Sci-fi' },
  { ar: 'موسيقى تصويرية', en: 'Soundtracks' },
  { ar: 'أفلام وثائقية', en: 'Documentaries' },
  { ar: 'قوائم آخر الليل', en: 'Late-night playlists' },
  { ar: 'كوميديا', en: 'Comedy' },
]

const watchPlatforms = [
  { name: 'YouTube', percentage: 48, className: 'youtube' },
  { name: 'Netflix', percentage: 30, className: 'netflix' },
  { name: 'Twitch', percentage: 15, className: 'twitch' },
  { name: 'Prime Video', percentage: 7, className: 'prime' },
]

export function ProfilePanel({ locale, profileImage, posts, onBack, onNotice, onPhotoChange }: ProfilePanelProps) {
  const isArabic = locale === 'ar'
  const photoInput = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('Morgan Lee')
  const [bio, setBio] = useState(isArabic ? 'بحب الأفلام الحلوة واللمة الأحلى.' : 'Collecting good films and better company.')
  const [isEditing, setIsEditing] = useState(false)
  const [includeMatureContent, setIncludeMatureContent] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState(() => new Set([0, 1, 2, 3]))
  const [hiddenSections, setHiddenSections] = useState(() => new Set<string>())

  function toggleSection(section: string) {
    setHiddenSections((current) => {
      const next = new Set(current)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  function toggleInterest(index: number) {
    setSelectedInterests((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function shareProfile() {
    onNotice(isArabic ? 'رابط الملف الشخصي هيكون متاح لما الحسابات تتفعل.' : 'Profile links will be available when accounts are enabled.')
  }

  const isHidden = (section: string) => hiddenSections.has(section)
  const sectionTools = (section: string, label: string) => (
    <div className="profile-rave-tools">
      <button type="button" aria-label={isHidden(section) ? (isArabic ? `إظهار ${label}` : `Show ${label}`) : (isArabic ? `إخفاء ${label}` : `Hide ${label}`)} aria-pressed={!isHidden(section)} onClick={() => toggleSection(section)}>
        {isHidden(section) ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>
      <button type="button" aria-label={isArabic ? 'خيارات القسم' : 'Section options'} onClick={() => onNotice(isArabic ? 'تقدر ترتب أقسام ملفك قريبًا.' : 'Section ordering is coming soon.')}><MoreHorizontal aria-hidden="true" /></button>
    </div>
  )

  return (
    <section className="profile-view profile-dashboard profile-rave" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="profile-rave-topbar">
        <button className="profile-back profile-rave-back" type="button" onClick={onBack} aria-label={isArabic ? 'رجوع' : 'Back'}>
          {isArabic ? <ChevronLeft aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
        </button>
        <div className="profile-rave-identity">
          <button className="profile-avatar-button" type="button" onClick={() => photoInput.current?.click()} aria-label={isArabic ? 'غيّر صورة الملف الشخصي، الصور المتحركة GIF مدعومة' : 'Change profile photo, animated GIFs supported'} title={isArabic ? 'الصور المتحركة GIF مدعومة' : 'Animated GIFs supported'}>
            {profileImage ? <img src={profileImage} alt={isArabic ? 'صورتك الشخصية' : 'Your profile'} /> : <span aria-hidden="true">M</span>}
            <i><Camera aria-hidden="true" /></i>
          </button>
          <div className="profile-rave-name">
            <h1 id="profile-name">{displayName}</h1>
            <div><span>@morgan82g</span><CountryName name="🇮🇶" className="profile-country-name" /></div>
          </div>
        </div>
        <div className="profile-rave-head-actions">
          <button className="profile-rave-icon-button" type="button" onClick={shareProfile} aria-label={isArabic ? 'مشاركة الملف الشخصي' : 'Share profile'}><Plus aria-hidden="true" /></button>
          <button className="profile-rave-icon-button" type="button" onClick={() => setIsEditing((current) => !current)} aria-label={isArabic ? 'تعديل الملف الشخصي' : 'Edit profile'}>{isEditing ? <Check aria-hidden="true" /> : <Pencil aria-hidden="true" />}</button>
        </div>
      </header>

      <button className={`profile-safety-toggle profile-rave-safety${includeMatureContent ? ' is-enabled' : ''}`} type="button" role="switch" aria-checked={includeMatureContent} onClick={() => setIncludeMatureContent((current) => !current)}>
        <span className="profile-safety-copy"><strong>{isArabic ? 'تضمين محتوى البالغين' : 'Include mature content'}</strong></span>
        <span className="profile-switch" aria-hidden="true"><i /></span>
      </button>

      <section className="profile-rave-section" aria-labelledby="profile-bio-title">
        <div className="profile-rave-section-bar">
          <span id="profile-bio-title">{isArabic ? 'النبذة' : 'BIO'}</span>
          {sectionTools('bio', isArabic ? 'النبذة' : 'bio')}
        </div>
        {!isHidden('bio') && <div className="profile-rave-bio">
          {isEditing ? <div className="profile-edit-fields">
            <label>{isArabic ? 'الاسم' : 'Name'}<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={48} /></label>
            <label>{isArabic ? 'النبذة' : 'Bio'}<textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={2} maxLength={180} /></label>
            <small>{isArabic ? 'التعديلات للمعاينة في الجلسة دي.' : 'Edits are a local preview for this session.'}</small>
          </div> : <p>{bio}</p>}
          <span className="profile-rave-member"><UsersRound aria-hidden="true" /> {isArabic ? 'عضو في mkemo من ٢٠٢٤' : 'Watching with mkemo since 2024'}</span>
        </div>}
      </section>

      <section className="profile-rave-section" aria-labelledby="profile-interests-title">
        <div className="profile-rave-section-bar">
          <span id="profile-interests-title">{isArabic ? 'الاهتمامات' : 'INTERESTS'} <small>{String(selectedInterests.size).padStart(2, '0')}</small></span>
          {sectionTools('interests', isArabic ? 'الاهتمامات' : 'interests')}
        </div>
        {!isHidden('interests') && <div className="profile-rave-interests">
          <p>{isArabic ? 'ذوقك يوصلك بأصحاب يشبهونك' : 'Find people who love the same things.'}</p>
          <div className="profile-interest-chips">
            {profileInterests.map((interest, index) => {
              const selected = selectedInterests.has(index)
              return <button className={`profile-interest-chip${selected ? ' is-selected' : ''}`} type="button" key={interest.en} aria-pressed={selected} onClick={() => toggleInterest(index)}>{selected && <Check aria-hidden="true" />}{isArabic ? interest.ar : interest.en}</button>
            })}
          </div>
        </div>}
      </section>

      <section className="profile-rave-section profile-rave-platforms" aria-labelledby="profile-platform-title">
        <div className="profile-rave-section-bar">
          <span id="profile-platform-title">{isArabic ? 'المنصات' : 'PLATFORMS'}</span>
          {sectionTools('platforms', isArabic ? 'المنصات' : 'platforms')}
        </div>
        {!isHidden('platforms') && <div className="profile-rave-chart-panel">
          <div className="profile-rave-chart-topline"><span>{isArabic ? 'ليالي المشاهدة' : 'WATCH NIGHTS'}</span><strong>18</strong></div>
          <div className="profile-platform-chart-row">
            <div className="profile-donut-chart" role="img" aria-label={isArabic ? 'يوتيوب ٤٨٪، نتفلكس ٣٠٪، تويتش ١٥٪، برايم فيديو ٧٪' : 'YouTube 48%, Netflix 30%, Twitch 15%, Prime Video 7%'}><span><strong>{isArabic ? 'المواقع' : 'SITES'}</strong></span></div>
            <ul className="profile-platform-legend">
              {watchPlatforms.map((platform) => <li key={platform.name}><span className={`profile-platform-dot ${platform.className}`} /><span>{platform.name}</span><strong>{platform.percentage}%</strong></li>)}
            </ul>
          </div>
          <button className="profile-platform-footnote" type="button" onClick={() => onNotice(isArabic ? 'إحصائياتك هتظهر هنا بعد تفعيل الحساب.' : 'Your stats will appear here when your account is active.')}>{isArabic ? 'إحصائياتك للمعاينة' : 'Preview statistics'} <EyeOff aria-hidden="true" /></button>
        </div>}
      </section>

      <section className="profile-rave-section" aria-labelledby="profile-gallery-title">
        <div className="profile-rave-section-bar">
          <span id="profile-gallery-title">{isArabic ? 'المعرض' : 'GALLERY'} <small>({posts.length})</small></span>
          <div className="profile-rave-tools">
            <button type="button" onClick={() => photoInput.current?.click()} aria-label={isArabic ? 'إضافة صورة' : 'Add a photo'}><ImagePlus aria-hidden="true" /></button>
            {sectionTools('gallery', isArabic ? 'المعرض' : 'gallery')}
          </div>
        </div>
        {!isHidden('gallery') && <div className={`profile-rave-gallery${posts.length ? ' has-posts' : ''}`}>
          {posts.map((post, index) => <button type="button" className="profile-gallery-photo" key={`${post.slice(-14)}-${index}`} onClick={() => onNotice(isArabic ? 'الصورة دي للمعاينة بس.' : 'This photo is a local preview.')}><img src={post} alt={isArabic ? `لحظة رقم ${index + 1}` : `Shared moment ${index + 1}`} /><span>{isArabic ? 'لحظة جديدة' : 'NEW MOMENT'}</span></button>)}
          <button className="profile-gallery-empty" type="button" onClick={() => photoInput.current?.click()}><span><ImagePlus aria-hidden="true" /></span><strong>{posts.length ? (isArabic ? 'ضيف ذكرى جديدة' : 'Add another moment') : (isArabic ? 'أضف أول صورة' : 'Add your first photo')}</strong><small>{isArabic ? 'صور GIF المتحركة مدعومة' : 'Animated GIFs supported'}</small><span className="profile-gallery-empty-link">{isArabic ? 'اختار صورة' : 'Choose a photo'} <Plus aria-hidden="true" /></span></button>
        </div>}
      </section>

      <input className="visually-hidden-input" ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPhotoChange} aria-label={isArabic ? 'اختار صورة للملف الشخصي أو المعرض' : 'Choose a profile or gallery photo'} />
      <p className="profile-dashboard-legal">{isArabic ? 'التعديلات والصور دي للمعاينة في الجلسة دي.' : 'Profile edits and photos are a preview for this session.'}</p>
    </section>
  )
}
