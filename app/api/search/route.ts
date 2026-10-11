import { Innertube } from 'youtubei.js'
import { NextRequest, NextResponse } from 'next/server'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getRequestOrigin } from '@/lib/request-origin'

export const runtime = 'nodejs'

type SearchText = { text?: unknown; toString?: () => string }
type YouTubeSearchNode = {
  video_id?: string
  content_id?: string
  id?: string
  content_type?: string
  title?: SearchText | string
  metadata?: { title?: SearchText | string }
  author?: { name?: string }
  thumbnails?: Array<{ url?: string }>
  best_thumbnail?: { url?: string }
  content_image?: { image?: Array<{ url?: string }> }
  duration?: unknown
  length_text?: unknown
  short_view_count?: unknown
  view_count?: unknown
  views?: unknown
  published?: unknown
  is_live?: boolean
}

let youtubeClientPromise: ReturnType<typeof Innertube.create> | null = null

async function getYouTubeClient() {
  youtubeClientPromise ??= Innertube.create()
  try {
    return await youtubeClientPromise
  } catch (error) {
    youtubeClientPromise = null
    throw error
  }
}

function readSearchText(value: unknown) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const textValue = (value as SearchText).text
  if (typeof textValue === 'string') return textValue.trim()
  const fallback = (value as SearchText).toString?.()
  return typeof fallback === 'string' && fallback !== '[object Object]' ? fallback.trim() : ''
}

async function searchYouTube(query: string) {
  const client = await getYouTubeClient()
  const search = await client.search(query)
  const results = search.videos.flatMap((node) => {
    const item = node as unknown as YouTubeSearchNode
    if (item.content_type && item.content_type !== 'VIDEO' && item.content_type !== 'SHORT') return []
    const id = item.video_id ?? item.content_id ?? item.id
    if (!id || !/^[\w-]{6,20}$/.test(id)) return []
    const title = readSearchText(item.title ?? item.metadata?.title)
    if (!title) return []
    const thumbnail = item.best_thumbnail?.url ?? item.thumbnails?.at(-1)?.url ?? item.content_image?.image?.at(-1)?.url
    const duration = readSearchText(item.duration) || readSearchText(item.length_text)
    return [{
      id,
      title: title.slice(0, 180),
      channel: item.author?.name?.slice(0, 100) ?? '',
      thumbnail: thumbnail?.startsWith('https://') ? thumbnail : undefined,
      duration: duration.slice(0, 24),
      views: readSearchText(item.short_view_count ?? item.view_count ?? item.views).slice(0, 60),
      published: readSearchText(item.published).slice(0, 60),
      isLive: item.is_live === true,
    }]
  })
  return results.slice(0, 12)
}

const providerSearchUrls: Record<string, (query: string) => string> = {
  YouTube: (query) => query ? `https://www.google.com/search?tbm=vid&safe=active&q=${encodeURIComponent(`site:youtube.com/watch ${query}`)}` : 'https://www.youtube.com/',
  Netflix: (query) => query ? `https://www.netflix.com/search?q=${encodeURIComponent(query)}` : 'https://www.netflix.com/',
  'Prime Video': (query) => query ? `https://www.primevideo.com/search?phrase=${encodeURIComponent(query)}` : 'https://www.primevideo.com/',
  'Disney+': (query) => query ? `https://www.disneyplus.com/search?q=${encodeURIComponent(query)}` : 'https://www.disneyplus.com/',
  Twitch: (query) => query ? `https://www.twitch.tv/search?term=${encodeURIComponent(query)}` : 'https://www.twitch.tv/',
  Crunchyroll: (query) => query ? `https://www.crunchyroll.com/search?q=${encodeURIComponent(query)}` : 'https://www.crunchyroll.com/',
  Playlist: (query) => query ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} playlist`)}` : 'https://www.youtube.com/feed/playlists',
  Photos: () => 'https://photos.google.com/',
  'rAVe DJ': () => 'https://rave.dj/',
  X: (query) => query ? `https://x.com/search?q=${encodeURIComponent(query)}` : 'https://x.com/',
  Tubi: (query) => query ? `https://tubitv.com/search/${encodeURIComponent(query)}` : 'https://tubitv.com/',
  'YouTube Live': (query) => query ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} live`)}` : 'https://www.youtube.com/live',
  Drive: (query) => query ? `https://drive.google.com/drive/search?q=${encodeURIComponent(query)}` : 'https://drive.google.com/',
  WEB: (query) => query ? `https://www.google.com/search?q=${encodeURIComponent(query)}` : 'https://www.google.com/',
  Karaoke: (query) => query ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} karaoke`)}` : 'https://www.youtube.com/results?search_query=karaoke',
  History: () => 'https://myactivity.google.com/product/youtube',
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim().slice(0, 160) ?? ''
  const requestedSource = request.nextUrl.searchParams.get('source') ?? 'YouTube'
  const sourceAliases: Record<string, string> = { NETFLIX: 'Netflix', twitch: 'Twitch', tubi: 'Tubi' }
  const source = sourceAliases[requestedSource] ?? requestedSource
  const wantsJson = request.nextUrl.searchParams.get('format') === 'json'

  if (!providerSearchUrls[source]) {
    return wantsJson
      ? NextResponse.json({ error: 'Choose a supported search source.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
      : NextResponse.redirect(new URL('/?search=invalid', getRequestOrigin(request)))
  }

  if (query && containsProhibitedSearch(query)) {
    return wantsJson
      ? NextResponse.json({ error: 'This search is not allowed.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
      : NextResponse.redirect(new URL('/?search=blocked', getRequestOrigin(request)))
  }

  if (wantsJson) {
    if (source !== 'YouTube' || !query) {
      return NextResponse.json({ error: 'Enter a YouTube search.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
    }
    try {
      const results = await searchYouTube(query)
      return NextResponse.json({ results }, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      })
    } catch (error) {
      console.error('[youtube-search] Search request failed:', error)
      return NextResponse.json({ error: 'YouTube search is temporarily unavailable.' }, {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      })
    }
  }

  return NextResponse.redirect(providerSearchUrls[source](query), { headers: { 'Cache-Control': 'no-store' } })
}
