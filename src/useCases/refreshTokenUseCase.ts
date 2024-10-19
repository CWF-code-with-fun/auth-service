import { UserRepository } from '../repositories/userRepository';
import { generateAccessToken } from '../utils/tokenUtils';

const userRepository = new UserRepository();

export class RefreshTokenUseCase {
    async execute(refreshToken: string) {
        const user = await userRepository.findByRefreshToken(refreshToken);
        if (!user) {
            throw new Error('Invalid refresh token');
        }
        return generateAccessToken(user.id);
    }
}
