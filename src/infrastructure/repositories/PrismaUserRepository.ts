import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import prisma from '../prismaClient';
import { Email } from '../../domain/valueObjects/Email';

export class PrismaUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return new User(
            user.id,
            new Email(user.email),
            user.password,
            user.refreshToken ?? undefined,
        );
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        const user = await prisma.user.findFirst({ where: { refreshToken } });
        if (!user) return null;
        return new User(
            user.id,
            new Email(user.email),
            user.password,
            user.refreshToken ?? undefined,
        );
    }

    async createUser(user: User): Promise<User> {
        const createdUser = await prisma.user.create({
            data: {
                email: user.email.getValue(),
                password: user.password,
            },
        });
        return new User(
            createdUser.id,
            new Email(createdUser.email),
            createdUser.password,
        );
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }
}
