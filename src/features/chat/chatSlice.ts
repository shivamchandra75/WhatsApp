import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatSliceState, Message } from "./chat.types";

const initialState: ChatSliceState = {
    activeChatId: '',
    activeContactName: '',
    activeMessages: [],
    loadingMessages: false,
}

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
