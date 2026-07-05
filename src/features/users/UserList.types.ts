export interface LastMessage {
  text: string;
  timestamp: number; // Storing as unix timestamp in milliseconds. Firebase can also use its own Timestamp type.
  isSeen: boolean;
}

export interface UserListUser {
  userId: string;
  username: string;
  userImage: string;
  lastMessage?: LastMessage;
}

export const USERS: UserListUser[] = [
  {
    userId: "user_1",
    username: "Alice",
    userImage: "https://i.pravatar.cc/150?u=alice",
    lastMessage: {
      text: "Hey, are we still meeting today?",
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      isSeen: false,
    },
  },
  {
    userId: "user_2",
    username: "Bob",
    userImage: "https://i.pravatar.cc/150?u=bob",
    lastMessage: {
      text: "I sent you the files.",
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      isSeen: true,
    },
  },
  {
    userId: "user_3",
    username: "Charlie",
    userImage: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: {
      text: "Let me know when you are free.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      isSeen: true,
    },
  },
  {
    userId: "user_4",
    username: "Diana",
    userImage: "https://i.pravatar.cc/150?u=diana",
  },
];
