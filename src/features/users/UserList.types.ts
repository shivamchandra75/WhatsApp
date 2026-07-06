export interface LastMessage {
  text: string;
  timestamp: number; // Storing as unix timestamp in milliseconds. Firebase can also use its own Timestamp type.
  isSeen: boolean;
}

export interface ContactProfile {
  uid: string;
  email: string;
  displayName: string;
  lastMessage?: LastMessage;
  status: string;
}

export interface UsersState {
  contacts: ContactProfile[];
  loading: boolean;
}