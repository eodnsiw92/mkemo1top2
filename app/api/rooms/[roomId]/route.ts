import { and, asc, desc, eq, gt } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roomEvents, roomMembers, roomMessages, rooms } from '@/lib/db/schema'
import { getGuestId, guestDisplayName, verifyInviteToken } from '@/lib/guest-session'
import { getRoomAccess } from '@/lib/room-access'
import { getPlayableSource } from '@/lib/media-url'
import { containsProhibitedSearch } from '@/lib/content-safety'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function GET(_request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params
  const guestId = await getGuestId()
  const { room, isMember } = await getRoomAccess(roomId, guestId)
  if (!room) return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  if (!isMember) return NextResponse.json({ error: 'Join this room before viewing its activity.' }, { status: 403 })

  const activeSince = new Date(Date.now() - 45_000)
  await db.update(roomMembers).set({ lastSeenAt: new Date() }).where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId)))
  const [members, messages, events] = await Promise.all([
    db.select({ guestId: roomMembers.guestId, displayName: roomMembers.displayName, isHost: roomMembers.isHost })
      .from(roomMembers).where(and(eq(roomMembers.roomId, roomId), gt(roomMembers.lastSeenAt, activeSince))).orderBy(asc(roomMembers.joinedAt)),
    db.select().from(roomMessages).where(eq(roomMessages.roomId, roomId)).orderBy(desc(roomMessages.createdAt)).limit(60),
    db.select().from(roomEvents).where(eq(roomEvents.roomId, roomId)).orderBy(desc(roomEvents.createdAt)).limit(40),
  ])

  return NextResponse.json({
    currentGuestId: guestId,
    room: { id: room.id, title: room.title, source: room.source, isPublic: room.isPublic, mediaUrl: room.mediaUrl, playbackPosition: room.playbackPosition, isPlaying: room.isPlaying, playbackUpdatedAt: room.playbackUpdatedAt },
    members,
    messages: messages.reverse().map((message) => ({
      id: message.id,
      guestId: message.guestId,
      name: message.displayName,
      text: message.body,
      createdAt: message.createdAt,
      attachmentUrl: message.attachmentPath ? `/api/rooms/${encodeURIComponent(roomId)}/media?pathname=${encodeURIComponent(message.attachmentPath)}` : null,
    })),
    events: events.reverse().map((event) => ({ id: event.id, name: event.displayName, action: event.eventType, createdAt: event.createdAt })),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  let payload: unknown
  try { payload = await request.json() } catch { payload = {} }
  const inviteToken = payload && typeof payload === 'object' && 'inviteToken' in payload && typeof payload.inviteToken === 'string' ? payload.inviteToken : ''
  const displayName = payload && typeof payload === 'object' && 'displayName' in payload && typeof payload.displayName === 'string' ? payload.displayName.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 32) : ''
  const { room, isMember } = await getRoomAccess(roomId, guestId)
  if (!room) return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  const allowed = room.isPublic || room.ownerId === guestId || isMember || verifyInviteToken(inviteToken, room.inviteTokenHash)
  if (!allowed) return NextResponse.json({ error: 'This room is private. Use its invite link to join.' }, { status: 403 })

  const [existing] = await db.select({ guestId: roomMembers.guestId }).from(roomMembers).where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId))).limit(1)
  const name = displayName || (existing ? undefined : guestDisplayName(guestId))
  await db.transaction(async (tx) => {
    await tx.insert(roomMembers).values({ roomId, guestId, displayName: name || guestDisplayName(guestId), isHost: room.ownerId === guestId })
      .onConflictDoUpdate({ target: [roomMembers.roomId, roomMembers.guestId], set: { lastSeenAt: new Date(), ...(name ? { displayName: name } : {}) } })
    if (!existing) await tx.insert(roomEvents).values({ id: randomUUID(), roomId, guestId, displayName: name || guestDisplayName(guestId), eventType: 'joined' })
    await tx.update(rooms).set({ updatedAt: new Date() }).where(eq(rooms.id, roomId))
  })
  return NextResponse.json({ room: { id: room.id, title: room.title, source: room.source, isPublic: room.isPublic } }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  const { room } = await getRoomAccess(roomId, guestId)
  if (!room) return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  if (room.ownerId !== guestId) return NextResponse.json({ error: 'Only the room host can change visibility.' }, { status: 403 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ error: 'Invalid room settings.' }, { status: 400 }) }
  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid room settings.' }, { status: 400 })
  if ('isPublic' in payload) {
    if (typeof payload.isPublic !== 'boolean') return NextResponse.json({ error: 'Choose public or private visibility.' }, { status: 400 })
    await db.update(rooms).set({ isPublic: payload.isPublic, updatedAt: new Date() }).where(eq(rooms.id, roomId))
    return NextResponse.json({ isPublic: payload.isPublic })
  }

  const playback = 'playback' in payload ? payload.playback : null
  if (!playback || typeof playback !== 'object' || !('mediaUrl' in playback) || !('position' in playback) || !('isPlaying' in playback)) {
    return NextResponse.json({ error: 'Invalid playback state.' }, { status: 400 })
  }
  const mediaUrl = playback.mediaUrl
  const position = playback.position
  const isPlaying = playback.isPlaying
  if ((typeof mediaUrl !== 'string' && mediaUrl !== null) || (mediaUrl && (!getPlayableSource(mediaUrl) || containsProhibitedSearch(mediaUrl))) || typeof position !== 'number' || !Number.isFinite(position) || position < 0 || position > 86_400 || typeof isPlaying !== 'boolean') {
    return NextResponse.json({ error: 'Choose a supported secure video link and playback position.' }, { status: 400 })
  }
  const playbackUpdatedAt = new Date()
  await db.update(rooms).set({ mediaUrl, playbackPosition: position, isPlaying, playbackUpdatedAt, updatedAt: playbackUpdatedAt }).where(eq(rooms.id, roomId))
  return NextResponse.json({ mediaUrl, position, isPlaying, playbackUpdatedAt })
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  const [membership] = await db.select({ displayName: roomMembers.displayName }).from(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId))).limit(1)
  if (!membership) return NextResponse.json({ ok: true })
  await db.transaction(async (tx) => {
    await tx.insert(roomEvents).values({ id: randomUUID(), roomId, guestId, displayName: membership.displayName, eventType: 'left' })
    await tx.delete(roomMembers).where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId)))
  })
  return NextResponse.json({ ok: true })
}
