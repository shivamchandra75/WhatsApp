import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../confg/firebase';

export interface UserState {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    user: UserState | null;
    loading: boolean;       // true until the firebase auth listener fires once
    authLoading: boolean;   // true while a login/signup request is in flight
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: true,
    authLoading: false,
    error: null,
};

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            return {
                uid: credentials.user.uid,
                email: credentials.user.email,
                displayName: credentials.user.displayName,
            };
        } catch (err: any) {
            console.log('error firebase 🔴', err)
            return rejectWithValue(err.message as string);
        }
    }
);

export const signUpUser = createAsyncThunk(
    'auth/signUp',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            return {
                uid: credentials.user.uid,
                email: credentials.user.email,
                displayName: credentials.user.displayName,
            };
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    }
);

export const signOutUser = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
        } catch (error: any) {
            return rejectWithValue(error.message as string);
        }
    }
)

// --- Slice ---

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Called by useAuthListener to hydrate user from Firebase's onAuthStateChanged
        setUser: (state, action: PayloadAction<UserState | null>) => {
            state.user = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- loginUser ---
            .addCase(loginUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authLoading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.authLoading = false;
            })
            // --- signUpUser ---
            .addCase(signUpUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authLoading = false;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.authLoading = false;
            })
            // --- signOutUser ---
            .addCase(signOutUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.user = null;
                state.authLoading = false;
                state.error = null;
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.authLoading = false;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;