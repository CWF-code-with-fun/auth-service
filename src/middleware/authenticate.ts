// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
