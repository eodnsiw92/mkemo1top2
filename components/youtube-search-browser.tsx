'use client'

import { useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { ArrowLeft, LoaderCircle, Play, RefreshCw, Search } from 'lucide-react'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getPlayableSourceFromInput, isMediaUrlInput } from '@/lib/media-url'

export type YouTubeSearchResult = {
  id: string
  title: string
  channel: string
  thumbnail?: string
  duration: string
  views: string
  published: string
  isLive: boolean
}

type YouTubeSearchResponse = {
  results: YouTubeSearchResult[]
}

type YouTubeSearchBrowserProps = {
  locale: 'ar' | 'en'
  initialQuery: string
  onBack: () => void
  onPlay: (video: YouTubeSearchResult) => void
  onPlayLink: (url: string) => void
}

async function fetchYouTubeResults(url: string): Promise<YouTubeSearchResponse> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  const payload = await response.json().catch(() => ({})) as YouTubeSearchResponse & { error?: unknown }
  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'YouTube search is temporarily unavailable.')
  }
  return payload
}

export function YouTubeSearchBrowser({ locale, initialQuery, onBack, onPlay, onPlayLink }: YouTubeSearchBrowserProps) {
  const isArabic = locale === 'ar'
  const [input, setInput] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(() => isMediaUrlInput(initialQuery) ? '' : initialQuery.trim())
  const [queryError, setQueryError] = useState('')
  const requestUrl = submittedQuery
    ? `/api/search?source=YouTube&format=json&query=${encodeURIComponent(submittedQuery)}`
    : null
  const { data, error, isLoading, isValidating, mutate } = useSWR(requestUrl, fetchYouTubeResults, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
    keepPreviousData: true,
  })
  const results = data?.results ?? []

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input.trim()
    if (!value) return
    if (containsProhibitedSearch(value)) {
      setQueryError(isArabic ? 'هذا البحث غير مسموح.' : 'This search is not allowed.')
      return
    }
    if (isMediaUrlInput(value)) {
      const playable = getPlayableSourceFromInput(value)
      if (!playable) {
        setQueryError(isArabic ? 'الرابط غير مدعوم. استخدم HTTPS ورابط فيديو أو منصة مدعومة.' : 'That link is not supported. Use HTTPS and a direct video or supported player URL.')
        return
      }
      setQueryError('')
      onPlayLink(playable.url)
      return
    }
    setQueryError('')
    setSubmittedQuery(value)
  }

  return (
    <section className="youtube-browser" dir={isArabic ? 'rtl' : 'ltr'} aria-label={isArabic ? 'بحث يوتيوب' : 'YouTube search'}>
      <div className="youtube-browser-content">
        <div className="youtube-browser-heading">
          <button className="youtube-browser-back" type="button" onClick={onBack} aria-label={isArabic ? 'العودة إلى الشاشة السابقة' : 'Back to previous screen'}>
            <ArrowLeft size={18} />
          </button>
          <span className="youtube-browser-brand" aria-hidden="true"><Play size={25} fill="currentColor" /></span>
          <div className="youtube-browser-title">
            <span>{isArabic ? 'بحث يوتيوب' : 'YOUTUBE SEARCH'}</span>
            <h1>{isArabic ? 'ابحث وشاهد هنا' : 'Search and watch here'}</h1>
            <p>{isArabic ? 'تصفح النتائج وشغّل الفيديو داخل غرفة المشاهدة.' : 'Browse real results and play a video in your watch room.'}</p>
          </div>
        </div>

        <form className="youtube-browser-search" role="search" onSubmit={submitSearch}>
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setQueryError('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
            }}
            placeholder={isArabic ? 'ابحث في يوتيوب أو الصق رابط فيديو' : 'Search YouTube or paste a video link'}
            aria-label={isArabic ? 'ابحث في يوتيوب أو الصق رابط فيديو' : 'Search YouTube or paste a video link'}
            autoComplete="off"
            autoFocus={Boolean(initialQuery)}
          />
          <button type="submit" aria-label={isArabic ? 'بحث' : 'Search'}><Search size={17} /></button>
        </form>

        {queryError && <p className="youtube-browser-error" role="alert">{queryError}</p>}
        {error && (
          <div className="youtube-browser-error-row" role="alert">
            <p>{isArabic ? 'تعذّر تحميل نتائج يوتيوب. أعد المحاولة.' : 'YouTube results could not load. Try again.'}</p>
            <button type="button" onClick={() => void mutate()}><RefreshCw size={14} />{isArabic ? 'إعادة المحاولة' : 'Retry'}</button>
          </div>
        )}

        {submittedQuery ? (
          <div className="youtube-browser-results-section" aria-busy={isLoading || isValidating}>
            <div className="youtube-browser-results-heading">
              <div>
                <span>{isArabic ? 'نتائج البحث' : 'SEARCH RESULTS'}</span>
                <h2>{submittedQuery}</h2>
              </div>
              {isValidating && <span className="youtube-browser-loading" role="status"><LoaderCircle size={15} />{isArabic ? 'جارٍ البحث' : 'Searching'}</span>}
              {!isLoading && !error && data && <span className="youtube-browser-count">{new Intl.NumberFormat(isArabic ? 'ar' : 'en').format(results.length)} {isArabic ? 'فيديوهات' : 'videos'}</span>}
            </div>

            {isLoading ? (
              <p className="youtube-browser-state" role="status"><LoaderCircle size={20} />{isArabic ? 'جارٍ تحميل النتائج...' : 'Loading YouTube results...'}</p>
            ) : error && results.length === 0 ? (
              <p className="youtube-browser-state">{isArabic ? 'أعد المحاولة لعرض النتائج.' : 'Retry to load these results.'}</p>
            ) : results.length === 0 ? (
              <div className="youtube-browser-state youtube-browser-empty">
                <span><Search size={22} /></span>
                <p>{isArabic ? 'لم نعثر على فيديوهات. جرّب كلمات بحث أخرى.' : 'No videos found. Try another search.'}</p>
              </div>
            ) : (
              <div className="youtube-browser-grid">
                {results.map((video) => (
                  <button className="youtube-video-card" type="button" key={video.id} onClick={() => onPlay(video)} aria-label={isArabic ? `تشغيل ${video.title}` : `Play ${video.title}`}>
                    <span className="youtube-video-thumbnail">
                      {video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" /> : <span className="youtube-video-thumbnail-fallback"><Play size={28} /></span>}
                      <span className="youtube-video-play" aria-hidden="true"><Play size={19} fill="currentColor" /></span>
                      {(video.duration || video.isLive) && <span className={video.isLive ? 'youtube-video-duration is-live' : 'youtube-video-duration'}>{video.isLive ? (isArabic ? 'مباشر' : 'LIVE') : video.duration}</span>}
                    </span>
                    <span className="youtube-video-copy">
                      <strong>{video.title}</strong>
                      {video.channel && <span className="youtube-video-channel">{video.channel}</span>}
                      {(video.views || video.published) && <span className="youtube-video-meta">{[video.views, video.published].filter(Boolean).join(' · ')}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="youtube-browser-state youtube-browser-empty">
            <span><Play size={25} /></span>
            <p>{isArabic ? 'اكتب ما تريد مشاهدته لتظهر نتائج يوتيوب هنا.' : 'Search for something to watch and YouTube results will appear here.'}</p>
          </div>
        )}

        <p className="youtube-browser-footnote">{isArabic ? 'ألصق رابط YouTube أو فيديو مباشر آمنًا لبدء المشاهدة المتزامنة مع أصدقائك.' : 'Paste a YouTube or secure direct video link to start watching in sync with friends.'}</p>
      </div>
    </section>
  )
}

export default YouTubeSearchBrowser
