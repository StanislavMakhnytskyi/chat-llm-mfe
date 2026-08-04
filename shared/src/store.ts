import { create } from "zustand"
import type { Chat, ChatActions, ChatState, Message } from "./types"

export type ChatStore = ChatState & ChatActions

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createMessage(
  chatId: string,
  content: string,
  sender: Message["sender"]
): Message {
  return {
    id: createId("message"),
    chatId,
    content,
    sender,
    timestamp: new Date(),
  }
}

export function createChat(title: string): Chat {
  return {
    id: createId("chat"),
    title,
    lastMessage: "Start a new conversation",
    timestamp: new Date(),
    unread: 0,
  }
}

const now = new Date()

const mockChats: Chat[] = [
  {
    id: "chat-design-system",
    title: "Design system",
    lastMessage: "The sidebar should feel like the ChatGPT web shell.",
    timestamp: new Date(now.getTime() - 1000 * 60 * 2),
    unread: 2,
  },
  {
    id: "chat-react-roadmap",
    title: "React 19 roadmap",
    lastMessage: "Let us keep the bundle slim and the UI focused.",
    timestamp: new Date(now.getTime() - 1000 * 60 * 18),
    unread: 0,
  },
  {
    id: "chat-mfe-setup",
    title: "MFE setup",
    lastMessage: "Module Federation 2.0 is ready to bootstrap.",
    timestamp: new Date(now.getTime() - 1000 * 60 * 31),
    unread: 1,
  },
]

const mockMessages: Message[] = [
  {
    id: "message-1",
    chatId: "chat-design-system",
    content: "Can we make the sidebar slide over the content on mobile?",
    sender: "user",
    timestamp: new Date(now.getTime() - 1000 * 60 * 8),
  },
  {
    id: "message-2",
    chatId: "chat-design-system",
    content:
      "Yes. We can keep it docked on desktop and animated on small screens.",
    sender: "assistant",
    timestamp: new Date(now.getTime() - 1000 * 60 * 7),
  },
  {
    id: "message-3",
    chatId: "chat-react-roadmap",
    content: "Which React version should we target?",
    sender: "user",
    timestamp: new Date(now.getTime() - 1000 * 60 * 19),
  },
  {
    id: "message-4",
    chatId: "chat-react-roadmap",
    content:
      "React 19.2.x gives us the current stable APIs and the latest docs baseline.",
    sender: "assistant",
    timestamp: new Date(now.getTime() - 1000 * 60 * 18),
  },
  {
    id: "message-5",
    chatId: "chat-mfe-setup",
    content: "How do we keep state consistent across host and remotes?",
    sender: "user",
    timestamp: new Date(now.getTime() - 1000 * 60 * 35),
  },
  {
    id: "message-6",
    chatId: "chat-mfe-setup",
    content:
      "By sharing a single workspace package and registering it as a federation singleton.",
    sender: "assistant",
    timestamp: new Date(now.getTime() - 1000 * 60 * 31),
  },
]

export const useChatStore = create<ChatStore>()((set) => ({
  chats: mockChats,
  messages: mockMessages,
  selectedChatId: mockChats[0]?.id ?? null,
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarOpen: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectChat: (chatId) =>
    set((state) => ({
      selectedChatId: chatId,
      sidebarOpen: false,
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      ),
    })),
  appendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      chats: state.chats.map((chat) =>
        chat.id !== message.chatId
          ? chat
          : {
              ...chat,
              lastMessage: message.content,
              timestamp: message.timestamp,
              unread:
                message.sender === "assistant" &&
                state.selectedChatId !== message.chatId
                  ? chat.unread + 1
                  : 0,
            }
      ),
    })),
  addChat: (title) =>
    set((state) => {
      const chat = createChat(title)

      return {
        chats: [chat, ...state.chats],
        selectedChatId: chat.id,
        sidebarOpen: false,
        messages: [
          createMessage(
            chat.id,
            "Start the conversation with a clear prompt.",
            "assistant"
          ),
          ...state.messages,
        ],
      }
    }),
}))
