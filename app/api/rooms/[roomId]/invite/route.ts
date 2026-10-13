import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { messages, rooms } from '@/lib/db/schema'
import { getGuestId } from '@/lib/guest-session'
import { getRoomAccess } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function generateStaticParams() {
  return [{ roomId: 'default' }]
}

export async function GET(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  }

  const { roomId } = await context.params
  const guestId = await getGuestId()
  const { room } = await getRoomAccess(roomId, guestId)

  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  }

  const roomMessages = await db.select().from(messages).where(eq(messages.roomId, roomId)).orderBy(messages.createdAt)

  return NextResponse.json({ messages: roomMessages }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  }

  const { roomId } = await context.params
  const guestId = await getGuestId()
  const { room } = await getRoomAccess(roomId, guestId)

  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const content = typeof body?.content === 'string' ? body.content.trim() : ''

    if (!content) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    const [newMessage] = await db.insert(messages).values({
      roomId,
      senderId: guestId,
      content,
    }).returning()

    return NextResponse.json({ message: newMessage }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}
