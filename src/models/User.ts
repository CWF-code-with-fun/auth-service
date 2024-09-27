// models/User.ts
export interface User {
    id: string;
    email: string;
    password: string;
}

// In-memory user store (replace with your DB logic)
export const users: User[] = [];
