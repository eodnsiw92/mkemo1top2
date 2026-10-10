import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'

const cookieName = 'mkemo_guest'
const cookieLifetime = 60 * 60 * 24 * 30

function getSessionSecret() {
  const secret = process.env.DATABASE_URL
  if (!secret) throw new Error('DATABASE_URL is required to create a guest session.')
  return secret
}

function sign(guestId: string) {
  return createHmac('sha256', getSessionSecret()).update(`mkemo:guest:${guestId}`).digest('base64url')
}

function verify(value: string | undefined) {
  if (!value) return null
  const [guestId, signature] = value.split('.')
  if (!guestId || !signature || !/^[\da-f-]{36}$/i.test(guestId)) return null
  const expected = sign(guestId)
  const suppliedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer) ? guestId : null
}

export async function getGuestId() {
  const cookieStore = await cookies()
  const existing = verify(cookieStore.get(cookieName)?.value)
  if (existing) return existing

  const guestId = randomUUID()
  const requestHeaders = await headers()
  const secure = process.env.NODE_ENV === 'production' || requestHeaders.get('x-forwarded-proto') === 'https'
  cookieStore.set(cookieName, `${guestId}.${sign(guestId)}`, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: cookieLifetime,
  })
  return guestId
}

export function guestDisplayName(guestId: string) {
  return `Guest ${guestId.slice(0, 4).toUpperCase()}`
}

export function hashInviteToken(token: string) {
  return createHmac('sha256', getSessionSecret()).update(`mkemo:invite:${token}`).digest('hex')
}

export function verifyInviteToken(token: string, expectedHash: string) {
  const supplied = Buffer.from(hashInviteToken(token))
  const expected = Buffer.from(expectedHash)
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}
