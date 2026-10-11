import 'server-only'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { containsProhibitedSearch, isAdultRatingLabel } from '@/lib/content-safety'
import { getPlayableSource, type PlayableSource } from '@/lib/media-url'

export type ResolveResult =
  | { ok: true; source: PlayableSource; title: string | null; frameBlocked: boolean }
  | { ok: false; reason: 'invalid' | 'blocked' | 'unreachable' }

const MAX_HTML_BYTES = 1_500_000
const MAX_REDIRECTS = 4
const FETCH_TIMEOUT_MS = 7000

function isPrivateAddress(address: string) {
  if (isIP(address) === 6) {
    const value = address.toLowerCase()
    if (value.startsWith('::ffff:')) return isPrivateAddress(value.slice(7))
    return value === '::1' || value === '::' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe8') || value.startsWith('fe9') || value.startsWith('fea') || value.startsWith('feb')
  }
  const [a, b] = address.split('.').map(Number)
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
}

async function assertPublicUrl(url: URL) {
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('invalid')
  const records = await lookup(url.hostname, { all: true })
  if (!records.length || records.some(({ address }) => isPrivateAddress(address))) throw new Error('invalid')
}

async function fetchPage(startUrl: URL) {
  let current = startUrl
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertPublicUrl(current)
    const response = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.8',
      },
    })
    const location = response.headers.get('location')
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, current)
      continue
    }
    return { response, finalUrl: current }
  }
  throw new Error('unreachable')
}

async function readLimitedText(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read()
    if (done || !value) break
    chunks.push(value)
    total += value.byteLength
  }
  void reader.cancel().catch(() => {})
  return new TextDecoder().decode(Buffer.concat(chunks))
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
}

function readMeta(html: string, names: string[]) {
  const values: string[] = []
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    if (!key || !names.includes(key)) continue
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]
    if (content) values.push(decodeEntities(content.trim()))
  }
  return values
}

function collectCandidates(html: string) {
  const candidates = [
    ...readMeta(html, ['og:video:secure_url', 'og:video:url', 'og:video', 'twitter:player:stream', 'contenturl', 'embedurl', 'twitter:player']),
  ]
  for (const match of html.matchAll(/<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) candidates.push(decodeEntities(match[1]))
  for (const match of html.matchAll(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) candidates.push(decodeEntities(match[1]))
  for (const match of html.matchAll(/"(?:contentUrl|embedUrl)"\s*:\s*"([^"]+)"/g)) candidates.push(decodeEntities(match[1]))
  for (const match of html.matchAll(/https?:\\?\/\\?\/[^"'\s<>]+?\.(?:m3u8|mp4|webm)(?:\?[^"'\s<>]*)?/gi)) candidates.push(decodeEntities(match[0]))
  return candidates
}

const sourcePriority: Record<PlayableSource['kind'], number> = { youtube: 0, provider: 1, direct: 2, embed: 3 }

function pickBestSource(candidates: string[], baseUrl: URL) {
  const sources: PlayableSource[] = []
  for (const candidate of candidates) {
    try {
      const absolute = new URL(candidate.startsWith('//') ? `https:${candidate}` : candidate, baseUrl)
      if (absolute.protocol === 'http:') absolute.protocol = 'https:'
      const source = getPlayableSource(absolute.href)
      if (source && source.kind !== 'embed' && !containsProhibitedSearch(source.url)) sources.push(source)
    } catch {}
  }
  return sources.sort((a, b) => sourcePriority[a.kind] - sourcePriority[b.kind])[0] ?? null
}

function isFrameBlocked(headers: Headers) {
  const frameOptions = headers.get('x-frame-options')?.toLowerCase() ?? ''
  if (frameOptions.includes('deny') || frameOptions.includes('sameorigin')) return true
  const frameAncestors = headers.get('content-security-policy')?.match(/frame-ancestors([^;]*)/i)?.[1]?.trim() ?? ''
  return Boolean(frameAncestors) && !frameAncestors.includes('*')
}

export async function resolveMediaLink(value: string): Promise<ResolveResult> {
  const initial = getPlayableSource(value)
  if (!initial) return { ok: false, reason: 'invalid' }
  if (containsProhibitedSearch(initial.url)) return { ok: false, reason: 'blocked' }
  if (initial.kind === 'youtube' || initial.kind === 'direct') return { ok: true, source: initial, title: null, frameBlocked: false }

  let page: Awaited<ReturnType<typeof fetchPage>>
  try {
    page = await fetchPage(new URL(initial.url))
  } catch {
    return initial.kind === 'provider'
      ? { ok: true, source: initial, title: null, frameBlocked: false }
      : { ok: false, reason: 'unreachable' }
  }

  const { response, finalUrl } = page
  if (containsProhibitedSearch(finalUrl.href)) return { ok: false, reason: 'blocked' }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  if (contentType.startsWith('video/') || contentType.startsWith('audio/') || contentType.includes('mpegurl') || contentType.includes('dash+xml')) {
    void response.body?.cancel().catch(() => {})
    return { ok: true, source: { kind: 'direct', url: finalUrl.href, label: 'Direct media' }, title: null, frameBlocked: false }
  }

  const html = contentType.includes('html') || !contentType ? await readLimitedText(response) : ''
  const title = decodeEntities(html.match(/<title[^>]*>([^<]{1,300})<\/title>/i)?.[1]?.trim() ?? '') || readMeta(html, ['og:title'])[0] || null
  const pageSignals = [
    title ?? '',
    ...readMeta(html, ['description', 'og:description', 'keywords', 'og:site_name']),
  ].join(' ')
  const ratings = readMeta(html, ['rating', 'adult', 'rta'])
  if (containsProhibitedSearch(pageSignals) || ratings.some(isAdultRatingLabel) || /RTA-5042-1996-1400-1577-RTA/i.test(html.slice(0, 200_000))) {
    return { ok: false, reason: 'blocked' }
  }

  const best = pickBestSource(collectCandidates(html), finalUrl)
  if (best) return { ok: true, source: best, title, frameBlocked: false }

  const fallback = getPlayableSource(finalUrl.href) ?? initial
  return { ok: true, source: fallback, title, frameBlocked: fallback.kind === 'embed' && isFrameBlocked(response.headers) }
}
