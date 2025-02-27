export type UserInterface = {
    id: string
    username: string
}

export type MessageInterface = {
    id: string;
    content: string;
    sender: UserInterface;
    timestamp: string;
    room_id: string;
};