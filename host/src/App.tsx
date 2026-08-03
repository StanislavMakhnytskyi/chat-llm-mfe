import React, { Suspense, lazy } from 'react';
import { useChatStore } from '@chat/shared';

const Sidebar = lazy(() => import('sidebar_remote/Sidebar'));
const Chat = lazy(() => import('chat_remote/Chat'));

function SidebarFallback() {
  return (
    <aside className="hidden h-full w-[22rem] shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl md:block">
      <div className="h-full animate-pulse bg-gradient-to-b from-white/10 to-transparent" />
    </aside>
  );
}

function ChatFallback() {
  return (
    <section className="flex min-w-0 flex-1 items-center justify-center bg-black/10">
      <div className="flex w-full max-w-3xl flex-col gap-4 px-6">
        <div className="h-6 w-52 rounded-full bg-white/10" />
        <div className="h-32 rounded-3xl bg-white/5" />
        <div className="h-20 w-3/4 rounded-3xl bg-white/5" />
      </div>
    </section>
  );
}

export default function App() {
  const toggleSidebarOpen = useChatStore((state) => state.toggleSidebarOpen);
  const sidebarOpen = useChatStore((state) => state.sidebarOpen);
  const selectedChat = useChatStore((state) =>
    state.chats.find((chat) => chat.id === state.selectedChatId) ?? null
  );

  return (
    <div className="flex h-full overflow-hidden text-slate-100">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                React 19 + Nx + MF 2.0+
              </p>
              <h1 className="mt-2 truncate text-xl font-semibold text-white md:text-2xl">
                {selectedChat?.title ?? 'Chat workspace'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100 md:block">
                {sidebarOpen ? 'Sidebar open' : 'Sidebar hidden'}
              </div>
              <button
                type="button"
                onClick={toggleSidebarOpen}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white shadow-[0_8px_30px_rgba(15,23,42,0.35)] transition hover:border-cyan-300/40 hover:bg-cyan-300/10 md:hidden"
              >
                <span className="text-lg">☰</span>
                Menu
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <Suspense fallback={<ChatFallback />}>
            <Chat />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
