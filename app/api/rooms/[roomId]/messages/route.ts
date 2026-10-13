import { eq, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { getGuestId } from '@/lib/guest-session'
import { getRoomAccess } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function generateStaticParams() {
  return [{ roomId: 'default' }]
}

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ roomId: string }> }
) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
    }

    const { roomId } = await context.params
    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json({ error: 'Invalid room ID.' }, { status: 400 })
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
    }

    // Fetch the latest 100 messages ordered by creation time
    const roomMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.roomId, roomId))
      .orderBy(messages.createdAt)
      .limit(100)

    return NextResponse.json(
      { messages: roomMessages }, 
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to retrieve messages.' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ roomId: string }> }
) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
    }

    const { roomId } = await context.params
    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json({ error: 'Invalid room ID.' }, { status: 400 })
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
    }

    const body = await request.json()
    const content = typeof body?.content === 'string' ? body.content.trim() : ''

    if (!content) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Message exceeds 1000 characters limit.' }, { status: 400 })
    }

    const [newMessage] = await db.insert(messages).values({
      roomId,
      senderId: guestId,
      content,
    }).returning()

    return NextResponse.json(
      { message: newMessage }, 
      { 
        status: 201,
        headers: { 'Cache-Control': 'no-store, max-age=0' } 
      }
    )
  } catch (error) {
    console.error('Error posting message:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

