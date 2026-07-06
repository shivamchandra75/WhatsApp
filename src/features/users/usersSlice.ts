import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ContactProfile, UsersState } from './UserList.types';

const initialState: UsersState = {
    contacts: [],
    loading: true,
};

export const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setContacts: (state, action: PayloadAction<ContactProfile[]>) => {
            state.contacts = action.payload;
        },
    }
})

export const { setContacts } = usersSlice.actions;
export default usersSlice.reducer;