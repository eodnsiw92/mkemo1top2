import useSWR from 'swr'

export type RoomFeedMessage = {
  id: string
  guestId: string
  name: string
  text: string
  createdAt: string
  attachmentUrl: string | null
}

export type RoomFeedEvent = {
  id: string
  name: string
  action: 'joined' | 'left'
  createdAt: string
}

export type RoomFeedMember = {
  guestId: string
  displayName: string
  isHost: boolean
}

export type RoomFeed = {
  currentGuestId: string
  room: { id: string; title: string; source: string; isPublic: boolean; mediaUrl: string | null; playbackPosition: number; isPlaying: boolean; playbackUpdatedAt: string }
  members: RoomFeedMember[]
  messages: RoomFeedMessage[]
  events: RoomFeedEvent[]
}

async function fetchRoomFeed(url: string): Promise<RoomFeed> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Room activity could not be loaded.')
  return response.json()
}

export function useRoomFeed(roomId: string | null) {
  return useSWR<RoomFeed>(roomId ? `/api/rooms/${encodeURIComponent(roomId)}` : null, fetchRoomFeed, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    shouldRetryOnError: true,
  })
}
