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