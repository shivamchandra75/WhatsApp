import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CallSliceState } from "./call.types";
import { createOfferInFirestore } from "./webrtcService";

const initialState: CallSliceState = {
    receiverId: '',
    callerId: '',
    status: 'idle', // idle | ringing | connected | rejected | ended
    offer: {},
    answer: {}
}

export const makeACall = createAsyncThunk(
    'makeACall',
    async ({ callerId, receiverId }: { callerId: string, receiverId: string }, { rejectWithValue }) => {
        try {
            const callId = await createOfferInFirestore(callerId, receiverId);
            console.log('offer created in firestore', callId);
        } catch (error) {
            return rejectWithValue(error?.message || 'failed to create an offer');
        }

    });

export const callSlice = createSlice({
    name: 'callSlice',
    initialState,
    reducers: {
        setReceiverId(state, action) {
            state.receiverId = action.payload;
        },
        setCallerId(state, action) {
            state.callerId = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setOffer(state, action) {
            state.offer = action.payload;
        },
        setAnswer(state, action) {
            state.answer = action.payload;
        }
    }
});

export const { setReceiverId, setCallerId, setStatus, setOffer, setAnswer } = callSlice.actions;

export default callSlice.reducer;