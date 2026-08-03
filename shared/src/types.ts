export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  sidebarOpen: boolean;
}

export interface ChatActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarOpen: () => void;
  selectChat: (chatId: string) => void;
  appendMessage: (message: Message) => void;
  addChat: (title: string) => void;
}
