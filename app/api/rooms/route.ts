import { and, asc, count, desc, eq, gt, inArray } from 'drizzle-orm'
import { randomBytes, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roomEvents, roomMembers, rooms } from '@/lib/db/schema'
import { cleanMessage, containsProhibitedSearch } from '@/lib/content-safety'
import { getGuestId, guestDisplayName, hashInviteToken } from '@/lib/guest-session'
import { countryFlagFromAcceptLanguage, withCountryFlag } from '@/lib/country'
import { isSupportedRoomSource } from '@/lib/media-url'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function GET() {
  const activeSince = new Date(Date.now() - 45_000)
  const publicRooms = await db.select({
    id: rooms.id,
    title: rooms.title,
    source: rooms.source,
    isPublic: rooms.isPublic,
    mediaUrl: rooms.mediaUrl,
    updatedAt: rooms.updatedAt,
    viewers: count(roomMembers.guestId),
  }).from(rooms)
    .leftJoin(roomMembers, and(eq(roomMembers.roomId, rooms.id), gt(roomMembers.lastSeenAt, activeSince)))
    .where(eq(rooms.isPublic, true))
    .groupBy(rooms.id)
    .orderBy(desc(rooms.updatedAt))
    .limit(40)

  const roomIds = publicRooms.map((room) => room.id)
  const activeMembers = roomIds.length > 0
    ? await db.select({ roomId: roomMembers.roomId, guestId: roomMembers.guestId, displayName: roomMembers.displayName })
      .from(roomMembers)
      .where(and(inArray(roomMembers.roomId, roomIds), gt(roomMembers.lastSeenAt, activeSince)))
      .orderBy(asc(roomMembers.joinedAt))
    : []
  const membersByRoom = new Map<string, typeof activeMembers>()
  for (const member of activeMembers) {
    const roomMembers = membersByRoom.get(member.roomId) ?? []
    if (roomMembers.length < 4) roomMembers.push(member)
    membersByRoom.set(member.roomId, roomMembers)
  }

  return NextResponse.json({ rooms: publicRooms.map((room) => ({
    ...room,
    members: membersByRoom.get(room.id) ?? [],
  })) }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })

  const input = payload as { source?: unknown; isPublic?: unknown; displayName?: unknown }
  const title = 'Watch together'
  const source = isSupportedRoomSource(input.source) ? input.source : ''
  if (!source) return NextResponse.json({ error: 'Choose a supported video source.' }, { status: 400 })

  const guestId = await getGuestId()
  const id = randomUUID()
  const inviteToken = randomBytes(24).toString('base64url')
  const displayName = typeof input.displayName === 'string' ? cleanMessage(input.displayName).slice(0, 32) : ''
  const name = withCountryFlag(displayName || guestDisplayName(guestId), countryFlagFromAcceptLanguage(request.headers.get('accept-language')))
  const isPublic = input.isPublic === true

  await db.transaction(async (tx) => {
    await tx.insert(rooms).values({ id, ownerId: guestId, title, source, isPublic, inviteTokenHash: hashInviteToken(inviteToken) })
    await tx.insert(roomMembers).values({ roomId: id, guestId, displayName: name, isHost: true })
    await tx.insert(roomEvents).values({ id: randomUUID(), roomId: id, guestId, displayName: name, eventType: 'joined' })
  })

  return NextResponse.json({ room: { id, title, source, isPublic }, inviteToken }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
