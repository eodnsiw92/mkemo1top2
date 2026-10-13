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
 * GET: استرجاع تفاصيل الوسائط الحالية وحالة المزامنة اللحظية للغرفة
 */
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
      return NextResponse.json({ error: 'Invalid or missing room identifier.' }, { status: 400 })
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json({ error: 'Room not found or access restricted.' }, { status: 404 })
    }

    return NextResponse.json(
      {
        media: {
          currentMediaUrl: room.currentMediaUrl || null,
          isPlaying: room.isPlaying ?? false,
          playbackPosition: room.playbackPosition ?? 0,
          updatedAt: room.updatedAt,
        }
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      }
    )
  } catch (error) {
    console.error('Error fetching media synchronization state:', error)
    return NextResponse.json({ error: 'Failed to retrieve media state.' }, { status: 500 })
  }
}

/**
 * POST: تحديث رابط الوسائط أو مزامنة التشغيل والإيقاف المؤقت (مستوحى من أنظمة Rave الحديثة)
 */
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
      return NextResponse.json({ error: 'Invalid room identifier.' }, { status: 400 })
    }

    const guestId = await getGuestId()
    const { room } = await getRoomAccess(roomId, guestId)

    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
    }

    // التحقق من صلاحيات المضيف لتغيير محتوى الوسائط الأساسي
    const isHost = room.ownerId === guestId
    const body = await request.json()
    
    const updateData: Record<string, any> = { updatedAt: new Date() }

    // معالجة رابط الميديا الجديد (يتطلب صلاحية المضيف عادة أو حسب سياسة الغرفة)
    if (typeof body?.mediaUrl === 'string') {
      if (!isHost) {
        return NextResponse.json({ error: 'Unauthorized: Only the room host can change the media source.' }, { status: 403 })
      }
      const sanitizedUrl = body.mediaUrl.trim()
      if (sanitizedUrl.length > 2048) {
        return NextResponse.json({ error: 'Media URL is too long.' }, { status: 400 })
      }
      updateData.currentMediaUrl = sanitizedUrl
      updateData.isPlaying = true
      updateData.playbackPosition = 0
    }

    // مزامنة حالة التشغيل والإيقاف المؤقت (Play / Pause Sync)
    if (typeof body?.isPlaying === 'boolean') {
      updateData.isPlaying = body.isPlaying
    }

    // مزامنة موضع التشغيل بالثواني بدقة عالية (Seek Position Sync)
    if (typeof body?.playbackPosition === 'number') {
      updateData.playbackPosition = Math.max(0, body.playbackPosition)
    }

    // تنفيذ التحديث الفوري في قاعدة البيانات
    const [updatedRoom] = await db
      .update(rooms)
      .set(updateData)
      .where(eq(rooms.id, roomId))
      .returning()

    return NextResponse.json(
      { 
        message: 'Media state synchronized successfully.', 
        media: {
          currentMediaUrl: updatedRoom.currentMediaUrl,
          isPlaying: updatedRoom.isPlaying,
          playbackPosition: updatedRoom.playbackPosition,
          updatedAt: updatedRoom.updatedAt,
        }
      },
      { 
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' } 
      }
    )
  } catch (error) {
    console.error('Error updating media synchronization:', error)
    return NextResponse.json({ error: 'Internal server error while syncing media.' }, { status: 500 })
  }
}
