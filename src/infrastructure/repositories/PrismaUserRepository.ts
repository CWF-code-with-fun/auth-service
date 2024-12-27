import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/valueObjects/Email';
import { DatabaseError } from '../../domain/errors/DatabaseError';
import { NotFoundError } from '../../domain/errors';

const prisma = new PrismaClient();


export class PrismaUserRepository implements UserRepository {
    async findAllUsers({ offset, limit }: { offset: number; limit: number }): Promise<User[]> {
        const users = await prisma.user.findMany({
            skip: offset,
            take: limit,
        });
        return users.map(
            (user) =>
                new User(
                    user.id,
                    new Email(user.email),
                    user.password,
                    user.refreshToken ?? undefined,
                ),
        );
    }

    async findUserById(id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) return null;
        return new User(
            user.id,
            new Email(user.email),
            user.password,
            user.refreshToken ?? undefined,
        );
    }
    async createUser(user: User): Promise<User> {
        try {
            const createdUser = await prisma.user.create({
                data: {
                    email: user.email.getValue(),
                    password: user.password,
                    refreshToken: user.refreshToken,
                },
            });
            return new User(
                createdUser.id,
                new Email(createdUser.email),
                createdUser.password,
                createdUser.refreshToken ?? undefined,
            );
        } catch (error) {
            throw new DatabaseError('Failed to create user');
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await prisma.user.findFirst({
                where: { email },
            });
            if (!user) {
                return null;
            }
            return new User(
                user.id,
                new Email(user.email),
                user.password,
                user.refreshToken ?? undefined,
            );
        } catch (error) {
            throw new DatabaseError('Failed to find user by email');
        }
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const user = await prisma.user.findFirst({
                where: { refreshToken },
            });
            if (!user) return null;
            return new User(
                user.id,
                new Email(user.email),
                user.password,
                user.refreshToken ?? undefined,
            );
        } catch (error) {
            throw new DatabaseError('Failed to find user by refresh token');
        }
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<void> {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { refreshToken },
            });
        } catch (error) {
            throw new DatabaseError('Failed to update refresh token');
        }
    }
    async findById(id: number): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (!user) return null;
            return new User(
                user.id,
                new Email(user.email),
                user.password,
                user.refreshToken ?? undefined,
            );
        } catch (error) {
            throw new NotFoundError('User not found');
        }
    }
}
