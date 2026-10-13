import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rooms } from '@/lib/db/schema'
import { getGuestId, hashInviteToken } from '@/lib/guest-session'
import { getRoomAccess } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

export async function generateStaticParams() {
  return [{ roomId: 'default' }]
}

export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ roomId: string }> }
) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { error: 'Cross-origin request denied.' }, 
        { status: 403 }
      )
    }

    const { roomId } = await context.params
    
    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid room ID provided.' }, 
        { status: 400 }
      )
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found.' }, 
        { status: 404 }
      )
    }

    if (room.ownerId !== guestId) {
      return NextResponse.json(
        { error: 'Only the room host can create a new invite.' }, 
        { status: 403 }
      )
    }

    const inviteToken = randomBytes(24).toString('base64url')
    const hashedToken = hashInviteToken(inviteToken)

    await db.update(rooms)
      .set({ 
        inviteTokenHash: hashedToken, 
        updatedAt: new Date() 
      })
      .where(eq(rooms.id, roomId))

    return NextResponse.json(
      { inviteToken, message: 'Invite token generated successfully.' }, 
      { 
        status: 200,
        headers: { 'Cache-Control': 'no-store' } 
      }
    )
  } catch (error) {
    console.error('Error generating invite token:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating invite.' }, 
      { status: 500 }
    )
  }
}
