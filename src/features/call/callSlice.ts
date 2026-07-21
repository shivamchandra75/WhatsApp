import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContactProfile } from '../users/UserList.types';

export type CallStatus = 'idle' | 'ringing' | 'connected';

export interface CallState {
  status: CallStatus;
  callId: string | null;
  remoteUser: ContactProfile | null;
  isCaller: boolean;
  isFullScreen: boolean;
  localStreamActive: boolean;
  remoteStreamActive: boolean;
  localVideoEnabled: boolean;
  localAudioEnabled: boolean;
}

const initialState: CallState = {
  status: 'idle',
  callId: null,
  remoteUser: null,
  isCaller: false,
  isFullScreen: false,
  localStreamActive: false,
  remoteStreamActive: false,
  localVideoEnabled: true,
  localAudioEnabled: true,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCallStatus: (state, action: PayloadAction<CallStatus>) => {
      state.status = action.payload;
    },
    setIncomingCall: (state, action: PayloadAction<{ callId: string; remoteUser: ContactProfile }>) => {
      state.status = 'ringing';
      state.callId = action.payload.callId;
      state.remoteUser = action.payload.remoteUser;
      state.isCaller = false;
    },
    initiateCall: (state, action: PayloadAction<ContactProfile>) => {
      state.status = 'ringing';
      state.remoteUser = action.payload;
      state.isCaller = true;
      state.isFullScreen = true;
    },
    setCallConnected: (state, action: PayloadAction<string>) => {
      state.status = 'connected';
      state.callId = action.payload;
      state.isFullScreen = true;
    },
    endCall: () => {
      return initialState; // Reset state
    },
    setFullScreen: (state, action: PayloadAction<boolean>) => {
      state.isFullScreen = action.payload;
    },
    setLocalStreamActive: (state, action: PayloadAction<boolean>) => {
      state.localStreamActive = action.payload;
    },
    setRemoteStreamActive: (state, action: PayloadAction<boolean>) => {
      state.remoteStreamActive = action.payload;
    },
    toggleLocalVideo: (state) => {
      state.localVideoEnabled = !state.localVideoEnabled;
    },
    toggleLocalAudio: (state) => {
      state.localAudioEnabled = !state.localAudioEnabled;
    }
  },
});

export const {
  setCallStatus,
  setIncomingCall,
  initiateCall,
  setCallConnected,
  endCall,
  setFullScreen,
  setLocalStreamActive,
  setRemoteStreamActive,
  toggleLocalVideo,
  toggleLocalAudio
} = callSlice.actions;

export default callSlice.reducer;
