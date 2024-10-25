import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/services/ITokenService';

export class TokenService implements ITokenService {
    generateAccessToken(userId: number): string {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '15m',
        });
    }

    generateRefreshToken(userId: number): string {
        return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: '7d',
        });
    }
}
