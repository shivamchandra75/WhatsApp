import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice'
import chatReducer from '../features/chat/chatSlice';
import callReducer from '../features/call/callSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        chat: chatReducer,
        call: callReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
