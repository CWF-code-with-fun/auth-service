import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../../domain/errors/ValidationError';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => error.msg as string);
        return next(new ValidationError(errorMessages));
    }
    next();
};
