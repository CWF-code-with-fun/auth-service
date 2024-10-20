import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { Email } from '../valueObjects/Email';
import { PasswordHasher } from './PasswordHasher';
import { BcryptPasswordHasher } from '../../infrastructure/security/BcryptPasswordHasher';

export class UserService {
    private passwordHasher: PasswordHasher;
    constructor(private userRepository: UserRepository) {
        this.passwordHasher = new BcryptPasswordHasher();
    }

    async registerUser(email: Email, password: string): Promise<User> {
        const hashedPassword = await this.passwordHasher.hash(password);
        const user = new User(0, email, hashedPassword);
        return this.userRepository.createUser(user);
    }

    async findUserByEmail(email: Email): Promise<User | null> {
        return this.userRepository.findByEmail(email.getValue());
    }

    async findUserByRefreshToken(refreshToken: string): Promise<User | null> {
        return this.userRepository.findByRefreshToken(refreshToken);
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, refreshToken);
    }
}
