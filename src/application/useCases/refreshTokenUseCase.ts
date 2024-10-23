import { UserService } from '../../domain/services/UserService';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { TokenService } from '../../infrastructure/auth/tokenServices';
import { NotFoundError } from '../../domain/errors';

export class RefreshTokenUseCase {
    private userService: UserService;
    private tokenService = new TokenService();

    constructor() {
        const userRepository = new PrismaUserRepository();
        this.userService = new UserService(userRepository);
    }

    async execute(refreshToken: string) {
        const user =
            await this.userService.findUserByRefreshToken(refreshToken);
        if (!user) {
            throw new NotFoundError('Invalid refresh token');
        }
        return this.tokenService.generateAccessToken(user.id);
    }
}
