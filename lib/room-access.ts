import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { roomMembers, rooms } from '@/lib/db/schema'

export async function getRoomAccess(roomId: string, guestId: string) {
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)
  if (!room) return { room: null, isMember: false }
  const [membership] = await db.select({ guestId: roomMembers.guestId }).from(roomMembers).where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId))).limit(1)
  return { room, isMember: Boolean(membership) }
}

export async function isRoomMember(roomId: string, guestId: string) {
  const [membership] = await db.select({ guestId: roomMembers.guestId }).from(roomMembers).where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.guestId, guestId))).limit(1)
  return Boolean(membership)
}
