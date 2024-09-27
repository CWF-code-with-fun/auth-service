import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';

// Middleware function to authenticate the user
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Assume a function 'verifyToken' exists to verify the JWT token
    try {
        const decodedUser = verifyToken(token); // Replace verifyToken with actual implementation
        req.user = decodedUser; // Attach user info to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
