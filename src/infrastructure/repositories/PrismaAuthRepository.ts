import { User } from '@prisma/client';
import { DatabaseError } from '../../domain/errors';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import prisma from '../prismaClient';

export class PrismaAuthRepository implements AuthRepository {
    generateAccessToken(userId: number): string {
        throw new Error('Method not implemented.');
    }
    generateRefreshToken(userId: number): string {
        throw new Error('Method not implemented.');
    }
    verifyToken(token: string, secret: string): Promise<unknown> {
        throw new Error('Method not implemented.');
    }
    hashPassword(password: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    logout(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async updateRefreshToken(refreshToken: string): Promise<User> {
        try {
            const user = await prisma.user.findFirst({});
        } catch (error) {
            throw new Error('Method not implemented.');
        }
    }
}
