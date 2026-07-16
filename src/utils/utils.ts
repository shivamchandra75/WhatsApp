export const formatTimeTo12Hours = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const AVATAR_COLORS = [
    'green', 'blue', 'orange', 'purple', 'yellow', 'teal', 'pink'
];

export const getAvatarColor = (identifier: string) => {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

export async function getCameraAndMicPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        return stream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        throw error;
    }
}

export function turnOffCameraAndMic(stream: MediaStream | null) {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}