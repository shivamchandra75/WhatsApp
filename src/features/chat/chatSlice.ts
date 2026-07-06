import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatSliceState, Message } from "./chat.types";
import type { RootState } from "../../store/store";
import { sendMessageToFirestore } from "./services/chatService";

const initialState: ChatSliceState = {
    activeChatId: '',
    activeContactName: '',
    activeMessages: [],
    loadingMessages: false,
}

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ chatId, message }: { chatId: string; message: string }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const senderId = state.auth.user?.uid;

        if (!senderId) return rejectWithValue('User not authenticated');

        try {
            await sendMessageToFirestore(chatId, message, senderId);
        } catch (error) {
            console.error(error);
            return rejectWithValue('Failed to send message');
        }
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChatId(state, action: PayloadAction<string>) {
            state.activeChatId = action.payload;
        },
        setActiveContact(state, action: PayloadAction<string>) {
            state.activeContactName = action.payload;
        },
        setMessages(state, action: PayloadAction<Message[]>) {
            state.activeMessages = action.payload;
        }
    }
});

export const { setActiveChatId, setActiveContact, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
