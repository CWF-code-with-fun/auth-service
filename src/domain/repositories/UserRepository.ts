import { User } from '../entities/User';

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findByRefreshToken(refreshToken: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    findUserById(id: number): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
}
