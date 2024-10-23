import { UserService } from '../../domain/services/UserService';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../../utils/tokenUtils';
import { Email } from '../../domain/valueObjects/Email';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { PasswordHasher } from '../../domain/services/PasswordHasher';
import { BcryptPasswordHasher } from '../../infrastructure/security/BcryptPasswordHasher';
import { ValidationError } from '../../domain/errors';

export class LoginUserUseCase {
    private userService: UserService;
    private hashPassword: PasswordHasher;
    constructor() {
        const userRepository = new PrismaUserRepository();
        this.userService = new UserService(userRepository);
        this.hashPassword = new BcryptPasswordHasher();
    }

    async execute(email: string, password: string) {
        const emailVO = new Email(email);
        const user = await this.userService.findUserByEmail(emailVO);

        if (
            !user ||
            !(await this.hashPassword.compare(password, user.password))
        ) {
            throw new ValidationError([
                'Please Provide Valid Email or Password ',
            ]);
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        await this.userService.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }
}
