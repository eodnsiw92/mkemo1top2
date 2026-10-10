export type PlayableSource = { kind: 'youtube'; id: string } | { kind: 'direct'; url: string }

export function getPlayableSource(value: string): PlayableSource | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    const host = url.hostname.toLowerCase()
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && /^[\w-]{6,20}$/.test(id) ? { kind: 'youtube', id } : null
    }
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.match(/\/(?:embed|live|shorts)\/([\w-]{6,20})(?:\/|$)/)?.[1]
      return id ? { kind: 'youtube', id } : null
    }
    return /\.(?:mp4|webm|ogg)$/i.test(url.pathname) ? { kind: 'direct', url: url.href } : null
  } catch {
    return null
  }
}
