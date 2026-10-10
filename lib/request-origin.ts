import type { NextRequest } from 'next/server'

export function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  const host = forwardedHost || request.headers.get('host')
  const protocol = forwardedProtocol || request.nextUrl.protocol.slice(0, -1)
  return host ? `${protocol}://${host}` : request.nextUrl.origin
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin')
  const requestOrigin = getRequestOrigin(request)
  if (origin) return origin === requestOrigin
  const fetchSite = request.headers.get('sec-fetch-site')
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none'
}
