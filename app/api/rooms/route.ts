import { and, count, desc, eq, gt, sql } from 'drizzle-orm'
import { randomBytes, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roomEvents, roomMembers, rooms } from '@/lib/db/schema'
import { cleanMessage, containsProhibitedSearch } from '@/lib/content-safety'
import { getGuestId, guestDisplayName, hashInviteToken } from '@/lib/guest-session'
import { isSameOriginRequest } from '@/lib/request-origin'

const sources = new Set(['YouTube', 'Netflix', 'Prime Video', 'Disney+', 'Twitch'])

export async function GET() {
  const activeSince = new Date(Date.now() - 45_000)
  const publicRooms = await db.select({
    id: rooms.id,
    title: rooms.title,
    source: rooms.source,
    isPublic: rooms.isPublic,
    updatedAt: rooms.updatedAt,
    viewers: count(roomMembers.guestId),
  }).from(rooms)
    .leftJoin(roomMembers, and(eq(roomMembers.roomId, rooms.id), gt(roomMembers.lastSeenAt, activeSince)))
    .where(eq(rooms.isPublic, true))
    .groupBy(rooms.id)
    .orderBy(desc(rooms.updatedAt))
    .limit(40)

  return NextResponse.json({ rooms: publicRooms }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })

  const input = payload as { title?: unknown; source?: unknown; isPublic?: unknown; displayName?: unknown }
  const title = typeof input.title === 'string' ? cleanMessage(input.title).slice(0, 60) : ''
  const source = typeof input.source === 'string' && sources.has(input.source) ? input.source : ''
  if (!title || !source) return NextResponse.json({ error: 'Add a room name and choose a supported video source.' }, { status: 400 })
  if (containsProhibitedSearch(title)) return NextResponse.json({ error: 'Adult or pornographic room names are not allowed.' }, { status: 422 })

  const guestId = await getGuestId()
  const id = randomUUID()
  const inviteToken = randomBytes(24).toString('base64url')
  const displayName = typeof input.displayName === 'string' ? cleanMessage(input.displayName).slice(0, 32) : ''
  const name = displayName || guestDisplayName(guestId)
  const isPublic = input.isPublic === true

  await db.transaction(async (tx) => {
    await tx.insert(rooms).values({ id, ownerId: guestId, title, source, isPublic, inviteTokenHash: hashInviteToken(inviteToken) })
    await tx.insert(roomMembers).values({ roomId: id, guestId, displayName: name, isHost: true })
    await tx.insert(roomEvents).values({ id: randomUUID(), roomId: id, guestId, displayName: name, eventType: 'joined' })
  })

  return NextResponse.json({ room: { id, title, source, isPublic }, inviteToken }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
