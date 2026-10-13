import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rooms } from '@/lib/db/schema'
import { getGuestId } from '@/lib/guest-session'
import { getRoomAccess } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ roomId: 'default' }]
}

/**
 * GET: استرجاع تفاصيل الغرفة المتقدمة وحالة المزامنة لحظياً (مشابه لمنصات المشاهدة الجماعية)
 */
export async function GET(
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
        { error: 'Invalid or missing room identifier.' },
        { status: 400 }
      )
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found or access restricted.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        room: {
          id: room.id,
          name: room.name ?? 'Watch Party Room',
          ownerId: room.ownerId,
          isHost: room.ownerId === guestId,
          currentMediaUrl: room.currentMediaUrl || null,
          isPlaying: room.isPlaying ?? false,
          playbackPosition: room.playbackPosition ?? 0,
          updatedAt: room.updatedAt,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  } catch (error) {
    console.error('Error fetching room state:', error)
    return NextResponse.json(
      { error: 'Internal server error while fetching room.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH: تحديث إعدادات الغرفة، الروابط، وحالة مزامنة الفيديو (خاص بصلاحيات المضيف)
 */
export async function PATCH(
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
        { error: 'Invalid room identifier.' },
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

    // التحقق من أن المضيف هو الوحيد المخول بتغيير حالة التشغيل أو الوسائط
    if (room.ownerId !== guestId) {
      return NextResponse.json(
        { error: 'Unauthorized: Only the room host can modify playback settings.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData: Record<string, any> = { updatedAt: new Date() }

    if (typeof body?.currentMediaUrl === 'string') {
      updateData.currentMediaUrl = body.currentMediaUrl.trim()
    }
    if (typeof body?.isPlaying === 'boolean') {
      updateData.isPlaying = body.isPlaying
    }
    if (typeof body?.playbackPosition === 'number') {
      updateData.playbackPosition = Math.max(0, body.playbackPosition)
    }
    if (typeof body?.roomName === 'string' && body.roomName.trim().length > 0) {
      updateData.name = body.roomName.trim().slice(0, 100)
    }

    const [updatedRoom] = await db
      .update(rooms)
      .set(updateData)
      .where(eq(rooms.id, roomId))
      .returning()

    return NextResponse.json(
      {
        message: 'Room synchronized and updated successfully.',
        room: updatedRoom,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  } catch (error) {
    console.error('Error updating room synchronization:', error)
    return NextResponse.json(
      { error: 'Failed to update room state.' },
      { status: 500 }
    )
  }
}
