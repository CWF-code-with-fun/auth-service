import { User } from '@prisma/client';

export interface AuthRepository {
    generateAccessToken(userId: number): string;
    generateRefreshToken(userId: number): string;
    verifyToken(token: string, secret: string): Promise<unknown>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    logout(): Promise<void>;
    updateRefreshToken(refreshToken: string): Promise<User>;
}
