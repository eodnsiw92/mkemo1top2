import { NextRequest, NextResponse } from 'next/server'
import { resolveMediaLink } from '@/lib/media-resolver'

export const runtime = 'nodejs'

const errorMessages = {
  invalid: 'Use a secure HTTPS link.',
  blocked: 'Pornographic or adult links are not allowed.',
  unreachable: 'This site could not be reached. Check the link and try again.',
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')?.trim() ?? ''
  if (!url || url.length > 2048) {
    return NextResponse.json({ error: errorMessages.invalid, reason: 'invalid' }, { status: 400 })
  }

  const result = await resolveMediaLink(url)
  if (!result.ok) {
    return NextResponse.json(
      { error: errorMessages[result.reason], reason: result.reason },
      { status: result.reason === 'blocked' ? 422 : 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  return NextResponse.json(
    { url: result.source.url, label: result.source.label, kind: result.source.kind, title: result.title, frameBlocked: result.frameBlocked },
    { headers: { 'Cache-Control': 'private, max-age=60' } },
  )
}
