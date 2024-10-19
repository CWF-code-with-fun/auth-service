import prisma from '../prismaClient';
import { User } from '@prisma/client';

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return prisma.user.findFirst({ where: { refreshToken } });
    }

    async createUser(email: string, password: string): Promise<User> {
        return prisma.user.create({
            data: {
                email,
                password,
            },
        });
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<User> {
        return prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }
}
