import { useMemo, useState } from "react"
import { useChatStore } from "@chat/shared"
import { cva } from "class-variance-authority"

export function Sidebar() {
  const [query, setQuery] = useState("")
  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const sidebarOpen = useChatStore((state) => state.sidebarOpen)
  const setSidebarOpen = useChatStore((state) => state.setSidebarOpen)
  const selectChat = useChatStore((state) => state.selectChat)
  const addChat = useChatStore((state) => state.addChat)

  const filteredChats = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return chats
    }

    return chats.filter((chat) => {
      return (
        chat.title.toLowerCase().includes(normalized) ||
        chat.lastMessage.toLowerCase().includes(normalized)
      )
    })
  }, [chats, query])

  return (
    <aside className={sidebarVariants({ open: sidebarOpen })}>
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 font-bold">
                Conversations
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Workspace
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:hidden"
              aria-label="Close sidebar"
            >
              X
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <label className="flex items-center gap-3 rounded-xl px-3 py-2">
              <span className="text-sm text-slate-400">/</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chats"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => addChat("Untitled chat")}
            disabled={sidebarOpen && filteredChats.length >= 10}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <span className="text-base">+</span>
            New chat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-2">
            {filteredChats.map((chat) => {
              const active = chat.id === selectedChatId

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => selectChat(chat.id)}
                  className={chatButtonVariants({ active })}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {chat.title}
                      </p>
                      <p className="mt-1 max-h-12 overflow-hidden text-sm leading-6 text-slate-500">
                        {chat.lastMessage}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="text-xs text-slate-400">
                        {formatTime(chat.timestamp)}
                      </span>
                      {chat.unread > 0 ? (
                        <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">
                          {chat.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value)
}

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-30 w-[22rem] max-w-[88vw] border-r border-slate-200 bg-white/95 backdrop-blur-2xl transition-transform duration-300 md:static md:z-auto md:w-[22rem] md:translate-x-0",
  {
    variants: {
      open: {
        true: "translate-x-0 shadow-xl md:shadow-none",
        false: "-translate-x-full md:translate-x-0 border-transparent",
      },
    },
  }
)

const chatButtonVariants = cva(
  "group w-full rounded-3xl border px-4 py-4 text-left transition duration-200",
  {
    variants: {
      active: {
        true: "border-cyan-200 bg-cyan-50",
        false: "border-transparent bg-transparent hover:bg-slate-100",
      },
    },
  }
)

export default Sidebar
