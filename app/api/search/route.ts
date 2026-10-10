import { NextRequest, NextResponse } from 'next/server'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getRequestOrigin } from '@/lib/request-origin'

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
  const source = request.nextUrl.searchParams.get('source') ?? 'YouTube'
  if (!providerSearchUrls[source]) return NextResponse.redirect(new URL('/?search=invalid', getRequestOrigin(request)))
  if (query && containsProhibitedSearch(query)) return NextResponse.redirect(new URL('/?search=blocked', getRequestOrigin(request)))
  return NextResponse.redirect(providerSearchUrls[source](query), { headers: { 'Cache-Control': 'no-store' } })
}
