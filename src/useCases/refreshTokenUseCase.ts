import { UserService } from '../domain/services/UserService';
import { TokenService } from '../infrastructure/auth/tokenServices';

export class RefreshTokenUseCase {
    private tokenService = new TokenService();

    constructor(private userService: UserService) {}

    async execute(refreshToken: string) {
        const user =
            await this.userService.findUserByRefreshToken(refreshToken);
        if (!user) {
            throw new Error('Invalid refresh token');
        }
        return this.tokenService.generateAccessToken(user.id);
    }
}
