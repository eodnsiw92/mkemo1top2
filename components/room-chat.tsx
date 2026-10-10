'use client'

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { Mic, MicOff, MoreHorizontal, Send, Settings2, Smile } from 'lucide-react'

export type RoomMessage = {
  id: string
  name: string
  text: string
  time: string
  tone: 'coral' | 'violet' | 'blue' | 'green'
  own?: boolean
}

type RoomChatProps = {
  messages: RoomMessage[]
  draft: string
  micEnabled: boolean
  onDraftChange: (value: string) => void
  onSend: (event: FormEvent<HTMLFormElement>) => void
  onMicToggle: () => void
  onNotice: (message: string) => void
}

export function RoomChat({
  messages,
  draft,
  micEnabled,
  onDraftChange,
  onSend,
  onMicToggle,
  onNotice,
}: RoomChatProps) {
  const endOfMessages = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages.length])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || event.shiftKey) return
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  return (
    <aside className="chat-panel" aria-label="Room chat">
      <div className="chat-header">
        <div>
          <h2>Room chat</h2>
          <span className="chat-online"><span className="live-dot" /> 4 here now</span>
        </div>
        <button className="icon-button" type="button" onClick={() => onNotice('Chat settings are available to the room host.')} aria-label="Chat settings">
          <Settings2 size={17} />
        </button>
      </div>

      <section className="voice-card" aria-labelledby="voice-title">
        <div className="voice-card-top">
          <div className="voice-icon"><Mic size={16} /></div>
          <div className="voice-copy"><strong id="voice-title">Voice lounge</strong><span>Talk while you watch</span></div>
          <span className="voice-status">PREVIEW</span>
        </div>
        <button className={`voice-join${micEnabled ? ' voice-active' : ''}`} type="button" onClick={onMicToggle}>
          {micEnabled ? <Mic size={15} /> : <MicOff size={15} />}
          {micEnabled ? 'Mic on in this preview' : 'Turn on microphone'}
        </button>
        <span className="voice-caption">Live group audio needs a voice service connection.</span>
      </section>

      <div className="chat-divider"><span>Today</span></div>
      <div className="messages-list" role="log" aria-label="Room messages" aria-live="polite" aria-relevant="additions text">
        {messages.map((message) => (
          <article className={`message-row${message.own ? ' own-message' : ''}`} key={message.id}>
            {!message.own && <span className={`message-avatar avatar-${message.tone}`} aria-hidden="true">{message.name.slice(0, 1)}</span>}
            <div className="message-content">
              <div className="message-meta"><strong>{message.own ? 'You' : message.name}</strong><time>{message.time}</time></div>
              <p>{message.text}</p>
            </div>
          </article>
        ))}
        <div ref={endOfMessages} />
      </div>

      <form className="chat-composer" onSubmit={onSend}>
        <input
          aria-label="Write a message"
          placeholder="Say something nice..."
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="emoji-button" type="button" aria-label="Add sparkle" onClick={() => onDraftChange(`${draft} ✨`)}><Smile size={17} /></button>
        <button className="send-button" type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={15} /></button>
      </form>
      <div className="chat-foot"><MoreHorizontal size={13} /> Only room members can see these messages</div>
    </aside>
  )
}

export default RoomChat


