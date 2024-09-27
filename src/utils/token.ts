import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
    id: string;
    name: string;
    email: string;
}

export const generateToken = (
    payload: TokenPayload,
    expiresIn: string = '1h',
): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, secretKey) as TokenPayload;
    } catch (err) {
        throw new Error('Invalid token');
    }
};
