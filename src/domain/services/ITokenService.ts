export interface ITokenService {
    generateAccessToken(userId: number): string;
    generateRefreshToken(userId: number): string;
}
