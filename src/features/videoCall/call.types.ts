export interface CallSliceState {
    receiverId: '',
    callerId: '',
    status: 'idle', // idle | ringing | connected | rejected | ended
    offer: {},
    answer: {},
};