import { and, count, eq, gt } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roomMembers, roomMessages } from '@/lib/db/schema'
import { cleanMessage, containsProhibitedSearch } from '@/lib/content-safety'
import { getGuestId } from '@/lib/guest-session'
import { isRoomMember } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  if (!await isRoomMember(roomId, guestId)) return NextResponse.json({ error: 'Join the room before sending a message.' }, { status: 403 })

  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ error: 'Invalid message.' }, { status: 400 }) }
  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid message.' }, { status: 400 })
  const input = payload as { text?: unknown; attachmentPath?: unknown }
  const text = typeof input.text === 'string' ? cleanMessage(input.text).slice(0, 2000) : ''
  const attachmentPath = typeof input.attachmentPath === 'string' && input.attachmentPath.startsWith(`room-media/${roomId}/`) ? input.attachmentPath : null
  if (!text && !attachmentPath) return NextResponse.json({ error: 'Write a message or attach media.' }, { status: 400 })
  if (containsProhibitedSearch(text)) return NextResponse.json({ error: 'Pornographic or adult content is not allowed in room chat.' }, { status: 422 })

  const cutoff = new Date(Date.now() - 10_000)
  const [recent] = await db.select({ total: count() }).from(roomMessages)
    .where(and(eq(roomMessages.roomId, roomId), eq(roomMessages.guestId, guestId), gt(roomMessages.createdAt, cutoff)))
  if ((recent?.total ?? 0) >= 6) return NextResponse.json({ error: 'Slow down a little before sending another message.' }, { status: 429 })

  const [member] = await db.select({ displayName: roomMembers.displayName }).from(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId))).limit(1)
  if (!member) return NextResponse.json({ error: 'Join the room before sending a message.' }, { status: 403 })

  const [message] = await db.insert(roomMessages).values({ id: randomUUID(), roomId, guestId, displayName: member.displayName, body: text, attachmentPath })
    .returning({ id: roomMessages.id, guestId: roomMessages.guestId, displayName: roomMessages.displayName, body: roomMessages.body, createdAt: roomMessages.createdAt, attachmentPath: roomMessages.attachmentPath })
  return NextResponse.json({ message: {
    id: message.id,
    guestId: message.guestId,
    name: message.displayName,
    text: message.body,
    createdAt: message.createdAt,
    attachmentUrl: message.attachmentPath ? `/api/rooms/${encodeURIComponent(roomId)}/media?pathname=${encodeURIComponent(message.attachmentPath)}` : null,
    attachmentKind: message.attachmentPath && /\.(mp4|webm)$/i.test(message.attachmentPath) ? 'video' : message.attachmentPath ? 'image' : null,
  } }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
