import React, { useEffect, useMemo, useRef, useState } from "react"
import { createMessage, useChatStore } from "@chat/shared"
import { cva } from "class-variance-authority"

export function Chat() {
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const chats = useChatStore((state) => state.chats)
  const messages = useChatStore((state) => state.messages)
  const appendMessage = useChatStore((state) => state.appendMessage)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  )

  const activeMessages = useMemo(
    () => messages.filter((message) => message.chatId === selectedChatId),
    [messages, selectedChatId]
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [activeMessages.length])

  const sendMessage = () => {
    const text = draft.trim()

    if (!text || !activeChat || isSending) {
      return
    }

    setIsSending(true)
    setDraft("")

    const userMessage = createMessage(activeChat.id, text, "user")
    appendMessage(userMessage)

    window.setTimeout(() => {
      const assistantReplies = [
        "That fits the current shell very well.",
        "We can wire that into the shared Zustand store.",
        "The module federation boundaries are in good shape.",
      ]

      const replyIndex = Math.min(
        activeMessages.length,
        assistantReplies.length - 1
      )
      appendMessage(
        createMessage(activeChat.id, assistantReplies[replyIndex], "assistant")
      )
      setIsSending(false)
    }, 550)
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-slate-50">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 font-bold">
            Remote chat
          </p>
          <h2 className="mt-2 truncate text-xl font-semibold text-slate-900 md:text-2xl">
            {activeChat?.title ?? "No chat selected"}
          </h2>
        </div>

        <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600 md:block">
          {activeMessages.length} messages
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          {activeMessages.map((message) => {
            const mine = message.sender === "user"

            return (
              <article
                key={message.id}
                className={messageLayoutVariants({ mine })}
              >
                {!mine ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-semibold text-cyan-700">
                    AI
                  </div>
                ) : null}

                <div className={messageBubbleVariants({ mine })}>
                  <p className="text-sm leading-7 md:text-[15px]">
                    {message.content}
                  </p>
                  <p className={timeLabelVariants({ mine })}>
                    {timeLabel(message.timestamp)}
                  </p>
                </div>

                {mine ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-sm font-semibold text-slate-700">
                    You
                  </div>
                ) : null}
              </article>
            )
          })}

          {isSending ? (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                AI
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                Thinking...
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl md:px-6"
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
      >
        <div className="mx-auto flex w-full max-w-4xl items-end gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask something about the workspace..."
            rows={1}
            className="min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            disabled={!draft.trim() || isSending || !activeChat}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  )
}

function timeLabel(value: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value)
}

const messageLayoutVariants = cva("flex items-end gap-3", {
  variants: {
    mine: {
      true: "justify-end",
      false: "justify-start",
    },
  },
})

const messageBubbleVariants = cva(
  "max-w-[min(42rem,85%)] rounded-[1.75rem] px-5 py-4 shadow-sm",
  {
    variants: {
      mine: {
        true: "rounded-br-md bg-cyan-600 text-white",
        false: "rounded-bl-md border border-slate-200 bg-white text-slate-800",
      },
    },
  }
)

const timeLabelVariants = cva("mt-2 text-xs", {
  variants: {
    mine: {
      true: "text-cyan-100",
      false: "text-slate-400",
    },
  },
})

export default Chat
