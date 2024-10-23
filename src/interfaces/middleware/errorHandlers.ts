import { Request, Response, NextFunction } from 'express';
import {
    DomainError,
    NotFoundError,
    ValidationError,
    DatabaseError,
} from '../../domain/errors';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExists';
import { sendResponse } from '../../utils/responseUtils';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('🚀 ~ err:', err);

    if (err instanceof DomainError) {
        if (err instanceof UserAlreadyExistsError) {
            return sendResponse(res, {
                status: 409,
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
            return sendResponse(res, {
                status: 400,
                success: false,
                message: err.messages,
                errorCode: err.name,
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

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
    });
};
