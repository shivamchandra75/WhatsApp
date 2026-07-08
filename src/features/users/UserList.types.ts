export interface LastMessage {
  text: string;
  timestamp: number;
  isSeen: boolean;
  senderId: string;
}

export interface ContactProfile {
  uid: string;
  email: string;
  displayName: string;
  lastMessage?: LastMessage;
  status: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface UsersState {
  contacts: ContactProfile[];
  loading: boolean;
}