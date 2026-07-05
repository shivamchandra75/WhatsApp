import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../confg/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Maps Firebase Auth error codes to user-friendly messages
function getFirebaseAuthError(code: string): string {
    switch (code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Incorrect email or password.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'Something went wrong. Please try again.';
    }
}

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
            return rejectWithValue(getFirebaseAuthError(err.code));
        }
    }
);

const getName = (email: string) => email.split('@')[0];

export const registerUser = createAsyncThunk(
    'auth/signUp',
    async ({ email, password, displayName }: { email: string; password: string, displayName: string }, { rejectWithValue }) => {
        // --- STEP 1: Create Firebase Auth user ---
        let credentials;
        try {
            console.log('🔵 [registerUser] Step 1: Creating auth user...');
            credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log('✅ [registerUser] Step 1 SUCCESS: Auth user created', credentials.user.uid);
        } catch (authErr: any) {
            console.error('🔴 [registerUser] Step 1 FAILED: Auth error', { code: authErr.code, message: authErr.message });
            return rejectWithValue(getFirebaseAuthError(authErr.code));
        }

        // --- STEP 2: Write user document to Firestore ---
        const user = credentials.user;
        try {
            const docData = {
                uid: user.uid,
                email: user.email,
                displayName: displayName || getName(user.email),
                createdAt: new Date().toISOString(),
                status: "Hey there! I am using WhatsApp.",
            };
            console.log('🔵 [registerUser] Step 2: Writing Firestore doc...', { path: `users/${user.uid}`, data: docData });
            await setDoc(doc(db, 'users', user.uid), docData);
            console.log('✅ [registerUser] Step 2 SUCCESS: Firestore doc written');
        } catch (firestoreErr: any) {
            // NOTE: Firestore errors use different codes (e.g. 'permission-denied'),
            // NOT the auth/xxx codes. Log the full error to diagnose.
            console.error('🔴 [registerUser] Step 2 FAILED: Firestore error', {
                code: firestoreErr.code,
                message: firestoreErr.message,
                firestoreErr
            });
            // Auth succeeded but Firestore failed — return a clear message
            return rejectWithValue(`Account created but profile save failed: ${firestoreErr.code}`);
        }

        console.log('✅ [registerUser] All steps complete');
        return {
            uid: user.uid,
            email: user.email,
            displayName: displayName || getName(user.email),
        };
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
            // --- registerUser ---
            .addCase(registerUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
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