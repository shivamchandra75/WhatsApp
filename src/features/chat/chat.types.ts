import type { ContactProfile, LastMessage } from "../users/UserList.types";

export interface ChatSliceState {
    activeChatId: string | null;
    activeContact: ContactProfile | null;
    activeMessages: Message[];
    loadingMessages: boolean;
}
export interface UnreadCount {
    [key: string]: number;
}

// 1. The Top-Level Chat Document Type
export interface ChatRoom {
    id: string;
    participants: string[];
    createdAt: any;
    updatedAt: any;
    lastMessage: LastMessage;
    unreadCount: UnreadCount;
}

// 2. The Sub-collection Message Document Type
export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: number | null; // stored as milliseconds — plain number, Redux serializable
}