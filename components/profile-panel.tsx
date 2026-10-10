'use client'

import { useRef, useState, type ChangeEventHandler } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  ChevronLeft,
  Clock3,
  Eye,
  EyeOff,
  Film,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
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
  const [hideMatureContent, setHideMatureContent] = useState(true)
  const [selectedInterests, setSelectedInterests] = useState(() => new Set([0, 1, 2, 3]))

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

  return (
    <section className="profile-view profile-dashboard" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="profile-dashboard-topbar">
        <button className="profile-back profile-dashboard-back" type="button" onClick={onBack}>
          {isArabic ? <ChevronLeft aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
          {isArabic ? 'رجوع' : 'Back'}
        </button>
        <span className="profile-page-label">{isArabic ? 'مساحتك في mkemo' : 'YOUR MKEMO SPACE'}</span>
      </div>

      <section className="profile-dashboard-hero" aria-labelledby="profile-name">
        <div className="profile-dashboard-cover">
          <img src="/profile-cover.png" alt="" />
          <div className="profile-cover-copy">
            <span><Sparkles aria-hidden="true" /> {isArabic ? 'مساحة للمشاهدة واللمة' : 'YOUR SPACE TO WATCH & CONNECT'}</span>
            <strong>{isArabic ? 'كل حكاية حلوة بتبدأ بمشاركة.' : 'Every great story is better shared.'}</strong>
          </div>
          <span className="profile-member-badge"><BadgeCheck aria-hidden="true" /> {isArabic ? 'عضو في mkemo' : 'MKEMO MEMBER'}</span>
        </div>

        <div className="profile-identity-row">
          <button className="profile-avatar-button" type="button" onClick={() => photoInput.current?.click()} aria-label={isArabic ? 'غيّر صورة الملف الشخصي، الصور المتحركة GIF مدعومة' : 'Change profile photo, animated GIFs supported'} title={isArabic ? 'الصور المتحركة GIF مدعومة' : 'Animated GIFs supported'}>
            {profileImage ? <img src={profileImage} alt={isArabic ? 'صورتك الشخصية' : 'Your profile'} /> : <span aria-hidden="true">M</span>}
            <i><Camera aria-hidden="true" /></i>
          </button>
          <div className="profile-identity-copy">
            <div className="profile-handle-line"><span>@morgan</span><CountryName name={`${displayName} 🇨🇦`} className="profile-country-name" /></div>
            <h1 id="profile-name">{displayName}</h1>
            <p><MapPin aria-hidden="true" /> {isArabic ? 'عضو من ٢٠٢٤' : 'Watching since 2024'}</p>
          </div>
          <div className="profile-hero-actions">
            <button className="profile-action-primary" type="button" onClick={() => setIsEditing((current) => !current)}>
              {isEditing ? <Check aria-hidden="true" /> : <Pencil aria-hidden="true" />}
              {isEditing ? (isArabic ? 'حفظ التعديلات' : 'Done editing') : (isArabic ? 'تعديل الملف' : 'Edit profile')}
            </button>
            <button className="profile-action-secondary" type="button" onClick={shareProfile} aria-label={isArabic ? 'مشاركة الملف الشخصي' : 'Share profile'}>
              <Plus aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat"><UsersRound aria-hidden="true" /><span><strong>04</strong><small>{isArabic ? 'أصدقاء' : 'Friends'}</small></span></div>
          <div className="profile-stat"><ImagePlus aria-hidden="true" /><span><strong>{String(posts.length).padStart(2, '0')}</strong><small>{isArabic ? 'لحظات' : 'Moments'}</small></span></div>
          <div className="profile-stat"><Clock3 aria-hidden="true" /><span><strong>08</strong><small>{isArabic ? 'ليالي مشاهدة' : 'Watch nights'}</small></span></div>
        </div>
      </section>

      <button className={`profile-safety-toggle${hideMatureContent ? ' is-enabled' : ''}`} type="button" role="switch" aria-checked={hideMatureContent} onClick={() => setHideMatureContent((current) => !current)}>
        <span className="profile-safety-icon"><ShieldCheck aria-hidden="true" /></span>
        <span className="profile-safety-copy"><strong>{isArabic ? 'إخفاء محتوى البالغين' : 'Hide mature content'}</strong><small>{isArabic ? 'هنخفي المحتوى المخصص للبالغين من اقتراحاتك.' : 'Keep mature titles out of your recommendations.'}</small></span>
        <span className="profile-switch" aria-hidden="true"><i /></span>
      </button>

      <div className="profile-dashboard-grid">
        <div className="profile-dashboard-main-column">
          <section className="profile-dashboard-card profile-about-card">
            <div className="profile-card-heading"><div><span>{isArabic ? 'نبذة' : 'A LITTLE ABOUT ME'}</span><h2>{isArabic ? 'أهلًا، أنا ' : 'Hey, I’m '}{displayName.split(' ')[0]}</h2></div><span className="profile-card-icon"><Film aria-hidden="true" /></span></div>
            {isEditing ? (
              <div className="profile-edit-fields">
                <label>{isArabic ? 'الاسم' : 'Name'}<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={48} /></label>
                <label>{isArabic ? 'النبذة' : 'Bio'}<textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} maxLength={180} /></label>
                <small>{isArabic ? 'التعديلات دي للمعاينة في الجلسة دي.' : 'Changes are a local preview for this session.'}</small>
              </div>
            ) : <p className="profile-bio-copy">{bio}</p>}
            <div className="profile-about-footer"><span><Film aria-hidden="true" /> {isArabic ? 'أكتر حاجة بحبها: قصص الخيال العلمي' : 'Currently into: thoughtful sci-fi'}</span><span><MapPin aria-hidden="true" /> {isArabic ? 'كندا' : 'Canada'}</span></div>
          </section>

          <section className="profile-dashboard-card profile-interest-card">
            <div className="profile-card-heading"><div><span>{isArabic ? 'ذوقك في المشاهدة' : 'YOUR TASTE'}</span><h2>{isArabic ? 'إيه اللي بتحبه؟' : 'Things I’m into'}</h2></div><span className="profile-interest-count">{String(selectedInterests.size).padStart(2, '0')}</span></div>
            <p className="profile-card-description">{isArabic ? 'اختار الحاجات اللي بتحبها عشان تلاقي ناس شبهك.' : 'Pick a few favorites to find your kind of people.'}</p>
            <div className="profile-interest-chips">
              {profileInterests.map((interest, index) => {
                const selected = selectedInterests.has(index)
                return <button className={`profile-interest-chip${selected ? ' is-selected' : ''}`} type="button" key={interest.en} aria-pressed={selected} onClick={() => toggleInterest(index)}>{selected && <Check aria-hidden="true" />}{isArabic ? interest.ar : interest.en}</button>
              })}
            </div>
          </section>
        </div>

        <section className="profile-dashboard-card profile-platform-card">
          <div className="profile-card-heading"><div><span>{isArabic ? 'ليالي المشاهدة' : 'YOUR WATCH NIGHTS'}</span><h2>{isArabic ? 'ذوقك في المنصات' : 'Where you watch'}</h2></div><span className="profile-card-icon"><Eye aria-hidden="true" /></span></div>
          <p className="profile-card-description">{isArabic ? 'توزيع وقت المشاهدة في غرفك.' : 'A snapshot of your room watch time.'}</p>
          <div className="profile-platform-chart-row">
            <div className="profile-donut-chart" role="img" aria-label={isArabic ? 'يوتيوب ٤٨٪، نتفلكس ٣٠٪، تويتش ١٥٪، برايم فيديو ٧٪' : 'YouTube 48%, Netflix 30%, Twitch 15%, Prime Video 7%'}><span><strong>08</strong><small>{isArabic ? 'ليالي' : 'NIGHTS'}</small></span></div>
            <ul className="profile-platform-legend">
              {watchPlatforms.map((platform) => <li key={platform.name}><span className={`profile-platform-dot ${platform.className}`} /><span>{platform.name}</span><strong>{platform.percentage}%</strong></li>)}
            </ul>
          </div>
          <button className="profile-platform-footnote" type="button" onClick={() => onNotice(isArabic ? 'الإحصائيات دي للمعاينة، وهنحدّثها مع نشاط حسابك.' : 'These are preview stats and will update with your account activity.')}>
            {isArabic ? 'الإحصائيات للمعاينة' : 'Preview stats'} <EyeOff aria-hidden="true" />
          </button>
        </section>

        <section className="profile-dashboard-card profile-gallery-card">
          <div className="profile-gallery-heading"><div className="profile-card-heading"><div><span>{isArabic ? 'لحظاتك' : 'YOUR CORNER'}</span><h2>{isArabic ? 'صور وذكريات' : 'Photos & moments'}</h2></div></div><button className="profile-add-photo" type="button" onClick={() => photoInput.current?.click()}><Plus aria-hidden="true" /> {isArabic ? 'ضيف صورة' : 'Add a photo'}</button></div>
          <p className="profile-card-description">{isArabic ? 'شارك لحظة من فيلم أو سهرة مشاهدة.' : 'Save a little moment from your latest watch night.'}</p>
          <div className={`profile-gallery-grid${posts.length ? ' has-posts' : ''}`}>
            {posts.map((post, index) => <button type="button" className="profile-gallery-photo" key={`${post.slice(-14)}-${index}`} onClick={() => onNotice(isArabic ? 'الصورة دي للمعاينة بس.' : 'This photo is a local preview.')}><img src={post} alt={isArabic ? `لحظة رقم ${index + 1}` : `Shared moment ${index + 1}`} /><span>{isArabic ? 'لحظة جديدة' : 'NEW MOMENT'}</span></button>)}
            <button className="profile-gallery-empty" type="button" onClick={() => photoInput.current?.click()}><span><ImagePlus aria-hidden="true" /></span><strong>{posts.length ? (isArabic ? 'ضيف ذكرى جديدة' : 'Add another moment') : (isArabic ? 'أول صورة ليك هتكون هنا' : 'Your first photo goes here')}</strong><small>{isArabic ? 'خلي لحظاتك الحلوة في مكان واحد.' : 'Keep your favorite moments in one place.'}</small><span className="profile-gallery-empty-link">{isArabic ? 'اختار صورة' : 'Choose a photo'} <Plus aria-hidden="true" /></span></button>
          </div>
        </section>
      </div>

      <input className="visually-hidden-input" ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPhotoChange} aria-label={isArabic ? 'اختار صورة للملف الشخصي أو المعرض' : 'Choose a profile or gallery photo'} />
      <p className="profile-dashboard-legal">{isArabic ? 'التعديلات والصور دي للمعاينة في الجلسة دي.' : 'Profile edits and photos are a preview for this session.'}</p>
    </section>
  )
}
