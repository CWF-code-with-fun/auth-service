import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { User } from '../entities/User';
import { NotFoundError } from '../errors';
import { AuthRepository } from '../repositories/AuthRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from './UserService';

export class AuthService {
    private authRepository: AuthRepository;
    private userService: UserService;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
        const prismaUserRepository = new PrismaUserRepository();
        this.userService = new this.userService(prismaUserRepository);
    }

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
    async invalidateRefreshToken(refreshToken: string): Promise<void> {
        const user = await this.userRep.updateRefreshToken(refreshToken);
        if (!user) {
            throw new NotFoundError('Method not implemented.');
        }

        await this.authRepository.logout();
    }
}
