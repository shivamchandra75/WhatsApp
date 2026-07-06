import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
