export interface ChatSliceState {
    activeChatId: string | null;
    activeContactName: string | null;
    activeMessages: Message[];
    loadingMessages: boolean;
}

// 1. The Top-Level Chat Document Type
export interface ChatRoom {
    id: string;
    participants: string[];
    createdAt: any;
    updatedAt: any;
    lastMessage: string;
}

// 2. The Sub-collection Message Document Type
export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
}