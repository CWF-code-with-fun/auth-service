import { Request, Response, NextFunction } from 'express';
import {
    UserAlreadyExistsError,
    DomainError,
    NotFoundError,
    ValidationError,
    DatabaseError,
} from '../../domain/errors';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('🚀 ~ err:', err);

    if (err instanceof DomainError) {
        if (err instanceof UserAlreadyExistsError) {
            return res.status(409).json({
                success: false,
                message: err.message,
                timestamp: new Date().toISOString(),
            });
        }
        if (err instanceof NotFoundError) {
            return res.status(404).json({
                success: false,
                message: err.message,
                timestamp: new Date().toISOString(),
            });
        }
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: err.message,
                timestamp: new Date().toISOString(),
            });
        }
        if (err instanceof DatabaseError) {
            return res.status(500).json({
                success: false,
                message: err.message,
                timestamp: new Date().toISOString(),
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
            timestamp: new Date().toISOString(),
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
    });
};

export default errorHandler;
