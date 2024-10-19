import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';

const userRepository = new UserRepository();

export class AuthService {
    async registerUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return userRepository.createUser(email, hashedPassword);
    }

    async loginUser(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        await userRepository.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }
}
