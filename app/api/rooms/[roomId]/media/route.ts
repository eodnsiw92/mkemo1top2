import { del, get, put } from '@vercel/blob'
import { gateway, generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roomMessages } from '@/lib/db/schema'
import { getGuestId } from '@/lib/guest-session'
import { isRoomMember } from '@/lib/room-access'
import { isSameOriginRequest } from '@/lib/request-origin'

const maxMediaBytes = 4 * 1024 * 1024
const mediaTypes: Record<string, { extension: string; signature: (bytes: Uint8Array) => boolean }> = {
  'image/gif': { extension: 'gif', signature: (bytes) => ['GIF87a', 'GIF89a'].includes(new TextDecoder().decode(bytes.slice(0, 6))) },
  'image/jpeg': { extension: 'jpg', signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  'image/png': { extension: 'png', signature: (bytes) => bytes[0] === 0x89 && new TextDecoder().decode(bytes.slice(1, 4)) === 'PNG' },
  'image/webp': { extension: 'webp', signature: (bytes) => new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP' },
  'video/mp4': { extension: 'mp4', signature: (bytes) => new TextDecoder().decode(bytes.slice(4, 8)) === 'ftyp' },
  'video/webm': { extension: 'webm', signature: (bytes) => bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3 },
}
const mediaModerationPrompt = (isVideo: boolean) => `Moderate this ${isVideo ? 'short video' : 'image or animation'} for a general-audience watch room. If it contains nudity, pornographic or explicit sexual content, output only BLOCK. If safe, output only ALLOW. If uncertain, output BLOCK.`

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  if (!await isRoomMember(roomId, guestId)) return NextResponse.json({ error: 'Join the room before uploading media.' }, { status: 403 })

  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')
  const mediaType = file instanceof File ? mediaTypes[file.type] : undefined
  if (!(file instanceof File) || !mediaType || file.size < 1 || file.size > maxMediaBytes) {
    return NextResponse.json({ error: 'Choose a verified GIF, photo, or MP4/WebM video no larger than 4 MB.' }, { status: 400 })
  }
  const isVideo = file.type.startsWith('video/')
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (!mediaType.signature(header)) return NextResponse.json({ error: 'The media file could not be verified.' }, { status: 400 })

  try {
    const moderation = await generateText({
      model: gateway('google/gemini-3.5-flash-lite'),
      messages: [{ role: 'user', content: [
        { type: 'text', text: mediaModerationPrompt(isVideo) },
        { type: 'file', mediaType: file.type, data: Buffer.from(await file.arrayBuffer()).toString('base64') },
      ] }],
      maxOutputTokens: 8,
      abortSignal: AbortSignal.timeout(15_000),
    })
    if (moderation.text.trim().toUpperCase() !== 'ALLOW') {
      return NextResponse.json({ error: 'This media could not be approved for a general-audience room.' }, { status: 422 })
    }
    const blob = await put(`room-media/${roomId}/${randomUUID()}.${mediaType.extension}`, file, {
      access: 'private',
      addRandomSuffix: false,
      contentType: file.type,
      cacheControlMaxAge: 60,
    })
    return NextResponse.json({ pathname: blob.pathname }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Media upload is temporarily unavailable.' }, { status: 503 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Cross-origin request denied.' }, { status: 403 })
  const { roomId } = await context.params
  const guestId = await getGuestId()
  if (!await isRoomMember(roomId, guestId)) return NextResponse.json({ error: 'Join the room before deleting an upload.' }, { status: 403 })
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname || !pathname.startsWith(`room-media/${roomId}/`)) return NextResponse.json({ error: 'GIF not found.' }, { status: 404 })
  const [message] = await db.select({ id: roomMessages.id }).from(roomMessages)
    .where(and(eq(roomMessages.roomId, roomId), eq(roomMessages.attachmentPath, pathname))).limit(1)
  if (message) return NextResponse.json({ error: 'GIF is already attached to a message.' }, { status: 409 })
  try {
    await del(pathname)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'GIF cleanup is temporarily unavailable.' }, { status: 503 })
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params
  const guestId = await getGuestId()
  if (!await isRoomMember(roomId, guestId)) return NextResponse.json({ error: 'Join the room to view its attachments.' }, { status: 403 })
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname || !pathname.startsWith(`room-media/${roomId}/`)) return NextResponse.json({ error: 'GIF not found.' }, { status: 404 })

  const [attachment] = await db.select({ id: roomMessages.id }).from(roomMessages)
    .where(and(eq(roomMessages.roomId, roomId), eq(roomMessages.attachmentPath, pathname))).limit(1)
  if (!attachment) return NextResponse.json({ error: 'GIF not found.' }, { status: 404 })

  try {
    const result = await get(pathname, { access: 'private', ifNoneMatch: request.headers.get('if-none-match') ?? undefined })
    if (!result) return NextResponse.json({ error: 'GIF not found.' }, { status: 404 })
    if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, 'Cache-Control': 'private, no-cache' } })
    return new NextResponse(result.stream, { headers: {
      'Content-Type': result.blob.contentType,
      'Content-Length': String(result.blob.size),
      ETag: result.blob.etag,
      'Cache-Control': 'private, no-cache',
      'X-Content-Type-Options': 'nosniff',
    } })
  } catch {
    return NextResponse.json({ error: 'GIF unavailable.' }, { status: 503 })
  }
}
