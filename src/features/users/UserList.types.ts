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
  }, {
    userId: "user_5",
    username: "Ethan",
    userImage: "https://i.pravatar.cc/150?u=ethan",
    lastMessage: {
      text: "Sounds like a plan!",
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      isSeen: true,
    },
  },
  {
    userId: "user_6",
    username: "Fiona",
    userImage: "https://i.pravatar.cc/150?u=fiona",
    lastMessage: {
      text: "Can you send me the link again?",
      timestamp: Date.now() - 1000 * 60 * 15,
      isSeen: false,
    },
  },
  {
    userId: "user_7",
    username: "George",
    userImage: "https://i.pravatar.cc/150?u=george",
    lastMessage: {
      text: "I'll be there in 10 mins.",
      timestamp: Date.now() - 1000 * 60 * 30,
      isSeen: true,
    },
  },
  {
    userId: "user_8",
    username: "Hannah",
    userImage: "https://i.pravatar.cc/150?u=hannah",
    lastMessage: {
      text: "Haha, that's hilarious!",
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      isSeen: true,
    },
  },
  {
    userId: "user_9",
    username: "Ian",
    userImage: "https://i.pravatar.cc/150?u=ian",
  },
  {
    userId: "user_10",
    username: "Julia",
    userImage: "https://i.pravatar.cc/150?u=julia",
    lastMessage: {
      text: "Did you watch the game last night?",
      timestamp: Date.now() - 1000 * 60 * 60 * 12,
      isSeen: true,
    },
  },
  {
    userId: "user_11",
    username: "Kevin",
    userImage: "https://i.pravatar.cc/150?u=kevin",
    lastMessage: {
      text: "Thanks for the help!",
      timestamp: Date.now() - 1000 * 60 * 60 * 48,
      isSeen: true,
    },
  },
  {
    userId: "user_12",
    username: "Laura",
    userImage: "https://i.pravatar.cc/150?u=laura",
    lastMessage: {
      text: "Don't forget the milk.",
      timestamp: Date.now() - 1000 * 60 * 45,
      isSeen: false,
    },
  },
  {
    userId: "user_13",
    username: "Michael",
    userImage: "https://i.pravatar.cc/150?u=michael",
    lastMessage: {
      text: "Are we still on for lunch?",
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      isSeen: true,
    },
  },
  {
    userId: "user_14",
    username: "Nina",
    userImage: "https://i.pravatar.cc/150?u=nina",
    lastMessage: {
      text: "I'll call you back later.",
      timestamp: Date.now() - 1000 * 60 * 60 * 7,
      isSeen: true,
    },
  },
  {
    userId: "user_15",
    username: "Oscar",
    userImage: "https://i.pravatar.cc/150?u=oscar",
  },
  {
    userId: "user_16",
    username: "Paula",
    userImage: "https://i.pravatar.cc/150?u=paula",
    lastMessage: {
      text: "Happy Birthday!! 🎉",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
      isSeen: true,
    },
  },
  {
    userId: "user_17",
    username: "Quinn",
    userImage: "https://i.pravatar.cc/150?u=quinn",
    lastMessage: {
      text: "Just checking in.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
      isSeen: true,
    },
  },
  {
    userId: "user_18",
    username: "Rachel",
    userImage: "https://i.pravatar.cc/150?u=rachel",
    lastMessage: {
      text: "See you tomorrow.",
      timestamp: Date.now() - 1000 * 60 * 60 * 8,
      isSeen: false,
    },
  },
  {
    userId: "user_19",
    username: "Steve",
    userImage: "https://i.pravatar.cc/150?u=steve",
    lastMessage: {
      text: "Can we reschedule?",
      timestamp: Date.now() - 1000 * 60 * 60 * 1,
      isSeen: true,
    },
  }
];
