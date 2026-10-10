export type PlayableSource =
  | { kind: 'youtube'; id: string; url: string; label: string }
  | { kind: 'direct'; url: string; label: string }
  | { kind: 'provider'; url: string; label: string }
  | { kind: 'embed'; url: string; label: string }

const urlProtocolPattern = /^[a-z][a-z\d+.-]*:\/\//i

export function isMediaUrlInput(value: string) {
  const input = value.trim()
  return urlProtocolPattern.test(input)
    || input.startsWith('//')
    || /^(?:[\w-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i.test(input)
}

export function getPlayableSourceFromInput(value: string): PlayableSource | null {
  const input = value.trim()
  if (!isMediaUrlInput(input)) return null
  const normalizedUrl = input.startsWith('//')
    ? `https:${input}`
    : urlProtocolPattern.test(input) ? input : `https://${input}`
  return getPlayableSource(normalizedUrl)
}

const mediaFilePattern = /\.(?:mp4|m4v|webm|ogg|oga|ogv|opus|mov|avi|m3u8|mpd|flv|mp3|m4a|m4b|aac|wav|flac)(?:$)/i
const providerLabels: Array<{ label: string; hosts: string[] }> = [
  { label: 'YouTube', hosts: ['youtube.com', 'youtube-nocookie.com', 'youtu.be'] },
  { label: 'Vimeo', hosts: ['vimeo.com'] },
  { label: 'Twitch', hosts: ['twitch.tv'] },
  { label: 'Dailymotion', hosts: ['dailymotion.com', 'dai.ly'] },
  { label: 'Facebook', hosts: ['facebook.com', 'fb.watch'] },
  { label: 'SoundCloud', hosts: ['soundcloud.com'] },
  { label: 'Mixcloud', hosts: ['mixcloud.com'] },
  { label: 'Streamable', hosts: ['streamable.com'] },
  { label: 'Wistia', hosts: ['wistia.com', 'wi.st'] },
  { label: 'Vidyard', hosts: ['vidyard.com'] },
  { label: 'Kaltura', hosts: ['kaltura.com', 'kaltura.org'] },
  { label: 'Mux', hosts: ['mux.com'] },
  { label: 'TikTok', hosts: ['tiktok.com'] },
  { label: 'Netflix', hosts: ['netflix.com'] },
  { label: 'Prime Video', hosts: ['primevideo.com', 'amazon.com'] },
  { label: 'Disney+', hosts: ['disneyplus.com'] },
  { label: 'Max', hosts: ['max.com', 'hbomax.com'] },
]

const supportedRoomSources = new Set([
  'Direct media',
  'External site',
  'Instagram',
  'Drive',
  ...providerLabels.map(({ label }) => label),
])

export function isSupportedRoomSource(value: unknown): value is string {
  return typeof value === 'string' && supportedRoomSources.has(value)
}

function matchesHost(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`)
}

function isPublicHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, '')
  return host.includes('.')
    && !/^[\d.]+$/.test(host)
    && !host.includes(':')
    && !host.endsWith('.localhost')
    && !host.endsWith('.local')
    && !host.endsWith('.internal')
    && !host.endsWith('.test')
    && !host.endsWith('.invalid')
    && host !== 'localhost'
}

export function getPlayableSource(value: string): PlayableSource | null {
  try {
    if (value.length > 2048) return null
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || !isPublicHost(url.hostname)) return null

    const host = url.hostname.toLowerCase().replace(/\.$/, '')
    const isYoutube = matchesHost(host, 'youtube.com') || matchesHost(host, 'youtube-nocookie.com') || host === 'youtu.be'
    if (isYoutube) {
      const id = host === 'youtu.be'
        ? url.pathname.split('/').filter(Boolean)[0]
        : url.searchParams.get('v') || url.pathname.match(/\/(?:embed|live|shorts)\/([\w-]{6,20})(?:\/|$)/)?.[1]
      return id && /^[\w-]{6,20}$/.test(id)
        ? { kind: 'youtube', id, url: url.href, label: 'YouTube' }
        : null
    }

    if (matchesHost(host, 'tiktok.com')) {
      const videoId = url.pathname.match(/\/(?:video|v|embed(?:\/v2)?)\/(\d{8,25})/)?.[1]
      if (videoId) return { kind: 'embed', url: `https://www.tiktok.com/embed/v2/${videoId}`, label: 'TikTok' }
    }

    if (matchesHost(host, 'instagram.com')) {
      const postId = url.pathname.match(/\/(?:p|reel|reels|tv)\/([\w-]{5,40})/)?.[1]
      if (postId) return { kind: 'embed', url: `https://www.instagram.com/p/${postId}/embed`, label: 'Instagram' }
    }

    if (matchesHost(host, 'drive.google.com')) {
      const fileId = url.pathname.match(/\/file\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get('id')
      if (fileId && /^[\w-]{10,}$/.test(fileId)) return { kind: 'embed', url: `https://drive.google.com/file/d/${fileId}/preview`, label: 'Drive' }
    }

    if (mediaFilePattern.test(url.pathname)) {
      return { kind: 'direct', url: url.href, label: 'Direct media' }
    }

    const provider = providerLabels.find(({ hosts }) => hosts.some((domain) => matchesHost(host, domain)))
    return provider
      ? { kind: 'provider', url: url.href, label: provider.label }
      : { kind: 'embed', url: url.href, label: 'External site' }
  } catch {
    return null
  }
}
