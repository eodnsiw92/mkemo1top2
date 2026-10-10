import { NextRequest, NextResponse } from 'next/server'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { getRequestOrigin } from '@/lib/request-origin'

const providerSearchUrls: Record<string, (query: string) => string> = {
  YouTube: (query) => `https://www.google.com/search?tbm=vid&safe=active&q=${encodeURIComponent(`site:youtube.com/watch ${query}`)}`,
  Netflix: (query) => `https://www.netflix.com/search?q=${encodeURIComponent(query)}`,
  'Prime Video': (query) => `https://www.primevideo.com/search?phrase=${encodeURIComponent(query)}`,
  'Disney+': (query) => `https://www.disneyplus.com/search?q=${encodeURIComponent(query)}`,
  Twitch: (query) => `https://www.twitch.tv/search?term=${encodeURIComponent(query)}`,
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim().slice(0, 160) ?? ''
  const source = request.nextUrl.searchParams.get('source') ?? 'YouTube'
  if (!query || !providerSearchUrls[source]) return NextResponse.redirect(new URL('/?search=invalid', getRequestOrigin(request)))
  if (containsProhibitedSearch(query)) return NextResponse.redirect(new URL('/?search=blocked', getRequestOrigin(request)))
  return NextResponse.redirect(providerSearchUrls[source](query), { headers: { 'Cache-Control': 'no-store' } })
}
