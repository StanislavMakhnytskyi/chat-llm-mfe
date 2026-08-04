import React, { Suspense, lazy } from "react"
import { useChatStore } from "@chat/shared"
import {
  MfeBoundary,
  MicrofrontendOverlay,
  OverlayProvider,
} from "./components/MicrofrontendOverlay"

const Sidebar = lazy(() => import("sidebar_remote/Sidebar"))
const Chat = lazy(() => import("chat_remote/Chat"))

function SidebarFallback() {
  return (
    <aside className="hidden h-full w-[22rem] shrink-0 border-r border-slate-200 bg-slate-50 backdrop-blur-xl md:block">
      <div className="h-full animate-pulse bg-slate-100" />
    </aside>
  )
}

function ChatFallback() {
  return (
    <section className="flex min-w-0 flex-1 items-center justify-center bg-white">
      <div className="flex w-full max-w-3xl flex-col gap-4 px-6">
        <div className="h-6 w-52 rounded-full bg-slate-200" />
        <div className="h-32 rounded-3xl bg-slate-100" />
        <div className="h-20 w-3/4 rounded-3xl bg-slate-100" />
      </div>
    </section>
  )
}

export default function App() {
  const toggleSidebarOpen = useChatStore((state) => state.toggleSidebarOpen)
  const sidebarOpen = useChatStore((state) => state.sidebarOpen)
  const selectedChat = useChatStore(
    (state) =>
      state.chats.find((chat) => chat.id === state.selectedChatId) ?? null
  )

  return (
    <OverlayProvider>
      <MicrofrontendOverlay />
      <div className="flex h-full overflow-hidden text-slate-900 bg-white">
        <Suspense fallback={<SidebarFallback />}>
          <MfeBoundary
            name="Microfrontend 1 - Sidebar"
            team="Navigation Team"
            technology="Module Federation 2.0"
            description="Conversation list loaded as Module Federation 2.0 remote."
          >
            <Sidebar />
          </MfeBoundary>
        </Suspense>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="md:hidden border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSidebarOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="text-lg">☰</span>
                  Menu
                </button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1">
            <Suspense fallback={<ChatFallback />}>
              <MfeBoundary
                name="Microfrontend 2 - Chat"
                team="Messaging Team"
                technology="Module Federation 2.0"
                description="Main chat thread handling LLM streaming."
              >
                <Chat />
              </MfeBoundary>
            </Suspense>
          </main>
        </div>
      </div>
    </OverlayProvider>
  )
}
