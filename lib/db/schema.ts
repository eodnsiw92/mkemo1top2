import { boolean, doublePrecision, index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const rooms = pgTable('mkemo_rooms', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  source: text('source').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  inviteTokenHash: text('invite_token_hash').notNull(),
  mediaUrl: text('media_url'),
  playbackPosition: doublePrecision('playback_position').notNull().default(0),
  isPlaying: boolean('is_playing').notNull().default(false),
  playbackUpdatedAt: timestamp('playback_updated_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('mkemo_rooms_public_updated_idx').on(table.isPublic, table.updatedAt)])

export const roomMembers = pgTable('mkemo_room_members', {
  roomId: text('room_id').notNull(),
  guestId: text('guest_id').notNull(),
  displayName: text('display_name').notNull(),
  isHost: boolean('is_host').notNull().default(false),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.roomId, table.guestId] })])

export const roomMessages = pgTable('mkemo_room_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  guestId: text('guest_id').notNull(),
  displayName: text('display_name').notNull(),
  body: text('body').notNull().default(''),
  attachmentPath: text('attachment_path'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('mkemo_room_messages_recent_idx').on(table.roomId, table.createdAt)])

export const roomEvents = pgTable('mkemo_room_events', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  guestId: text('guest_id').notNull(),
  displayName: text('display_name').notNull(),
  eventType: text('event_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('mkemo_room_events_recent_idx').on(table.roomId, table.createdAt)])

export const schema = { rooms, roomMembers, roomMessages, roomEvents }
export type Room = typeof rooms.$inferSelect
export type RoomMessage = typeof roomMessages.$inferSelect
export type RoomMember = typeof roomMembers.$inferSelect
export type RoomEvent = typeof roomEvents.$inferSelect
