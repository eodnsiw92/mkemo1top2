'use client'

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Copy, ImagePlus, Languages, LoaderCircle, MessageCircle, Send } from 'lucide-react'
import { CountryName } from '@/components/country-name'
import type { RoomFeed } from '@/lib/room-feed'

type RoomChatPanelProps = {
  roomId: string
  locale: 'ar' | 'en'
  feed?: RoomFeed
  onRefresh: () => void
  onNotice: (message: string) => void
}

export function RoomChatPanel({ roomId, locale, feed, onRefresh, onNotice }: RoomChatPanelProps) {
  const [draft, setDraft] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [translatingKeys, setTranslatingKeys] = useState<Record<string, boolean>>({})
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [visibleTranslations, setVisibleTranslations] = useState<Record<string, boolean>>({})
  const mediaInput = useRef<HTMLInputElement>(null)
  const messages = feed?.messages ?? []
  const events = feed?.events ?? []
  const activity = useMemo(() => [
    ...messages.map((message) => ({ kind: 'message' as const, at: message.createdAt, value: message })),
    ...events.map((event) => ({ kind: 'event' as const, at: event.createdAt, value: event })),
  ].sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime()), [events, messages])

  function selectMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'].includes(file.type) || file.size > 4 * 1024 * 1024) {
      onNotice(locale === 'ar' ? 'اختار GIF أو صورة أو فيديو MP4/WebM لحد 4 ميجابايت.' : 'Choose a GIF, photo, or MP4/WebM video up to 4 MB.')
      event.target.value = ''
      return
    }
    setSelectedMedia(file)
    event.target.value = ''
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if ((!text && !selectedMedia) || sending) return
    setSending(true)
    try {
      let attachmentPath: string | undefined
      if (selectedMedia) {
        const formData = new FormData()
        formData.set('file', selectedMedia)
        const upload = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/media`, { method: 'POST', body: formData })
        const uploadResult = await upload.json()
        if (!upload.ok) throw new Error(uploadResult.error || 'GIF upload failed.')
        attachmentPath = uploadResult.pathname
      }
      const response = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, attachmentPath }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (attachmentPath) void fetch(`/api/rooms/${encodeURIComponent(roomId)}/media?pathname=${encodeURIComponent(attachmentPath)}`, { method: 'DELETE' })
        throw new Error(result.error || 'Message could not be sent.')
      }
      setDraft('')
      setSelectedMedia(null)
      onRefresh()
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Message could not be sent.')
    } finally {
      setSending(false)
    }
  }

  async function translateMessage(id: string, text: string) {
    const targetLocale = locale
    const translationKey = `${id}:${targetLocale}`
    if (translations[translationKey]) {
      setVisibleTranslations((current) => ({ ...current, [translationKey]: !current[translationKey] }))
      return
    }
    if (translatingKeys[translationKey]) return
    setTranslatingKeys((current) => ({ ...current, [translationKey]: true }))
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, text, targetLanguage: targetLocale }),
      })
      const result = await response.json()
      if (!response.ok || typeof result.translation !== 'string' || !result.translation.trim()) {
        throw new Error(result.error || (targetLocale === 'ar' ? 'تعذرت ترجمة الرسالة.' : 'Translation failed.'))
      }
      setTranslations((current) => ({ ...current, [translationKey]: result.translation.trim() }))
      setVisibleTranslations((current) => ({ ...current, [translationKey]: true }))
    } catch (error) {
      onNotice(error instanceof Error ? error.message : (targetLocale === 'ar' ? 'تعذرت ترجمة الرسالة.' : 'Translation failed.'))
    } finally {
      setTranslatingKeys((current) => {
        const next = { ...current }
        delete next[translationKey]
        return next
      })
    }
  }

  return <div className="chat-panel-content">
    <div className="chat-day">{locale === 'ar' ? 'نشاط الغرفة' : 'ROOM ACTIVITY'} <span /> {locale === 'ar' ? 'مباشر' : 'LIVE'}</div>
    <div className="chat-messages" role="log" aria-label={locale === 'ar' ? 'رسائل الغرفة' : 'Room chat messages'} aria-live="polite">
      {activity.map((item) => {
        if (item.kind === 'event') {
          return <p className="room-event" key={`event-${item.value.id}`} dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}><span />{locale === 'ar' ? `${item.value.name} ${item.value.action === 'joined' ? 'انضم إلى الغرفة' : 'غادر الغرفة'}` : `${item.value.name} ${item.value.action} the room`}</p>
        }

        const message = item.value
        const translationKey = `${message.id}:${locale}`
        const translation = translations[translationKey]
        const isTranslating = Boolean(translatingKeys[translationKey])
        const isTranslationVisible = Boolean(translation && visibleTranslations[translationKey])
        const translationAction = isTranslationVisible
          ? (locale === 'ar' ? 'إخفاء الترجمة' : 'Hide translation')
          : translation
            ? (locale === 'ar' ? 'عرض الترجمة' : 'Show translation')
            : (locale === 'ar' ? 'ترجم إلى العربية' : 'Translate to English')

        return <article className={`chat-message${message.guestId === feed?.currentGuestId ? ' own' : ''}`} key={`message-${message.id}`}>
          <div className="chat-bubble-wrap"><div className="chat-meta"><strong className="chat-user-name"><CountryName name={message.name} /></strong><time dateTime={message.createdAt}>{new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(new Date(message.createdAt))}</time></div>
            {message.text && <p dir="auto">{message.text}</p>}
            {message.attachmentUrl && (message.attachmentKind === 'video' ? <video className="chat-gif" src={message.attachmentUrl} controls playsInline preload="metadata" aria-label={locale === 'ar' ? 'فيديو أرسله أحد أعضاء الغرفة' : 'Video shared in the room'} /> : <img className="chat-gif" src={message.attachmentUrl} alt={locale === 'ar' ? 'صورة أو GIF أرسلها أحد أعضاء الغرفة' : 'Photo or GIF shared in the room'} loading="lazy" />)}
            {isTranslationVisible && translation && <p className="chat-translation" role="status" aria-label={locale === 'ar' ? 'الترجمة العربية' : 'English translation'} dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>{translation}</p>}
            <div className="chat-message-actions"><button type="button" aria-label={locale === 'ar' ? 'نسخ الرسالة' : 'Copy message'} onClick={() => { void navigator.clipboard.writeText(message.text).then(() => onNotice(locale === 'ar' ? 'تم نسخ الرسالة.' : 'Message copied.')).catch(() => onNotice(locale === 'ar' ? 'تعذر نسخ الرسالة.' : 'Could not copy message.')) }} disabled={!message.text}><Copy size={12} /><span>{locale === 'ar' ? 'نسخ' : 'Copy'}</span></button><button type="button" aria-label={translationAction} aria-pressed={isTranslationVisible} onClick={() => void translateMessage(message.id, message.text)} disabled={!message.text || isTranslating}>{isTranslating ? <LoaderCircle size={12} className="spin" /> : <Languages size={12} />}<span>{isTranslating ? (locale === 'ar' ? 'جارٍ الترجمة…' : 'Translating…') : translationAction}</span></button></div>
          </div>
        </article>
      })}
      {activity.length === 0 && <p className="chat-empty"><MessageCircle size={18} />{locale === 'ar' ? 'ابدأوا المحادثة، رسائلكم تظهر للجميع في الغرفة.' : 'Start the conversation. Room messages sync for everyone here.'}</p>}
    </div>
    <form className="chat-compose" onSubmit={sendMessage}>
      <input aria-label={locale === 'ar' ? 'اكتب رسالة' : 'Write a message'} placeholder={locale === 'ar' ? 'اكتب شي لطيف...' : 'Say something nice...'} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} />
      <button type="button" aria-label={locale === 'ar' ? 'إرفاق GIF أو صورة أو فيديو' : 'Attach a GIF, photo, or video'} onClick={() => mediaInput.current?.click()}><ImagePlus size={16} /></button>
      <button className="send-message" type="submit" aria-label={locale === 'ar' ? 'إرسال الرسالة' : 'Send message'} disabled={sending || (!draft.trim() && !selectedMedia)}>{sending ? <LoaderCircle className="spin" size={14} /> : <Send size={14} />}</button>
      <input ref={mediaInput} className="visually-hidden-input" type="file" accept="image/gif,image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={selectMedia} aria-label={locale === 'ar' ? 'اختر GIF أو صورة أو فيديو' : 'Choose a GIF, photo, or video'} />
    </form>
    {selectedMedia && <div className="selected-gif"><span>{selectedMedia.name}</span><button type="button" onClick={() => setSelectedMedia(null)}>{locale === 'ar' ? 'إزالة' : 'Remove'}</button></div>}
    <p className="preview-caption"><MessageCircle size={13} /> {locale === 'ar' ? 'الرسائل والصور وملفات GIF محفوظة داخل الغرفة. تُفحص الصور تلقائيًا قبل النشر؛ لا تشارك كلمات مرور البث.' : 'Messages and private media stay in this room. Uploads are automatically screened; never share streaming passwords.'}</p>
  </div>
}
