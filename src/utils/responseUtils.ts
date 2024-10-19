import { Response } from 'express';

interface ResponseData {
    status: number;
    message: string;
    data?: unknown;
}

export const sendResponse = (
    res: Response,
    { status, message, data }: ResponseData,
) => {
    res.status(status).json({
        message,
        data,
    });
};
