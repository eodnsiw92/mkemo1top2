import { randomBytes } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rooms } from '@/lib/db/schema'
import { getGuestId } from '@/lib/guest-session'
import { isSameOriginRequest } from '@/lib/request-origin'

export const dynamic = 'force-static'

/**
 * GET: استرجاع قائمة الغرف المتاحة للمستخدم (أو الغرف النشطة مؤخراً)
 */
export async function GET(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { error: 'Cross-origin request denied.' },
        { status: 403 }
      )
    }

    const guestId = await getGuestId()

    // جلب أحدث 50 غرفة تم إنشاؤها أو التفاعل معها للمزامنة الجماعية
    const activeRooms = await db
      .select()
      .from(rooms)
      .orderBy(desc(rooms.updatedAt))
      .limit(50)

    return NextResponse.json(
      { 
        rooms: activeRooms,
        currentGuestId: guestId 
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  } catch (error) {
    console.error('Error fetching rooms list:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve rooms.' },
      { status: 500 }
    )
  }
}

/**
 * POST: إنشاء غرفة مشاهدة جماعية جديدة (Watch Party Room)
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { error: 'Cross-origin request denied.' },
        { status: 403 }
      )
    }

    const guestId = await getGuestId()
    let roomName = 'Watch Party Room'
    let initialMediaUrl = null

    try {
      const body = await request.json()
      if (typeof body?.name === 'string' && body.name.trim().length > 0) {
        roomName = body.name.trim().slice(0, 100)
      }
      if (typeof body?.mediaUrl === 'string' && body.mediaUrl.trim().length > 0) {
        initialMediaUrl = body.mediaUrl.trim()
      }
    } catch {
      // استخدام القيم الافتراضية إذا لم يتم إرسال جسم طلب (Body)
    }

    // توليد معرف فريد وآمن للغرفة
    const roomId = randomBytes(8).toString('hex')

    // إدخال الغرفة الجديدة في قاعدة البيانات وتعيين المضيف (Owner)
    const [newRoom] = await db
      .insert(rooms)
      .values({
        id: roomId,
        name: roomName,
        ownerId: guestId,
        currentMediaUrl: initialMediaUrl,
        isPlaying: false,
        playbackPosition: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        message: 'Room created successfully.',
        room: newRoom,
      },
      {
        status: 201,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    )
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room.' },
      { status: 500 }
    )
  }
}
